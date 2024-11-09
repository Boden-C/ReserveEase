import pytest
from flask import Flask
import firebase_admin
from firebase_admin import credentials, db
from unittest.mock import Mock, patch
from datetime import datetime, timedelta
import json

# Import your Blueprint
from data_management import data_management_bp

@pytest.fixture
def app():
    """Create a Flask test application"""
    app = Flask(__name__)
    app.register_blueprint(data_management_bp)
    return app

@pytest.fixture
def client(app):
    """Create a test client"""
    return app.test_client()

@pytest.fixture
def mock_db():
    """Mock Firebase database operations"""
    with patch('firebase_admin.db') as mock_db:
        # Create a mock reference object
        mock_ref = Mock()
        mock_db.reference.return_value = mock_ref
        yield mock_db

class TestChargerReservation:
    def test_add_reservation_success(self, client, mock_db):
        """Test successful reservation creation"""
        # Mock the database response
        mock_ref = mock_db.reference.return_value
        mock_ref.transaction.return_value = {
            'reserved': True,
            'user_id': 'test_user',
            'timestamp': datetime.now().isoformat()
        }

        # Test data
        test_data = {
            'charger_id': 'charger1',
            'time_block': datetime.now().isoformat(),
            'user_id': 'test_user'
        }

        # Make request
        response = client.post('/add_reservation',
                             data=json.dumps(test_data),
                             content_type='application/json')
        
        # Assert response
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['status'] == 'success'
        assert 'reservation_data' in data

    def test_add_reservation_already_reserved(self, client, mock_db):
        """Test attempting to reserve an already reserved time block"""
        # Mock the database response for already reserved
        mock_ref = mock_db.reference.return_value
        mock_ref.transaction.return_value = {
            'reserved': True,
            'user_id': 'other_user',
            'timestamp': datetime.now().isoformat()
        }

        test_data = {
            'charger_id': 'charger1',
            'time_block': datetime.now().isoformat(),
            'user_id': 'test_user'
        }

        response = client.post('/add_reservation',
                             data=json.dumps(test_data),
                             content_type='application/json')
        
        assert response.status_code == 409
        data = json.loads(response.data)
        assert data['status'] == 'error'
        assert 'already reserved' in data['message']

    def test_add_reservation_invalid_data(self, client):
        """Test reservation with missing required fields"""
        test_data = {
            'charger_id': 'charger1'
            # Missing time_block
        }

        response = client.post('/add_reservation',
                             data=json.dumps(test_data),
                             content_type='application/json')
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert data['status'] == 'error'
        assert 'Missing required fields' in data['message']

    def test_delete_reservation_success(self, client, mock_db):
        """Test successful reservation deletion"""
        # Mock the database response
        mock_ref = mock_db.reference.return_value
        mock_ref.get.return_value = {
            'reserved': True,
            'user_id': 'test_user',
            'timestamp': datetime.now().isoformat()
        }

        test_data = {
            'charger_id': 'charger1',
            'time_block': datetime.now().isoformat(),
            'user_id': 'test_user'
        }

        response = client.post('/delete_reservation',
                             data=json.dumps(test_data),
                             content_type='application/json')
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['status'] == 'success'
        assert 'deleted' in data['message']

    def test_delete_reservation_not_found(self, client, mock_db):
        """Test deleting a non-existent reservation"""
        # Mock the database response for non-existent reservation
        mock_ref = mock_db.reference.return_value
        mock_ref.get.return_value = None

        test_data = {
            'charger_id': 'charger1',
            'time_block': datetime.now().isoformat(),
            'user_id': 'test_user'
        }

        response = client.post('/delete_reservation',
                             data=json.dumps(test_data),
                             content_type='application/json')
        
        assert response.status_code == 404
        data = json.loads(response.data)
        assert data['status'] == 'error'
        assert 'not reserved' in data['message']

    def test_delete_reservation_unauthorized(self, client, mock_db):
        """Test deleting someone else's reservation"""
        # Mock the database response
        mock_ref = mock_db.reference.return_value
        mock_ref.get.return_value = {
            'reserved': True,
            'user_id': 'other_user',
            'timestamp': datetime.now().isoformat()
        }

        test_data = {
            'charger_id': 'charger1',
            'time_block': datetime.now().isoformat(),
            'user_id': 'test_user'
        }

        response = client.post('/delete_reservation',
                             data=json.dumps(test_data),
                             content_type='application/json')
        
        assert response.status_code == 403
        data = json.loads(response.data)
        assert data['status'] == 'error'
        assert 'Unauthorized' in data['message']

    def test_get_availability(self, client, mock_db):
        """Test getting charger availability"""
        # Mock the database response
        mock_ref = mock_db.reference.return_value
        mock_ref.get.return_value = {
            '2024-01-01T10:00:00': {'reserved': False},
            '2024-01-01T11:00:00': {'reserved': True, 'user_id': 'test_user'}
        }

        response = client.get('/get_availability?charger_id=charger1&date=2024-01-01')
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['status'] == 'success'
        assert 'data' in data
        assert len(data['data']) == 2

    def test_get_availability_missing_charger(self, client):
        """Test getting availability without charger ID"""
        response = client.get('/get_availability')
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert data['status'] == 'error'
        assert 'Charger ID is required' in data['message']

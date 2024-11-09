# api/tests/conftest.py
import sys
import os
import pytest
from flask import Flask
from firebase_admin import credentials, initialize_app, db, auth
from unittest.mock import Mock, patch
from functools import wraps

# Add the api directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from routes.reservations import reservations_bp

@pytest.fixture
def app():
    """Create and configure a test Flask application"""
    app = Flask(__name__)
    app.register_blueprint(reservations_bp)
    
    # Mock Firebase initialization
    with patch('firebase_admin.credentials.Certificate') as mock_cred:
        with patch('firebase_admin.initialize_app') as mock_init:
            yield app

@pytest.fixture
def client(app):
    """Create a test client for the app"""
    return app.test_client()

@pytest.fixture
def mock_db():
    """Fixture to mock Firebase database with test data"""
    test_chargers = [
        {
            "charger_id": "test_charger_1",
            "availability": [
                {
                    "time_block": "09:00-10:00",
                    "reserved": False
                },
                {
                    "time_block": "10:00-11:00",
                    "reserved": True,
                    "user_id": "test_user_1"
                }
            ]
        }
    ]
    
    with patch('firebase_admin.db.reference') as mock_db_ref:
        mock_ref = Mock()
        mock_ref.get.return_value = test_chargers
        mock_ref.set = Mock()
        mock_db_ref.return_value = mock_ref
        yield mock_ref

@pytest.fixture
def mock_auth():
    """Fixture to mock Firebase authentication"""
    with patch('firebase_admin.auth.verify_id_token') as mock_verify:
        mock_verify.return_value = {
            'uid': 'test_user_1',
            'email': 'test@example.com',
            'user_role': 'user'
        }
        yield mock_verify

@pytest.fixture
def auth_headers():
    """Fixture to provide authentication headers"""
    return {'Authorization': 'Bearer fake_test_token'}
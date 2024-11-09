# api/tests/test_reservations.py
import pytest
import json
from unittest.mock import patch
import firebase_admin.auth

class TestReservations:
    """Test suite for reservation endpoints"""

    def test_add_reservation_success(self, client, mock_db, mock_auth, auth_headers):
        """Test successfully adding a reservation"""
        # Mock the auth token verification to return test user 1
        mock_auth.return_value = {
            'uid': 'test_user_2',
            'email': 'test2@example.com',
            'user_role': 'user'
        }

        response = client.post(
            '/reservations/add',
            json={
                'charger_id': 'test_charger_1',
                'time_block': '09:00-10:00'
            },
            headers=auth_headers
        )
        
        assert response.status_code == 200
        response_data = json.loads(response.data)
        assert response_data['status'] == 'success'
        assert response_data['message'] == 'Reservation added successfully'

    def test_add_reservation_unauthorized(self, client, mock_db):
        """Test adding a reservation without auth token"""
        response = client.post(
            '/reservations/add',
            json={
                'charger_id': 'test_charger_1',
                'time_block': '09:00-10:00'
            }
        )
        
        assert response.status_code == 401
        response_data = json.loads(response.data)
        assert response_data['error'] == 'Authorization header missing or invalid'

    def test_add_reservation_already_reserved(self, client, mock_db, mock_auth, auth_headers):
        """Test attempting to add a reservation for an already reserved time block"""
        mock_auth.return_value = {
            'uid': 'test_user_2',
            'email': 'test2@example.com',
            'user_role': 'user'
        }

        response = client.post(
            '/reservations/add',
            json={
                'charger_id': 'test_charger_1',
                'time_block': '10:00-11:00'
            },
            headers=auth_headers
        )
        
        assert response.status_code == 409
        response_data = json.loads(response.data)
        assert response_data['message'] == 'Time block already reserved'

    def test_add_reservation_invalid_token(self, client, mock_db, mock_auth, auth_headers):
        """Test adding a reservation with invalid token"""
        mock_auth.side_effect = firebase_admin.auth.InvalidIdTokenError('Invalid token')

        response = client.post(
            '/reservations/add',
            json={
                'charger_id': 'test_charger_1',
                'time_block': '09:00-10:00'
            },
            headers=auth_headers
        )
        
        assert response.status_code == 401
        response_data = json.loads(response.data)
        assert response_data['error'] == 'Invalid token'

    def test_delete_reservation_success(self, client, mock_db, mock_auth, auth_headers):
        """Test successfully deleting a reservation"""
        # Mock the auth token verification to return test user 1 (owner of the reservation)
        mock_auth.return_value = {
            'uid': 'test_user_1',
            'email': 'test1@example.com',
            'user_role': 'user'
        }

        response = client.post(
            '/reservations/delete',
            json={
                'charger_id': 'test_charger_1',
                'time_block': '10:00-11:00'
            },
            headers=auth_headers
        )
        
        assert response.status_code == 200
        response_data = json.loads(response.data)
        assert response_data['status'] == 'success'
        assert response_data['message'] == 'Reservation deleted successfully'

    def test_delete_reservation_unauthorized_user(self, client, mock_db, mock_auth, auth_headers):
        """Test attempting to delete someone else's reservation"""
        # Mock the auth token verification to return test user 2 (not the owner)
        mock_auth.return_value = {
            'uid': 'test_user_2',
            'email': 'test2@example.com',
            'user_role': 'user'
        }

        response = client.post(
            '/reservations/delete',
            json={
                'charger_id': 'test_charger_1',
                'time_block': '10:00-11:00'
            },
            headers=auth_headers
        )
        
        assert response.status_code == 403
        response_data = json.loads(response.data)
        assert response_data['message'] == 'Not authorized to delete this reservation'

    def test_delete_reservation_no_token(self, client, mock_db):
        """Test deleting a reservation without auth token"""
        response = client.post(
            '/reservations/delete',
            json={
                'charger_id': 'test_charger_1',
                'time_block': '10:00-11:00'
            }
        )
        
        assert response.status_code == 401
        response_data = json.loads(response.data)
        assert response_data['error'] == 'Authorization header missing or invalid'
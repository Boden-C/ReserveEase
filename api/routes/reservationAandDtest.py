import unittest
from unittest.mock import patch, MagicMock
from flask import Flask
from reservationAandDtest import data_management_bp

class ReservationManagementTestCase(unittest.TestCase):
    def setUp(self):
        self.app = Flask(__name__)
        self.app.register_blueprint(data_management_bp)
        self.client = self.app.test_client()

    @patch('firebase_admin.db.reference')
    def test_add_reservation_success(self, mock_db_reference):
        # Setup mock response for available time block
        mock_ref = MagicMock()
        mock_ref.get.return_value = {'reserved': False}
        mock_db_reference.return_value = mock_ref

        # Simulate POST request to add reservation
        response = self.client.post('/add_reservation', json={
            'charger_id': 'charger1',
            'time_block': '08:00-09:00'
        })

        # Assertions
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {'status': 'success', 'message': 'Reservation added'})
        mock_ref.update.assert_called_once_with({'reserved': True})

    @patch('firebase_admin.db.reference')
    def test_add_reservation_conflict(self, mock_db_reference):
        # Setup mock response for already reserved time block
        mock_ref = MagicMock()
        mock_ref.get.return_value = {'reserved': True}
        mock_db_reference.return_value = mock_ref

        # Simulate POST request to add reservation
        response = self.client.post('/add_reservation', json={
            'charger_id': 'charger1',
            'time_block': '08:00-09:00'
        })

        # Assertions
        self.assertEqual(response.status_code, 409)
        self.assertEqual(response.json, {'status': 'error', 'message': 'Time block already reserved'})
        mock_ref.update.assert_not_called()

    @patch('firebase_admin.db.reference')
    def test_delete_reservation_success(self, mock_db_reference):
        # Setup mock response for a reserved time block
        mock_ref = MagicMock()
        mock_ref.get.return_value = {'reserved': True}
        mock_db_reference.return_value = mock_ref

        # Simulate POST request to delete reservation
        response = self.client.post('/delete_reservation', json={
            'charger_id': 'charger1',
            'time_block': '08:00-09:00'
        })

        # Assertions
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {'status': 'success', 'message': 'Reservation deleted'})
        mock_ref.update.assert_called_once_with({'reserved': False})

    @patch('firebase_admin.db.reference')
    def test_delete_reservation_not_found(self, mock_db_reference):
        # Setup mock response for a non-reserved time block
        mock_ref = MagicMock()
        mock_ref.get.return_value = {'reserved': False}
        mock_db_reference.return_value = mock_ref

        # Simulate POST request to delete reservation
        response = self.client.post('/delete_reservation', json={
            'charger_id': 'charger1',
            'time_block': '08:00-09:00'
        })

        # Assertions
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json, {'status': 'error', 'message': 'Time block not reserved'})
        mock_ref.update.assert_not_called()

if __name__ == '__main__':
    unittest.main()

import unittest
from unittest.mock import patch, MagicMock
from app import app, User  # Make sure app.py is in the same directory

class TestAuth(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Configure the test client
        app.config['TESTING'] = True
        cls.client = app.test_client()

    @patch('firebase_admin.auth.create_user')
    def test_register_success(self, mock_create_user):
        # Mock Firebase's create_user to return a user with a specific UID
        mock_user = MagicMock()
        mock_user.uid = '12345'
        mock_create_user.return_value = mock_user

        response = self.client.post('/register', json={
            'email': 'test@example.com',
            'password': 'password123',
            'name': 'Test User'
        })

        self.assertEqual(response.status_code, 201)
        self.assertIn('User registered successfully', response.get_json()['message'])
        self.assertEqual(response.get_json()['user_id'], '12345')

    @patch('firebase_admin.auth.create_user')
    def test_register_failure(self, mock_create_user):
        # Mock Firebase's create_user to raise an exception
        mock_create_user.side_effect = Exception('Registration failed')

        response = self.client.post('/register', json={
            'email': 'test@example.com',
            'password': 'password123',
            'name': 'Test User'
        })

        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.get_json())

    @patch('firebase_admin.auth.get_user_by_email')
    def test_login_success(self, mock_get_user_by_email):
        # Mock Firebase's get_user_by_email to return a user with a specific UID and email
        mock_user = MagicMock()
        mock_user.uid = '12345'
        mock_user.email = 'test@example.com'
        mock_get_user_by_email.return_value = mock_user

        with app.test_client() as client:
            with client.session_transaction() as session:
                # Simulate login request
                response = client.post('/login', json={
                    'email': 'test@example.com',
                    'password': 'password123'  # Assuming frontend verified password
                })

                self.assertEqual(response.status_code, 200)
                self.assertIn('Login successful', response.get_json()['message'])
                self.assertEqual(session['user_id'], '12345')

    @patch('firebase_admin.auth.get_user_by_email')
    def test_login_failure(self, mock_get_user_by_email):
        # Mock Firebase's get_user_by_email to raise an exception
        mock_get_user_by_email.side_effect = Exception('Login failed')

        response = self.client.post('/login', json={
            'email': 'test@example.com',
            'password': 'password123'
        })

        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.get_json())

    def test_logout_success(self):
        with app.test_client() as client:
            # Set up a logged-in user in the session
            with client.session_transaction() as session:
                session['user_id'] = '12345'

            # Simulate logout request
            response = client.post('/logout')

            self.assertEqual(response.status_code, 200)
            self.assertIn('Logged out successfully', response.get_json()['message'])
            self.assertNotIn('user_id', session)

if __name__ == '__main__':
    unittest.main()

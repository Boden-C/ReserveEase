# app.py
from flask import Flask, request, jsonify, session, redirect, url_for
from firebase_admin import auth, credentials, initialize_app

# Initialize Flask app
app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Needed for session management

# Initialize Firebase Admin SDK
cred = credentials.Certificate("path/to/your-firebase-adminsdk.json")
initialize_app(cred)

# User class to manage authentication
class User:
    def __init__(self, user_id=None, name=None, email=None, password=None):
        self.user_id = user_id
        self.name = name
        self.email = email
        self.password = password

    @staticmethod
    def login(email, password):
        try:
            user = auth.get_user_by_email(email)
            # Assuming you've verified the password with a frontend Firebase auth call
            session['user_id'] = user.uid
            session['email'] = user.email
            return jsonify({"message": "Login successful", "user_id": user.uid}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 400

    @staticmethod
    def logout():
        session.pop('user_id', None)
        return jsonify({"message": "Logged out successfully"}), 200

    @staticmethod
    def register(email, password, name=None):
        try:
            user = auth.create_user(email=email, password=password, display_name=name)
            return jsonify({"message": "User registered successfully", "user_id": user.uid}), 201
        except Exception as e:
            return jsonify({"error": str(e)}), 400

# Routes
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    return User.register(email, password, name)

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    # Password verification handled by Firebase client-side SDK
    return User.login(email, password)

@app.route('/logout', methods=['POST'])
def logout():
    return User.logout()

if __name__ == '__main__':
    app.run(debug=True)

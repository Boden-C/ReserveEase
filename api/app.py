# app.py
from flask import Flask
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials

from routes.authenticate import authentication_bp
from routes.reservations import reservations_bp

# Initialize Flask app
app = Flask(__name__)
app.config.from_object('config.Config')  
CORS(app)

# Initialize Firebase Admin
cred = credentials.Certificate("./firebase-adminsdk.json.local")
firebase_admin.initialize_app(cred)

# Register blueprints with a URL prefix
app.register_blueprint(authentication_bp, url_prefix='/api')
app.register_blueprint(reservations_bp, url_prefix='/api')

# Run the app
if __name__ == '__main__':
    app.run()
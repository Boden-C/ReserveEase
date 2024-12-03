from flask import Flask, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Flask app
app = Flask(__name__)
app.config.from_object('config.Config')  

# Let Flask-CORS handle all CORS headers
CORS(app, 
     origins=["http://localhost:5173"],
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     expose_headers=["Content-Type", "Authorization"])

# Initialize Firebase Admin
cred = credentials.Certificate("./firebase-adminsdk.json.local")
firebase_admin.initialize_app(cred)
db = firestore.client()

from routes.authenticate import authentication_bp
from routes.reservations import reservations_bp
from routes.edit_parking import parking_bp

# Register blueprints with a URL prefix
app.register_blueprint(authentication_bp, url_prefix='/api')
app.register_blueprint(reservations_bp, url_prefix='/api')
app.register_blueprint(parking_bp, url_prefix='/api')

@app.after_request
def after_request(response):
    # CORS should already handle this, but for some reason it sometimes doesn't
    if 'Access-Control-Allow-Origin' not in response.headers:
        response.headers['Access-Control-Allow-Origin'] = 'http://localhost:5173'
    if 'Access-Control-Allow-Headers' not in response.headers:
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    if 'Access-Control-Allow-Methods' not in response.headers:
        response.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS'
    if 'Access-Control-Allow-Credentials' not in response.headers:
        response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response

@app.errorhandler(400)
@app.errorhandler(401)
@app.errorhandler(403)
@app.errorhandler(404)
@app.errorhandler(500)
def handle_error(error):
    response = jsonify({'message': error.description})
    response.status_code = error.code if hasattr(error, 'code') else 500
    return response

# Run the app
if __name__ == '__main__':
    app.run()
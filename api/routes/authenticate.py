# routes/authenticate.py
from flask import Blueprint, jsonify, request
from api.wrappers import verify_token

authentication_bp = Blueprint('authentication_bp', __name__)

@authentication_bp.route('/authenticate', methods=['GET'])
@verify_token()
def authenticate():
    """Route to check if user is valid."""
    user = request.user  # Access the user info from the verified token
    return jsonify({"user_id": user["uid"]}), 200

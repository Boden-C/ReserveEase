#decorators.py
from flask import request, jsonify
from functools import wraps
from firebase_admin import auth

def verify_token(roles=None):
    """
    Decorator to verify Firebase ID token and check for required roles.
    - `roles`: List of roles (claims) that satisfy the access condition.
    """
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            auth_header = request.headers.get("Authorization")
            if not auth_header or not auth_header.startswith("Bearer "):
                return jsonify({"error": "Authorization header missing or invalid"}), 401

            id_token = auth_header.split(" ")[1]
            try:
                # Verify ID token and decode it
                decoded_token = auth.verify_id_token(id_token)
                request.user = decoded_token  # Attach decoded token to request

                # Check for at least one of the required roles
                if roles and not any(decoded_token.get(role) for role in roles):
                    return jsonify({"error": "Forbidden: Insufficient permissions"}), 403

            except Exception as e:
                return jsonify({"error": "Unauthorized"}), 401

            return f(*args, **kwargs)
        return wrapper
    return decorator
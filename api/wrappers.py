#decorators.py
from flask import request, jsonify
from functools import wraps
from firebase_admin import auth

def verify_token(roles=None):
    """
    Decorator to verify Firebase ID token and check for required roles.
    Args:
        roles: List of roles (claims) that satisfy the access condition.
    
    Returns:
        Function decorator that handles authentication and authorization.
        
    Status Codes:
        401 - Missing token or invalid authentication
        403 - Valid authentication but insufficient permissions
    """
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            # Check if Authorization header exists
            auth_header = request.headers.get("Authorization")
            if not auth_header:
                return jsonify({
                    "error": "Authorization header missing or invalid",
                    "message": "Authentication required"
                }), 401

            # Validate Authorization header format
            if not auth_header.startswith("Bearer "):
                return jsonify({
                    "error": "Invalid authorization format",
                    "message": "Authorization header must start with 'Bearer'"
                }), 401

            # Extract token
            id_token = auth_header.split(" ")[1]
            
            try:
                # Verify ID token and decode it
                decoded_token = auth.verify_id_token(id_token)
                
                # Attach decoded token to request
                request.user = decoded_token

                # Role-based authorization check
                if roles:
                    user_roles = decoded_token.get('roles', [])
                    if not any(role in user_roles for role in roles):
                        return jsonify({
                            "error": "Insufficient permissions",
                            "message": f"Required roles: {', '.join(roles)}"
                        }), 403

                return f(*args, **kwargs)

            except auth.InvalidIdTokenError:
                return jsonify({
                    "error": "Invalid token",
                    "message": "The authentication token is invalid"
                }), 401
                
            except auth.ExpiredIdTokenError:
                return jsonify({
                    "error": "Expired token",
                    "message": "The authentication token has expired"
                }), 401
                
            except auth.RevokedIdTokenError:
                return jsonify({
                    "error": "Revoked token",
                    "message": "The authentication token has been revoked"
                }), 401
                
            except Exception as e:
                # Log the error here with proper error logging
                return jsonify({
                    "error": "Authentication error",
                    "message": "An error occurred during authentication"
                }), 401

        return wrapper
    return decorator
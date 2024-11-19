#decorators.py
from flask import abort, request, g
import traceback
from app import app
from typing import Callable, Dict, Tuple, Union, Any
from functools import wraps
from firebase_admin import auth

def verify_token(f: Callable) -> Callable:
    """
    Decorator that verifies Firebase JWT tokens from the Authorization header.
    Sets both the full decoded token and user_id in Flask's g object.
    
    Sets:
        g.user (Dict): Full decoded token containing user data
        g.user_id (str): Firebase user ID (UID)
    
    Returns:
        If token is valid: Original route response
        If token is invalid: Tuple[Dict[str, str], int] with error message and 401 status
    
    Usage:
        @app.route('/protected')
        @verify_token
        def protected_route():
            user_id = g.user_id  # access just the ID
            user_data = g.user   # access full token data
            return {'message': f'Hello {user_id}'}
    """
    @wraps(f)
    def decorated(*args, **kwargs) -> Union[Tuple[Dict[str, str], int], Any]:
        token = None
        auth_header = request.headers.get('Authorization')

        if not auth_header:
            abort(401, description='No token provided')
        
        if not auth_header.startswith('Bearer '):
            abort(401, description='Invalid token format')

        try:
            token = auth_header.split('Bearer ')[1]
            decoded_token = None
            if (app.config['TESTING']):
                try:
                    decoded_token = auth.verify_id_token(token)
                except:
                    decoded_token = 'test_user'
                    decoded_token['uid'] = 'test_user_id'
            else:
                decoded_token = auth.verify_id_token(token)  
              
            g.user = decoded_token
            g.user_id = decoded_token['uid']
                
            return f(*args, **kwargs)
        
        except auth.ExpiredIdTokenError:
            abort(401, description='Token has expired')
        except auth.RevokedIdTokenError:
            abort(401, description='Token has been revoked')
        except auth.InvalidIdTokenError:
            abort(401, description='Invalid token')
            
        except Exception as e:
            traceback.print_exc()
            abort(500, description=str(e))

    return decorated
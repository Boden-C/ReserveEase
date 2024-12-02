from flask import Blueprint, request, jsonify, g, abort
from wrappers import verify_token 
from database.firestore import get_collection
from exceptions import ClientError
import traceback

# Define the Blueprint
parking_bp = Blueprint('parking_bp', __name__)
parking_collection = get_collection('parkingSpots')

@parking_bp.route('/parking', methods=['GET'])
@verify_token
def get_parking_spots():
    """
    Fetch all parking spots.
    Authentication is required to access this route.
    """
    try:
        docs = parking_collection.stream()
        spots = [{**doc.to_dict(), 'id': doc.id} for doc in docs]
        return jsonify(spots), 200
    except Exception as e:
        traceback.print_exc()
        abort(500, description=str(e))

@parking_bp.route('/parking', methods=['POST'])
@verify_token
def create_parking_spot():
    """
    Create a new parking spot.
    Authentication is required to access this route.
    """
    try:
        data = request.json
        if 'name' not in data or 'location' not in data:
            raise ClientError('Missing required fields: "name" and "location"', 400)

        parking_collection.add(data)
        return jsonify({'message': 'Parking spot added successfully'}), 201
    except ClientError as e:
        print(str(e))
        abort(e.code, description=e.message)
    except Exception as e:
        traceback.print_exc()
        abort(500, description=str(e))

@parking_bp.route('/parking/<spot_id>', methods=['DELETE'])
@verify_token
def delete_parking_spot(spot_id):
    """
    Delete a parking spot by ID.
    Authentication is required to access this route.
    """
    try:
        spot_ref = parking_collection.document(spot_id)
        if not spot_ref.get().exists:
            raise ClientError(f'Parking spot with ID {spot_id} does not exist.', 404)
        spot_ref.delete()
        return jsonify({'message': f'Parking spot {spot_id} deleted successfully.'}), 200
    except ClientError as e:
        print(str(e))
        abort(e.code, description=e.message)
    except Exception as e:
        traceback.print_exc()
        abort(500, description=str(e))
# api/routes/reservationAandD.py
from flask import Blueprint, request, jsonify
from firebase_admin import db
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from wrappers import verify_token  # Using absolute import

# Define the Blueprint - keeping your original name
data_management_bp = Blueprint('data_management', __name__)

@data_management_bp.route('/add_reservation', methods=['POST'])
@verify_token()
def add_reservation():
    try:
        content = request.json
        user = request.user
        charger_id = content.get('charger_id')
        time_block = content.get('time_block')

        if not charger_id or not time_block:
            return jsonify({'status': 'error', 'message': 'Missing required fields'}), 400

        # Find the specific charger
        chargers_ref = db.reference('/chargers')
        chargers = chargers_ref.get()
        
        # Find the specific charger in the list
        charger = next((c for c in chargers if c['charger_id'] == charger_id), None)
        if not charger:
            return jsonify({'status': 'error', 'message': 'Charger not found'}), 404

        # Find the specific time block
        time_slot = next((t for t in charger['availability'] if t['time_block'] == time_block), None)
        if not time_slot:
            return jsonify({'status': 'error', 'message': 'Time block not found'}), 404

        if time_slot['reserved']:
            return jsonify({'status': 'error', 'message': 'Time block already reserved'}), 409

        # Update the reservation status
        charger_index = next(i for i, c in enumerate(chargers) if c['charger_id'] == charger_id)
        time_block_index = next(i for i, t in enumerate(charger['availability']) if t['time_block'] == time_block)
        
        # Update the specific time block
        chargers[charger_index]['availability'][time_block_index]['reserved'] = True
        chargers[charger_index]['availability'][time_block_index]['user_id'] = user['uid']

        # Update the entire chargers array
        chargers_ref.set(chargers)

        return jsonify({'status': 'success', 'message': 'Reservation added successfully'}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@data_management_bp.route('/delete_reservation', methods=['POST'])
@verify_token()
def delete_reservation():
    try:
        content = request.json
        user = request.user
        charger_id = content.get('charger_id')
        time_block = content.get('time_block')

        if not charger_id or not time_block:
            return jsonify({'status': 'error', 'message': 'Missing required fields'}), 400

        # Find the specific charger
        chargers_ref = db.reference('/chargers')
        chargers = chargers_ref.get()
        
        # Find the specific charger in the list
        charger = next((c for c in chargers if c['charger_id'] == charger_id), None)
        if not charger:
            return jsonify({'status': 'error', 'message': 'Charger not found'}), 404

        # Find the specific time block
        time_slot = next((t for t in charger['availability'] if t['time_block'] == time_block), None)
        if not time_slot:
            return jsonify({'status': 'error', 'message': 'Time block not found'}), 404

        if not time_slot['reserved']:
            return jsonify({'status': 'error', 'message': 'Time block not reserved'}), 409

        # Verify user owns this reservation
        if 'user_id' in time_slot and time_slot['user_id'] != user['uid']:
            return jsonify({'status': 'error', 'message': 'Not authorized to delete this reservation'}), 403

        # Update the reservation status
        charger_index = next(i for i, c in enumerate(chargers) if c['charger_id'] == charger_id)
        time_block_index = next(i for i, t in enumerate(charger['availability']) if t['time_block'] == time_block)
        
        # Update the specific time block
        chargers[charger_index]['availability'][time_block_index]['reserved'] = False
        chargers[charger_index]['availability'][time_block_index].pop('user_id', None)

        # Update the entire chargers array
        chargers_ref.set(chargers)

        return jsonify({'status': 'success', 'message': 'Reservation deleted successfully'}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500
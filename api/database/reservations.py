# reservations.py
from typing import List, Optional
from firebase_admin import firestore
from datetime import datetime
from exceptions import ClientError
from api.types import Reservation

db = firestore.client()

def create_reservation(user_id: str, space_id: str, start_timestamp: datetime, end_timestamp: datetime) -> str:
    """
    Create a new reservation in Firestore.

    Args:
        user_id (str): ID of the user making the reservation
        space_id (str): ID of the space being reserved
        start_timestamp (datetime): Start time of the reservation
        end_timestamp (datetime): End time of the reservation

    Returns:
        str: Reservation ID
    """
    # Create reservation data
    reservation_data = {
        'user_id': user_id,
        'space_id': space_id,
        'start_timestamp': firestore.Timestamp.from_datetime(start_timestamp),
        'end_timestamp': firestore.Timestamp.from_datetime(end_timestamp),
        'created_at': firestore.SERVER_TIMESTAMP,
        'status': 'active'
    }
    
    # Add to Firestore
    reservations_ref = db.collection('reservations').document()
    reservations_ref.set(reservation_data)
    
    # Return reservation ID
    return reservations_ref.id


def delete_reservation(reservation_id: str) -> None:
    """
    Delete a reservation from Firestore.
    
    Args:
        reservation_id (str): ID of the reservation to delete
    """
    # Get reservation reference
    reservation_ref = db.collection('reservations').document(reservation_id)
    
    if not reservation_ref.get().exists:
        raise ClientError("Reservation not found when deleting", 404)
    
    # Delete the reservation
    reservation_ref.delete()
    
def get_reservations(
    reservation_id: Optional[str] = None,
    user_id: Optional[str] = None,
    space_id: Optional[str] = None,
    start_timestamp: Optional[str] = None,
    end_timestamp: Optional[str] = None
) -> List[Reservation]:
    """
    Fetches reservations based on provided filters.

    Args:
        reservation_id (str, optional): Unique ID of the reservation.
        user_id (str, optional): The ID of the user who made the reservation.
        space_id (str, optional): The ID of the parking space for the reservation.
        start_timestamp (str, optional): ISO-formatted start timestamp for filtering reservations.
        end_timestamp (str, optional): ISO-formatted end timestamp for filtering reservations.

    Returns:
        List[Reservation]: List of reservations matching the filters.
    
    Raises:
        ClientError: If timestamp format is invalid or query execution fails.
    """
    reservations_ref = db.collection("reservations")
    
    # If reservation_id is provided, fetch a single reservation by its document ID
    if reservation_id:
        reservation_doc = reservations_ref.document(reservation_id).get()
        if not reservation_doc.exists:
            raise ClientError("Reservation not found", 404)
        
        # Return a single reservation in a list
        return [
            Reservation(
                reservation_id=reservation_doc.id,
                user_id=reservation_doc.get("user_id"),
                space_id=reservation_doc.get("space_id"),
                start_timestamp=reservation_doc.get("start_timestamp").to_datetime(),
                end_timestamp=reservation_doc.get("end_timestamp").to_datetime()
            )
        ]

    # Otherwise, apply filters to query all matching reservations
    query = reservations_ref
    if user_id:
        query = query.where("user_id", "==", user_id)
    if space_id:
        query = query.where("space_id", "==", space_id)
    if start_timestamp:
        try:
            start = datetime.fromisoformat(start_timestamp.replace('Z', '+00:00'))
            query = query.where("start_timestamp", ">=", start)
        except ValueError:
            raise ClientError("Invalid format for start_timestamp. Expected ISO format.")
    if end_timestamp:
        try:
            end = datetime.fromisoformat(end_timestamp.replace('Z', '+00:00'))
            query = query.where("end_timestamp", "<=", end)
        except ValueError:
            raise ClientError("Invalid format for end_timestamp. Expected ISO format.")
    
    # Validate timestamps if both provided
    if start_timestamp and end_timestamp:
        if start >= end:
            raise ClientError("Start time must be before end time")

    # Execute the query and retrieve results
    results = query.stream()
    return [
        Reservation(
            reservation_id=doc.id,
            user_id=doc.get("user_id"),
            space_id=doc.get("space_id"),
            start_timestamp=doc.get("start_timestamp").to_datetime(),
            end_timestamp=doc.get("end_timestamp").to_datetime()
        )
        for doc in results
    ]



def schedule(
    user_id: str,
    space_id: str,
    start_timestamp: str,
    end_timestamp: str
) -> str:
    """
    Validates reservation times and creates a new reservation in Firestore.
    
    Args:
        user_id (str): ID of the user making the reservation
        space_id (str): ID of the space being reserved
        start_timestamp (str): Start time of the reservation in ISO format
        end_timestamp (str): End time of the reservation in ISO format
    
    Returns:
        str: Reservation ID
    """
    # Validate input
    try:
        # Check conversion
        start = datetime.fromisoformat(start_timestamp.replace('Z', '+00:00'))
        end = datetime.fromisoformat(end_timestamp.replace('Z', '+00:00'))
        
        # Check if start time is in the past
        if start < datetime.now():
            raise ClientError("Start time must be in the future")
        
        # Check for valid time range
        if start >= end:
            raise ClientError("Start time must be before end time")
        
        # TODO: Check for valid space_id
        
        # Check for conflicting reservations
        reservations_ref = db.collection('reservations')
        conflicts_query = reservations_ref\
            .where('space_id', '==', space_id)\
            .where('status', '==', 'active')\
            .where('start_timestamp', '<', end)\
            .where('end_timestamp', '>', start)
        conflicting_reservations = list(conflicts_query.stream())
        if conflicting_reservations:
            raise ClientError("Time conflict with existing reservation", 409)
        
        # If no conflicts, create the reservation
        return create_reservation(user_id, space_id, start, end)
        
    except ValueError:
        raise ClientError("Invalid timestamp format. Use ISO 8601 format")
    

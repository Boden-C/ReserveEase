from dataclasses import asdict, dataclass
from typing import List, Optional
from datetime import datetime

@dataclass
class Reservation:
    """
    Represents a parking reservation.

    Attributes:
        reservation_id (str): Unique identifier for the reservation.
        user_id (str): Unique identifier for the user who made the reservation.
        space_id (str): Unique identifier for the parking space reserved.
        start_timestamp (datetime): Start time of the reservation.
        end_timestamp (datetime): End time of the reservation.
    """
    reservation_id: str
    user_id: str
    space_id: str
    start_timestamp: datetime
    end_timestamp: datetime
    
    def to_dict(self):
        data = asdict(self)
        data["start_timestamp"] = self.start_timestamp.isoformat() if self.start_timestamp else None
        data["end_timestamp"] = self.end_timestamp.isoformat() if self.end_timestamp else None
        return data
    
    @staticmethod
    def jsonify_list(reservations: List['Reservation'], restrict_user_id: Optional[bool] = False):
        result = []
        for reservation in reservations:
            reservation_dict = reservation.to_dict()
            if restrict_user_id:
                reservation_dict.pop("user_id", None)  # Remove user_id if restrict_user_id is True
            result.append(reservation_dict)
        return result

parking_data = {
    "A1": {"x": 0.4, "y": 0.5, "space_id": "A1"},
    "A2": {"x": 0.6, "y": 0.3, "space_id": "A2"},
    "A3": {"x": 0.8, "y": 0.7, "space_id": "A3"},
    "A4": {"x": 0.2, "y": 0.2, "space_id": "A4"},
    "A5": {"x": 0.3, "y": 0.8, "space_id": "A5"},
    "A6": {"x": 0.7, "y": 0.4, "space_id": "A6"},
    "A7": {"x": 0.9, "y": 0.9, "space_id": "A7"},
    "A8": {"x": 0.1, "y": 0.6, "space_id": "A8"},
    "A9": {"x": 0.5, "y": 0.1, "space_id": "A9"},
    "A10": {"x": 0.8, "y": 0.2, "space_id": "A10"},
    "A11": {"x": 0.2, "y": 0.9, "space_id": "A11"},
    "A12": {"x": 0.6, "y": 0.6, "space_id": "A12"},
    "A13": {"x": 0.4, "y": 0.2, "space_id": "A13"},
    "B1": {"x": 0.5, "y": 0.4, "space_id": "B1"},
    "B2": {"x": 0.3, "y": 0.2, "space_id": "B2"},
    "B3": {"x": 0.7, "y": 0.8, "space_id": "B3"},
    "B4": {"x": 0.2, "y": 0.3, "space_id": "B4"},
    "B5": {"x": 0.8, "y": 0.6, "space_id": "B5"},
    "B6": {"x": 0.4, "y": 0.8, "space_id": "B6"},
    "B7": {"x": 0.6, "y": 0.1, "space_id": "B7"},
    "B8": {"x": 0.1, "y": 0.7, "space_id": "B8"},
    "B9": {"x": 0.9, "y": 0.4, "space_id": "B9"},
    "B10": {"x": 0.8, "y": 0.1, "space_id": "B10"},
    "B11": {"x": 0.3, "y": 0.9, "space_id": "B11"},
    "B12": {"x": 0.7, "y": 0.6, "space_id": "B12"},
    "C1": {"x": 0.4, "y": 0.6, "space_id": "C1"},
    "C2": {"x": 0.6, "y": 0.2, "space_id": "C2"},
    "C3": {"x": 0.8, "y": 0.8, "space_id": "C3"},
    "C4": {"x": 0.2, "y": 0.4, "space_id": "C4"},
    "C5": {"x": 0.3, "y": 0.7, "space_id": "C5"},
    "C6": {"x": 0.7, "y": 0.5, "space_id": "C6"},
    "C7": {"x": 0.9, "y": 0.2, "space_id": "C7"},
    "C8": {"x": 0.1, "y": 0.8, "space_id": "C8"},
    "C9": {"x": 0.5, "y": 0.3, "space_id": "C9"},
    "C10": {"x": 0.8, "y": 0.3, "space_id": "C10"},
    "C11": {"x": 0.2, "y": 0.8, "space_id": "C11"},
    "C12": {"x": 0.6, "y": 0.7, "space_id": "C12"}
}

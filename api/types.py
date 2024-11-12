from dataclasses import dataclass
from typing import Optional
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

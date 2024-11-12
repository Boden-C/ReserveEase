# Backend Function Documentaion

## api/exceptions.py
`api.exceptions.__init__(self, message: str, code: int)`
    Custom exception for client-side errors.
    This should be the only error explicitly raised in the API routes.
    
    Args:
        message (str): The error message.
        code (int, optional): The HTTP status code for the error. Defaults to 400.
        
    Common codes:
        400 Bad Request
        404 Not Found: Resource doesn't exist
        406 Not Acceptable: Resource doesn't match client's accept headers
        408 Request Timeout: Client request took too long
        409 Conflict: Request conflicts with server state
        410 Gone: Resource is no longer available.
        422 Unprocessable Entity: Valid syntax but semantic issues

## api/wrappers.py
`api.wrappers.verify_token(f: Callable) -> Callable`
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

`api.wrappers.decorated() -> Union[Tuple[Dict[str, str], int], Any]`
    

## api/database/reservations.py
`api.database.reservations.create_reservation(user_id: str, space_id: str, start_timestamp: datetime, end_timestamp: datetime) -> str`
    Create a new reservation in Firestore.
    
    Args:
        user_id (str): ID of the user making the reservation
        space_id (str): ID of the space being reserved
        start_timestamp (datetime): Start time of the reservation
        end_timestamp (datetime): End time of the reservation
    
    Returns:
        str: Reservation ID

`api.database.reservations.delete_reservation(reservation_id: str) -> None`
    Delete a reservation from Firestore.
    
    Args:
        reservation_id (str): ID of the reservation to delete

`api.database.reservations.get_reservations(reservation_id: Optional[str], user_id: Optional[str], space_id: Optional[str], start_timestamp: Optional[str], end_timestamp: Optional[str]) -> List[Reservation]`
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

`api.database.reservations.schedule(user_id: str, space_id: str, start_timestamp: str, end_timestamp: str) -> str`
    Validates reservation times and creates a new reservation in Firestore.
    
    Args:
        user_id (str): ID of the user making the reservation
        space_id (str): ID of the space being reserved
        start_timestamp (str): Start time of the reservation in ISO format
        end_timestamp (str): End time of the reservation in ISO format
    
    Returns:
        str: Reservation ID

## api/routes/authenticate.py
`api.routes.authenticate.authenticate()`
    Route to check if user is valid.

## api/routes/reservations.py
`api.routes.reservations.create_reservation()`
    Create a new reservation using authenticated user's ID
    ---
    post:
        summary: Create a new reservation
        requestBody:
            required: true
            content:
                application/json:
                    schema:
                        type: object
                        properties:
                            space_id:
                                type: string
                                description: ID of the parking space to reserve
                            start_timestamp:
                                type: string
                                format: date-time
                                description: ISO-formatted start time of the reservation
                            end_timestamp:
                                type: string
                                format: date-time
                                description: ISO-formatted end time of the reservation
        responses:
            201:
                description: Reservation created successfully
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                id:
                                    type: string
                                    description: ID of the created reservation
                                message:
                                    type: string
            400:
                description: Missing required fields
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                message:
                                    type: string
            500:
                description: Internal server error
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                message:
                                    type: string

`api.routes.reservations.delete_reservation(reservation_id)`
    Delete an existing reservation by ID, if it belongs to the authenticated user
    ---
    delete:
        summary: Delete a reservation
        parameters:
            - in: path
              name: reservation_id
              required: true
              schema:
                type: string
              description: ID of the reservation to delete
    responses:
        200:
            description: Reservation deleted successfully
        403:
            description: Unauthorized action
        404:
            description: Reservation not found

`api.routes.reservations.get_user_reservations()`
    Get all reservations for the authenticated user
    ---
    get:
        summary: Get user's reservations
    responses:
        200:
            description: List of reservations
            content:
                application/json:
                    schema:
                        type: array
                        items: Reservation

`api.routes.reservations.get_reservations_route()`
    Get reservations based on filters
    ---
    get:
        summary: Get reservations based on optional filters
        parameters:
            - in: query
              name: reservation_id
              schema:
                type: string
              description: Unique ID of the reservation
            - in: query
              name: space_id
              schema:
                type: string
              description: The ID of the parking space for the reservation
            - in: query
              name: start_timestamp
              schema:
                type: string
                format: date-time
              description: ISO-formatted start timestamp for filtering reservations
            - in: query
              name: end_timestamp
              schema:
                type: string
                format: date-time
              description: ISO-formatted end timestamp for filtering reservations
        responses:
            200:
                description: List of reservations matching the filters
                content:
                    application/json:
                        schema:
                            type: array
                            items: Reservation
            403:
                description: Unauthorized request for user_id filter
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                message:
                                    type: string

## api/tests/conftest.py
`api.tests.conftest.app()`
    Create and configure a test Flask application

`api.tests.conftest.client(app)`
    Create a test client for the app

`api.tests.conftest.mock_db()`
    Fixture to mock Firebase database with test data

`api.tests.conftest.mock_auth()`
    Fixture to mock Firebase authentication

`api.tests.conftest.auth_headers()`
    Fixture to provide authentication headers

## api/tests/test_reservations.py
`api.tests.test_reservations.test_add_reservation_success(self, client, mock_db, mock_auth, auth_headers)`
    Test successfully adding a reservation

`api.tests.test_reservations.test_add_reservation_unauthorized(self, client, mock_db)`
    Test adding a reservation without auth token

`api.tests.test_reservations.test_add_reservation_already_reserved(self, client, mock_db, mock_auth, auth_headers)`
    Test attempting to add a reservation for an already reserved time block

`api.tests.test_reservations.test_add_reservation_invalid_token(self, client, mock_db, mock_auth, auth_headers)`
    Test adding a reservation with invalid token

`api.tests.test_reservations.test_delete_reservation_success(self, client, mock_db, mock_auth, auth_headers)`
    Test successfully deleting a reservation

`api.tests.test_reservations.test_delete_reservation_unauthorized_user(self, client, mock_db, mock_auth, auth_headers)`
    Test attempting to delete someone else's reservation

`api.tests.test_reservations.test_delete_reservation_no_token(self, client, mock_db)`
    Test deleting a reservation without auth token


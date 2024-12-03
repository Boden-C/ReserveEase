from firebase_admin import credentials, firestore, initialize_app
from exceptions import ClientError
import os

def initialize_firestore():
    """
    Initializes Firestore with the Firebase Admin credentials.

    Returns:
        firestore.Client: The Firestore client instance.

    Raises:
        ClientError: If initialization fails due to missing credentials or other issues.
    """
    try:
        # Load Firebase credentials
        cred_path = os.getenv("FIREBASE_CREDENTIALS", "./firebase-adminsdk.json.local")
        if not os.path.exists(cred_path):
            raise ClientError(f"Firebase credentials file not found at {cred_path}", 500)

        cred = credentials.Certificate(cred_path)
        initialize_app(cred)

        # Initialize Firestore client
        db = firestore.client()
        return db

    except Exception as e:
        raise ClientError(f"Failed to initialize Firestore: {str(e)}", 500)


class FirestoreDB:
    """
    Wrapper class for Firestore operations.
    Provides common methods for interacting with Firestore collections.

    Attributes:
        db (firestore.Client): The Firestore client instance.
    """
    def __init__(self):
        self.db = initialize_firestore()

    def get_collection(self, collection_name: str):
        """
        Returns a reference to the specified Firestore collection.

        Args:
            collection_name (str): Name of the Firestore collection.

        Returns:
            firestore.CollectionReference: Reference to the Firestore collection.
        """
        return self.db.collection(collection_name)

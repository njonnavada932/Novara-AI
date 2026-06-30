from pathlib import Path
import firebase_admin
from firebase_admin import credentials, firestore

if not firebase_admin._apps:
    firebase_key_path = "/secrets/firebase-key"

    # Local development
    if not Path(firebase_key_path).exists():
        firebase_key_path = "firebase_key.json"

    cred = credentials.Certificate(firebase_key_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

print("✅ Firebase initialized")
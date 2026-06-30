import firebase_admin
from firebase_admin import credentials, auth
from firebase_admin import firestore

# Prevent multiple initialization
if not firebase_admin._apps:
    cred = credentials.Certificate("firebase_key.json")
    firebase_admin.initialize_app(cred)

db = firestore.client()

print("✅ Firebase initialized")
print("✅ Firestore client:", db)
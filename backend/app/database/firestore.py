from firebase_admin import firestore
from app.firebase.firebase_config import db
db = firestore.client()
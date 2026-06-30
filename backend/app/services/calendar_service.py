import os
from urllib.parse import urlencode

import requests
from dotenv import load_dotenv
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from app.firebase.firebase_config import db

if os.path.exists(".env"):
    load_dotenv()

CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")

SCOPES = [
    "https://www.googleapis.com/auth/calendar.events"
]


def get_google_auth_url(uid):

    params = {
        "client_id": CLIENT_ID,
        "redirect_uri": REDIRECT_URI,
        "response_type": "code",
        "scope": " ".join(SCOPES),
        "access_type": "offline",
        "prompt": "consent",
        "state": uid,
    }

    return (
        "https://accounts.google.com/o/oauth2/v2/auth?"
        + urlencode(params)
    )


def exchange_code(code):

    response = requests.post(
        "https://oauth2.googleapis.com/token",
        data={
            "code": code,
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
            "redirect_uri": REDIRECT_URI,
            "grant_type": "authorization_code",
        },
    )

    return response.json()


def create_calendar_event(access_token, task):

    creds = Credentials(access_token)

    service = build(
        "calendar",
        "v3",
        credentials=creds,
    )

    event = {
        "summary": task["title"],
        "description": task.get("description", ""),
        "start": {
            "dateTime": task["dueDate"],
            "timeZone": "Asia/Kolkata",
        },
        "end": {
            "dateTime": task["dueDate"],
            "timeZone": "Asia/Kolkata",
        },
        "reminders": {
        "useDefault": False,
        "overrides": [
            {
                "method": "popup",
                "minutes": 15
            },
            {
                "method": "email",
                "minutes": 30
            }
        ]
    },
    }

    return (
        service.events()
        .insert(calendarId="primary", body=event)
        .execute()
    )

def create_calendar_event(uid: str, task: dict):

    user = db.collection("users").document(uid).get()

    if not user.exists:
        return

    data = user.to_dict()

    if not data.get("calendarConnected"):
        return

    creds = Credentials(
        token=data["googleAccessToken"],
        refresh_token=data["googleRefreshToken"],
        token_uri="https://oauth2.googleapis.com/token",
        client_id=os.getenviron["GOOGLE_CLIENT_ID"],
        client_secret=os.getenviron["GOOGLE_CLIENT_SECRET"],
    )

    service = build("calendar", "v3", credentials=creds)

    event = {
        "summary": task["title"],
        "description": task["description"],
        "start": {
            "dateTime": task["dueDate"],
            "timeZone": "Asia/Kolkata",
        },
        "end": {
            "dateTime": task["dueDate"],
            "timeZone": "Asia/Kolkata",
        },
        "reminders": {
        "useDefault": False,
        "overrides": [
            {
                "method": "popup",
                "minutes": 15
            },
            {
                "method": "email",
                "minutes": 30
            }
        ]
    },
    }

    service.events().insert(
        calendarId="primary",
        body=event,
    ).execute()
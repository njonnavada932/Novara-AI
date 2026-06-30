# from fastapi import APIRouter
# from services.calendar_service import create_calendar_event


# router = APIRouter(prefix="/calendar", tags=["Calendar"])


# @router.post("/create")
# def create_event(task: dict):
#     create_calendar_event(task)
#     return {"message": "Calendar event created"}

# @router.get("/login")
# def login():
#     return {
#         "url": get_google_auth_url()
#     }

# @router.get("/oauth2callback")
# def callback(code: str):

#     token = exchange_code(code)

#     return token


from fastapi import APIRouter
from app.firebase.firebase_config import db

from app.services.calendar_service import (
    get_google_auth_url,
    exchange_code,
    create_calendar_event
)

router = APIRouter(
    prefix="/calendar",
    tags=["Google Calendar"]
)


@router.get("/login")
def login(uid: str):

    return {
        "url": get_google_auth_url(uid)
    }

# @router.get("/login")
# def login():
#     return "hello"

@router.get("/oauth2callback")
def oauth_callback(code: str,
    state: str):

    token = exchange_code(code)

    db.collection("users").document(state).update({

    "googleAccessToken": token["access_token"],

    "googleRefreshToken": token.get("refresh_token", ""),

    "calendarConnected": True

})

    return {
        "message": "Google Calendar Connected Successfully"
    }

@router.post("/create-event")
def create_event(task: dict):

    uid = task["uid"]

    create_calendar_event(uid, task)

    return {"message": "Event Created"}

@router.get("/status/{uid}")
def calendar_status(uid: str):

    user = db.collection("users").document(uid).get()

    if not user.exists:
        return {"connected": False}

    data = user.to_dict()

    return {
        "connected": data.get("calendarConnected", False)
    }
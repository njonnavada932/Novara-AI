from fastapi import APIRouter, Header, HTTPException
from app.auth.auth_service import verify_token

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.get("/verify")
def verify_user(authorization: str = Header(...)):
    try:
        token = authorization.replace("Bearer ", "")
        user = verify_token(token)

        if user is None:
            raise HTTPException(status_code=401, detail="Invalid Token")

        return {
            "message": "Authentication Successful",
            "uid": user["uid"],
            "email": user.get("email")
        }

    except Exception:
        raise HTTPException(status_code=401, detail="Unauthorized")
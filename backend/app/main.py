from fastapi import FastAPI
from app.firebase.firebase_config import *
from app.auth.auth_routes import router as auth_router
from app.tasks.task_routes import router as task_router
from app.routers.ai import router as ai_router
from fastapi.middleware.cors import CORSMiddleware
from app.routers.calendar_router import router as calendar_router
from app.rag.rag_router import router as rag_router

app = FastAPI(
    title="Novara AI API",
    description="AI Powered Smart Task Management Backend",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth_router)
app.include_router(task_router)
app.include_router(ai_router, prefix="/ai", tags=["AI"])
app.include_router(calendar_router)
app.include_router(rag_router)

@app.get("/")
def home():
    return {
        "message": "Welcome to Novara AI Backend 🚀",
        "status": "Running Successfully"
    }

@app.get("/health")
def health():
    return {
        "status": "Healthy",
        "server": "FastAPI"
    }
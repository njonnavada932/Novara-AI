from fastapi import APIRouter
from app.rag.rag_chat import rag_chat
from app.rag.index_tasks import index_all_tasks

router = APIRouter(prefix="/rag", tags=["RAG"])

@router.post("/chat")
def chat(data: dict):

    answer = rag_chat(
        data["question"],
        data["userId"]
    )

    return {
        "answer": answer
    }

@router.post("/reindex")
def reindex():

    index_all_tasks()

    return {
        "message": "Indexed"
    }
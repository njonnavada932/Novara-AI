from fastapi import APIRouter
from app.tasks.task_schema import TaskCreate
from app.tasks.task_service import create_task

router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"]
)


@router.post("/create")
def create_new_task(task: TaskCreate):
    """
    Temporary user_id.
    Later we'll get this from Firebase Authentication.
    """

    user_id = "demo_user"

    return create_task(user_id, task)
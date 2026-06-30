from fastapi import APIRouter
from pydantic import BaseModel
from app.services.gemini_service import parse_task, plan_task


router = APIRouter()

class TaskPrompt(BaseModel):
    prompt: str

class PlanTaskRequest(BaseModel):
    title: str
    description: str = ""
    category: str = "Personal"
    priority: str = "Medium"

@router.post("/plan-task")
def plan_task_route(body: PlanTaskRequest):
    result = plan_task(body.title, body.description, body.category, body.priority)
    return result

class PromptRequest(BaseModel):
    prompt: str


@router.post("/parse-task")
async def parse(request: PromptRequest):
    result = parse_task(request.prompt)
    return parse_task(request.prompt)
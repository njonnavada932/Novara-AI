from pydantic import BaseModel
from typing import Optional


class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    category: str
    priority: str
    deadline: Optional[str] = None


class TaskResponse(TaskCreate):
    id: str
    status: str = "Pending"
    ai_generated: bool = False
    voice_generated: bool = False
    calendar_synced: bool = True
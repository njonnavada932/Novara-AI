from uuid import uuid4
from app.database.firestore import db


def create_task(user_id: str, task):
    task_id = str(uuid4())

    task_data = {
        "id": task_id,
        "title": task.title,
        "description": task.description,
        "category": task.category,
        "priority": task.priority,
        "deadline": task.deadline,
        "status": "Pending",
        "ai_generated": False,
        "voice_generated": False,
        "calendarSynced": True,
    }

    print("Before Firestore write")

    db.collection("users") \
      .document(user_id) \
      .collection("tasks") \
      .document(task_id) \
      .set(task_data)

    print("After Firestore write")

    return task_data
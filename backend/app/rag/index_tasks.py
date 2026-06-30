from app.firebase.firebase_config import db

from app.rag.embedding_service import generate_embedding
from app.rag.pinecone_service import index

# print("Number of tasks:", len(docs))
embedding=""
vectors = []
def index_all_tasks():

    docs = db.collection("tasks").stream()
    doc_list=list(docs)
    print("Number of tasks:", len(doc_list))
    

    for doc in doc_list:

        task = doc.to_dict()
        due = task.get("dueDate")
        # print("dueDate===",type(task.get("dueDate")))
        # print("dueDate===",task.get("dueDate"))
        if due:
           due = due.isoformat() if hasattr(due, "isoformat") else str(due)
        else:
           due = ""
        text = f"""
        Title : {task['title']}
        Description : {task['description']}
        Category : {task['category']}
        Priority : {task['priority']}
        """

        embedding = generate_embedding(text)
        # print("Embedding length:", len(embedding))
        
        vectors.append({
            "id": doc.id,
            "values": embedding,
            "metadata": {
                "userId": task["userId"],
                "title": task.get("title", ""),
                "description": task.get("description", ""),
                "priority": task.get("priority", ""),
                "category": task.get("category", ""),
                "dueDate": due,
                "completed": task.get("completed", False),
                "calendarSynced": task.get("calendarSynced", True),
                "reminderEnabled": task.get("reminderEnabled", False),
            },
        })
    # print("First vector:", vectors)
    index.upsert(vectors=vectors)
    print("✅ Indexed successfully.")
from app.rag.index_tasks import index_all_tasks
from app.firebase.firebase_config import db

print("Indexing tasks into Pinecone...")

index_all_tasks()

print("Done!")

# def index_all_tasks():

#     docs = list(db.collection("tasks").stream())

#     print("Total tasks found:", len(docs))

#     for doc in docs:
#         # print("--------------------------------")
#         # print("Document ID:", doc.id)
#         task = doc.to_dict()
#         print(task)

#         due = task.get("dueDate")
#         # print("dueDate:", due)
#         # print("type:", type(due))

#         # Stop after the first document
#         break
    
# index_all_tasks()
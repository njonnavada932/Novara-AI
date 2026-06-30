from app.rag.retrieve_tasks import retrieve_tasks

results = retrieve_tasks("pending work tasks")

for r in results:
    print(r.metadata)
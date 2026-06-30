from app.rag.embedding_service import generate_embedding
from app.rag.pinecone_service import index


def retrieve_tasks(query, user_id, top_k=5):

    embedding = generate_embedding(query)

    result = index.query(
        vector=embedding,
        top_k=top_k,
        include_metadata=True,
        filter={
        "userId": user_id,
        }
    )

    for match in result.matches:
        print("matcheddata===",match.metadata)
    # print("========== Pinecone ==========")
    # print(result)
    # print("==============================")
    return result.matches
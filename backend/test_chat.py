from app.rag.rag_chat import rag_chat

uid = "d3ECbpZVGgSmdqUWRV1UJRA6UVU2"

print(
    rag_chat(
        "What work tasks are pending?",
        uid
    )
)
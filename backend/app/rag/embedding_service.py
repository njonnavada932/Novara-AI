# import os
# import google.generativeai as genai
# from app.services.gemini_service import genai

# print("GEMINI_API_KEY =", os.getenv("GEMINI_API_KEY"))
# genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


# def generate_embedding(text: str):

#     response = genai.embed_content(
#         model="models/text-embedding-004",
#         content=text,
#         task_type="retrieval_document",
#     )

#     return response["embedding"]
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2",cache_folder="./models")


def generate_embedding(text: str):
    return model.encode(text).tolist()
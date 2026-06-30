import os
from dotenv import load_dotenv

load_dotenv()

from pinecone import Pinecone

# print("Pine cone API key ====",os.getenv("PINECONE_API_KEY"))
pc = Pinecone(
    api_key=os.getenv("PINECONE_API_KEY")
)

index = pc.Index(
    host=os.getenv("PINECONE_HOST")
)
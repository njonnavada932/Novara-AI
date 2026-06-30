import os
from dotenv import load_dotenv
from pinecone import Pinecone

if os.path.exists(".env"):
    load_dotenv()



# print("Pine cone API key ====",os.getenv("PINECONE_API_KEY"))
pc = Pinecone(
    api_key=os.environ["PINECONE_API_KEY"]
)



index = pc.Index(
    host=os.getenviron["PINECONE_HOST"]
)



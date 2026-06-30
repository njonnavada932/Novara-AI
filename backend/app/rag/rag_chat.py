from app.rag.retrieve_tasks import retrieve_tasks
from app.services.gemini_service import model
from datetime import datetime

today = datetime.now().date()

def rag_chat(question, user_id):

    matches = retrieve_tasks(question, user_id)
    if len(matches) == 0:
        return "I couldn't find that information in your tasks."
    context = ""

    for task in matches:
        meta = task.metadata
        context += f"""
        Title: {meta.get('title')}
        Description: {meta.get('description')}
        Priority: {meta.get('priority')}
        Category: {meta.get('category')}
        Due Date: {meta.get('dueDate')}
        Completed: {meta.get('completed')}
        calendarSynced: {meta.get('calendarSynced')}
        ReminderEnabled: {meta.get('reminderEnabled')}

"""

    prompt = f"""
You are Novara AI, a smart productivity assistant.
Today's date is:

{today}
The following are the user's tasks.

{context}

User question:
{question}

Rules:
1. Answer ONLY from the tasks above.
2. If the user asks for pending tasks, list every task.
3. Mention title and priority whenever possible.
4. Be conversational and helpful.
5. Only say "I couldn't find that information in your tasks." if there are absolutely no relevant tasks.

Answer:
""" 

    response = model.generate_content(prompt)

    return response.text
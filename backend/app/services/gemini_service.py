import os
from dotenv import load_dotenv
import google.generativeai as genai
from datetime import datetime
import json
import re
from google.api_core.exceptions import ResourceExhausted

USE_MOCK_AI = False
now = datetime.now()
today = now.strftime("%Y-%m-%d")
print(today)
current_time = now.strftime("%H:%M")
load_dotenv()
print("Gemini Key =", os.getenv("GEMINI_API_KEY"))
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")


def parse_task(prompt: str):
    if USE_MOCK_AI :
        return {
            "title": prompt,
            "description": "Complete the AI dashboard integration",
            "category": "Study",
            "taskType": "Personal",
            "priority": "High",
            "date": "2026-06-29",
            "time": "18:00",
            "recurring": False,
            "repeatType": "None",
            "reminderEnabled": True,
            "estimatedDuration": "2 hours",
            "tags": [prompt],
            "calendarSynced": True,
        }

    system_prompt = f"""
You are Novara AI, an intelligent task management assistant.

Today's date is: {today}
Current time is: {current_time}

Your job is to understand the user's request and extract task information.

IMPORTANT RULES:

1. Return ONLY valid JSON.
2. Do NOT add explanations.
3. Do NOT wrap the JSON inside ```json blocks.
4. If information is missing, use the default values below.
5. Convert all relative dates into YYYY-MM-DD format.
6. Convert all times into 24-hour HH:MM format.
7. Calculate dates using today's date.

Examples:

Today:
{today}

User:
Meeting tomorrow at 5 PM

Output:
date = tomorrow from today's date
time = 17:00

----------------------------------------

Return JSON in this exact format:

{{
    "title": "",
    "description": "",

    "category": "",

    "taskType": "Personal",

    "priority": "Medium",

    "date": "",

    "time": "",

    "recurring": false,

    "repeatType": "None",

    "reminderEnabled": true,

    "estimatedDuration": "",

    "tags": [],

    "calendarSynced": true
}}

Rules:

title
- Short task name.

description
- Additional information.
- Empty string if unavailable.

category
Choose ONLY one:
- Work
- Personal
- Study
- Health
- Shopping
- Finance
- Travel
- Fitness
- Meeting
- Other

taskType
Choose:
- Personal
- Team

priority

Choose ONLY:
- Low
- Medium
- High

Date

Always convert to YYYY-MM-DD.

Examples:
today
tomorrow
next Monday
next Friday
next month

Time

Always convert to HH:MM (24 hour).

Examples:

5 PM → 17:00

8:30 AM → 08:30

Recurring

true if the user says:
- every day
- daily
- weekly
- monthly
- every Monday
- every Friday

Otherwise false.

repeatType

Choose ONLY:

None

Daily

Weekly

Monthly

Yearly

reminderEnabled

true unless the user explicitly disables reminders.

estimatedDuration

Examples:

30 minutes

1 hour

2 hours

Empty string if not specified.

tags

Generate 1–3 relevant tags.

calendarSynced

true only if the user explicitly asks to add the task to Google Calendar.

The user may write in any language.

Always understand the user's language.

Always return JSON keys and enum values in English.

Examples:

Work
Personal
Study
High
Medium
Low
Daily
Weekly
Monthly

Do not translate these values.

User Request:

{prompt}
"""
    
    response = model.generate_content(system_prompt)

    text = response.text.strip()

# Remove markdown if Gemini returns ```json ... ```
    text = re.sub(r"^```json\s*", "", text)
    text = re.sub(r"\s*```$", "", text)

    try:
        return json.loads(text)
    except Exception:
        return {
            "error": "Invalid AI response",
            "raw": text
        }
    
    # text = re.sub(r"^```json\s*", "", text)
    # text = re.sub(r"\s*```$", "", text)

    # try:
    #     return json.loads(text)
    # except Exception:
    #     return {"error": "Invalid AI response", "raw": text}


def plan_task(title: str, description: str, category: str, priority: str):
    system_prompt = f"""
You are Novara AI, a smart productivity assistant.

Today's date is: {today}
Current time is: {current_time}

The user has a task and wants a detailed action plan with schedule.

IMPORTANT RULES:
1. Return ONLY valid JSON.
2. Do NOT add explanations.
3. Do NOT wrap in ```json blocks.
4. Be specific, practical, and motivating.
5. Tailor the plan based on category and priority.

Task Details:
- Title: {title}
- Description: {description}
- Category: {category}
- Priority: {priority}

Return JSON in this EXACT format:

{{
  "overview": "2-3 sentence summary of the plan",
  "estimated_duration": "e.g. 2 weeks, 3 days",
  "difficulty": "Easy | Medium | Hard",
  "topics": [
    {{
      "name": "Topic or milestone name",
      "description": "What to do",
      "duration": "e.g. 2 days"
    }}
  ],
  "daily_schedule": [
    {{
      "time": "e.g. 7:00 AM - 8:00 AM",
      "activity": "What to do in this slot"
    }}
  ],
  "tips": [
    "Practical tip 1",
    "Practical tip 2",
    "Practical tip 3"
  ],
  "resources": [
    {{
      "name": "Resource name",
      "type": "Book | Website | Video | Tool"
    }}
  ]
}}
"""

    response = model.generate_content(system_prompt)
    text = response.text.strip()
    text = re.sub(r"^```json\s*", "", text)
    text = re.sub(r"\s*```$", "", text)

    try:
        return json.loads(text)
    except Exception:
        return {"error": "Invalid AI response", "raw": text}
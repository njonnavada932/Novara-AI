const API_URL = "http://127.0.0.1:8000";

export async function parseTask(prompt: string) {
  const response = await fetch(`${API_URL}/ai/parse-task`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    throw new Error("Unable to parse task");
  }

  return await response.json();
}
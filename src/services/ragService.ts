import { apiFetch } from "./api";

export async function askNovara(
  question: string,
  userId: string
) {
  const response = await apiFetch("/rag/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question,
      userId,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to get AI response");
  }

  return await response.json();
}
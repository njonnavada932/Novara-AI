import { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles } from "lucide-react";
import { apiFetch } from "../../services/api";
import { askNovara } from "../../services/ragService";
import { auth } from "../../firebase/firebase";

interface Message {
  sender: "user" | "ai";
  text: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AIChatModal({ open, onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "👋 Hi! I'm Novara.\n\nAsk me about your tasks, priorities, deadlines or schedule.",
    },
  ]);

  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  if (!open) return null;

  async function sendMessage(customQuestion?: string) {
    const userMessage = customQuestion || question;

    if (!userMessage.trim()) return;

    // Add user's message
    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: userMessage,
      },
    ]);

    // Clear textbox only if typed manually
    if (!customQuestion) {
      setQuestion("");
    }

    setLoading(true);

    try {
      const result = await askNovara(userMessage, auth.currentUser!.uid);

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: result.answer,
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Sorry, something went wrong while talking to Novara AI.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end items-center p-4 md:p-8">
      <div className="w-full max-w-[480px] h-[78vh] max-h-[620px] min-h-[520px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}

        <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-700 px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <Sparkles size={22} className="text-white" />
              </div>

              <div>
                <h2 className="text-white font-bold text-xl">Novara AI</h2>

                <p className="text-indigo-100 text-sm">
                  Plan Smart. Finish Faster.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-lg p-2 transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        {/* Chat */}

        <div className="flex-1 overflow-y-auto bg-gray-50 px-4 py-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[82%] px-4 py-3 text-sm whitespace-pre-wrap leading-6 shadow-sm ${
                  message.sender === "user"
                    ? "bg-indigo-600 text-white rounded-2xl rounded-br-md"
                    : "bg-white border border-gray-200 rounded-2xl rounded-bl-md"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl rounded-bl-md border border-gray-200 px-4 py-3 shadow-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"></div>

                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:.15s]"></div>

                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:.3s]"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef}></div>
        </div>

        {/* Quick Suggestions */}

        <div className="px-4 pt-4 pb-2 bg-white">
          {/* <p className="text-xs text-gray-500 mb-3">Try asking...</p> */}

          <div className="flex flex-wrap gap-2">
            {[
              "What's on my schedule today?",
              "Show overdue tasks",
              "Prepare today's work",
              "Which task should I finish first?",
            ].map((item) => (
              <button
                key={item}
                onClick={() => sendMessage(item)}
                className="text-xs px-3 py-2 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}

        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center gap-3 bg-gray-100 rounded-full px-3 py-2">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              placeholder="Ask anything about your work..."
              className="flex-1 bg-transparent outline-none text-sm px-2"
            />

            <button
              onClick={() => sendMessage()}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center justify-center text-white hover:scale-105 transition"
            >
              <Send size={17} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

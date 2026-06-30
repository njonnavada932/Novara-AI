import { Sparkles } from "lucide-react";
interface Props {
  onOpen: () => void;
}

export default function AIAssistantCard({ onOpen }: Props) {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <Sparkles size={28} />
        <h2 className="text-xl font-bold">Novara AI Assistant</h2>
      </div>

      <p className="text-indigo-100">
        Ask me to organize your day, prioritize tasks, or generate a
        productivity plan.
      </p>

      <button
        onClick={onOpen}
        className="mt-5 bg-white text-indigo-700 px-5 py-2 rounded-xl font-semibold hover:bg-gray-100"
      >
        Ask AI
      </button>
    </div>
  );
}

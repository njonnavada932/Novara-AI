import { useState, useRef } from "react";
import { Mic, MicOff, Sparkles, AlertCircle } from "lucide-react";
import { parseTask } from "../../services/aiservices";

interface Props {
  onAITaskGenerated: (task: any) => void;
}

export default function AITaskInput({ onAITaskGenerated }: Props) {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string>("");
  const [liveText, setLiveText] = useState("");
  const recognitionRef = useRef<any>(null);
  const finalTranscriptRef = useRef<string>("");
  const hasProcessedRef = useRef(false);

  const resetState = () => {
    setListening(false);
  };

  const startListening = () => {
    setError("");
    setLiveText("");
    finalTranscriptRef.current = "";
    hasProcessedRef.current = false;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.lang = "en-IN";
      recognition.interimResults = true;
      recognition.continuous = true;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: any) => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscriptRef.current += event.results[i][0].transcript + " ";
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        setLiveText(finalTranscriptRef.current + interim);
      };

      recognition.onerror = (event: any) => {
        console.error("Recognition error:", event.error);
        if (
          event.error === "not-allowed" ||
          event.error === "permission-denied"
        ) {
          setError("Microphone access denied. Please allow mic permissions.");
        } else if (event.error === "no-speech") {
          setError("No speech detected. Please try again.");
        } else if (event.error !== "aborted") {
          setError("Voice recognition failed. Please try again.");
        }
        resetState();
      };

      recognition.onend = async () => {
        resetState();

        const transcript = finalTranscriptRef.current.trim();

        if (hasProcessedRef.current || !transcript) return;
        hasProcessedRef.current = true;

        try {
          console.log("User said:", transcript);
          const task = await parseTask(transcript);

          if (!task || task.error) {
            throw new Error("Invalid task response");
          }

          onAITaskGenerated(task);
          setLiveText("");
        } catch (err) {
          console.error(err);
          setError("Unable to process your request. Please try again.");
        }
      };

      setListening(true);
      recognition.start();
    } catch (err) {
      console.error("Failed to start recognition:", err);
      setError("Could not start voice recognition.");
      resetState();
    }
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
  };

  return (
    <div className="fixed bottom-8 right-8 bg-white shadow-2xl rounded-2xl p-5 w-[330px]">
      <div className="flex items-center gap-2 mb-5">
        <Sparkles className="text-indigo-600" />
        <h3 className="font-semibold text-lg">Novara AI</h3>
      </div>

      {!listening ? (
        <button
          onClick={startListening}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-4 flex items-center justify-center gap-3 transition"
        >
          <Mic size={22} />
          Tap to Speak
        </button>
      ) : (
        <button
          onClick={stopListening}
          className="w-full bg-red-500 hover:bg-red-600 text-white rounded-xl py-4 flex items-center justify-center gap-3 transition"
        >
          <MicOff size={22} />
          Tap to Stop
        </button>
      )}

      {listening && (
        <div className="mt-4">
          <p className="text-center text-sm text-indigo-600 animate-pulse mb-2">
            🎤 Listening...
          </p>
          {liveText && (
            <p className="text-xs text-slate-500 bg-slate-50 rounded-lg p-2.5 leading-relaxed">
              {liveText}
            </p>
          )}
        </div>
      )}

      {error && (
        <div className="mt-4 flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl p-3">
          <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
          <p className="text-xs text-red-600 leading-relaxed">{error}</p>
        </div>
      )}
    </div>
  );
}

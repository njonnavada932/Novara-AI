import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sparkles,
  Clock,
  BookOpen,
  Calendar,
  Lightbulb,
  Link,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { apiFetch } from "../../services/api";
import type { Task } from "../../services/taskservice";

interface Props {
  task: Task;
  onClose: () => void;
}

interface Topic {
  name: string;
  description: string;
  duration: string;
}

interface ScheduleItem {
  time: string;
  activity: string;
}

interface Resource {
  name: string;
  type: string;
}

interface Plan {
  overview: string;
  estimated_duration: string;
  difficulty: string;
  topics: Topic[];
  daily_schedule: ScheduleItem[];
  tips: string[];
  resources: Resource[];
}

const difficultyColor: Record<string, string> = {
  Easy: "bg-green-100 text-green-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Hard: "bg-red-100 text-red-700",
};

export default function TaskPlanModal({ task, onClose }: Props) {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openSection, setOpenSection] = useState<string>("topics");

  const generatePlan = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/ai/plan-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: task.title,
          description: task.description,
          category: task.category,
          priority: task.priority,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setPlan(data);
    } catch (err: any) {
      setError("Failed to generate plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggle = (section: string) =>
    setOpenSection(openSection === section ? "" : section);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">
                AI Plan
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-800 leading-snug">
              {task.title}
            </h3>
            <div className="flex gap-2 mt-1.5">
              <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium">
                {task.category}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  task.priority === "High"
                    ? "bg-red-50 text-red-600"
                    : task.priority === "Medium"
                      ? "bg-yellow-50 text-yellow-600"
                      : "bg-green-50 text-green-600"
                }`}
              >
                {task.priority}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
          {!plan && !loading && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-indigo-400" />
              </div>
              <p className="text-slate-600 font-medium mb-1">
                Generate an AI plan for this task
              </p>
              <p className="text-sm text-slate-400 mb-6">
                Novara AI will create a step-by-step plan, schedule, and tips
                tailored to your task.
              </p>
              <button
                onClick={generatePlan}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition"
              >
                <Sparkles className="w-4 h-4" />
                Generate Plan
              </button>
            </div>
          )}

          {loading && (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mx-auto mb-3" />
              <p className="text-sm text-slate-500 font-medium">
                Novara AI is planning your task...
              </p>
            </div>
          )}

          {error && (
            <div className="text-center py-6">
              <p className="text-sm text-red-500 font-medium mb-3">{error}</p>
              <button
                onClick={generatePlan}
                className="text-sm font-bold text-indigo-600 hover:underline"
              >
                Try again
              </button>
            </div>
          )}

          {plan && (
            <div className="space-y-3">
              {/* Overview */}
              <div className="bg-indigo-50 rounded-xl p-4">
                <p className="text-sm text-indigo-800 leading-relaxed">
                  {plan.overview}
                </p>
                <div className="flex gap-3 mt-3">
                  <span className="flex items-center gap-1 text-xs font-semibold text-slate-600">
                    <Clock className="w-3.5 h-3.5" />
                    {plan.estimated_duration}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${difficultyColor[plan.difficulty] ?? "bg-slate-100 text-slate-600"}`}
                  >
                    {plan.difficulty}
                  </span>
                </div>
              </div>

              {/* Topics */}
              <Section
                icon={<BookOpen className="w-4 h-4 text-indigo-500" />}
                title="Topics & Milestones"
                id="topics"
                open={openSection === "topics"}
                onToggle={() => toggle("topics")}
              >
                <div className="space-y-2">
                  {plan.topics.map((t, i) => (
                    <div
                      key={i}
                      className="flex gap-3 p-3 bg-slate-50 rounded-xl"
                    >
                      <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-700">
                          {t.name}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {t.description}
                        </p>
                        <p className="text-xs text-indigo-500 font-medium mt-1">
                          ⏱ {t.duration}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>

              {/* Schedule */}
              <Section
                icon={<Calendar className="w-4 h-4 text-violet-500" />}
                title="Daily Schedule"
                id="schedule"
                open={openSection === "schedule"}
                onToggle={() => toggle("schedule")}
              >
                <div className="space-y-2">
                  {plan.daily_schedule.map((s, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <span className="text-xs font-bold text-violet-600 bg-violet-50 px-2 py-1 rounded-lg whitespace-nowrap">
                        {s.time}
                      </span>
                      <p className="text-sm text-slate-600 pt-0.5">
                        {s.activity}
                      </p>
                    </div>
                  ))}
                </div>
              </Section>

              {/* Tips */}
              <Section
                icon={<Lightbulb className="w-4 h-4 text-yellow-500" />}
                title="Pro Tips"
                id="tips"
                open={openSection === "tips"}
                onToggle={() => toggle("tips")}
              >
                <div className="space-y-2">
                  {plan.tips.map((tip, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-yellow-400 mt-0.5">💡</span>
                      <p className="text-sm text-slate-600">{tip}</p>
                    </div>
                  ))}
                </div>
              </Section>

              {/* Resources */}
              <Section
                icon={<Link className="w-4 h-4 text-green-500" />}
                title="Resources"
                id="resources"
                open={openSection === "resources"}
                onToggle={() => toggle("resources")}
              >
                <div className="flex flex-wrap gap-2">
                  {plan.resources.map((r, i) => (
                    <span
                      key={i}
                      className="text-xs font-medium px-3 py-1.5 bg-green-50 text-green-700 rounded-full border border-green-100"
                    >
                      {r.name} · {r.type}
                    </span>
                  ))}
                </div>
              </Section>
            </div>
          )}
        </div>

        {/* Footer */}
        {plan && (
          <div className="px-6 py-4 border-t border-slate-100 flex justify-between items-center">
            <button
              onClick={generatePlan}
              className="text-xs font-semibold text-slate-400 hover:text-indigo-600 transition flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Regenerate
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition"
            >
              Got it!
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// Reusable collapsible section
function Section({
  icon,
  title,
  id,
  open,
  onToggle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  id: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-slate-100 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-bold text-slate-700">{title}</span>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="px-4 pb-4"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onRemove: (id: string) => void;
}

export default function ToastContainer({
  toasts,
  onRemove,
}: ToastContainerProps) {
  return (
    <div
      id="toast-container"
      className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full px-4 pointer-events-none"
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          let Icon = Info;
          let bgColor =
            "bg-white border-slate-100 text-slate-800 shadow-lg shadow-slate-100/50";
          let iconColor = "text-indigo-500";

          if (toast.type === "success") {
            Icon = CheckCircle2;
            bgColor =
              "bg-white border-emerald-100 text-slate-800 shadow-lg shadow-emerald-100/30";
            iconColor = "text-emerald-500";
          } else if (toast.type === "error") {
            Icon = AlertCircle;
            bgColor =
              "bg-white border-rose-100 text-slate-800 shadow-lg shadow-rose-100/30";
            iconColor = "text-rose-500";
          }

          return (
            <motion.div
              key={toast.id}
              id={`toast-${toast.id}`}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border ${bgColor}`}
            >
              <div className="mt-0.5">
                <Icon
                  id={`toast-icon-${toast.id}`}
                  className={`h-5 w-5 ${iconColor}`}
                />
              </div>
              <div className="flex-1 text-sm font-medium leading-tight">
                {toast.message}
              </div>
              <button
                id={`toast-close-btn-${toast.id}`}
                onClick={() => onRemove(toast.id)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded-lg hover:bg-slate-50"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

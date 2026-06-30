import { useEffect, useState, useRef } from "react";
import { auth, db } from "../../firebase/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Plus,
  Pencil,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// ─────────────────────────────────────────────
// NOTIFICATION BELL
// ─────────────────────────────────────────────
interface NotificationBellProps {
  todayTasks?: number;
  overdue?: number;
  highPriority?: number;
  pending?: number;
}

export function NotificationBell({
  todayTasks = 0,
  overdue = 0,
  highPriority = 0,
  pending = 0,
}: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const notifications = [];

  if (overdue > 0)
    notifications.push({
      id: 1,
      icon: "warning",
      message: `${overdue} overdue task${overdue > 1 ? "s" : ""} need attention`,
    });
  if (todayTasks > 0)
    notifications.push({
      id: 2,
      icon: "clock",
      message: `${todayTasks} task${todayTasks > 1 ? "s" : ""} due today`,
    });
  if (highPriority > 0)
    notifications.push({
      id: 3,
      icon: "warning",
      message: `${highPriority} high priority task${highPriority > 1 ? "s" : ""} pending`,
    });
  if (pending > 0)
    notifications.push({
      id: 4,
      icon: "check",
      message: `${pending} task${pending > 1 ? "s" : ""} waiting to be completed`,
    });
  if (notifications.length === 0)
    notifications.push({
      id: 5,
      icon: "ai",
      message: "All caught up! Great job 🎉",
    });

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const iconMap: any = {
    check: <CheckCircle2 className="w-4 h-4 text-green-500" />,
    warning: <AlertTriangle className="w-4 h-4 text-orange-500" />,
    clock: <Clock className="w-4 h-4 text-indigo-500" />,
    ai: <Sparkles className="w-4 h-4 text-violet-500" />,
  };

  const hasAlert = overdue + todayTasks + highPriority > 0;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl hover:bg-slate-50 transition"
      >
        <Bell className="w-6 h-6 text-gray-600" />
        {hasAlert && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
              {notifications.length} new
            </span>
          </div>

          <div className="divide-y divide-slate-50 max-h-72 overflow-y-auto">
            {notifications.map((n: any) => (
              <div
                key={n.id}
                className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition"
              >
                <div className="mt-0.5">{iconMap[n.icon]}</div>
                <p className="text-sm text-slate-700 font-medium leading-snug">
                  {n.message}
                </p>
              </div>
            ))}
          </div>

          <div className="px-4 py-3 border-t border-slate-100">
            {/* <button
              onClick={() => {
                navigate("/notifications");
                setOpen(false);
              }}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition"
            >
              View all notifications →
            </button> */}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// RECENT ACTIVITY
// ─────────────────────────────────────────────
type ActivityType = "completed" | "added" | "updated" | "ai" | "calendar";

interface Activity {
  id: string;
  title: string;
  type: ActivityType;
  time: string;
}

function timeAgo(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 172800) return "Yesterday";
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

const activityIcon: Record<ActivityType, JSX.Element> = {
  completed: <CheckCircle2 className="w-4 h-4 text-green-500" />,
  added: <Plus className="w-4 h-4 text-indigo-500" />,
  updated: <Pencil className="w-4 h-4 text-orange-400" />,
  ai: <Sparkles className="w-4 h-4 text-violet-500" />,
  calendar: <Calendar className="w-4 h-4 text-blue-400" />,
};

const activityLabel: Record<ActivityType, string> = {
  completed: "Completed",
  added: "Added",
  updated: "Updated",
  ai: "AI Created",
  calendar: "Calendar Synced",
};

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) return;
      try {
        const q = query(
          collection(db, "tasks"),
          where("userId", "==", user.uid),
          where("completed", "==", true),
          //   orderBy("updatedAt", "desc"),
          //   limit(6),
        );
        const snapshot = await getDocs(q);

        const data: Activity[] = snapshot.docs
          .map((doc) => {
            const d = doc.data();
            const updatedAt = d.updatedAt?.toDate?.() ?? new Date();
            const createdAt = d.createdAt?.toDate?.() ?? new Date();
            let type: ActivityType = "added";
            if (d.completed) type = "completed";
            else if (d.aiGenerated) type = "ai";
            else if (d.calendarSynced) type = "calendar";
            else if (updatedAt.getTime() !== createdAt.getTime())
              type = "updated";
            return {
              id: doc.id,
              title: d.title,
              type,
              time: timeAgo(updatedAt),
              _updatedAt: updatedAt,
            };
          })
          .sort((a, b) => b._updatedAt.getTime() - a._updatedAt.getTime()) // sort in memory
          .slice(0, 6);
        setActivities(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-lg font-bold mb-4 text-slate-800">Recent Activity</h2>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-slate-100" />
              <div className="flex-1 space-y-1.5 py-1">
                <div className="h-3 bg-slate-100 rounded w-3/4" />
                <div className="h-2.5 bg-slate-100 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-8">
          <Sparkles className="w-8 h-8 text-slate-200 mx-auto mb-2" />
          <p className="text-sm text-slate-400 font-medium">No activity yet</p>
          <p className="text-xs text-slate-300 mt-1">
            Start adding tasks to see your activity
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {activities.map((a) => (
            <div
              key={a.id}
              className="flex items-start gap-3 py-3 border-b last:border-none"
            >
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                {activityIcon[a.type]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 truncate">
                  {a.title}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {activityLabel[a.type]} · {a.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

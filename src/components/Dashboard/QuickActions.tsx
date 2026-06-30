import { Plus, Mic, Calendar } from "lucide-react";
import { connectGoogleCalendar } from "../../services/calendarservice";

interface Props {
  onAddTask: () => void;
}

export default function QuickActions({ onAddTask }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-semibold mb-5">Quick Actions</h2>

      <div className="grid grid-cols-3 gap-4">
        <button
          className="flex flex-col items-center justify-center p-5 rounded-xl bg-indigo-100 hover:bg-indigo-200 transition"
          onClick={onAddTask}
        >
          <Plus className="text-indigo-600 mb-2" />
          <span>Add Task</span>
        </button>

        {/* <button className="flex flex-col items-center justify-center p-5 rounded-xl bg-violet-100 hover:bg-violet-200 transition">
          <Mic className="text-violet-600 mb-2" />
          <span>Voice Task</span>
        </button> */}

        <button
          onClick={connectGoogleCalendar}
          className="flex flex-col items-center justify-center p-5 rounded-xl bg-green-100 hover:bg-green-200 transition"
        >
          <Calendar className="text-green-600 mb-2" />
          <span>Google Calendar</span>
        </button>
      </div>
    </div>
  );
}

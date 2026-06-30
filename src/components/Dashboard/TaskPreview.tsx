import type { Task } from "../../services/taskservice";
import { deleteTask, toggleTask } from "../../services/taskservice";
import { Trash2, CheckCircle, Pencil } from "lucide-react";
import { Sparkles } from "lucide-react";
import TaskPlanModal from "./TaskPlanModal";
import { useState } from "react";

interface Props {
  tasks: Task[];
  refreshTasks: () => void;
  onEdit: (task: Task) => void;
}

export default function TaskPreview({ tasks, refreshTasks, onEdit }: Props) {
  const [planTask, setPlanTask] = useState<Task | null>(null);
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-semibold mb-5">Let's Get Things Done</h2>

      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks available.</p>
      ) : (
        tasks.map((task) => (
          <div
            key={task.id}
            className="border rounded-2xl p-3 mb-3 shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-start">
              {/* Left Side */}
              <div className="flex gap-3 flex-1">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={async () => {
                    await toggleTask(task.id!, !task.completed);
                    refreshTasks();
                  }}
                  className="mt-1 h-4 w-4 accent-green-600 cursor-pointer"
                />

                <div>
                  <h3
                    className={`text-sm font-semibold ${
                      task.completed
                        ? "line-through text-gray-400"
                        : "text-black"
                    }`}
                  >
                    {task.title}
                  </h3>

                  <p
                    className={`text-xs text-sm ${
                      task.completed ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {task.description}
                  </p>

                  <div className="flex gap-2 mt-3">
                    <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs">
                      {task.category}
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        task.priority === "High"
                          ? "bg-red-100 text-red-700"
                          : task.priority === "Medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 mt-3">
                    {task.dueDate.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Right Side */}

              <div className="flex flex-col gap-3">
                <button onClick={() => onEdit(task)} title="Edit Task">
                  <Pencil
                    size={15}
                    className="text-blue-500 hover:text-blue-700"
                  />
                </button>

                {/* <button
                  onClick={async () => {
                    await toggleTask(task.id!, !task.completed);
                    refreshTasks();
                  }}
                  title="Complete"
                >
                  <CheckCircle
                    className={
                      task.completed
                        ? "text-green-600"
                        : "text-gray-300 hover:text-green-500"
                    }
                  />
                </button> */}

                <button
                  onClick={async () => {
                    await deleteTask(task.id!);
                    refreshTasks();
                  }}
                  title="Delete"
                >
                  <Trash2
                    size={15}
                    className="text-red-500 hover:text-red-700"
                  />
                </button>
                <button
                  onClick={() => setPlanTask(task)}
                  title="AI Plan"
                  className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 transition"
                >
                  <Sparkles size={18} className="text-indigo-500" />
                </button>
                {planTask && (
                  <TaskPlanModal
                    task={planTask}
                    onClose={() => setPlanTask(null)}
                  />
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

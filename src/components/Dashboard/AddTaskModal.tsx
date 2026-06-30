import { useEffect, useState } from "react";
import { addTask, updateTask } from "../../services/taskservice";
import { Sparkles } from "lucide-react";
import { auth } from "../../firebase/firebase";
import { apiFetch } from "../../services/api";
import { toast } from "react-hot-toast";
import {
  connectGoogleCalendar,
  getCalendarStatus,
} from "../../services/calendarservice";

interface Props {
  initialData?: any;
  onClose: () => void;
  onTaskAdded: () => void;
}

export default function AddTaskModal({
  initialData,
  onClose,
  onTaskAdded,
}: Props) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || "",
  );
  const [category, setCategory] = useState(initialData?.category || "Personal");
  const [priority, setPriority] = useState(initialData?.priority || "Medium");
  //   const [dueDate, setDueDate] = useState("");
  const [reminder, setReminder] = useState(
    initialData?.reminderEnabled ?? true,
  );
  const now = new Date();
  const [calendarSynced, setCalendarSynced] = useState(
    initialData?.calendarSynced ?? true,
  );
  const [date, setDate] = useState(
    initialData?.dueDate
      ? new Date(initialData.dueDate).toISOString().split("T")[0]
      : now.toISOString().split("T")[0],
  );

  const [time, setTime] = useState(
    initialData?.dueDate
      ? new Date(initialData.dueDate).toTimeString().slice(0, 5)
      : now.toTimeString().slice(0, 5),
  );

  useEffect(() => {
    if (!initialData) return;

    setTitle(initialData.title || "");
    setDescription(initialData.description || "");
    setCategory(initialData.category || "Personal");
    setPriority(initialData.priority || "Medium");

    setReminder(initialData.reminderEnabled ?? true);
    setCalendarSynced(initialData.calen ?? true);
    if (initialData.dueDate) {
      const due = new Date(initialData.dueDate);

      setDate(due.toISOString().split("T")[0]);
      setTime(due.toTimeString().slice(0, 5));
    }
  }, [initialData]);
  const handleSave = async () => {
    try {
      const dueDateTime = new Date(`${date}T${time}`);
      //   if (calendarSync) {
      //     const status = await getCalendarStatus(auth.currentUser!.uid);
      //     if (!status.connected) {
      //       await connectGoogleCalendar();

      //       //   return;
      //     }
      //   }
      const taskData = {
        title,
        description,
        category,
        priority,
        reminderEnabled: reminder,
        dueDate: dueDateTime,
        completed: initialData?.completed ?? false,
        aiGenerated: initialData?.aiGenerated ?? false,
        voiceCreated: initialData?.voiceCreated ?? false,
        calendarSynced,
        updatedAt: new Date(),
      };
      //   console.log("calender synced before if");
      if (initialData?.id) {
        // Edit existing task
        await updateTask(initialData.id!, taskData);
        // await apiFetch("/rag/reindex", {
        //   method: "POST",
        // });
        // console.log("calender synced before toast");
        // console.log("calender synced true");
        await apiFetch("/calendar/create-event", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: auth.currentUser?.uid,
            title,
            description,
            dueDate: dueDateTime.toISOString(),
          }),
        });
        toast.success("calender synced");
        alert("Task Updated Successfully");
      } else {
        // Create new task
        await addTask({
          ...taskData,
          createdAt: new Date(),
        });
        // await apiFetch("/rag/reindex", {
        //   method: "POST",
        // });
        await apiFetch("/calendar/create-event", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: auth.currentUser?.uid,
            title,
            description,
            dueDate: dueDateTime.toISOString(),
          }),
        });
        toast.success("calender synced");

        alert("Task Added Successfully");
      }

      await onTaskAdded();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Unable to save task");
    }
  };
  {
    initialData && (
      <div className="mb-5 rounded-xl bg-indigo-50 border border-indigo-200 p-4">
        <div className="flex items-center gap-2">
          <Sparkles className="text-indigo-600" size={18} />
          <p className="font-semibold text-indigo-700">
            Novara understood your voice command.
          </p>
        </div>

        <p className="text-sm text-gray-600 mt-2">
          Review the generated task before saving.
        </p>
      </div>
    );
  }
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        {initialData && (
          <div className="mb-5 rounded-xl bg-indigo-50 border border-indigo-200 p-4">
            <div className="flex items-center gap-2">
              <Sparkles className="text-indigo-600" size={18} />
              <p className="font-semibold text-indigo-700">
                Novara understands your voice command.
              </p>
            </div>

            <p className="text-sm text-gray-600 mt-2">
              Review the generated task before saving.
            </p>
          </div>
        )}
        <h2 className="text-2xl font-bold mb-4">Add New Task</h2>
        {/*popup of Add Task*/}
        <input
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded-lg p-3 mb-4"
        />
        <textarea
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded-lg p-3 mb-4 h-24"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border rounded-lg p-3 mb-4"
        >
          <option>Personal</option>
          <option>Work</option>
          <option>Study</option>
          <option>Shopping</option>
        </select>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full border rounded-lg p-3 mb-4"
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded-xl p-3"
          />

          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="border rounded-xl p-3"
          />
        </div>
        <label className="flex items-center gap-3 mb-5">
          <input
            type="checkbox"
            checked={reminder}
            onChange={(e) => setReminder(e.target.checked)}
          />
          Enable Reminder
        </label>
        {/* <label className="flex items-center gap-3 mb-5">
          <input
            type="checkbox"
            checked={calendarSync}
            onChange={(e) => setCalendarSync(e.target.checked)}
          />
          Enable Calendar
        </label> */}
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2 rounded-lg border">
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg"
          >
            Save Task
          </button>
        </div>
      </div>
    </div>
  );
}

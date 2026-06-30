import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import DashboardHeader from "../../components/Dashboard/DashboardHeader";
import WelcomeCard from "../../components/Dashboard/WelcomeCard";
import StatsCard from "../../components/Dashboard/StatsCard";
import QuickActions from "../../components/Dashboard/QuickActions";
import TaskPreview from "../../components/Dashboard/TaskPreview";
import AIAssistantCard from "../../components/Dashboard/AIAssistantCard";
import AITaskInput from "../../components/Dashboard/AITaskInput";
import AddTaskModal from "../../components/Dashboard/AddTaskModal";
import { useCallback } from "react";
import { getTasks } from "../../services/taskservice";
import type { Task } from "../../services/taskservice";
import { getTaskStats } from "../../services/taskservice";
import AIChatModal from "../../components/ai/AIChatModal";
import { RecentActivity } from "../../components/Dashboard/DashboardEnhancements";

interface UserData {
  name: string;
  email: string;
  phone: string;
  streak: number;
  aiPoints: number;
}

export default function Dashboard() {
  const [userData, setUserData] = useState<UserData | null>(null);
  // const [showModal, setShowModal] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [aiTask, setAITask] = useState<any>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [openAI, setOpenAI] = useState(false);
  const [stats, setStats] = useState({
    completed: 0,
    pending: 0,
    todayTasks: 0,
    overdue: 0,
  });
  // console.log(showModal);
  const loadTasks = useCallback(async () => {
    const user = auth.currentUser;

    if (!user) return;

    const data = await getTasks(user.uid);

    setTasks(data);
    setStats(getTaskStats(data));
  }, []);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      console.log("Current User:", user);

      if (!user) {
        console.log("No user logged in");
        return;
      }

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      console.log("Firestore Exists:", docSnap.exists());

      if (docSnap.exists()) {
        // console.log(docSnap.data());
        setUserData(docSnap.data() as UserData);
        await loadTasks();
      } else {
        const newUser: UserData = {
          name: user.displayName || user.email?.split("@")[0] || "User",
          email: user.email || "",
          phone: "",
          streak: 0,
          aiPoints: 0,
        };
        await setDoc(docRef, newUser);
        setUserData(newUser);
        await loadTasks();
      }
    });

    return () => unsubscribe();
  }, []);

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <DashboardHeader
        userName={userData.name}
        todayTasks={stats.todayTasks}
        overdue={stats.overdue}
        highPriority={
          tasks.filter((t) => t.priority === "High" && !t.completed).length
        }
        pending={stats.pending}
      />

      <div className="mt-6">
        <WelcomeCard
          userName={userData.name}
          todayTasks={stats.todayTasks}
          pending={stats.pending}
        />
      </div>

      <div className="grid md:grid-cols-4 gap-5 mt-6">
        <StatsCard
          title="Today's Tasks"
          value={stats.todayTasks}
          color="bg-blue-600"
        />

        <StatsCard title="Pending" value={stats.pending} color="bg-red-500" />

        {/* <StatsCard
          title="AI Points"
          // value={userData.aiPoints}
          value="Coming Soon"
          color="bg-indigo-600"
        /> */}

        <StatsCard
          title="Completed"
          value={stats.completed}
          color="bg-green-600"
        />
        <StatsCard
          title="Streak"
          // value={userData.streak}
          value="Coming Soon"
          color="bg-orange-500"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-6 items-start">
        <TaskPreview
          tasks={tasks}
          refreshTasks={loadTasks}
          onEdit={(task) => {
            console.log(task);
            setEditingTask(task);
            setShowModal(true);
          }}
        />

        <QuickActions onAddTask={() => setShowModal(true)} />
      </div>

      <div className="mt-6">
        <AIAssistantCard onOpen={() => setOpenAI(true)} />

        <AIChatModal open={openAI} onClose={() => setOpenAI(false)} />
      </div>
      <div className="mt-6">
        <RecentActivity />
      </div>

      <AITaskInput
        onAITaskGenerated={(task) => {
          setAITask(task);
          setShowModal(true);
        }}
      />
      {showModal && (
        <AddTaskModal
          initialData={editingTask ?? aiTask}
          onClose={() => {
            setShowModal(false);
            setAITask(null);
            setEditingTask(null);
          }}
          onTaskAdded={async () => {
            await loadTasks();
            setAITask(null);
            setEditingTask(null);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}

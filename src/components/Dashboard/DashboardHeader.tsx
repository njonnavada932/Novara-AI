import { Bell, LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { NotificationBell } from "./DashboardEnhancements";

interface DashboardHeaderProps {
  userName: string;
  todayTasks?: number;
  overdue?: number;
  highPriority?: number;
  pending?: number;
}

export default function DashboardHeader({
  userName,
  todayTasks,
  overdue,
  highPriority,
  pending,
}: DashboardHeaderProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("Logout failed");
    }
  };
  let greeting = "Good Evening";
  const hour = new Date().getHours();
  if (hour < 12) greeting = "Good Morning";
  else if (hour < 17) greeting = "Good Afternoon";

  return (
    // <header className="flex justify-between items-center bg-white rounded-2xl shadow-md px-6 py-4">
    //   {/* <div> */}
    //   {/* <h1 className="text-2xl font-bold text-indigo-600">Novara AI</h1> */}

    //   {/* <p className="text-sm text-gray-500">Welcome, {userName}</p> */}
    //   {/* </div> */}
    <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 text-white shadow-lg flex justify-between items-start">
      {/* Left Section */}
      <div>
        <h2 className="text-3xl font-bold">
          {greeting}, {userName} 👋
        </h2>

        <p className="mt-2 text-indigo-100">Welcome back to Novara AI.</p>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <NotificationBell
          todayTasks={todayTasks}
          overdue={overdue}
          highPriority={highPriority}
          pending={pending}
        />

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
    // {/* </header> */}
  );
}

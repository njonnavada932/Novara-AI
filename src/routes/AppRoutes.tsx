import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login/Login";
import Signup from "../pages/Signup/Signup";
import Dashboard from "../pages/Dashboard/Dashboard";
import Tasks from "../pages/Tasks/Tasks";
import AIAssistant from "../pages/AIAssistant/AIAssistant";
import Calendar from "../pages/Calendar/Calendar";
import Connections from "../pages/Connections/Connections";
import Analytics from "../pages/Analytics/Analytics";
import Notifications from "../pages/Notifications/Notifications";
import Settings from "../pages/Settings/Settings";
import Profile from "../pages/Profile/Profile";
import ForgetPassword from "../pages/Forgetpassword/Forgetpassword";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/tasks" element={<Tasks />} />
      <Route path="/ai" element={<AIAssistant />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/connections" element={<Connections />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/Forgetpassword" element={<ForgetPassword />} />
    </Routes>
  );
};

export default AppRoutes;

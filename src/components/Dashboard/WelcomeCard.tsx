interface WelcomeCardProps {
  userName: string;
  todayTasks: number;
  pending: number;
}

export default function WelcomeCard({
  userName,
  todayTasks,
  pending,
}: WelcomeCardProps) {
  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) greeting = "Good Morning";
  else if (hour < 17) greeting = "Good Afternoon";

  return (
    <div></div>
    // <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 text-white shadow-lg">
    //   {/* <h2 className="text-3xl font-bold">
    //     {greeting}, {userName} 👋
    //   </h2>

    //   <p className="mt-2 text-indigo-100">Welcome back to Novara AI.</p> */}

    //   <p className="mt-2 text-indigo-100">
    //     You have <span className="font-bold">{todayTasks}</span> task(s) today
    //     and <span className="font-bold">{pending}</span> pending task(s).
    //   </p>

    //   <p className="mt-3 text-sm text-indigo-200">
    //     Let's make today productive 🚀
    //   </p>
    // </div>
  );
}

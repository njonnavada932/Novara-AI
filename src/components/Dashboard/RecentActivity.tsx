interface Activity {
  title: string;
  time: string;
}

export default function RecentActivity() {
  const activities: Activity[] = [
    {
      title: "Signed into Novara AI",
      time: "Just now",
    },
    {
      title: "Created first account",
      time: "Today",
    },
    {
      title: "Dashboard initialized",
      time: "Today",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-lg font-bold mb-4">Recent Activity</h2>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="border-b last:border-none pb-3">
            <p className="font-medium text-slate-700">{activity.title}</p>

            <p className="text-xs text-slate-400">{activity.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

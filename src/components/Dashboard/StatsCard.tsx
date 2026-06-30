interface StatsCardProps {
  title: string;
  value: string | number;
  color: string;
}

export default function StatsCard({ title, value, color }: StatsCardProps) {
  return (
    <div className={`rounded-2xl shadow-md p-5 text-white ${color}`}>
      <h3 className="text-sm font-medium opacity-90">{title}</h3>

      <p className="text-3xl font-bold mt-3">{value}</p>
    </div>
  );
}

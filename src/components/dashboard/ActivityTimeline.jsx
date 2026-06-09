const activities = [
  {
    title: "Critical issue resolved",
    time: "2 mins ago",
  },
  {
    title: "AI assigned new tester",
    time: "18 mins ago",
  },
  {
    title: "Database latency warning",
    time: "1 hour ago",
  },
  {
    title: "New developer onboarded",
    time: "3 hours ago",
  },
];

function ActivityTimeline() {
  return (
    <div className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-6">
      <h2 className="text-xl font-semibold mb-6">Activity Timeline</h2>

      <div className="space-y-6">
        {activities.map((item, index) => (
          <div key={index} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-lg shadow-cyan-500/50" />
              {index !== activities.length - 1 && (
                <div className="w-[1px] h-full bg-white/10" />
              )}
            </div>

            <div>
              <p className="font-medium">{item.title}</p>
              <span className="text-sm text-gray-400">{item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActivityTimeline;
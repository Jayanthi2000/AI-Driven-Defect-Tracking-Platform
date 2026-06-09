const items = [
  {
    title: "Live Sessions",
    value: "1.2k",
  },
  {
    title: "AI Scans",
    value: "18k",
  },
  {
    title: "Open Tickets",
    value: "248",
  },
  {
    title: "Server Load",
    value: "62%",
  },
];

function RealtimeStatusGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {items.map((item) => (
        <div
          key={item.title}
          className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-5"
        >
          <p className="text-sm text-gray-400">
            {item.title}
          </p>

          <h2 className="text-3xl font-bold mt-4 text-white">
            {item.value}
          </h2>
        </div>
      ))}
    </div>
  );
}

export default RealtimeStatusGrid;
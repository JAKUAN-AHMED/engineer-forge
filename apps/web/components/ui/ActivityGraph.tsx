const activity = [70, 56, 80, 92, 86, 62, 78, 90, 94, 88, 72, 98, 84];

export function ActivityGraph() {
  return (
    <div className="rounded-3xl border border-border bg-surface p-5 shadow-lg shadow-black/5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-secondary">Activity</p>
          <h3 className="text-xl font-semibold text-text-primary">Study pulse</h3>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Weekly</span>
      </div>
      <div className="flex items-end gap-2 h-40">
        {activity.map((value, index) => (
          <div key={index} className="flex-1 rounded-full bg-primary/10">
            <div className="h-full rounded-full bg-primary transition-all" style={{ height: `${value}%` }} />
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-between text-xs text-text-secondary">
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
        <span>Sun</span>
      </div>
    </div>
  );
}

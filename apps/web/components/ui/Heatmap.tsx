export function Heatmap() {
  return (
    <div className="rounded-3xl border border-border bg-surface p-5 shadow-lg shadow-black/5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-secondary">Heatmap</p>
          <h3 className="text-xl font-semibold text-text-primary">Learning streak</h3>
        </div>
      </div>
      <div className="grid grid-cols-14 gap-1">
        {Array.from({ length: 98 }).map((_, index) => {
          const level = index % 4;
          const bg = ['bg-border', 'bg-primary/15', 'bg-primary/40', 'bg-primary/70'][level];
          return <div key={index} className={`h-4 rounded-md ${bg}`} />;
        })}
      </div>
      <div className="mt-4 flex justify-between text-xs text-text-secondary">
        <span>Less</span>
        <span>More</span>
      </div>
    </div>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm text-text-secondary">
        <span>Progress</span>
        <span>{Math.round(value)}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-border">
        <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
      </div>
    </div>
  );
}

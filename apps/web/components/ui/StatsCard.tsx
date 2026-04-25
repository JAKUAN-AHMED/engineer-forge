import { motion } from 'framer-motion';

export function StatsCard({ title, value, percent }: { title: string; value: string; percent?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-3xl border border-border bg-surface p-6 shadow-lg shadow-black/5"
    >
      <p className="text-sm uppercase tracking-[0.24em] text-secondary">{title}</p>
      <h3 className="mt-3 text-3xl font-semibold text-text-primary">{value}</h3>
      {typeof percent === 'number' && (
        <div className="mt-4 rounded-full bg-border p-1">
          <div className="h-2 rounded-full bg-primary" style={{ width: `${Math.max(0, Math.min(percent, 100))}%` }} />
        </div>
      )}
    </motion.div>
  );
}

import { motion } from 'framer-motion';

export function StatsCard({ title, value, percent }: { title: string; value: string; percent?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4, scale: 1.02, zIndex: 10 }}
      className="glass-card p-6 md:p-8 group cursor-default"
    >
      <p className="text-sm font-bold uppercase tracking-[0.24em] text-secondary transition-colors group-hover:text-primary">{title}</p>
      <h3 className="mt-3 text-3xl md:text-4xl font-extrabold text-text-primary drop-shadow-sm">{value}</h3>
      {typeof percent === 'number' && (
        <div className="mt-5 overflow-hidden rounded-full bg-border-glass ring-1 ring-inset ring-white/5">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(0, Math.min(percent, 100))}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
            className="h-2.5 rounded-full bg-gradient-to-r from-primary to-secondary shadow-[0_0_12px_rgba(99,102,241,0.5)]" 
          />
        </div>
      )}
    </motion.div>
  );
}

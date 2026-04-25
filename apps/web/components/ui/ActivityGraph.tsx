import { motion } from 'framer-motion';

const activity = [70, 56, 80, 92, 86, 62, 78, 90, 94, 88, 72, 98, 84];

export function ActivityGraph() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card p-6 md:p-8"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-secondary">Activity</p>
          <h3 className="text-xl font-bold text-text-primary">Study pulse</h3>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary ring-1 ring-inset ring-primary/20">Weekly</span>
      </div>
      <div className="flex items-end gap-2 h-40">
        {activity.map((value, index) => (
          <div key={index} className="flex-1 overflow-hidden rounded-t-full bg-border-glass h-[100%] flex flex-col justify-end ring-1 ring-inset ring-white/5">
            <motion.div 
              initial={{ height: 0 }}
              animate={{ height: `${value}%` }}
              transition={{ duration: 0.8, delay: index * 0.05, type: 'spring', bounce: 0.4 }}
              className="w-full rounded-t-full bg-gradient-to-t from-primary/30 to-primary/90 transition-opacity hover:opacity-80" 
            />
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-between text-xs font-medium text-text-secondary pr-1">
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
        <span>Sun</span>
      </div>
    </motion.div>
  );
}

import { motion } from 'framer-motion';

export function Heatmap() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card p-6"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-secondary font-bold">Heatmap</p>
          <h3 className="mt-1 text-2xl font-bold text-text-primary">Learning streak</h3>
        </div>
      </div>
      
      <div className="overflow-x-auto pb-4 custom-scrollbar">
        <div className="grid grid-cols-14 gap-2 min-w-[650px] pr-2">
          {Array.from({ length: 98 }).map((_, index) => {
            const level = index % 4;
            const bgClass = ['bg-border-glass', 'bg-primary/40', 'bg-primary/70', 'bg-primary'][level];
            return (
              <motion.div 
                key={index} 
                whileHover={{ scale: 1.2, zIndex: 10 }}
                className={`h-4 rounded-sm ${bgClass} shadow-sm transition-colors ring-1 ring-inset ring-white/5 cursor-pointer`}
              />
            );
          })}
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-end gap-2 text-xs font-semibold text-text-secondary">
        <span>Less</span>
        <div className="flex gap-1.5 mx-1">
          {['bg-border-glass', 'bg-primary/40', 'bg-primary/70', 'bg-primary'].map((bg, i) => (
            <div key={i} className={`h-3 w-3 rounded-[3px] ${bg} shadow-sm ring-1 ring-inset ring-white/5`} />
          ))}
        </div>
        <span>More</span>
      </div>
    </motion.div>
  );
}

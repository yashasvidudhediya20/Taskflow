import { motion } from 'framer-motion';

interface ProgressBarProps {
  percentage: number;
  total: number;
  completed: number;
  isDark: boolean;
}

export function ProgressBar({ percentage, total, completed, isDark }: ProgressBarProps) {
  return (
    <motion.div
      className="relative flex items-center gap-4"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, type: 'spring', stiffness: 380, damping: 28 }}
    >
      <div className="flex-1">
        {/* Labels row */}
        <div className="flex items-center justify-between mb-2">
          <span
            className="text-[12px] font-semibold tracking-wide uppercase"
            style={{ color: isDark ? 'rgba(180,180,200,0.5)' : 'rgba(100,100,130,0.6)' }}
          >
            Progress
          </span>
          <motion.span
            className="text-[13px] font-bold tabular-nums"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #a78bfa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
            key={percentage}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            {completed}/{total} · {percentage}%
          </motion.span>
        </div>

        {/* Track */}
        <div
          className="relative h-[5px] rounded-full overflow-hidden"
          style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)' }}
        >
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              background: 'linear-gradient(90deg, #6366f1 0%, #a78bfa 60%, #c084fc 100%)',
              boxShadow: '0 0 10px rgba(99,102,241,0.5)',
            }}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20, delay: 0.15 }}
          />
        </div>
      </div>
    </motion.div>
  );
}

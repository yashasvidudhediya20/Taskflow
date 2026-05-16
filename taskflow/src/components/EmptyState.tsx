import { motion } from 'framer-motion';
import type { Filter } from '../types';

interface EmptyStateProps {
  filter: Filter;
  hasSearch: boolean;
  isDark: boolean;
}

const MESSAGES: Record<string, { title: string; sub: string }> = {
  search: { title: 'No results found', sub: 'Try a different search term' },
  completed: { title: 'Nothing completed yet', sub: 'Finish a task to see it here' },
  active: { title: 'All clear!', sub: 'No active tasks. Enjoy the moment.' },
  all: { title: 'Your canvas awaits', sub: 'Add your first task to get started' },
};

export function EmptyState({ filter, hasSearch, isDark }: EmptyStateProps) {
  const key = hasSearch ? 'search' : filter;
  const { title, sub } = MESSAGES[key] || MESSAGES.all;

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-14 gap-5"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
    >
      {/* Illustration */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad1" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.7"/>
              <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.5"/>
            </linearGradient>
          </defs>
          {/* Paper */}
          <motion.rect
            x="16" y="12" width="48" height="60" rx="8"
            fill="url(#grad1)"
            fillOpacity={isDark ? 0.15 : 0.1}
            stroke="url(#grad1)"
            strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
          {/* Lines */}
          {[28, 38, 48].map((y, i) => (
            <motion.rect
              key={y}
              x="26" y={y} width={hasSearch ? 28 : [28, 22, 18][i]} height="3" rx="1.5"
              fill="url(#grad1)"
              fillOpacity={0.4}
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.5, ease: 'easeOut' }}
            />
          ))}
          {/* Sparkle dots */}
          {hasSearch ? (
            <motion.text x="34" y="62" fontSize="16" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>🔍</motion.text>
          ) : filter === 'completed' ? (
            <motion.path
              d="M30 58 l6 6 12-14"
              stroke="#6366f1"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.7 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            />
          ) : (
            <>
              {[[58,20],[66,34],[60,56]].map(([cx, cy], i) => (
                <motion.circle
                  key={i}
                  cx={cx} cy={cy} r="2.5"
                  fill="#a78bfa"
                  fillOpacity={0.6}
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.4, 1] }}
                  transition={{ delay: 0.5 + i * 0.15, duration: 0.4 }}
                />
              ))}
            </>
          )}
        </svg>
      </motion.div>

      <div className="text-center">
        <motion.p
          className="font-semibold text-[16px] mb-1"
          style={{ color: isDark ? 'rgba(220,220,240,0.75)' : 'rgba(40,40,70,0.7)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {title}
        </motion.p>
        <motion.p
          className="text-[13px]"
          style={{ color: isDark ? 'rgba(180,180,200,0.4)' : 'rgba(100,100,130,0.5)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {sub}
        </motion.p>
      </div>
    </motion.div>
  );
}

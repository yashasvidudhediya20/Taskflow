import { motion } from 'framer-motion';

interface NotesEmptyStateProps {
  hasSearch: boolean;
  isDark: boolean;
}

export function NotesEmptyState({ hasSearch, isDark }: NotesEmptyStateProps) {
  const title = hasSearch ? 'No notes found' : 'Nothing here yet';
  const sub = hasSearch ? 'Try a different search term' : 'Create your first note to get started';

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 gap-5"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
    >
      {/* Floating notebook illustration */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="noteGrad" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.75"/>
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.5"/>
            </linearGradient>
          </defs>

          {/* Notebook shadow */}
          <motion.rect
            x="21" y="17" width="42" height="54" rx="7"
            fill="url(#noteGrad)"
            fillOpacity={0.12}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          />

          {/* Notebook body */}
          <motion.rect
            x="18" y="14" width="42" height="54" rx="7"
            fill="url(#noteGrad)"
            fillOpacity={isDark ? 0.18 : 0.12}
            stroke="url(#noteGrad)"
            strokeWidth="1.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          />

          {/* Spine */}
          <motion.rect
            x="18" y="14" width="7" height="54" rx="7"
            fill="url(#noteGrad)"
            fillOpacity={0.3}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          />

          {hasSearch ? (
            /* Search illustration */
            <motion.circle
              cx="44" cy="42" r="10"
              stroke="url(#noteGrad)"
              strokeWidth="2"
              fill="none"
              strokeOpacity={0.6}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.35, type: 'spring', stiffness: 320, damping: 22 }}
            />
          ) : (
            /* Lines illustration */
            <>
              {[30, 39, 48, 57].map((y, i) => (
                <motion.rect
                  key={y}
                  x="31" y={y} width={[24, 18, 22, 14][i]} height="2.5" rx="1.25"
                  fill="url(#noteGrad)"
                  fillOpacity={0.45}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  style={{ transformOrigin: '31px center' }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.4, ease: 'easeOut' }}
                />
              ))}
              {/* Pencil dot sparkles */}
              {[[62, 18], [66, 32], [60, 50]].map(([cx, cy], i) => (
                <motion.circle
                  key={i}
                  cx={cx} cy={cy} r="2.5"
                  fill="#a78bfa"
                  fillOpacity={0.55}
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.4, 1] }}
                  transition={{ delay: 0.55 + i * 0.14, duration: 0.35 }}
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

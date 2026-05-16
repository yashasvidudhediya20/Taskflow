import { motion, AnimatePresence } from 'framer-motion';

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  priority?: 'low' | 'medium' | 'high';
}

const PRIORITY_COLORS = {
  low: '#10b981',
  medium: '#f59e0b',
  high: '#f43f5e',
};

export function AnimatedCheckbox({ checked, onChange, priority = 'medium' }: CheckboxProps) {
  const color = PRIORITY_COLORS[priority];

  return (
    <motion.button
      onClick={e => { e.stopPropagation(); onChange(); }}
      className="relative flex-shrink-0 w-[22px] h-[22px] rounded-full outline-none cursor-pointer"
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.88 }}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {/* Track */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 transition-colors duration-200"
        style={{
          borderColor: checked ? color : 'rgba(150,150,165,0.4)',
          backgroundColor: checked ? color : 'transparent',
        }}
        animate={{ scale: checked ? [1, 0.85, 1] : 1 }}
        transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
      />

      {/* Ripple on check */}
      <AnimatePresence>
        {checked && (
          <motion.div
            className="absolute inset-0 rounded-full"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 2.2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{ backgroundColor: color }}
          />
        )}
      </AnimatePresence>

      {/* Checkmark SVG */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 22 22"
        fill="none"
      >
        <AnimatePresence>
          {checked && (
            <motion.path
              d="M6 11.5l3.5 3.5 6.5-7"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              exit={{ pathLength: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.65, 0, 0.35, 1] }}
            />
          )}
        </AnimatePresence>
      </svg>
    </motion.button>
  );
}

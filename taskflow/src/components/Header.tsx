import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Trash2 } from 'lucide-react';
import type { Filter } from '../types';

interface HeaderProps {
  filter: Filter;
  search: string;
  completedCount: number;
  onFilterChange: (f: Filter) => void;
  onSearchChange: (s: string) => void;
  onClearCompleted: () => void;
  isDark: boolean;
}

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Done' },
];

export function Header({ filter, search, completedCount, onFilterChange, onSearchChange, onClearCompleted, isDark }: HeaderProps) {
  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-[26px] font-bold tracking-tight leading-none"
            style={{
              background: isDark
                ? 'linear-gradient(135deg, #e0e0f0 0%, #a8a8d0 100%)'
                : 'linear-gradient(135deg, #1a1a2e 0%, #4a4a7a 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Tasks
          </h1>
          <p className="text-[12px] font-medium mt-0.5" style={{ color: isDark ? 'rgba(180,180,200,0.45)' : 'rgba(100,100,140,0.6)' }}>
            Stay focused. Ship things.
          </p>
        </div>
        <AnimatePresence>
          {completedCount > 0 && (
            <motion.button
              onClick={onClearCompleted}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-[12px] font-medium"
              style={{ color: isDark ? 'rgba(250,100,100,0.7)' : 'rgba(200,50,50,0.65)', backgroundColor: isDark ? 'rgba(250,100,100,0.08)' : 'rgba(200,50,50,0.06)' }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <Trash2 size={12} />
              Clear {completedCount}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: isDark ? 'rgba(200,200,220,0.3)' : 'rgba(100,100,140,0.4)' }} />
        <input
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Search tasks..."
          className="w-full rounded-xl pl-9 pr-9 py-2.5 text-[14px] font-medium outline-none input-glow transition-all"
          style={{
            backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(200,200,220,0.7)'}`,
            color: isDark ? '#e0e0f0' : '#1a1a2e',
          }}
        />
        <AnimatePresence>
          {search && (
            <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5"
              style={{ color: isDark ? 'rgba(200,200,220,0.4)' : 'rgba(100,100,140,0.5)' }}
              whileHover={{ scale: 1.15 }}
            >
              <X size={13} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center rounded-xl p-1 gap-1"
        style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(200,200,220,0.5)'}` }}
      >
        {FILTERS.map(({ key, label }) => (
          <motion.button key={key} onClick={() => onFilterChange(key)}
            className="relative flex-1 rounded-lg py-1.5 text-[13px] font-semibold transition-colors"
            style={{ color: filter === key ? (isDark ? '#e0e0f0' : '#1a1a2e') : (isDark ? 'rgba(180,180,200,0.45)' : 'rgba(100,100,140,0.55)') }}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          >
            {filter === key && (
              <motion.div layoutId="filterActive" className="absolute inset-0 rounded-lg"
                style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.95)', boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              />
            )}
            <span className="relative z-10">{label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

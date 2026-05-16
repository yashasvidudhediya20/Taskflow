import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Calendar, ChevronDown } from 'lucide-react';
import type { Priority } from '../types';
import { PRIORITY_CONFIG } from '../utils/priority';

interface TaskInputProps {
  onAdd: (title: string, priority: Priority, dueDate?: string) => void;
  isDark: boolean;
}

export function TaskInput({ onAdd, isDark }: TaskInputProps) {
  const [value, setValue] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showPriority, setShowPriority] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (!value.trim()) return;
    onAdd(value.trim(), priority, dueDate || undefined);
    setValue('');
    setDueDate('');
    setPriority('medium');
    inputRef.current?.focus();
  };

  const pc = PRIORITY_CONFIG[priority];

  return (
    <motion.div
      className="relative"
      animate={{ y: 0, opacity: 1 }}
      initial={{ y: 20, opacity: 0 }}
      transition={{ delay: 0.2, type: 'spring', stiffness: 380, damping: 28 }}
    >
      <motion.div
        className="relative flex flex-col rounded-2xl overflow-visible"
        style={{
          background: isDark ? 'rgba(22,22,38,0.82)' : 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: `1.5px solid ${isFocused
            ? 'rgba(99,102,241,0.55)'
            : isDark ? 'rgba(255,255,255,0.07)' : 'rgba(200,200,220,0.9)'}`,
          boxShadow: isFocused
            ? isDark
              ? '0 0 0 4px rgba(99,102,241,0.14), 0 8px 32px rgba(0,0,0,0.4)'
              : '0 0 0 4px rgba(99,102,241,0.1), 0 8px 24px rgba(99,102,241,0.1)'
            : isDark
              ? '0 4px 20px rgba(0,0,0,0.35)'
              : '0 4px 20px rgba(0,0,0,0.07)',
          transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <div className="flex items-center gap-2 px-4 py-3.5">
          {/* Plus icon */}
          <motion.div
            animate={{ rotate: isFocused ? 45 : 0, scale: isFocused ? 1.1 : 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            style={{ color: isFocused ? '#6366f1' : isDark ? '#555' : '#aaa' }}
          >
            <Plus size={18} strokeWidth={2.5} />
          </motion.div>

          <input
            ref={inputRef}
            value={value}
            onChange={e => setValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); }}
            placeholder="Add a task..."
            className="flex-1 bg-transparent outline-none text-[15px] font-medium placeholder:font-normal"
            style={{
              color: isDark ? '#e4e4f0' : '#1a1a2e',
              caretColor: '#6366f1',
            }}
          />

          {/* Priority picker */}
          <div className="relative">
            <motion.button
              onClick={() => { setShowPriority(v => !v); setShowDate(false); }}
              className="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-[12px] font-semibold transition-all"
              style={{
                color: priority === 'low' ? (isDark ? '#34d399' : '#059669')
                  : priority === 'medium' ? (isDark ? '#fbbf24' : '#d97706')
                  : (isDark ? '#fb7185' : '#e11d48'),
                backgroundColor: priority === 'low' ? 'rgba(16,185,129,0.12)'
                  : priority === 'medium' ? 'rgba(245,158,11,0.12)'
                  : 'rgba(244,63,94,0.12)',
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: PRIORITY_CONFIG[priority].bgDark }} />
              {pc.label}
              <ChevronDown size={10} />
            </motion.button>

            <AnimatePresence>
              {showPriority && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 bottom-full mb-2 z-50 rounded-xl overflow-hidden shadow-xl"
                  style={{
                    background: isDark ? 'rgba(18,18,28,0.98)' : 'rgba(255,255,255,0.98)',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                    backdropFilter: 'blur(16px)',
                    minWidth: 115,
                  }}
                >
                  {(['low', 'medium', 'high'] as Priority[]).map(p => (
                    <button
                      key={p}
                      onClick={() => { setPriority(p); setShowPriority(false); }}
                      className="flex items-center gap-2 w-full px-3 py-2.5 text-[12px] font-medium transition-colors"
                      style={{
                        color: isDark ? '#e0e0ee' : '#2a2a3a',
                        backgroundColor: priority === p ? (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)') : 'transparent',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = priority === p ? (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)') : 'transparent')}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PRIORITY_CONFIG[p].bgDark }} />
                      {PRIORITY_CONFIG[p].label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Date picker */}
          <div className="relative">
            <motion.button
              onClick={() => { setShowDate(v => !v); setShowPriority(false); }}
              className="flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-[12px] font-medium transition-all"
              style={{
                color: dueDate ? '#6366f1' : isDark ? '#555' : '#bbb',
                backgroundColor: dueDate ? 'rgba(99,102,241,0.1)' : 'transparent',
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <Calendar size={13} />
              {dueDate ? new Date(dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Date'}
            </motion.button>

            <AnimatePresence>
              {showDate && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 bottom-full mb-2 z-50 rounded-xl p-3 shadow-xl"
                  style={{
                    background: isDark ? 'rgba(18,18,28,0.98)' : 'rgba(255,255,255,0.98)',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                    backdropFilter: 'blur(16px)',
                  }}
                >
                  <input
                    type="date"
                    value={dueDate}
                    onChange={e => { setDueDate(e.target.value); setShowDate(false); }}
                    className="outline-none bg-transparent text-[13px]"
                    style={{ color: isDark ? '#ddd' : '#333' }}
                    autoFocus
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Add button */}
          <motion.button
            onClick={handleSubmit}
            disabled={!value.trim()}
            className="rounded-xl px-3.5 py-1.5 text-[13px] font-semibold disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: '#fff',
              boxShadow: value.trim() ? '0 4px 14px rgba(99,102,241,0.4)' : 'none',
              transition: 'box-shadow 0.2s ease',
            }}
            whileHover={value.trim() ? { scale: 1.04, y: -1 } : {}}
            whileTap={value.trim() ? { scale: 0.96 } : {}}
          >
            Add
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

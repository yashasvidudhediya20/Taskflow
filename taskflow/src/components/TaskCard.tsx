import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, GripVertical, Calendar, ChevronDown } from 'lucide-react';
import type { Task, Priority } from '../types';
import { AnimatedCheckbox } from './AnimatedCheckbox';
import { PRIORITY_CONFIG, formatDueDate } from '../utils/priority';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
  isDark: boolean;
}

export function TaskCard({ task, onToggle, onUpdate, onDelete, isDark }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 999 : undefined,
    opacity: isDragging ? 0 : 1,
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleEditSubmit = () => {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== task.title) {
      onUpdate(task.id, { title: trimmed });
    } else {
      setEditTitle(task.title);
    }
    setIsEditing(false);
  };

  const dueInfo = task.dueDate ? formatDueDate(task.dueDate) : null;
  const pc = PRIORITY_CONFIG[task.priority];

  const cardBg = isDark
    ? 'rgba(22, 22, 36, 0.72)'
    : 'rgba(255,255,255,0.76)';
  const cardBorder = isDark
    ? isHovered ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.055)'
    : isHovered ? 'rgba(99,102,241,0.22)' : 'rgba(220,220,235,0.8)';

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, y: -8, transition: { duration: 0.22 } }}
      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        className="relative flex items-start gap-3 px-4 py-3.5 rounded-2xl group"
        style={{
          background: cardBg,
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          border: `1px solid ${cardBorder}`,
          boxShadow: isDark
            ? isHovered
              ? '0 8px 32px rgba(0,0,0,0.45), 0 2px 8px rgba(99,102,241,0.12)'
              : '0 2px 12px rgba(0,0,0,0.3)'
            : isHovered
              ? '0 8px 32px rgba(99,102,241,0.1), 0 2px 8px rgba(0,0,0,0.06)'
              : '0 2px 8px rgba(0,0,0,0.04)',
          transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
        }}
        animate={{ y: isHovered ? -2 : 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      >
        {/* Priority accent bar */}
        <motion.div
          className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full"
          style={{ backgroundColor: PRIORITY_CONFIG[task.priority].bgDark }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 0.1 }}
        />

        {/* Drag handle */}
        <motion.button
          {...attributes}
          {...listeners}
          className="flex-shrink-0 mt-0.5 cursor-grab active:cursor-grabbing touch-none opacity-0 group-hover:opacity-40 hover:!opacity-80 transition-opacity"
          style={{ color: isDark ? '#aaa' : '#888' }}
          whileHover={{ scale: 1.1 }}
        >
          <GripVertical size={15} />
        </motion.button>

        {/* Checkbox */}
        <div className="mt-0.5">
          <AnimatedCheckbox
            checked={task.completed}
            onChange={() => onToggle(task.id)}
            priority={task.priority}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              ref={inputRef}
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              onBlur={handleEditSubmit}
              onKeyDown={e => {
                if (e.key === 'Enter') handleEditSubmit();
                if (e.key === 'Escape') { setEditTitle(task.title); setIsEditing(false); }
              }}
              className="w-full bg-transparent outline-none font-medium text-[15px] leading-snug input-glow rounded-lg px-1 -mx-1"
              style={{
                color: isDark ? '#e8e8f0' : '#1a1a2e',
                border: '1px solid',
                borderColor: 'rgba(99,102,241,0.35)',
                padding: '2px 6px',
                borderRadius: '6px',
              }}
            />
          ) : (
            <div
              className="relative cursor-text select-none"
              onDoubleClick={() => { if (!task.completed) setIsEditing(true); }}
            >
              <motion.span
                className="block font-medium text-[15px] leading-snug break-words"
                style={{
                  color: task.completed
                    ? isDark ? 'rgba(180,180,200,0.45)' : 'rgba(100,100,120,0.5)'
                    : isDark ? '#e4e4f0' : '#1a1a2e',
                }}
                animate={{ opacity: task.completed ? 0.55 : 1 }}
              >
                {task.title}
                {/* Strikethrough overlay */}
                {task.completed && (
                  <motion.span
                    className="absolute left-0 top-1/2 h-[1.5px] rounded-full"
                    style={{ backgroundColor: isDark ? 'rgba(180,180,200,0.5)' : 'rgba(100,100,120,0.45)' }}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.3, ease: [0.65, 0, 0.35, 1] }}
                  />
                )}
              </motion.span>
            </div>
          )}

          {/* Meta row */}
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {/* Priority badge */}
            <div className="relative">
              <motion.button
                onClick={() => setShowPriorityMenu(v => !v)}
                className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold transition-colors"
                style={{
                  color: pc.color.includes('emerald') ? (isDark ? '#34d399' : '#059669')
                    : pc.color.includes('amber') ? (isDark ? '#fbbf24' : '#d97706')
                    : (isDark ? '#fb7185' : '#e11d48'),
                  backgroundColor: isDark
                    ? pc.bg.replace('dark:bg-', '').includes('emerald') ? 'rgba(16,185,129,0.12)'
                      : pc.bg.includes('amber') ? 'rgba(245,158,11,0.12)'
                      : 'rgba(244,63,94,0.12)'
                    : pc.bg.includes('emerald') ? 'rgba(16,185,129,0.1)'
                      : pc.bg.includes('amber') ? 'rgba(245,158,11,0.1)'
                      : 'rgba(244,63,94,0.1)',
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: PRIORITY_CONFIG[task.priority].bgDark }} />
                {pc.label}
                <ChevronDown size={9} />
              </motion.button>

              <AnimatePresence>
                {showPriorityMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full mt-1 z-50 rounded-xl overflow-hidden shadow-xl"
                    style={{
                      background: isDark ? 'rgba(22,22,36,0.95)' : 'rgba(255,255,255,0.98)',
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                      backdropFilter: 'blur(16px)',
                      minWidth: 110,
                    }}
                  >
                    {(['low', 'medium', 'high'] as Priority[]).map(p => (
                      <button
                        key={p}
                        onClick={() => { onUpdate(task.id, { priority: p }); setShowPriorityMenu(false); }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-[12px] font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                        style={{ color: isDark ? '#ddd' : '#333' }}
                      >
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PRIORITY_CONFIG[p].bgDark }} />
                        {PRIORITY_CONFIG[p].label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Due date */}
            <div className="relative">
              <motion.button
                onClick={() => setShowDatePicker(v => !v)}
                className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium transition-colors"
                style={{
                  color: dueInfo
                    ? dueInfo.isOverdue ? '#f43f5e'
                      : dueInfo.isToday ? '#f59e0b'
                      : dueInfo.isSoon ? '#6366f1'
                      : isDark ? '#888' : '#666'
                    : isDark ? '#555' : '#aaa',
                  backgroundColor: dueInfo
                    ? dueInfo.isOverdue ? 'rgba(244,63,94,0.1)'
                      : dueInfo.isToday ? 'rgba(245,158,11,0.1)'
                      : dueInfo.isSoon ? 'rgba(99,102,241,0.1)'
                      : 'transparent'
                    : 'transparent',
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <Calendar size={10} />
                {dueInfo ? dueInfo.label : 'Add date'}
              </motion.button>

              <AnimatePresence>
                {showDatePicker && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full mt-1 z-50 rounded-xl p-2 shadow-xl"
                    style={{
                      background: isDark ? 'rgba(22,22,36,0.95)' : 'rgba(255,255,255,0.98)',
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                      backdropFilter: 'blur(16px)',
                    }}
                  >
                    <input
                      type="date"
                      defaultValue={task.dueDate || ''}
                      onChange={e => {
                        onUpdate(task.id, { dueDate: e.target.value || undefined });
                        setShowDatePicker(false);
                      }}
                      className="text-[12px] outline-none bg-transparent"
                      style={{ color: isDark ? '#ddd' : '#333' }}
                      autoFocus
                    />
                    {task.dueDate && (
                      <button
                        onClick={() => { onUpdate(task.id, { dueDate: undefined }); setShowDatePicker(false); }}
                        className="block w-full text-left text-[11px] mt-1 px-1 text-rose-400 hover:text-rose-300"
                      >
                        Clear date
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Delete button */}
        <motion.button
          onClick={() => onDelete(task.id)}
          className="flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg p-1"
          style={{ color: isDark ? 'rgba(255,100,100,0.6)' : 'rgba(200,50,50,0.5)' }}
          whileHover={{ scale: 1.15, color: '#f43f5e' }}
          whileTap={{ scale: 0.85 }}
        >
          <Trash2 size={15} />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

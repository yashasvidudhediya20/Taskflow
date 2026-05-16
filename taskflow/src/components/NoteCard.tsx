import { useState } from 'react';
import { motion } from 'framer-motion';
import { Pin, Trash2 } from 'lucide-react';
import type { Note } from '../types';
import { NOTE_COLORS } from '../utils/noteColors';

interface NoteCardProps {
  note: Note;
  isActive: boolean;
  isDark: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
  formattedDate: string;
}

export function NoteCard({
  note, isActive, isDark,
  onSelect, onDelete, onTogglePin, formattedDate,
}: NoteCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cfg = NOTE_COLORS[note.color];

  const bg = isDark ? cfg.tintDark : cfg.tintLight;
  const borderColor = isActive
    ? cfg.accent
    : isHovered
      ? isDark ? 'rgba(255,255,255,0.1)' : 'rgba(99,102,241,0.22)'
      : isDark ? cfg.borderDark : cfg.borderLight;

  const boxShadow = isActive
    ? `0 0 0 1.5px ${cfg.accent}55, 0 8px 32px rgba(0,0,0,${isDark ? '0.45' : '0.1'})`
    : isDark
      ? isHovered ? '0 8px 32px rgba(0,0,0,0.45)' : '0 2px 12px rgba(0,0,0,0.3)'
      : isHovered ? '0 8px 32px rgba(99,102,241,0.1), 0 2px 8px rgba(0,0,0,0.06)' : '0 2px 8px rgba(0,0,0,0.04)';

  const title = note.title.trim() || 'Untitled note';
  const preview = note.body.replace(/\n+/g, ' ').trim();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, y: -6, transition: { duration: 0.18 } }}
      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        onClick={() => onSelect(note.id)}
        className="relative flex flex-col gap-1.5 px-4 py-3.5 rounded-2xl cursor-pointer group overflow-hidden"
        style={{
          background: bg,
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          border: `1px solid ${borderColor}`,
          boxShadow,
          transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
        }}
        animate={{ y: isHovered && !isActive ? -2 : 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      >
        {/* Color accent bar — mirrors TaskCard's priority bar */}
        <motion.div
          className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full"
          style={{ backgroundColor: cfg.accent }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 0.08 }}
        />

        {/* Pin indicator */}
        {note.pinned && (
          <motion.div
            className="absolute top-3 right-10 opacity-60"
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: -20 }}
            style={{ color: cfg.accent }}
          >
            <Pin size={11} fill="currentColor" />
          </motion.div>
        )}

        {/* Title */}
        <p
          className="text-[14px] font-semibold leading-snug truncate pr-6"
          style={{ color: isDark ? '#e4e4f0' : '#1a1a2e' }}
        >
          {title}
        </p>

        {/* Body preview */}
        {preview && (
          <p
            className="text-[12px] leading-relaxed line-clamp-2"
            style={{ color: isDark ? 'rgba(180,180,200,0.55)' : 'rgba(80,80,110,0.65)' }}
          >
            {preview}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-0.5">
          <span
            className="text-[11px] font-medium"
            style={{ color: isDark ? 'rgba(160,160,190,0.4)' : 'rgba(120,120,150,0.5)' }}
          >
            {formattedDate}
          </span>
        </div>

        {/* Action buttons — appear on hover, matching TaskCard pattern */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button
            onClick={e => { e.stopPropagation(); onTogglePin(note.id); }}
            className="rounded-lg p-1.5"
            style={{ color: note.pinned ? cfg.accent : (isDark ? 'rgba(200,200,220,0.45)' : 'rgba(100,100,140,0.45)') }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.85 }}
            title={note.pinned ? 'Unpin' : 'Pin'}
          >
            <Pin size={12} fill={note.pinned ? 'currentColor' : 'none'} />
          </motion.button>
          <motion.button
            onClick={e => { e.stopPropagation(); onDelete(note.id); }}
            className="rounded-lg p-1.5"
            style={{ color: isDark ? 'rgba(255,100,100,0.55)' : 'rgba(200,50,50,0.45)' }}
            whileHover={{ scale: 1.15, color: '#f43f5e' }}
            whileTap={{ scale: 0.85 }}
            title="Delete note"
          >
            <Trash2 size={12} />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

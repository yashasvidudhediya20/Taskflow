import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pin, Trash2, Palette, Check, ArrowLeft } from 'lucide-react';
import type { Note, NoteColor } from '../types';
import { NOTE_COLORS } from '../utils/noteColors';

interface NoteEditorProps {
  note: Note;
  isDark: boolean;
  onUpdate: (id: string, updates: Partial<Note>) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onSetColor: (id: string, color: NoteColor) => void;
  onClose: () => void;
  formattedDate: string;
}

export function NoteEditor({
  note, isDark, onUpdate, onDelete, onTogglePin, onSetColor, onClose, formattedDate,
}: NoteEditorProps) {
  const [title, setTitle] = useState(note.title);
  const [body, setBody] = useState(note.body);
  const [showPalette, setShowPalette] = useState(false);
  const [saved, setSaved] = useState(true);
  const titleRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync if note changes externally (switching notes)
  useEffect(() => {
    setTitle(note.title);
    setBody(note.body);
    setSaved(true);
  }, [note.id]);

  // Auto-focus title if empty (new note)
  useEffect(() => {
    if (!note.title && titleRef.current) {
      titleRef.current.focus();
    }
  }, [note.id, note.title]);

  const scheduleSave = useCallback((updates: Partial<Note>) => {
    setSaved(false);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      onUpdate(note.id, updates);
      setSaved(true);
    }, 400);
  }, [note.id, onUpdate]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    scheduleSave({ title: val, body });
  };

  const handleBodyChange = (val: string) => {
    setBody(val);
    scheduleSave({ title, body: val });
  };

  // Flush on unmount
  useEffect(() => {
    return () => {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
        onUpdate(note.id, { title, body });
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note.id, title, body]);

  const cfg = NOTE_COLORS[note.color];

  return (
    <motion.div
      key={note.id}
      className="flex flex-col h-full"
      initial={{ opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 18 }}
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
    >
      {/* Toolbar */}
      <div
        className="flex items-center gap-2 px-1 pb-3 mb-1"
        style={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(200,200,220,0.5)'}` }}
      >
        {/* Back (mobile feel) */}
        <motion.button
          onClick={onClose}
          className="rounded-xl p-2 mr-1"
          style={{
            color: isDark ? 'rgba(180,180,210,0.6)' : 'rgba(100,100,140,0.7)',
            backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          title="Back to list"
        >
          <ArrowLeft size={15} />
        </motion.button>

        {/* Auto-save indicator */}
        <AnimatePresence mode="wait">
          {saved ? (
            <motion.div
              key="saved"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-1"
              style={{ color: isDark ? 'rgba(160,160,190,0.4)' : 'rgba(120,120,150,0.5)' }}
            >
              <Check size={11} />
              <span className="text-[11px] font-medium">Saved</span>
            </motion.div>
          ) : (
            <motion.span
              key="saving"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[11px] font-medium"
              style={{ color: cfg.accent }}
            >
              Saving…
            </motion.span>
          )}
        </AnimatePresence>

        <div className="flex-1" />

        {/* Updated timestamp */}
        <span
          className="text-[11px] font-medium"
          style={{ color: isDark ? 'rgba(160,160,190,0.35)' : 'rgba(120,120,150,0.45)' }}
        >
          {formattedDate}
        </span>

        {/* Color palette */}
        <div className="relative">
          <motion.button
            onClick={() => setShowPalette(v => !v)}
            className="rounded-xl p-2"
            style={{
              color: note.color === 'default'
                ? isDark ? 'rgba(180,180,210,0.6)' : 'rgba(100,100,140,0.7)'
                : cfg.accent,
              backgroundColor: note.color === 'default'
                ? isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'
                : `${cfg.accent}18`,
            }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            title="Note color"
          >
            <Palette size={15} />
          </motion.button>

          <AnimatePresence>
            {showPalette && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.92 }}
                transition={{ duration: 0.16 }}
                className="absolute right-0 top-full mt-2 z-50 rounded-2xl p-3 shadow-2xl"
                style={{
                  background: isDark ? 'rgba(18,18,28,0.98)' : 'rgba(255,255,255,0.98)',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                  backdropFilter: 'blur(20px)',
                  minWidth: 170,
                }}
              >
                <p
                  className="text-[10px] font-semibold uppercase tracking-wider mb-2.5 px-0.5"
                  style={{ color: isDark ? 'rgba(180,180,210,0.4)' : 'rgba(120,120,150,0.5)' }}
                >
                  Note color
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.entries(NOTE_COLORS) as [NoteColor, typeof NOTE_COLORS[NoteColor]][]).map(([key, c]) => (
                    <motion.button
                      key={key}
                      onClick={() => { onSetColor(note.id, key); setShowPalette(false); }}
                      className="flex flex-col items-center gap-1.5 rounded-xl p-2 transition-colors"
                      style={{
                        backgroundColor: note.color === key
                          ? isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'
                          : 'transparent',
                      }}
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.94 }}
                    >
                      <span
                        className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                        style={{
                          backgroundColor: c.swatch,
                          borderColor: note.color === key ? c.accent : 'transparent',
                        }}
                      >
                        {note.color === key && <Check size={9} strokeWidth={3} color={c.accent} />}
                      </span>
                      <span
                        className="text-[10px] font-medium"
                        style={{ color: isDark ? 'rgba(200,200,220,0.7)' : 'rgba(60,60,90,0.7)' }}
                      >
                        {c.label}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pin */}
        <motion.button
          onClick={() => onTogglePin(note.id)}
          className="rounded-xl p-2"
          style={{
            color: note.pinned ? cfg.accent : (isDark ? 'rgba(180,180,210,0.6)' : 'rgba(100,100,140,0.7)'),
            backgroundColor: note.pinned ? `${cfg.accent}15` : (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'),
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          title={note.pinned ? 'Unpin' : 'Pin note'}
        >
          <Pin size={15} fill={note.pinned ? 'currentColor' : 'none'} />
        </motion.button>

        {/* Delete */}
        <motion.button
          onClick={() => { onDelete(note.id); onClose(); }}
          className="rounded-xl p-2"
          style={{
            color: isDark ? 'rgba(255,100,100,0.55)' : 'rgba(200,50,50,0.5)',
            backgroundColor: isDark ? 'rgba(255,100,100,0.05)' : 'rgba(200,50,50,0.04)',
          }}
          whileHover={{ scale: 1.08, color: '#f43f5e' }}
          whileTap={{ scale: 0.92 }}
          title="Delete note"
        >
          <Trash2 size={15} />
        </motion.button>
      </div>

      {/* Title input */}
      <input
        ref={titleRef}
        value={title}
        onChange={e => handleTitleChange(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') { e.preventDefault(); bodyRef.current?.focus(); }
        }}
        placeholder="Note title…"
        className="w-full bg-transparent outline-none text-[20px] font-bold tracking-tight placeholder:font-light mb-3"
        style={{
          color: isDark ? '#e4e4f2' : '#1a1a2e',
          caretColor: cfg.accent,
        }}
      />

      {/* Body textarea — grows with content */}
      <textarea
        ref={bodyRef}
        value={body}
        onChange={e => handleBodyChange(e.target.value)}
        placeholder="Start writing…"
        className="flex-1 w-full bg-transparent outline-none resize-none text-[14px] leading-relaxed font-normal placeholder:font-light"
        style={{
          color: isDark ? 'rgba(220,220,240,0.82)' : 'rgba(40,40,70,0.85)',
          caretColor: cfg.accent,
          minHeight: 220,
          fontFamily: 'var(--font-sans)',
        }}
      />
    </motion.div>
  );
}

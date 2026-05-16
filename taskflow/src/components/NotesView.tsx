import { AnimatePresence, motion } from 'framer-motion';
import { Search, Plus, X } from 'lucide-react';
import { useNotes } from '../hooks/useNotes';
import { NoteCard } from './NoteCard';
import { NoteEditor } from './NoteEditor';
import { NotesEmptyState } from './NotesEmptyState';

interface NotesViewProps {
  isDark: boolean;
}

export function NotesView({ isDark }: NotesViewProps) {
  const {
    notes, search, activeNote, activeNoteId,
    setSearch, setActiveNoteId,
    createNote, updateNote, deleteNote, togglePin, setColor,
    formatUpdated,
  } = useNotes();

  const handleNewNote = () => {
    createNote();
  };

  return (
    <motion.div
      className="flex flex-col gap-5"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
    >
      {/* ── Notes header ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2
            className="text-[20px] font-bold tracking-tight leading-none"
            style={{
              background: isDark
                ? 'linear-gradient(135deg, #e0e0f0 0%, #a8a8d0 100%)'
                : 'linear-gradient(135deg, #1a1a2e 0%, #4a4a7a 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Notes
          </h2>
          <p
            className="text-[12px] font-medium mt-0.5"
            style={{ color: isDark ? 'rgba(180,180,200,0.45)' : 'rgba(100,100,140,0.6)' }}
          >
            Capture your thoughts.
          </p>
        </div>

        {/* New note button — mirrors TaskInput "Add" button style */}
        <motion.button
          onClick={handleNewNote}
          className="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[13px] font-semibold"
          style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            color: '#fff',
            boxShadow: '0 4px 14px rgba(99,102,241,0.38)',
          }}
          whileHover={{ scale: 1.04, y: -1 }}
          whileTap={{ scale: 0.96 }}
        >
          <Plus size={15} strokeWidth={2.5} />
          New note
        </motion.button>
      </div>

      {/* ── Search ─────────────────────────────────────────────────── */}
      <div className="relative">
        <Search
          size={14}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: isDark ? 'rgba(200,200,220,0.3)' : 'rgba(100,100,140,0.4)' }}
        />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search notes…"
          className="w-full rounded-xl pl-9 pr-9 py-2.5 text-[14px] font-medium outline-none input-glow transition-all"
          style={{
            backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(200,200,220,0.7)'}`,
            color: isDark ? '#e0e0f0' : '#1a1a2e',
          }}
        />
        <AnimatePresence>
          {search && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5"
              style={{ color: isDark ? 'rgba(200,200,220,0.4)' : 'rgba(100,100,140,0.5)' }}
              whileHover={{ scale: 1.15 }}
            >
              <X size={13} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ── Main content: list + editor ────────────────────────────── */}
      <AnimatePresence mode="wait">
        {activeNote ? (
          /* ─ EDITOR VIEW ─ */
          <motion.div
            key="editor"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="rounded-2xl px-5 py-4"
            style={{
              background: isDark ? 'rgba(22,22,36,0.76)' : 'rgba(255,255,255,0.82)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(200,200,220,0.8)'}`,
              boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.35)' : '0 4px 20px rgba(0,0,0,0.06)',
            }}
          >
            <NoteEditor
              note={activeNote}
              isDark={isDark}
              onUpdate={updateNote}
              onDelete={deleteNote}
              onTogglePin={togglePin}
              onSetColor={setColor}
              onClose={() => setActiveNoteId(null)}
              formattedDate={formatUpdated(activeNote.updatedAt)}
            />
          </motion.div>
        ) : (
          /* ─ LIST VIEW ─ */
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {notes.length === 0 ? (
              <NotesEmptyState hasSearch={!!search} isDark={isDark} />
            ) : (
              <div className="flex flex-col gap-2">
                {/* Pinned section label */}
                {notes.some(n => n.pinned) && (
                  <motion.p
                    className="text-[10px] font-bold uppercase tracking-widest px-1 mb-0.5"
                    style={{ color: isDark ? 'rgba(180,180,200,0.35)' : 'rgba(120,120,150,0.45)' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    Pinned
                  </motion.p>
                )}

                <AnimatePresence mode="popLayout">
                  {notes.filter(n => n.pinned).map(note => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      isActive={note.id === activeNoteId}
                      isDark={isDark}
                      onSelect={setActiveNoteId}
                      onDelete={deleteNote}
                      onTogglePin={togglePin}
                      formattedDate={formatUpdated(note.updatedAt)}
                    />
                  ))}
                </AnimatePresence>

                {/* Other section label */}
                {notes.some(n => n.pinned) && notes.some(n => !n.pinned) && (
                  <motion.p
                    className="text-[10px] font-bold uppercase tracking-widest px-1 mt-2 mb-0.5"
                    style={{ color: isDark ? 'rgba(180,180,200,0.35)' : 'rgba(120,120,150,0.45)' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    Other
                  </motion.p>
                )}

                <AnimatePresence mode="popLayout">
                  {notes.filter(n => !n.pinned).map(note => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      isActive={note.id === activeNoteId}
                      isDark={isDark}
                      onSelect={setActiveNoteId}
                      onDelete={deleteNote}
                      onTogglePin={togglePin}
                      formattedDate={formatUpdated(note.updatedAt)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Note, NoteColor } from '../types';

const STORAGE_KEY = 'taskflow_notes';

function generateId(): string {
  return `note_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function loadNotes(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveNotes(notes: Note[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>(loadNotes);
  const [search, setSearch] = useState('');
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-save on every change (debounced for body edits, immediate for meta)
  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  const createNote = useCallback(() => {
    const note: Note = {
      id: generateId(),
      title: '',
      body: '',
      pinned: false,
      color: 'default',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes(prev => [note, ...prev]);
    setActiveNoteId(note.id);
    return note.id;
  }, []);

  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
    // Clear any pending debounce
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setNotes(prev =>
      prev.map(n =>
        n.id === id
          ? { ...n, ...updates, updatedAt: new Date().toISOString() }
          : n
      )
    );
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    setActiveNoteId(prev => (prev === id ? null : prev));
  }, []);

  const togglePin = useCallback((id: string) => {
    setNotes(prev =>
      prev.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n)
    );
  }, []);

  const setColor = useCallback((id: string, color: NoteColor) => {
    setNotes(prev =>
      prev.map(n => n.id === id ? { ...n, color } : n)
    );
  }, []);

  // Sort: pinned first, then by updatedAt desc
  const sortedNotes = [...notes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  const filteredNotes = sortedNotes.filter(n => {
    if (!search) return true;
    const q = search.toLowerCase();
    return n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q);
  });

  const activeNote = notes.find(n => n.id === activeNoteId) ?? null;

  const formatUpdated = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return {
    notes: filteredNotes,
    allNotes: notes,
    search,
    activeNote,
    activeNoteId,
    setSearch,
    setActiveNoteId,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
    setColor,
    formatUpdated,
  };
}

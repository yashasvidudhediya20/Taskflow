import { useState, useEffect, useCallback } from 'react';
import type { AppPage } from '../types';

const THEME_KEY = 'taskflow_theme';
const SOUND_KEY = 'taskflow_sound';
const PAGE_KEY = 'taskflow_page';
const STREAK_KEY = 'taskflow_streak';
const FOCUS_KEY = 'taskflow_focus_total';

function loadTheme(): 'light' | 'dark' {
  const saved = localStorage.getItem(THEME_KEY) as 'light' | 'dark' | null;
  if (saved) return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function loadStreak(): number {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (!raw) return 1;
    const { streak, lastDate } = JSON.parse(raw);
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (lastDate === today) return streak;
    if (lastDate === yesterday) return streak; // will increment on save
    return 1; // reset
  } catch { return 1; }
}

function saveStreak(streak: number) {
  localStorage.setItem(STREAK_KEY, JSON.stringify({
    streak,
    lastDate: new Date().toDateString(),
  }));
}

export function useAppStore() {
  const [theme, setThemeState] = useState<'light' | 'dark'>(loadTheme);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem(SOUND_KEY) !== 'false';
  });
  const [page, setPageState] = useState<AppPage>(() => {
    return (localStorage.getItem(PAGE_KEY) as AppPage) || 'dashboard';
  });
  const [streak] = useState<number>(loadStreak);
  const [focusMinutes, setFocusMinutes] = useState<number>(() => {
    return Number(localStorage.getItem(FOCUS_KEY) || 0);
  });

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(SOUND_KEY, String(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem(PAGE_KEY, page);
  }, [page]);

  useEffect(() => {
    saveStreak(streak);
  }, [streak]);

  const setTheme = useCallback((t: 'light' | 'dark') => setThemeState(t), []);
  const toggleTheme = useCallback(() => setThemeState(p => p === 'dark' ? 'light' : 'dark'), []);
  const toggleSound = useCallback(() => setSoundEnabled(p => !p), []);
  const setPage = useCallback((p: AppPage) => setPageState(p), []);

  const addFocusMinutes = useCallback((mins: number) => {
    setFocusMinutes(prev => {
      const next = prev + mins;
      localStorage.setItem(FOCUS_KEY, String(next));
      return next;
    });
  }, []);

  const isDark = theme === 'dark';

  return {
    theme, isDark, soundEnabled, page, streak, focusMinutes,
    setTheme, toggleTheme, toggleSound, setPage, addFocusMinutes,
  };
}

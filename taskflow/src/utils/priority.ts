import type { Priority } from '../types';

export const PRIORITY_CONFIG: Record<Priority, {
  label: string;
  color: string;
  bg: string;
  bgDark: string;
  dot: string;
  ring: string;
}> = {
  low: {
    label: 'Low',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    bgDark: 'bg-emerald-500',
    dot: 'bg-emerald-400',
    ring: 'ring-emerald-300 dark:ring-emerald-700',
  },
  medium: {
    label: 'Medium',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    bgDark: 'bg-amber-500',
    dot: 'bg-amber-400',
    ring: 'ring-amber-300 dark:ring-amber-700',
  },
  high: {
    label: 'High',
    color: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-900/20',
    bgDark: 'bg-rose-500',
    dot: 'bg-rose-400',
    ring: 'ring-rose-300 dark:ring-rose-700',
  },
};

export function formatDueDate(dateStr: string): { label: string; isOverdue: boolean; isToday: boolean; isSoon: boolean } {
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  const diff = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diff < 0) return { label: `${Math.abs(diff)}d overdue`, isOverdue: true, isToday: false, isSoon: false };
  if (diff === 0) return { label: 'Today', isOverdue: false, isToday: true, isSoon: false };
  if (diff === 1) return { label: 'Tomorrow', isOverdue: false, isToday: false, isSoon: true };
  if (diff <= 3) return { label: `In ${diff} days`, isOverdue: false, isToday: false, isSoon: true };

  return {
    label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    isOverdue: false, isToday: false, isSoon: false
  };
}

import type { NoteColor } from '../types';

export const NOTE_COLORS: Record<NoteColor, {
  label: string;
  // Accent hex used for pin dot, border glow
  accent: string;
  // Card tint — light mode
  tintLight: string;
  // Card tint — dark mode
  tintDark: string;
  // Border — light
  borderLight: string;
  // Border — dark
  borderDark: string;
  // Swatch for color picker
  swatch: string;
}> = {
  default: {
    label: 'Default',
    accent: '#6366f1',
    tintLight: 'rgba(255,255,255,0.76)',
    tintDark: 'rgba(22,22,36,0.72)',
    borderLight: 'rgba(220,220,235,0.8)',
    borderDark: 'rgba(255,255,255,0.055)',
    swatch: '#e0e0f0',
  },
  rose: {
    label: 'Rose',
    accent: '#f43f5e',
    tintLight: 'rgba(255,241,242,0.82)',
    tintDark: 'rgba(36,14,20,0.78)',
    borderLight: 'rgba(251,207,213,0.9)',
    borderDark: 'rgba(244,63,94,0.15)',
    swatch: '#fda4af',
  },
  amber: {
    label: 'Amber',
    accent: '#f59e0b',
    tintLight: 'rgba(255,251,235,0.82)',
    tintDark: 'rgba(34,28,8,0.78)',
    borderLight: 'rgba(252,228,170,0.9)',
    borderDark: 'rgba(245,158,11,0.15)',
    swatch: '#fcd34d',
  },
  emerald: {
    label: 'Emerald',
    accent: '#10b981',
    tintLight: 'rgba(236,253,245,0.82)',
    tintDark: 'rgba(6,30,22,0.78)',
    borderLight: 'rgba(167,243,208,0.9)',
    borderDark: 'rgba(16,185,129,0.15)',
    swatch: '#6ee7b7',
  },
  sky: {
    label: 'Sky',
    accent: '#0ea5e9',
    tintLight: 'rgba(240,249,255,0.82)',
    tintDark: 'rgba(4,24,36,0.78)',
    borderLight: 'rgba(186,230,253,0.9)',
    borderDark: 'rgba(14,165,233,0.15)',
    swatch: '#7dd3fc',
  },
  violet: {
    label: 'Violet',
    accent: '#8b5cf6',
    tintLight: 'rgba(245,243,255,0.82)',
    tintDark: 'rgba(22,14,38,0.78)',
    borderLight: 'rgba(221,214,254,0.9)',
    borderDark: 'rgba(139,92,246,0.18)',
    swatch: '#c4b5fd',
  },
};

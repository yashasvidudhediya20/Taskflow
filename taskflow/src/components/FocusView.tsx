import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';

interface FocusViewProps {
  isDark: boolean;
  onFocusComplete: (mins: number) => void;
  onPlaySound: (type: 'focus' | 'complete') => void;
}

type Mode = 'focus' | 'short' | 'long';
const DURATIONS: Record<Mode, number> = { focus: 25 * 60, short: 5 * 60, long: 15 * 60 };
const MODE_LABELS: Record<Mode, string> = { focus: 'Deep Focus', short: 'Short Break', long: 'Long Break' };
const MODE_COLORS: Record<Mode, string> = { focus: '#6366f1', short: '#10b981', long: '#06b6d4' };

function pad(n: number) { return String(n).padStart(2, '0'); }

export function FocusView({ isDark, onFocusComplete, onPlaySound }: FocusViewProps) {
  const [mode, setMode] = useState<Mode>('focus');
  const [remaining, setRemaining] = useState(DURATIONS.focus);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedRef = useRef<number>(0);

  const color = MODE_COLORS[mode];
  const total = DURATIONS[mode];
  const progress = (total - remaining) / total;

  const reset = useCallback((m: Mode = mode) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);
    setRemaining(DURATIONS[m]);
  }, [mode]);

  const switchMode = (m: Mode) => {
    reset(m);
    setMode(m);
    setRemaining(DURATIONS[m]);
  };

  useEffect(() => {
    if (running) {
      startedRef.current = Date.now();
      intervalRef.current = setInterval(() => {
        setRemaining(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setRunning(false);
            if (mode === 'focus') {
              setSessions(s => s + 1);
              onFocusComplete(Math.round((total - 0) / 60));
              onPlaySound('complete');
            } else {
              onPlaySound('focus');
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, mode, total, onFocusComplete, onPlaySound]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;

  // SVG circle progress
  const R = 88;
  const circ = 2 * Math.PI * R;
  const dash = circ * (1 - progress);

  const label = isDark ? 'rgba(180,180,210,0.45)' : 'rgba(100,100,140,0.55)';

  return (
    <motion.div
      className="flex flex-col items-center gap-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 360, damping: 28 }}
    >
      {/* Header */}
      <div className="w-full">
        <h2 className="text-[20px] font-bold tracking-tight" style={{
          background: isDark ? 'linear-gradient(135deg, #e0e0f0 0%, #a8a8d0 100%)' : 'linear-gradient(135deg, #1a1a2e 0%, #4a4a7a 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>Focus Timer</h2>
        <p className="text-[12px] font-medium mt-0.5" style={{ color: label }}>Deep work, one session at a time.</p>
      </div>

      {/* Mode tabs */}
      <div
        className="flex items-center gap-1 rounded-xl p-1 w-full"
        style={{
          backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(200,200,220,0.5)'}`,
        }}
      >
        {(['focus', 'short', 'long'] as Mode[]).map(m => (
          <motion.button
            key={m}
            onClick={() => switchMode(m)}
            className="relative flex-1 rounded-lg py-1.5 text-[12px] font-semibold"
            style={{ color: mode === m ? (isDark ? '#e0e0f0' : '#1a1a2e') : (isDark ? 'rgba(180,180,200,0.45)' : 'rgba(100,100,140,0.55)') }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            {mode === m && (
              <motion.div
                layoutId="focusModeActive"
                className="absolute inset-0 rounded-lg"
                style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.95)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              />
            )}
            <span className="relative z-10">{MODE_LABELS[m]}</span>
          </motion.button>
        ))}
      </div>

      {/* Timer ring */}
      <div className="relative flex items-center justify-center">
        {/* Ambient glow */}
        <motion.div
          className="absolute rounded-full"
          style={{ width: 220, height: 220, background: `radial-gradient(circle, ${color}22 0%, transparent 70%)` }}
          animate={{ scale: running ? [1, 1.06, 1] : 1, opacity: running ? [0.6, 1, 0.6] : 0.4 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        <svg width={220} height={220} className="rotate-[-90deg]">
          {/* Track */}
          <circle cx={110} cy={110} r={R} fill="none" strokeWidth={6}
            stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)'} />
          {/* Progress */}
          <motion.circle
            cx={110} cy={110} r={R} fill="none" strokeWidth={6}
            stroke={color}
            strokeLinecap="round"
            strokeDasharray={circ}
            animate={{ strokeDashoffset: dash }}
            transition={{ type: 'spring', stiffness: 40, damping: 18 }}
            style={{ filter: `drop-shadow(0 0 8px ${color}88)` }}
          />
        </svg>

        {/* Time display */}
        <div className="absolute flex flex-col items-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={`${mins}-${secs}`}
              className="text-[44px] font-bold tabular-nums leading-none"
              style={{ color: isDark ? '#e4e4f2' : '#1a1a2e', fontFamily: 'var(--font-mono)', letterSpacing: '-0.02em' }}
              initial={{ opacity: 0.6, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15 }}
            >
              {pad(mins)}:{pad(secs)}
            </motion.p>
          </AnimatePresence>
          <p className="text-[11px] font-semibold mt-1 uppercase tracking-widest" style={{ color }}>
            {MODE_LABELS[mode]}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <motion.button
          onClick={() => { reset(); }}
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', color: isDark ? 'rgba(200,200,220,0.5)' : 'rgba(100,100,140,0.6)' }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.9 }}
        >
          <RotateCcw size={15} />
        </motion.button>

        <motion.button
          onClick={() => { setRunning(p => !p); if (!running) onPlaySound('focus'); }}
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`, boxShadow: `0 6px 20px ${color}55` }}
          whileHover={{ scale: 1.06, y: -1 }}
          whileTap={{ scale: 0.94 }}
        >
          <AnimatePresence mode="wait">
            {running ? (
              <motion.div key="pause" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }} transition={{ duration: 0.15 }}>
                <Pause size={22} color="#fff" fill="#fff" />
              </motion.div>
            ) : (
              <motion.div key="play" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }} transition={{ duration: 0.15 }}>
                <Play size={22} color="#fff" fill="#fff" style={{ marginLeft: 2 }} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }}>
          {mode === 'focus' ? <Brain size={15} style={{ color }} /> : <Coffee size={15} style={{ color }} />}
        </div>
      </div>

      {/* Sessions */}
      <div
        className="w-full rounded-2xl p-4 flex items-center justify-between"
        style={{
          background: isDark ? 'rgba(18,18,32,0.72)' : 'rgba(255,255,255,0.76)',
          backdropFilter: 'blur(18px)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(220,220,235,0.8)'}`,
        }}
      >
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: label }}>Sessions today</p>
          <p className="text-[22px] font-bold mt-0.5 tabular-nums" style={{ color: isDark ? '#e4e4f0' : '#1a1a2e' }}>{sessions}</p>
        </div>
        <div className="flex gap-1.5">
          {Array.from({ length: Math.max(4, sessions) }).map((_x, i) => (
            <motion.div
              key={i}
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: i < sessions ? color : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)') }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.05 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Clock, Sparkles, TrendingUp, Lightbulb, CheckSquare, FileText } from 'lucide-react';

interface DashboardViewProps {
  isDark: boolean;
  streak: number;
  focusMinutes: number;
  taskStats: { total: number; completed: number; percentage: number; active: number };
  noteCount: number;
  onNavigate: (p: 'tasks' | 'notes' | 'focus') => void;
}

const QUOTES = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  { text: "It's not about having time, it's about making time.", author: "Unknown" },
  { text: "Small steps every day lead to big results.", author: "Unknown" },
  { text: "Clarity is the antidote to anxiety.", author: "Naval Ravikant" },
  { text: "Your focus determines your reality.", author: "Qui-Gon Jinn" },
];

const TIPS = [
  "Try the 2-minute rule: if a task takes less than 2 minutes, do it now.",
  "Batch similar tasks together to reduce context-switching overhead.",
  "Your peak focus window is usually 90 minutes after waking.",
  "Use your high-priority tasks for your highest-energy time of day.",
  "A clean workspace leads to a clearer mind. Take 2 minutes to tidy up.",
  "Plan tomorrow the night before — decision fatigue is real.",
  "Protect your deep work time by blocking it in the morning.",
];

function GlassWidget({ children, isDark, delay = 0, className = '', onClick }: {
  children: React.ReactNode;
  isDark: boolean;
  delay?: number;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <motion.div
      className={`rounded-2xl p-4 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{
        background: isDark ? 'rgba(18,18,32,0.72)' : 'rgba(255,255,255,0.76)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(220,220,235,0.8)'}`,
        boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.35)' : '0 4px 16px rgba(0,0,0,0.05)',
      }}
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 380, damping: 30, delay }}
      whileHover={onClick ? { y: -2, boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)' : '0 8px 28px rgba(99,102,241,0.12)' } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}

export function DashboardView({ isDark, streak, focusMinutes, taskStats, noteCount, onNavigate }: DashboardViewProps) {
  const [quote] = useState(() => QUOTES[new Date().getDay() % QUOTES.length]);
  const [tip] = useState(() => TIPS[new Date().getHours() % TIPS.length]);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const greeting = (() => {
    const h = time.getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();



  return (
    <motion.div
      className="flex flex-col gap-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      >
        <h2
          className="text-[26px] font-bold tracking-tight leading-none mb-1"
          style={{
            background: isDark
              ? 'linear-gradient(135deg, #e0e0f0 0%, #a8a8d0 100%)'
              : 'linear-gradient(135deg, #1a1a2e 0%, #4a4a7a 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {greeting} ✦
        </h2>
        <p className="text-[13px] font-medium" style={{ color: isDark ? 'rgba(180,180,200,0.45)' : 'rgba(100,100,140,0.6)' }}>
          {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {/* Streak */}
        <GlassWidget isDark={isDark} delay={0.05}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: 'rgba(251,146,60,0.15)' }}>
              <Flame size={14} style={{ color: '#fb923c' }} />
            </div>
          </div>
          <p className="text-[22px] font-bold tabular-nums leading-none mb-0.5" style={{ color: '#fb923c' }}>{streak}</p>
          <p className="text-[11px] font-medium" style={{ color: isDark ? 'rgba(180,180,200,0.45)' : 'rgba(100,100,140,0.6)' }}>Day streak</p>
        </GlassWidget>

        {/* Focus */}
        <GlassWidget isDark={isDark} delay={0.08} onClick={() => onNavigate('focus')}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.15)' }}>
              <Clock size={14} style={{ color: '#10b981' }} />
            </div>
          </div>
          <p className="text-[22px] font-bold tabular-nums leading-none mb-0.5" style={{ color: '#10b981' }}>{focusMinutes}</p>
          <p className="text-[11px] font-medium" style={{ color: isDark ? 'rgba(180,180,200,0.45)' : 'rgba(100,100,140,0.6)' }}>Focus mins</p>
        </GlassWidget>

        {/* Productivity % */}
        <GlassWidget isDark={isDark} delay={0.11} onClick={() => onNavigate('tasks')}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.15)' }}>
              <TrendingUp size={14} style={{ color: '#6366f1' }} />
            </div>
          </div>
          <p className="text-[22px] font-bold tabular-nums leading-none mb-0.5" style={{ color: '#6366f1' }}>{taskStats.percentage}%</p>
          <p className="text-[11px] font-medium" style={{ color: isDark ? 'rgba(180,180,200,0.45)' : 'rgba(100,100,140,0.6)' }}>Done today</p>
        </GlassWidget>
      </div>

      {/* Quick access row */}
      <div className="grid grid-cols-2 gap-3">
        <GlassWidget isDark={isDark} delay={0.13} onClick={() => onNavigate('tasks')}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CheckSquare size={14} style={{ color: '#8b5cf6' }} />
              <span className="text-[12px] font-semibold" style={{ color: isDark ? '#c4b5fd' : '#6d28d9' }}>Tasks</span>
            </div>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(139,92,246,0.12)', color: '#8b5cf6' }}>
              {taskStats.active} left
            </span>
          </div>
          {/* Mini progress */}
          <div className="h-[4px] rounded-full overflow-hidden" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' }}
              initial={{ width: 0 }}
              animate={{ width: `${taskStats.percentage}%` }}
              transition={{ type: 'spring', stiffness: 100, damping: 18, delay: 0.3 }}
            />
          </div>
          <p className="text-[11px] mt-2" style={{ color: isDark ? 'rgba(180,180,200,0.45)' : 'rgba(100,100,140,0.6)' }}>{taskStats.completed}/{taskStats.total} completed</p>
        </GlassWidget>

        <GlassWidget isDark={isDark} delay={0.15} onClick={() => onNavigate('notes')}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileText size={14} style={{ color: '#06b6d4' }} />
              <span className="text-[12px] font-semibold" style={{ color: isDark ? '#67e8f9' : '#0e7490' }}>Notes</span>
            </div>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(6,182,212,0.12)', color: '#06b6d4' }}>
              {noteCount} notes
            </span>
          </div>
          <div className="flex gap-1 flex-wrap mt-1">
            {noteCount === 0 ? (
              <p className="text-[11px]" style={{ color: isDark ? 'rgba(180,180,200,0.45)' : 'rgba(100,100,140,0.6)' }}>No notes yet. Start capturing ideas.</p>
            ) : (
              <p className="text-[11px]" style={{ color: isDark ? 'rgba(180,180,200,0.45)' : 'rgba(100,100,140,0.6)' }}>Tap to view your notes.</p>
            )}
          </div>
        </GlassWidget>
      </div>

      {/* Quote */}
      <GlassWidget isDark={isDark} delay={0.17}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-7 h-7 rounded-xl flex items-center justify-center mt-0.5" style={{ background: 'rgba(168,85,247,0.15)' }}>
            <Sparkles size={13} style={{ color: '#a855f7' }} />
          </div>
          <div>
            <p className="text-[13px] font-medium leading-relaxed italic mb-1" style={{ color: isDark ? 'rgba(220,220,240,0.82)' : 'rgba(40,40,70,0.85)' }}>
              "{quote.text}"
            </p>
            <p className="text-[11px] font-semibold" style={{ color: isDark ? 'rgba(180,180,200,0.45)' : 'rgba(100,100,140,0.6)' }}>— {quote.author}</p>
          </div>
        </div>
      </GlassWidget>

      {/* AI tip */}
      <GlassWidget isDark={isDark} delay={0.2}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-7 h-7 rounded-xl flex items-center justify-center mt-0.5" style={{ background: 'rgba(245,158,11,0.13)' }}>
            <Lightbulb size={13} style={{ color: '#f59e0b' }} />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#f59e0b' }}>Productivity tip</p>
            <p className="text-[13px] leading-relaxed" style={{ color: isDark ? 'rgba(200,200,220,0.75)' : 'rgba(60,60,90,0.8)' }}>
              {tip}
            </p>
          </div>
        </div>
      </GlassWidget>
    </motion.div>
  );
}

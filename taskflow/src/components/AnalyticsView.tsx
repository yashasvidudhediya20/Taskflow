import { motion } from 'framer-motion';
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import type { Task } from '../types';
import { PRIORITY_CONFIG } from '../utils/priority';

interface AnalyticsViewProps {
  isDark: boolean;
  tasks: Task[];
}

function GlassCard({ children, isDark, delay = 0 }: { children: React.ReactNode; isDark: boolean; delay?: number }) {
  return (
    <motion.div
      className="rounded-2xl p-4"
      style={{
        background: isDark ? 'rgba(18,18,32,0.72)' : 'rgba(255,255,255,0.76)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(220,220,235,0.8)'}`,
        boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 16px rgba(0,0,0,0.05)',
      }}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 380, damping: 30, delay }}
    >
      {children}
    </motion.div>
  );
}

export function AnalyticsView({ isDark, tasks }: AnalyticsViewProps) {
  const label = isDark ? 'rgba(180,180,210,0.45)' : 'rgba(100,100,140,0.55)';
  const val = isDark ? '#e4e4f0' : '#1a1a2e';

  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const active = total - completed;
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  const byPriority = {
    high: tasks.filter(t => t.priority === 'high'),
    medium: tasks.filter(t => t.priority === 'medium'),
    low: tasks.filter(t => t.priority === 'low'),
  };

  const priorityColors = { high: '#f43f5e', medium: '#f59e0b', low: '#10b981' };

  // Completion by priority
  const priorityStats = (['high', 'medium', 'low'] as const).map(p => ({
    p,
    total: byPriority[p].length,
    done: byPriority[p].filter(t => t.completed).length,
    color: priorityColors[p],
    label: PRIORITY_CONFIG[p].label,
  }));

  // Last 7 days task creation
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const ds = d.toDateString();
    return {
      label: d.toLocaleDateString('en-US', { weekday: 'short' }),
      created: tasks.filter(t => new Date(t.createdAt).toDateString() === ds).length,
      completed: tasks.filter(t => t.completed && new Date(t.createdAt).toDateString() === ds).length,
    };
  });

  const maxBar = Math.max(...last7.map(d => d.created), 1);

  return (
    <motion.div
      className="flex flex-col gap-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 380, damping: 28 }}>
        <h2 className="text-[20px] font-bold tracking-tight" style={{
          background: isDark ? 'linear-gradient(135deg, #e0e0f0 0%, #a8a8d0 100%)' : 'linear-gradient(135deg, #1a1a2e 0%, #4a4a7a 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>Analytics</h2>
        <p className="text-[12px] font-medium mt-0.5" style={{ color: label }}>Your productivity at a glance.</p>
      </motion.div>

      {/* Overview stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: CheckCircle2, value: completed, label: 'Completed', color: '#10b981' },
          { icon: Circle, value: active, label: 'Active', color: '#6366f1' },
          { icon: AlertCircle, value: tasks.filter(t => t.priority === 'high' && !t.completed).length, label: 'Urgent', color: '#f43f5e' },
        ].map(({ icon: Icon, value, label: l, color }, i) => (
          <GlassCard key={l} isDark={isDark} delay={i * 0.05}>
            <div className="w-6 h-6 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: `${color}18` }}>
              <Icon size={13} style={{ color }} />
            </div>
            <p className="text-[20px] font-bold tabular-nums" style={{ color: isDark ? '#e4e4f0' : '#1a1a2e' }}>{value}</p>
            <p className="text-[10px] font-medium mt-0.5" style={{ color: label }}>{l}</p>
          </GlassCard>
        ))}
      </div>

      {/* Overall completion donut-style */}
      <GlassCard isDark={isDark} delay={0.12}>
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 flex-shrink-0">
            <svg width={80} height={80} className="rotate-[-90deg]">
              <circle cx={40} cy={40} r={32} fill="none" strokeWidth={7}
                stroke={isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'} />
              <motion.circle
                cx={40} cy={40} r={32} fill="none" strokeWidth={7}
                stroke="url(#analyticsGrad)" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 32}
                animate={{ strokeDashoffset: 2 * Math.PI * 32 * (1 - pct / 100) }}
                transition={{ type: 'spring', stiffness: 80, damping: 18, delay: 0.2 }}
              />
              <defs>
                <linearGradient id="analyticsGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#a78bfa" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-[14px] font-bold" style={{ color: isDark ? '#e4e4f0' : '#1a1a2e' }}>{pct}%</p>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-semibold mb-0.5" style={{ color: val }}>Overall completion</p>
            <p className="text-[12px]" style={{ color: label }}>{completed} of {total} tasks done</p>
            {/* Mini bar */}
            <div className="h-1.5 rounded-full overflow-hidden mt-2" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)' }}>
              <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #6366f1, #a78bfa)' }}
                initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                transition={{ type: 'spring', stiffness: 80, damping: 18, delay: 0.25 }}
              />
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Priority breakdown */}
      <GlassCard isDark={isDark} delay={0.16}>
        <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: label }}>By priority</p>
        <div className="flex flex-col gap-3">
          {priorityStats.map(({ p, total: t, done, color, label: lbl }) => {
            const pct = t === 0 ? 0 : Math.round((done / t) * 100);
            return (
              <div key={p}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-[12px] font-medium" style={{ color: val }}>{lbl}</span>
                  </div>
                  <span className="text-[11px] font-medium tabular-nums" style={{ color: label }}>{done}/{t}</span>
                </div>
                <div className="h-[4px] rounded-full overflow-hidden" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)' }}>
                  <motion.div className="h-full rounded-full" style={{ backgroundColor: color }}
                    initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                    transition={{ type: 'spring', stiffness: 80, damping: 18, delay: 0.2 }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* 7-day activity */}
      <GlassCard isDark={isDark} delay={0.2}>
        <p className="text-[11px] font-bold uppercase tracking-wider mb-4" style={{ color: label }}>7-day activity</p>
        <div className="flex items-end gap-2 h-20">
          {last7.map((d, i) => {
            const h = Math.round((d.created / maxBar) * 72);
            const hDone = Math.round((d.completed / maxBar) * 72);
            const isToday = i === 6;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="relative w-full rounded-lg overflow-hidden" style={{ height: 72, backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                  {/* created bar */}
                  <motion.div
                    className="absolute bottom-0 w-full rounded-lg"
                    style={{ backgroundColor: isToday ? '#6366f1' : (isDark ? 'rgba(99,102,241,0.35)' : 'rgba(99,102,241,0.2)') }}
                    initial={{ height: 0 }}
                    animate={{ height: h || 2 }}
                    transition={{ type: 'spring', stiffness: 120, damping: 18, delay: 0.1 + i * 0.03 }}
                  />
                  {/* completed overlay */}
                  <motion.div
                    className="absolute bottom-0 w-full rounded-lg"
                    style={{ backgroundColor: isToday ? '#a78bfa' : (isDark ? 'rgba(167,139,250,0.5)' : 'rgba(167,139,250,0.45)') }}
                    initial={{ height: 0 }}
                    animate={{ height: hDone || 0 }}
                    transition={{ type: 'spring', stiffness: 120, damping: 18, delay: 0.15 + i * 0.03 }}
                  />
                </div>
                <span className="text-[9px] font-medium" style={{ color: isToday ? '#6366f1' : label }}>{d.label}</span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: 'rgba(99,102,241,0.4)' }} />
            <span className="text-[10px]" style={{ color: label }}>Created</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: 'rgba(167,139,250,0.55)' }} />
            <span className="text-[10px]" style={{ color: label }}>Completed</span>
          </div>
        </div>
      </GlassCard>

      {total === 0 && (
        <motion.p className="text-center text-[13px] py-4" style={{ color: label }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Add some tasks to see your analytics.
        </motion.p>
      )}
    </motion.div>
  );
}

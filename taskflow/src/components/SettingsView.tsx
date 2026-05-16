import { motion } from 'framer-motion';
import { Sun, Moon, Volume2, VolumeX, Download } from 'lucide-react';

interface SettingsViewProps {
  isDark: boolean;
  soundEnabled: boolean;
  onToggleTheme: () => void;
  onToggleSound: () => void;
  taskCount: number;
  noteCount: number;
}

function SettingRow({ children, isDark }: { children: React.ReactNode; isDark: boolean }) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3.5 rounded-2xl"
      style={{
        background: isDark ? 'rgba(18,18,32,0.72)' : 'rgba(255,255,255,0.76)',
        backdropFilter: 'blur(18px)',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(220,220,235,0.8)'}`,
        boxShadow: isDark ? '0 2px 12px rgba(0,0,0,0.25)' : '0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      {children}
    </div>
  );
}

function Toggle({ on, onToggle, color = '#6366f1' }: { on: boolean; onToggle: () => void; color?: string }) {
  return (
    <motion.button
      onClick={onToggle}
      className="relative w-11 h-6 rounded-full flex-shrink-0"
      style={{ backgroundColor: on ? color : (on ? color : 'rgba(150,150,170,0.25)') }}
      animate={{ backgroundColor: on ? color : 'rgba(150,150,170,0.25)' }}
      transition={{ duration: 0.2 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md"
        animate={{ x: on ? 22 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </motion.button>
  );
}

export function SettingsView({ isDark, soundEnabled, onToggleTheme, onToggleSound, taskCount, noteCount }: SettingsViewProps) {
  const label = isDark ? 'rgba(180,180,210,0.45)' : 'rgba(100,100,140,0.55)';
  const val = isDark ? '#e4e4f0' : '#1a1a2e';

  const handleExport = () => {
    const data = {
      tasks: localStorage.getItem('taskflow_tasks'),
      notes: localStorage.getItem('taskflow_notes'),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `taskflow-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      className="flex flex-col gap-5"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 360, damping: 28 }}
    >
      {/* Header */}
      <div>
        <h2 className="text-[20px] font-bold tracking-tight" style={{
          background: isDark ? 'linear-gradient(135deg, #e0e0f0 0%, #a8a8d0 100%)' : 'linear-gradient(135deg, #1a1a2e 0%, #4a4a7a 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>Settings</h2>
        <p className="text-[12px] font-medium mt-0.5" style={{ color: label }}>Personalize your workspace.</p>
      </div>

      {/* Appearance */}
      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-bold uppercase tracking-widest px-1" style={{ color: label }}>Appearance</p>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <SettingRow isDark={isDark}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)' }}>
                {isDark ? <Moon size={15} style={{ color: '#c4b5fd' }} /> : <Sun size={15} style={{ color: '#f59e0b' }} />}
              </div>
              <div>
                <p className="text-[13px] font-semibold" style={{ color: val }}>Theme</p>
                <p className="text-[11px]" style={{ color: label }}>{isDark ? 'Dark mode' : 'Light mode'}</p>
              </div>
            </div>
            <Toggle on={isDark} onToggle={onToggleTheme} color="#6366f1" />
          </SettingRow>
        </motion.div>
      </div>

      {/* Sound */}
      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-bold uppercase tracking-widest px-1" style={{ color: label }}>Sound</p>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <SettingRow isDark={isDark}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: soundEnabled ? 'rgba(99,102,241,0.12)' : (isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)') }}>
                {soundEnabled
                  ? <Volume2 size={15} style={{ color: '#6366f1' }} />
                  : <VolumeX size={15} style={{ color: isDark ? 'rgba(180,180,210,0.4)' : 'rgba(120,120,150,0.5)' }} />}
              </div>
              <div>
                <p className="text-[13px] font-semibold" style={{ color: val }}>UI Sounds</p>
                <p className="text-[11px]" style={{ color: label }}>Subtle audio feedback</p>
              </div>
            </div>
            <Toggle on={soundEnabled} onToggle={onToggleSound} color="#6366f1" />
          </SettingRow>
        </motion.div>
      </div>

      {/* Data */}
      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-bold uppercase tracking-widest px-1" style={{ color: label }}>Data</p>
        <motion.div className="flex flex-col gap-2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.11 }}>
          <SettingRow isDark={isDark}>
            <div>
              <p className="text-[13px] font-semibold" style={{ color: val }}>Storage</p>
              <p className="text-[11px]" style={{ color: label }}>{taskCount} tasks · {noteCount} notes · Local only</p>
            </div>
          </SettingRow>
          <SettingRow isDark={isDark}>
            <div>
              <p className="text-[13px] font-semibold" style={{ color: val }}>Export backup</p>
              <p className="text-[11px]" style={{ color: label }}>Download your data as JSON</p>
            </div>
            <motion.button
              onClick={handleExport}
              className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[12px] font-semibold"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', boxShadow: '0 3px 10px rgba(99,102,241,0.35)' }}
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
            >
              <Download size={12} />
              Export
            </motion.button>
          </SettingRow>
        </motion.div>
      </div>

      {/* About */}
      <motion.div
        className="rounded-2xl px-4 py-3 text-center"
        style={{
          background: isDark ? 'rgba(99,102,241,0.07)' : 'rgba(99,102,241,0.05)',
          border: `1px solid rgba(99,102,241,0.15)`,
        }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
      >
        <p className="text-[13px] font-semibold" style={{ color: isDark ? '#c4b5fd' : '#6366f1' }}>TaskFlow OS</p>
        <p className="text-[11px] mt-0.5" style={{ color: label }}>A futuristic productivity workspace. v2.0</p>
      </motion.div>
    </motion.div>
  );
}

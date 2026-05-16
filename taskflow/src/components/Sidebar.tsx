import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, CheckSquare, FileText,
  Timer, BarChart2, Settings, ChevronLeft, ChevronRight, Zap
} from 'lucide-react';
import type { AppPage } from '../types';

interface SidebarProps {
  page: AppPage;
  isDark: boolean;
  onNavigate: (p: AppPage) => void;
  onPlayNav: () => void;
}

interface NavItem {
  id: AppPage;
  icon: React.ElementType;
  label: string;
  color: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', color: '#6366f1' },
  { id: 'tasks',     icon: CheckSquare,     label: 'Tasks',     color: '#8b5cf6' },
  { id: 'notes',     icon: FileText,        label: 'Notes',     color: '#06b6d4' },
  { id: 'focus',     icon: Timer,           label: 'Focus',     color: '#10b981' },
  { id: 'analytics', icon: BarChart2,       label: 'Analytics', color: '#f59e0b' },
  { id: 'settings',  icon: Settings,        label: 'Settings',  color: '#94a3b8' },
];

export function Sidebar({ page, isDark, onNavigate, onPlayNav }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const bg = isDark ? 'rgba(12,12,22,0.82)' : 'rgba(255,255,255,0.72)';
  const border = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(210,210,230,0.8)';
  const shadow = isDark
    ? '0 0 0 1px rgba(255,255,255,0.04), 0 8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)'
    : '0 0 0 1px rgba(200,200,220,0.4), 0 8px 40px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8)';

  return (
    <motion.div
      className="fixed left-4 top-1/2 z-50 flex flex-col"
      style={{ transform: 'translateY(-50%)' }}
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.1 }}
    >
      <motion.div
        className="relative flex flex-col items-center rounded-[22px] py-4 gap-1 overflow-hidden"
        animate={{ width: collapsed ? 56 : 188 }}
        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
        style={{
          background: bg,
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: `1px solid ${border}`,
          boxShadow: shadow,
        }}
      >
        {/* Subtle inner highlight */}
        <div
          className="absolute inset-x-0 top-0 h-px rounded-full"
          style={{ background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.9)' }}
        />

        {/* Logo mark */}
        <div
          className="flex items-center gap-2.5 mb-3 px-3 w-full"
          style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
        >
          <motion.div
            className="flex-shrink-0 w-7 h-7 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', boxShadow: '0 2px 8px rgba(99,102,241,0.4)' }}
            whileHover={{ scale: 1.08, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <Zap size={14} color="#fff" fill="#fff" />
          </motion.div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
                className="text-[13px] font-bold tracking-tight whitespace-nowrap"
                style={{ color: isDark ? '#e0e0f0' : '#1a1a2e' }}
              >
                TaskFlow
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div
          className="w-8 h-px mb-2"
          style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}
        />

        {/* Nav items */}
        {NAV_ITEMS.map((item) => {
          const isActive = page === item.id;
          const Icon = item.icon;

          return (
            <motion.button
              key={item.id}
              onClick={() => { onNavigate(item.id); onPlayNav(); }}
              className="relative flex items-center rounded-[14px] transition-all w-full"
              style={{
                gap: collapsed ? 0 : 10,
                padding: collapsed ? '9px 0' : '9px 12px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                minHeight: 40,
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
            >
              {/* Active background pill */}
              {isActive && (
                <motion.div
                  layoutId="sidebarActive"
                  className="absolute inset-0 rounded-[14px]"
                  style={{
                    background: isDark
                      ? `linear-gradient(135deg, ${item.color}22 0%, ${item.color}12 100%)`
                      : `linear-gradient(135deg, ${item.color}18 0%, ${item.color}0a 100%)`,
                    border: `1px solid ${item.color}30`,
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              {/* Hover glow */}
              {!isActive && (
                <motion.div
                  className="absolute inset-0 rounded-[14px] opacity-0"
                  whileHover={{ opacity: 1 }}
                  style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}
                />
              )}

              {/* Icon */}
              <motion.div
                className="relative flex-shrink-0"
                animate={{ color: isActive ? item.color : isDark ? 'rgba(180,180,210,0.5)' : 'rgba(100,100,140,0.55)' }}
                transition={{ duration: 0.2 }}
              >
                <Icon size={16} strokeWidth={isActive ? 2.2 : 1.8} />
                {/* Active dot */}
                {isActive && (
                  <motion.div
                    className="absolute -right-0.5 -top-0.5 w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500 }}
                  />
                )}
              </motion.div>

              {/* Label */}
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.16 }}
                    className="relative text-[13px] font-medium whitespace-nowrap"
                    style={{
                      color: isActive
                        ? isDark ? '#e0e0f4' : '#1a1a2e'
                        : isDark ? 'rgba(180,180,210,0.55)' : 'rgba(100,100,140,0.65)',
                      fontWeight: isActive ? 600 : 500,
                    }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}

        {/* Divider + Collapse toggle */}
        <div
          className="w-8 h-px mt-2 mb-1"
          style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}
        />
        <motion.button
          onClick={() => setCollapsed(p => !p)}
          className="flex items-center justify-center w-7 h-7 rounded-xl transition-colors"
          style={{
            color: isDark ? 'rgba(180,180,210,0.35)' : 'rgba(120,120,150,0.4)',
            backgroundColor: 'transparent',
          }}
          whileHover={{ scale: 1.12, backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }}
          whileTap={{ scale: 0.9 }}
        >
          <AnimatePresence mode="wait">
            {collapsed ? (
              <motion.div key="right" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <ChevronRight size={12} />
              </motion.div>
            ) : (
              <motion.div key="left" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <ChevronLeft size={12} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

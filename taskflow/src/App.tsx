import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from './hooks/useAppStore';
import { useTasks } from './hooks/useTasks';
import { useNotes } from './hooks/useNotes';
import { useSound } from './hooks/useSound';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { TaskInput } from './components/TaskInput';
import { TaskList } from './components/TaskList';
import { ProgressBar } from './components/ProgressBar';
import { NotesView } from './components/NotesView';
import { DashboardView } from './components/DashboardView';
import { FocusView } from './components/FocusView';
import { AnalyticsView } from './components/AnalyticsView';
import { SettingsView } from './components/SettingsView';
import type { AppPage } from './types';

const PAGE_TRANSITIONS = {
  initial: { opacity: 0, y: 12, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit:    { opacity: 0, y: -8, scale: 0.99 },
};

export default function App() {
  const { isDark, soundEnabled, page, streak, focusMinutes, toggleTheme, toggleSound, setPage, addFocusMinutes } = useAppStore();
  const tasks = useTasks();
  const notes = useNotes();
  const { play } = useSound(soundEnabled);

  const handleNavigate = (p: AppPage) => {
    play('nav');
    setPage(p);
  };

  // Wrap task mutations with sound
  const handleAddTask = (...args: Parameters<typeof tasks.addTask>) => {
    tasks.addTask(...args);
    play('create');
  };
  const handleToggleTask = (id: string) => {
    const task = tasks.allTasks.find(t => t.id === id);
    tasks.toggleTask(id);
    if (task && !task.completed) play('complete');
    else play('nav');
  };
  const handleDeleteTask = (id: string) => {
    tasks.deleteTask(id);
    play('delete');
  };
  const handleReorderTasks = (activeId: string, overId: string) => {
    tasks.reorderTasks(activeId, overId);
    play('drop');
  };

  const noiseOpacity = isDark ? 0.6 : 0.3;

  return (
    <div
      className={isDark ? 'bg-app-dark' : 'bg-app-light'}
      style={{ minHeight: '100vh', fontFamily: 'var(--font-sans)' }}
    >
      {/* Noise grain */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: noiseOpacity,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
      }} />

      {/* Floating sidebar */}
      <Sidebar
        page={page}
        isDark={isDark}
        onNavigate={handleNavigate}
        onPlayNav={() => play('nav')}
      />

      {/* Main content — stays centered, same maxWidth as before */}
      <div className="relative z-10 mx-auto px-4 py-10" style={{ maxWidth: 560 }}>
        <AnimatePresence mode="wait">
          {page === 'dashboard' && (
            <motion.div key="dashboard" {...PAGE_TRANSITIONS} transition={{ type: 'spring', stiffness: 380, damping: 30 }}>
              <DashboardView
                isDark={isDark}
                streak={streak}
                focusMinutes={focusMinutes}
                taskStats={tasks.stats}
                noteCount={notes.allNotes.length}
                onNavigate={(p) => handleNavigate(p)}
              />
            </motion.div>
          )}

          {page === 'tasks' && (
            <motion.div key="tasks" {...PAGE_TRANSITIONS} transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              className="flex flex-col gap-5">
              <Header
                filter={tasks.filter}
                search={tasks.search}
                completedCount={tasks.stats.completed}
                onFilterChange={tasks.setFilter}
                onSearchChange={tasks.setSearch}
                onClearCompleted={tasks.clearCompleted}
                isDark={isDark}
              />
              {tasks.stats.total > 0 && (
                <ProgressBar
                  percentage={tasks.stats.percentage}
                  total={tasks.stats.total}
                  completed={tasks.stats.completed}
                  isDark={isDark}
                />
              )}
              <TaskInput onAdd={handleAddTask} isDark={isDark} />
              <TaskList
                tasks={tasks.tasks}
                filter={tasks.filter}
                hasSearch={!!tasks.search}
                isDark={isDark}
                onToggle={handleToggleTask}
                onUpdate={tasks.updateTask}
                onDelete={handleDeleteTask}
                onReorder={handleReorderTasks}
              />
            </motion.div>
          )}

          {page === 'notes' && (
            <motion.div key="notes" {...PAGE_TRANSITIONS} transition={{ type: 'spring', stiffness: 380, damping: 30 }}>
              <NotesView isDark={isDark} />
            </motion.div>
          )}

          {page === 'focus' && (
            <motion.div key="focus" {...PAGE_TRANSITIONS} transition={{ type: 'spring', stiffness: 380, damping: 30 }}>
              <FocusView
                isDark={isDark}
                onFocusComplete={addFocusMinutes}
                onPlaySound={play}
              />
            </motion.div>
          )}

          {page === 'analytics' && (
            <motion.div key="analytics" {...PAGE_TRANSITIONS} transition={{ type: 'spring', stiffness: 380, damping: 30 }}>
              <AnalyticsView isDark={isDark} tasks={tasks.allTasks} />
            </motion.div>
          )}

          {page === 'settings' && (
            <motion.div key="settings" {...PAGE_TRANSITIONS} transition={{ type: 'spring', stiffness: 380, damping: 30 }}>
              <SettingsView
                isDark={isDark}
                soundEnabled={soundEnabled}
                onToggleTheme={toggleTheme}
                onToggleSound={toggleSound}
                taskCount={tasks.allTasks.length}
                noteCount={notes.allNotes.length}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

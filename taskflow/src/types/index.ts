export type Priority = 'low' | 'medium' | 'high';
export type Filter = 'all' | 'active' | 'completed';
export type AppPage = 'dashboard' | 'tasks' | 'notes' | 'focus' | 'analytics' | 'settings';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  dueDate?: string;
  createdAt: string;
  order: number;
}

export interface TaskStore {
  tasks: Task[];
  filter: Filter;
  search: string;
  theme: 'light' | 'dark';
}

export interface Note {
  id: string;
  title: string;
  body: string;
  pinned: boolean;
  color: NoteColor;
  createdAt: string;
  updatedAt: string;
}

export type NoteColor = 'default' | 'rose' | 'amber' | 'emerald' | 'sky' | 'violet';

export interface FocusSession {
  id: string;
  durationMinutes: number;
  completedAt: string;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  soundEnabled: boolean;
  sidebarCollapsed: boolean;
}

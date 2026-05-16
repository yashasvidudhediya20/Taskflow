import { AnimatePresence, motion } from 'framer-motion';
import {
  DndContext, DragOverlay,
  PointerSensor, useSensor, useSensors, closestCenter
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useState } from 'react';
import type { Task, Filter } from '../types';
import { TaskCard } from './TaskCard';
import { EmptyState } from './EmptyState';

interface TaskListProps {
  tasks: Task[];
  filter: Filter;
  hasSearch: boolean;
  isDark: boolean;
  onToggle: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
  onReorder: (activeId: string, overId: string) => void;
}

export function TaskList({
  tasks, filter, hasSearch, isDark,
  onToggle, onUpdate, onDelete, onReorder
}: TaskListProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const handleDragStart = (e: DragStartEvent) => setActiveId(e.active.id as string);
  const handleDragEnd = (e: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = e;
    if (over && active.id !== over.id) {
      onReorder(active.id as string, over.id as string);
    }
  };

  const activeTask = tasks.find(t => t.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <motion.div className="flex flex-col gap-2" layout>
          <AnimatePresence mode="popLayout">
            {tasks.length === 0 ? (
              <EmptyState key="empty" filter={filter} hasSearch={hasSearch} isDark={isDark} />
            ) : (
              tasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={onToggle}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                  isDark={isDark}
                />
              ))
            )}
          </AnimatePresence>
        </motion.div>
      </SortableContext>

      <DragOverlay>
        {activeTask && (
          <div className="drag-overlay" style={{ transform: 'rotate(1.5deg) scale(1.03)' }}>
            <TaskCard
              task={activeTask}
              onToggle={() => {}}
              onUpdate={() => {}}
              onDelete={() => {}}
              isDark={isDark}
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

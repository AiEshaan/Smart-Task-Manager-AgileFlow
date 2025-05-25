'use client';

import type { Task, TaskStatus } from '@/types';
import { TaskCard } from './TaskCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface KanbanColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTaskStatus: (taskId: string, status: TaskStatus) => void;
}

export function KanbanColumn({ title, status, tasks, onEditTask, onDeleteTask, onUpdateTaskStatus }: KanbanColumnProps) {
  const columnTasks = tasks.filter(task => task.status === status);

  return (
    <Card className="flex-1 min-w-[300px] h-full flex flex-col bg-secondary/50 shadow-sm">
      <CardHeader className="py-3 px-4 border-b">
        <CardTitle className="text-lg font-medium capitalize">{title} ({columnTasks.length})</CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex-1 overflow-y-auto">
        {columnTasks.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">No tasks here.</p>
        )}
        {columnTasks.map(task => (
          <TaskCard 
            key={task.id} 
            task={task} 
            onEditTask={onEditTask} 
            onDeleteTask={onDeleteTask}
            onUpdateTaskStatus={onUpdateTaskStatus}
          />
        ))}
      </CardContent>
    </Card>
  );
}

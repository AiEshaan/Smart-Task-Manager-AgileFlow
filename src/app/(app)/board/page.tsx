
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { KanbanColumn } from '@/components/tasks/KanbanColumn';
import { AddTaskDialog } from '@/components/tasks/AddTaskDialog';
import type { Task, TaskStatus } from '@/types';
import { MOCK_TASKS } from '@/data/mock';
import { TASK_STATUSES } from '@/lib/constants';

const statusDisplayNames: Record<TaskStatus, string> = {
  [TASK_STATUSES.TODO]: "To Do",
  [TASK_STATUSES.IN_PROGRESS]: "In Progress",
  [TASK_STATUSES.DONE]: "Done",
};

export default function TaskBoardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  useEffect(() => {
    // Simulate fetching tasks
    setTasks(MOCK_TASKS);
  }, []);

  const handleOpenDialog = (task?: Task) => {
    setTaskToEdit(task || null);
    setIsDialogOpen(true);
  };

  const handleSaveTask = (task: Task) => {
    setTasks(prevTasks => {
      const existingTaskIndex = prevTasks.findIndex(t => t.id === task.id);
      if (existingTaskIndex > -1) {
        const updatedTasks = [...prevTasks];
        updatedTasks[existingTaskIndex] = task;
        return updatedTasks;
      }
      return [...prevTasks, task];
    });
    // In a real app, you would also save to a backend here
    // For MOCK_TASKS, we can update it if needed for other components to see, but state is king here.
    const mockTaskIndex = MOCK_TASKS.findIndex(t => t.id === task.id);
    if (mockTaskIndex > -1) MOCK_TASKS[mockTaskIndex] = task;
    else MOCK_TASKS.push(task);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
    const mockTaskIndex = MOCK_TASKS.findIndex(t => t.id === taskId);
    if (mockTaskIndex > -1) MOCK_TASKS.splice(mockTaskIndex, 1);
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus, updatedAt: new Date().toISOString() } : task
      )
    );
    const mockTaskIndex = MOCK_TASKS.findIndex(t => t.id === taskId);
    if (mockTaskIndex > -1) MOCK_TASKS[mockTaskIndex].status = newStatus;
  };
  
  const columnOrder: TaskStatus[] = [TASK_STATUSES.TODO, TASK_STATUSES.IN_PROGRESS, TASK_STATUSES.DONE];

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">Task Board</h1>
        <Button onClick={() => handleOpenDialog()} className="shadow-md">
          <PlusCircle className="mr-2 h-5 w-5" /> Add Task
        </Button>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-x-auto pb-4">
        {columnOrder.map(statusKey => {
            return (
                 <KanbanColumn
                    key={statusKey}
                    title={statusDisplayNames[statusKey] || statusKey.replace('_', ' ')}
                    status={statusKey}
                    tasks={tasks}
                    onEditTask={handleOpenDialog}
                    onDeleteTask={handleDeleteTask}
                    onUpdateTaskStatus={handleUpdateTaskStatus}
                />
            );
        })}
      </div>

      <AddTaskDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSaveTask={handleSaveTask}
        taskToEdit={taskToEdit}
      />
    </div>
  );
}

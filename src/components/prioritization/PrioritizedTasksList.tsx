'use client';

import type { PrioritizedTaskOutput, TaskPriority } from '@/types';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, MinusCircle, ListChecks } from 'lucide-react';
import { TASK_PRIORITIES } from '@/lib/constants';


const priorityIcons: Record<TaskPriority, React.ReactNode | undefined> = {
  [TASK_PRIORITIES.HIGH]: <AlertTriangle className="h-4 w-4 mr-1.5 text-red-500" />,
  'High': <AlertTriangle className="h-4 w-4 mr-1.5 text-red-500" />,
  [TASK_PRIORITIES.MEDIUM]: <MinusCircle className="h-4 w-4 mr-1.5 text-yellow-500" />,
  'Medium': <MinusCircle className="h-4 w-4 mr-1.5 text-yellow-500" />,
  [TASK_PRIORITIES.LOW]: <CheckCircle className="h-4 w-4 mr-1.5 text-green-500" />,
  'Low': <CheckCircle className="h-4 w-4 mr-1.5 text-green-500" />,
};

const priorityBadgeVariant = (priority: TaskPriority) => {
  const p = priority.toLowerCase();
  if (p === TASK_PRIORITIES.HIGH) return 'destructive';
  if (p === TASK_PRIORITIES.MEDIUM) return 'secondary'; // You might want a custom 'warning' variant
  if (p === TASK_PRIORITIES.LOW) return 'default'; // You might want a custom 'success' variant
  return 'outline';
};


interface PrioritizedTasksListProps {
  prioritizedTasks: PrioritizedTaskOutput[];
  originalTasks: { id: string; description: string }[];
}

export function PrioritizedTasksList({ prioritizedTasks, originalTasks }: PrioritizedTasksListProps) {
  if (!prioritizedTasks || prioritizedTasks.length === 0) {
    return null;
  }

  // Sort tasks by AI priority: High > Medium > Low
  const sortedTasks = [...prioritizedTasks].sort((a, b) => {
    const priorityOrder = { [TASK_PRIORITIES.HIGH.toLowerCase()]: 1, 'high': 1, [TASK_PRIORITIES.MEDIUM.toLowerCase()]: 2, 'medium': 2, [TASK_PRIORITIES.LOW.toLowerCase()]: 3, 'low': 3 };
    return (priorityOrder[a.priority.toLowerCase() as keyof typeof priorityOrder] || 4) - (priorityOrder[b.priority.toLowerCase() as keyof typeof priorityOrder] || 4);
  });

  return (
    <Card className="mt-8 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2"><ListChecks className="text-primary h-7 w-7" /> AI Prioritization Results</CardTitle>
        <CardDescription>Tasks ordered by AI-suggested priority.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {sortedTasks.map((task) => {
            const originalTask = originalTasks.find(ot => ot.id === task.id);
            return (
              <li key={task.id} className="p-4 border rounded-lg bg-card shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-lg text-foreground break-words">
                    {originalTask?.description || `Task ID: ${task.id}`}
                  </h3>
                  <Badge variant={priorityBadgeVariant(task.priority)} className="capitalize whitespace-nowrap ml-2 flex items-center">
                     {priorityIcons[task.priority] || priorityIcons[task.priority.toLowerCase() as TaskPriority]}
                    {task.priority}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground italic">
                  <strong className="not-italic">Reason:</strong> {task.reason}
                </p>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}

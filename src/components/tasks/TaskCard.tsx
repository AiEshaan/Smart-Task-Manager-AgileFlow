'use client';

import type { Task, User, TaskStatus, TaskPriority } from '@/types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, UserCircle, CalendarDays, AlertTriangle, CheckCircle, MinusCircle } from 'lucide-react';
import { MOCK_USERS } from '@/data/mock'; // For assignee lookup
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TASK_STATUSES, TASK_PRIORITIES } from '@/lib/constants';

interface TaskCardProps {
  task: Task;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTaskStatus: (taskId: string, status: TaskStatus) => void;
}

const priorityIcons: Record<TaskPriority, React.ReactNode | undefined> = {
  [TASK_PRIORITIES.HIGH]: <AlertTriangle className="h-4 w-4 text-red-500" />,
  [TASK_PRIORITIES.MEDIUM]: <MinusCircle className="h-4 w-4 text-yellow-500" />,
  [TASK_PRIORITIES.LOW]: <CheckCircle className="h-4 w-4 text-green-500" />,
};

const priorityColors: Record<TaskPriority, string> = {
  [TASK_PRIORITIES.HIGH]: 'bg-red-500/20 text-red-700 border-red-500/50',
  [TASK_PRIORITIES.MEDIUM]: 'bg-yellow-500/20 text-yellow-700 border-yellow-500/50',
  [TASK_PRIORITIES.LOW]: 'bg-green-500/20 text-green-700 border-green-500/50',
}

export function TaskCard({ task, onEditTask, onDeleteTask, onUpdateTaskStatus }: TaskCardProps) {
  const assignee = MOCK_USERS.find(user => user.id === task.assigneeId);

  const handleStatusChange = (newStatus: string) => {
    onUpdateTaskStatus(task.id, newStatus as TaskStatus);
  };

  return (
    <Card className="mb-4 shadow-md hover:shadow-lg transition-shadow duration-200 bg-card">
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base font-semibold leading-tight">{task.title}</CardTitle>
          {task.priority && (
             <Badge variant="outline" className={`capitalize ${priorityColors[task.priority as TaskPriority] || 'border-border'}`}>
              {priorityIcons[task.priority as TaskPriority]}
              <span className="ml-1">{task.priority}</span>
            </Badge>
          )}
        </div>
      </CardHeader>
      {task.description && (
        <CardContent className="py-2 px-4 text-sm text-muted-foreground">
          <p className="line-clamp-2">{task.description}</p>
        </CardContent>
      )}
      <CardFooter className="py-3 px-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {assignee ? (
            <Avatar className="h-6 w-6">
              <AvatarImage src={assignee.avatarUrl} alt={assignee.name} data-ai-hint="person portrait" />
              <AvatarFallback>{assignee.name.substring(0, 1)}</AvatarFallback>
            </Avatar>
          ) : (
            <UserCircle className="h-5 w-5" />
          )}
          <span>{assignee ? assignee.name : 'Unassigned'}</span>
          {task.dueDate && (
            <>
              <span className="mx-1">·</span>
              <CalendarDays className="h-4 w-4" />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-1 w-full sm:w-auto mt-2 sm:mt-0">
          <Select value={task.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="h-8 text-xs w-full sm:w-auto flex-grow min-w-[100px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(TASK_STATUSES).map(status => (
                <SelectItem key={status} value={status} className="capitalize text-xs">
                  {status.replace('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEditTask(task)}>
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => onDeleteTask(task.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

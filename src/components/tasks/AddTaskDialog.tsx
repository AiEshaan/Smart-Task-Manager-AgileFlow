'use client';

import { useState, useEffect } from 'react';
import type { Task, User, Project, TaskStatus, TaskPriority } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { MOCK_USERS, MOCK_PROJECTS } from '@/data/mock';
import { TASK_STATUSES, TASK_PRIORITIES } from '@/lib/constants';

interface AddTaskDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSaveTask: (task: Task) => void;
  taskToEdit?: Task | null;
  projects?: Project[];
  users?: User[];
}

const initialTaskState: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
  title: '',
  description: '',
  status: TASK_STATUSES.TODO as TaskStatus,
  priority: TASK_PRIORITIES.MEDIUM as TaskPriority,
  assigneeId: undefined,
  dueDate: undefined,
  projectId: undefined,
  projectGoals: '',
};

export function AddTaskDialog({
  isOpen,
  onOpenChange,
  onSaveTask,
  taskToEdit,
  projects = MOCK_PROJECTS,
  users = MOCK_USERS,
}: AddTaskDialogProps) {
  const [taskData, setTaskData] = useState<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>(initialTaskState);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (taskToEdit) {
      setTaskData({
        title: taskToEdit.title,
        description: taskToEdit.description || '',
        status: taskToEdit.status,
        priority: taskToEdit.priority || (TASK_PRIORITIES.MEDIUM as TaskPriority),
        assigneeId: taskToEdit.assigneeId,
        dueDate: taskToEdit.dueDate,
        projectId: taskToEdit.projectId,
        projectGoals: taskToEdit.projectGoals || projects.find(p => p.id === taskToEdit.projectId)?.goals || '',
      });
      setDueDate(taskToEdit.dueDate ? new Date(taskToEdit.dueDate) : undefined);
    } else {
      setTaskData(initialTaskState);
      setDueDate(undefined);
    }
  }, [taskToEdit, isOpen, projects]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTaskData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof Task, value: string) => {
    setTaskData(prev => ({ ...prev, [name]: value }));
    if (name === 'projectId') {
        const selectedProject = projects.find(p => p.id === value);
        setTaskData(prev => ({ ...prev, projectGoals: selectedProject?.goals || '' }));
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setDueDate(date);
    setTaskData(prev => ({ ...prev, dueDate: date?.toISOString() }));
  };

  const handleSubmit = () => {
    if (!taskData.title) {
      // Basic validation
      alert('Title is required.');
      return;
    }
    const now = new Date().toISOString();
    const finalTask: Task = {
      ...taskData,
      id: taskToEdit ? taskToEdit.id : `task-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      createdAt: taskToEdit ? taskToEdit.createdAt : now,
      updatedAt: now,
    };
    onSaveTask(finalTask);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{taskToEdit ? 'Edit Task' : 'Add New Task'}</DialogTitle>
          <DialogDescription>
            {taskToEdit ? 'Update the details of your task.' : 'Fill in the details for your new task.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">Title</Label>
            <Input id="title" name="title" value={taskData.title} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <Textarea id="description" name="description" value={taskData.description} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">Status</Label>
            <Select name="status" value={taskData.status} onValueChange={(value) => handleSelectChange('status', value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(TASK_STATUSES).map(status => (
                  <SelectItem key={status} value={status} className="capitalize">{status.replace('_', ' ')}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right">Priority</Label>
            <Select name="priority" value={taskData.priority} onValueChange={(value) => handleSelectChange('priority', value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(TASK_PRIORITIES).map(priority => (
                  <SelectItem key={priority} value={priority} className="capitalize">{priority}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="assigneeId" className="text-right">Assignee</Label>
            <Select name="assigneeId" value={taskData.assigneeId} onValueChange={(value) => handleSelectChange('assigneeId', value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Unassigned</SelectItem>
                {users.map(user => (
                  <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dueDate" className="text-right">Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "col-span-3 justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={handleDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="projectId" className="text-right">Project</Label>
            <Select name="projectId" value={taskData.projectId} onValueChange={(value) => handleSelectChange('projectId', value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                 <SelectItem value="">None</SelectItem>
                {projects.map(project => (
                  <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
           {taskData.projectId && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="projectGoals" className="text-right">Project Goals</Label>
              <Textarea id="projectGoals" name="projectGoals" value={taskData.projectGoals} onChange={handleChange} className="col-span-3" placeholder="Project goals (for AI prioritization)" />
            </div>
           )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={handleSubmit}>Save Task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

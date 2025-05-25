'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { PlusCircle, Trash2, Lightbulb } from 'lucide-react';
import type { PrioritizationTaskInput } from '@/types';
import { MOCK_PROJECTS } from '@/data/mock';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PrioritizationFormProps {
  onSubmit: (tasks: PrioritizationTaskInput[], projectGoals: string) => void;
  isLoading: boolean;
}

const createNewTaskInput = (): PrioritizationTaskInput => ({
  id: `temp-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  description: '',
  deadline: '',
  projectGoals: '', // This will be set globally for the batch
});

export function PrioritizationForm({ onSubmit, isLoading }: PrioritizationFormProps) {
  const [tasks, setTasks] = useState<PrioritizationTaskInput[]>([createNewTaskInput()]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(MOCK_PROJECTS[0]?.id || '');
  const [projectGoals, setProjectGoals] = useState<string>(MOCK_PROJECTS[0]?.goals || '');

  useEffect(() => {
    const selectedProject = MOCK_PROJECTS.find(p => p.id === selectedProjectId);
    setProjectGoals(selectedProject?.goals || '');
  }, [selectedProjectId]);

  const handleTaskChange = (index: number, field: keyof Omit<PrioritizationTaskInput, 'id' | 'projectGoals'>, value: string) => {
    const newTasks = [...tasks];
    newTasks[index] = { ...newTasks[index], [field]: value };
    setTasks(newTasks);
  };

  const addTask = () => {
    setTasks([...tasks, createNewTaskInput()]);
  };

  const removeTask = (index: number) => {
    if (tasks.length <= 1) return; // Keep at least one task
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tasksWithGoals = tasks.map(task => ({...task, projectGoals}));
    onSubmit(tasksWithGoals, projectGoals);
  };
  
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2"><Lightbulb className="text-primary h-7 w-7" /> AI Task Prioritization</CardTitle>
        <CardDescription>Input your tasks and project goals. The AI will help you prioritize them.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="projectSelect" className="text-base font-medium">Select Project (for Goals)</Label>
             <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
              <SelectTrigger id="projectSelect" className="mt-1">
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {MOCK_PROJECTS.map(project => (
                  <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="projectGoals" className="text-base font-medium">Project Goals</Label>
            <Textarea
              id="projectGoals"
              value={projectGoals}
              onChange={(e) => setProjectGoals(e.target.value)}
              placeholder="e.g., Launch V2 by end of Q3, Improve user retention by 15%"
              className="mt-1 min-h-[80px]"
              required
            />
          </div>

          <div className="space-y-4">
            <Label className="text-base font-medium">Tasks to Prioritize</Label>
            {tasks.map((task, index) => (
              <Card key={task.id} className="p-4 bg-secondary/30 space-y-3">
                <div className="flex justify-between items-center">
                  <p className="font-medium text-sm">Task {index + 1}</p>
                  {tasks.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeTask(index)} className="text-destructive hover:text-destructive h-7 w-7">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div>
                  <Label htmlFor={`task-desc-${index}`} className="text-xs">Description</Label>
                  <Textarea
                    id={`task-desc-${index}`}
                    value={task.description}
                    onChange={(e) => handleTaskChange(index, 'description', e.target.value)}
                    placeholder="Detailed task description"
                    className="mt-1 text-sm"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor={`task-deadline-${index}`} className="text-xs">Deadline (YYYY-MM-DD)</Label>
                  <Input
                    id={`task-deadline-${index}`}
                    type="date"
                    value={task.deadline ? task.deadline.split('T')[0] : ''} // Handle ISO string if present, otherwise expect YYYY-MM-DD
                    onChange={(e) => handleTaskChange(index, 'deadline', e.target.value ? new Date(e.target.value).toISOString() : '')}
                    className="mt-1 text-sm"
                    required
                  />
                </div>
              </Card>
            ))}
            <Button type="button" variant="outline" onClick={addTask} className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Another Task
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading} className="w-full text-base py-3">
            {isLoading ? 'Prioritizing...' : 'Prioritize Tasks with AI'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

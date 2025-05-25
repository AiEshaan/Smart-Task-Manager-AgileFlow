'use client';

import { useState } from 'react';
import { PrioritizationForm } from '@/components/prioritization/PrioritizationForm';
import { PrioritizedTasksList } from '@/components/prioritization/PrioritizedTasksList';
import type { PrioritizationTaskInput, PrioritizedTaskOutput } from '@/types';
import { prioritizeTasks } from '@/ai/flows/smart-prioritization'; // Ensure this path is correct
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


export default function SmartPrioritizationPage() {
  const [prioritizedTasksResult, setPrioritizedTasksResult] = useState<PrioritizedTaskOutput[]>([]);
  const [originalTasksInput, setOriginalTasksInput] = useState<PrioritizationTaskInput[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmitPrioritization = async (tasksToPrioritize: PrioritizationTaskInput[], projectGoals: string) => {
    setIsLoading(true);
    setError(null);
    setPrioritizedTasksResult([]); // Clear previous results
    setOriginalTasksInput(tasksToPrioritize); // Store original descriptions for display

    try {
      // The AI flow expects projectGoals within each task object for the prompt structure.
      // We've already added projectGoals to each task in PrioritizationForm.
      const inputForAI = { tasks: tasksToPrioritize };
      
      const result = await prioritizeTasks(inputForAI);
      
      if (result && result.prioritizedTasks) {
        setPrioritizedTasksResult(result.prioritizedTasks);
        toast({
          title: "Prioritization Complete!",
          description: "AI has successfully prioritized your tasks.",
        });
      } else {
        throw new Error("AI prioritization failed to return expected results.");
      }
    } catch (err: any) {
      console.error("Error during AI prioritization:", err);
      const errorMessage = err.message || "An unexpected error occurred during AI prioritization.";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Prioritization Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Smart Task Prioritization</h1>
        <p className="text-muted-foreground">
          Let AI help you decide what to focus on next based on your project goals and task deadlines.
        </p>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <PrioritizationForm onSubmit={handleSubmitPrioritization} isLoading={isLoading} />

      {prioritizedTasksResult.length > 0 && !isLoading && (
        <PrioritizedTasksList 
          prioritizedTasks={prioritizedTasksResult}
          originalTasks={originalTasksInput.map(t => ({ id: t.id, description: t.description }))}
        />
      )}
    </div>
  );
}

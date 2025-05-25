'use server';
/**
 * @fileOverview Implements AI-powered task prioritization based on deadlines and project goals.
 *
 * - prioritizeTasks - A function that prioritizes tasks.
 * - PrioritizeTasksInput - The input type for the prioritizeTasks function.
 * - PrioritizeTasksOutput - The return type for the prioritizeTasks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PrioritizeTasksInputSchema = z.object({
  tasks: z
    .array(
      z.object({
        id: z.string().describe('Unique identifier for the task.'),
        description: z.string().describe('Detailed description of the task.'),
        deadline: z.string().describe('The deadline for the task (ISO format).'),
        projectGoals: z.string().describe('The high-level goals for the project.'),
      })
    )
    .describe('Array of tasks to prioritize.'),
});
export type PrioritizeTasksInput = z.infer<typeof PrioritizeTasksInputSchema>;

const PrioritizeTasksOutputSchema = z.object({
  prioritizedTasks: z
    .array(
      z.object({
        id: z.string().describe('The id of the task'),
        priority: z
          .string()
          .describe(
            'The priority of the task, which could be High, Medium, or Low. Consider project goals and deadlines.'
          ),
        reason: z.string().describe('The reason for the assigned priority.'),
      })
    )
    .describe('List of tasks with assigned priorities and reasons.'),
});
export type PrioritizeTasksOutput = z.infer<typeof PrioritizeTasksOutputSchema>;

export async function prioritizeTasks(input: PrioritizeTasksInput): Promise<PrioritizeTasksOutput> {
  return prioritizeTasksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'prioritizeTasksPrompt',
  input: {schema: PrioritizeTasksInputSchema},
  output: {schema: PrioritizeTasksOutputSchema},
  prompt: `You are a project management assistant. Prioritize the following tasks based on their deadlines and project goals.

Project Goals: {{{tasks.0.projectGoals}}}

Tasks:
{{#each tasks}}
- ID: {{this.id}}
  Description: {{this.description}}
  Deadline: {{this.deadline}}
{{/each}}

Prioritize the tasks considering the project goals and deadlines. Return a priority (High, Medium, or Low) and a reason for each task.
Make sure that ALL tasks are returned.

Output should be in JSON format.
`, // Added handlebars template
});

const prioritizeTasksFlow = ai.defineFlow(
  {
    name: 'prioritizeTasksFlow',
    inputSchema: PrioritizeTasksInputSchema,
    outputSchema: PrioritizeTasksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

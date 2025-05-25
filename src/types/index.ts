import type { LucideIcon } from 'lucide-react';

export type TaskStatus = 'todo' | 'inprogress' | 'done';
export type TaskPriority = 'high' | 'medium' | 'low' | string; // string for AI output flexibility

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string;
  dueDate?: string; // ISO string
  projectId?: string;
  projectGoals?: string; // For AI prioritization context
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface Project {
  id: string;
  name: string;
  goals: string;
}

export interface User {
  id: string;
  name: string;
  avatarUrl?: string; // URL to an avatar image
}

export interface Note {
  id: string;
  title: string;
  content: string; // Markdown content
  taskId?: string; // Optional: link note to a task
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  disabled?: boolean;
}

// For AI Prioritization
export interface PrioritizationTaskInput {
  id: string;
  description: string;
  deadline: string; // ISO format
  projectGoals: string;
}

export interface PrioritizedTaskOutput {
  id: string;
  priority: TaskPriority;
  reason: string;
}

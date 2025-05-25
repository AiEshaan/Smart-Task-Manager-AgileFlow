import type { NavItem } from '@/types';
import { LayoutDashboard, Kanban, StickyNote, Lightbulb, Settings } from 'lucide-react';

export const APP_NAME = 'AgileFlow';

export const NAV_ITEMS: NavItem[] = [
  { href: '/board', label: 'Task Board', icon: Kanban },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/prioritize', label: 'Smart Prioritize', icon: Lightbulb },
  { href: '/notes', label: 'Markdown Notes', icon: StickyNote },
  // Future: { href: '/settings', label: 'Settings', icon: Settings },
];

export const TASK_STATUSES = {
  TODO: 'todo',
  IN_PROGRESS: 'inprogress',
  DONE: 'done',
} as const;

export const TASK_PRIORITIES = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
} as const;

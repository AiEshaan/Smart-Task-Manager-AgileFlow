import type { Task, User, Project, Note } from '@/types';

export const MOCK_USERS: User[] = [
  { id: 'user-1', name: 'Alice Wonderland', avatarUrl: 'https://placehold.co/100x100.png' },
  { id: 'user-2', name: 'Bob The Builder', avatarUrl: 'https://placehold.co/100x100.png' },
  { id: 'user-3', name: 'Charlie Chaplin', avatarUrl: 'https://placehold.co/100x100.png' },
];

export const MOCK_PROJECTS: Project[] = [
  { id: 'project-1', name: 'DevOps Pipeline Enhancement', goals: 'Streamline CI/CD, reduce deployment time by 20%, improve monitoring.' },
  { id: 'project-2', name: 'Q4 Feature Release', goals: 'Launch new user authentication, revamp dashboard UI, integrate third-party API.' },
];

export const MOCK_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Setup Jenkins CI Server',
    description: 'Install and configure Jenkins on a new EC2 instance for project Alpha.',
    status: 'todo',
    priority: 'high',
    assigneeId: 'user-1',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    projectId: 'project-1',
    projectGoals: MOCK_PROJECTS[0].goals,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    title: 'Design New Dashboard UI',
    description: 'Create Figma mockups for the revamped user dashboard.',
    status: 'inprogress',
    priority: 'medium',
    assigneeId: 'user-2',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
    projectId: 'project-2',
    projectGoals: MOCK_PROJECTS[1].goals,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    title: 'Write Unit Tests for Auth Module',
    description: 'Ensure 90% test coverage for the new authentication service.',
    status: 'todo',
    priority: 'high',
    assigneeId: 'user-3',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    projectId: 'project-2',
    projectGoals: MOCK_PROJECTS[1].goals,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-4',
    title: 'Deploy Staging Environment',
    description: 'Push the latest build to the staging servers for QA testing.',
    status: 'done',
    priority: 'medium',
    assigneeId: 'user-1',
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    projectId: 'project-1',
    projectGoals: MOCK_PROJECTS[0].goals,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-5',
    title: 'Client Demo Preparation',
    description: 'Prepare slides and demo script for Q4 feature presentation.',
    status: 'todo',
    priority: 'low',
    projectId: 'project-2',
    projectGoals: MOCK_PROJECTS[1].goals,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const MOCK_NOTES: Note[] = [
  {
    id: 'note-1',
    title: 'Jenkins Setup Checklist',
    content: `
# Jenkins Setup Steps
- [ ] Provision EC2 instance (t3.medium)
- [ ] Install Java JDK 11
- [ ] Install Jenkins
- [ ] Configure security groups
- [ ] Setup initial admin user
- [ ] Install necessary plugins (Git, Docker, Blue Ocean)
    `,
    taskId: 'task-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'note-2',
    title: 'Dashboard UI Ideas',
    content: `
# Dashboard UI Brainstorm
- Key Metrics: Active Users, Task Completion Rate, Error Rate
- Charts: Line chart for trends, Pie chart for status distribution
- Layout: Customizable widgets
- Color Palette: Follow AgileFlow theme
    `,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

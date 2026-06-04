import { Task } from '../types';

export const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Design Login Page',
    description: 'Create a clean login UI with form validation',
    status: 'Completed',
    dueDate: '2026-05-20',
  },
  {
    id: '2',
    title: 'Setup Next.js Project',
    description: 'Initialize project with TypeScript and Tailwind',
    status: 'Completed',
    dueDate: '2026-05-22',
  },
  {
    id: '3',
    title: 'Build Dashboard Layout',
    description: 'Create responsive dashboard with sidebar and task table',
    status: 'In Progress',
    dueDate: '2026-06-05',
  },
  {
    id: '4',
    title: 'Implement CRUD Operations',
    description: 'Add create, edit, delete and status change for tasks',
    status: 'In Progress',
    dueDate: '2026-06-08',
  },
  {
    id: '5',
    title: 'Add Filtering & Search',
    description: 'Filter by status, sort by due date, search by title',
    status: 'Todo',
    dueDate: '2026-06-10',
  },
  {
    id: '6',
    title: 'Write Unit Tests',
    description: 'Basic unit tests for components',
    status: 'Todo',
    dueDate: '2026-06-12',
  },
];
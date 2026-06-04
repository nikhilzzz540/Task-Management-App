export type Status = 'Todo' | 'In Progress' | 'Completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  dueDate: string;
}

export interface User {
  username: string;
}
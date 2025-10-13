export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'client';
  avatar?: string;
}

export interface Project {
  id: string;
  name: string;
  category: 'web' | 'graphic';
  deadline: string;
  status: 'ongoing' | 'finished';
  clientId: string;
  client: User;
  createdAt: string;
  description: string;
  tasks: Task[];
  payments: Payment[];
  messages: Message[];
}

export interface TaskComment {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  type: 'comment' | 'approval' | 'change_request';
}

export interface Payment {
  id: string;
  projectId: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  quotationUrl?: string;
  receiptUrl?: string;
  dueDate: string;
  paidAt?: string;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  sender: User;
  projectId: string;
  createdAt: string;
  type: 'text' | 'image' | 'document';
  attachmentUrl?: string;
  replyTo?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface TaskComment {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  type: "comment" | "approval" | "change_request";
}

export interface Task {
  _id?: string;
  projectId: string;
  title: string;
  description: string;
  stage: "to do" | "in progress" | "review" | "done";
  createdBy: string;
  createdAt: string;
  comments: TaskComment[];
  attachments?: string[];
}

export interface KanbanBoardProps {
  projectId: string;
}
import { User, Project, Task, Payment, Message } from '../types';

export const dummyUsers: User[] = [
  {
    id: 'admin-1',
    name: 'Sarah Johnson',
    email: 'admin@designstudio.com',
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
  },
  {
    id: 'client-1',
    name: 'Michael Chen',
    email: 'michael@techcorp.com',
    role: 'client',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
  },
  {
    id: 'client-2',
    name: 'Emma Rodriguez',
    email: 'emma@startup.com',
    role: 'client',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
  },
  {
    id: 'client-3',
    name: 'David Wilson',
    email: 'david@ecommerce.com',
    role: 'client',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
  }
];

export const dummyTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Homepage Design',
    description: 'Create modern homepage layout with hero section',
    status: 'in-progress',
    createdBy: 'admin-1',
    createdAt: '2024-01-15T10:00:00Z',
    attachments: ['https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400'],
    comments: [
      {
        id: 'comment-1',
        content: 'Initial design looks great! Can we make the hero section more vibrant?',
        author: 'client-1',
        createdAt: '2024-01-15T14:30:00Z',
        type: 'change_request'
      }
    ]
  },
  {
    id: 'task-2',
    title: 'Brand Logo',
    description: 'Design company logo with modern aesthetic',
    status: 'review',
    createdBy: 'admin-1',
    createdAt: '2024-01-14T09:00:00Z',
    attachments: ['https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=400']
  },
  {
    id: 'task-3',
    title: 'Mobile Optimization',
    description: 'Ensure website works perfectly on mobile devices',
    status: 'todo',
    createdBy: 'client-1',
    createdAt: '2024-01-16T11:00:00Z'
  },
  {
    id: 'task-4',
    title: 'Contact Form',
    description: 'Implement contact form with validation',
    status: 'finished',
    createdBy: 'admin-1',
    createdAt: '2024-01-10T08:00:00Z'
  }
];

export const dummyPayments: Payment[] = [
  {
    id: 'payment-1',
    projectId: 'project-1',
    amount: 2500,
    status: 'paid',
    quotationUrl: '/dummy-quotation.pdf',
    receiptUrl: '/dummy-receipt.pdf',
    dueDate: '2024-01-20T00:00:00Z',
    paidAt: '2024-01-18T10:30:00Z'
  },
  {
    id: 'payment-2',
    projectId: 'project-2',
    amount: 1800,
    status: 'pending',
    quotationUrl: '/dummy-quotation-2.pdf',
    dueDate: '2024-01-25T00:00:00Z'
  }
];

export const dummyMessages: Message[] = [
  {
    id: 'msg-1',
    content: 'Hi! Looking forward to working on this project with you.',
    senderId: 'admin-1',
    sender: dummyUsers[0],
    projectId: 'project-1',
    createdAt: '2024-01-15T09:00:00Z',
    type: 'text'
  },
  {
    id: 'msg-2',
    content: 'Great! I\'ve attached the initial requirements document.',
    senderId: 'client-1',
    sender: dummyUsers[1],
    projectId: 'project-1',
    createdAt: '2024-01-15T09:15:00Z',
    type: 'document',
    attachmentUrl: '/requirements.pdf'
  },
  {
    id: 'msg-3',
    content: 'Perfect! I\'ll review this and get back to you with questions.',
    senderId: 'admin-1',
    sender: dummyUsers[0],
    projectId: 'project-1',
    createdAt: '2024-01-15T09:30:00Z',
    type: 'text'
  }
];

export const dummyProjects: Project[] = [
  {
    id: 'project-1',
    name: 'TechCorp Website Redesign',
    category: 'web',
    deadline: '2024-02-15T00:00:00Z',
    status: 'ongoing',
    clientId: 'client-1',
    client: dummyUsers[1],
    createdAt: '2024-01-10T00:00:00Z',
    description: 'Complete website redesign for TechCorp with modern UI/UX',
    tasks: dummyTasks.slice(0, 3),
    payments: [dummyPayments[0]],
    messages: dummyMessages
  },
  {
    id: 'project-2',
    name: 'Startup Branding Package',
    category: 'graphic',
    deadline: '2024-01-30T00:00:00Z',
    status: 'ongoing',
    clientId: 'client-2',
    client: dummyUsers[2],
    createdAt: '2024-01-12T00:00:00Z',
    description: 'Complete branding package including logo, business cards, and letterhead',
    tasks: [dummyTasks[1]],
    payments: [dummyPayments[1]],
    messages: []
  },
  {
    id: 'project-3',
    name: 'E-commerce Platform',
    category: 'web',
    deadline: '2024-03-01T00:00:00Z',
    status: 'finished',
    clientId: 'client-3',
    client: dummyUsers[3],
    createdAt: '2023-12-01T00:00:00Z',
    description: 'Custom e-commerce platform with payment integration',
    tasks: [dummyTasks[3]],
    payments: [],
    messages: []
  }
];

export const bankDetails = {
  bankName: 'Bank of Ceylone (BOC)',
  accountName: 'GGPM Wijerathne',
  accountNumber: '83777187',
  routingNumber: 'Kandy',
  country: "Sri Lanka",
};
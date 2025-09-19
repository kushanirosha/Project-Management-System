import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Project, Task, Message, Payment } from '../types';
import { dummyProjects } from '../data/dummyData';

interface ProjectContextType {
  projects: Project[];
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
  updateTask: (projectId: string, taskId: string, updates: Partial<Task>) => void;
  addTask: (projectId: string, task: Omit<Task, 'id' | 'createdAt'>) => void;
  addMessage: (projectId: string, message: Omit<Message, 'id' | 'createdAt'>) => void;
  updatePayment: (projectId: string, paymentId: string, updates: Partial<Payment>) => void;
  createProject: (project: Omit<Project, 'id' | 'createdAt' | 'tasks' | 'payments' | 'messages'>) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProject = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(dummyProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const updateTask = (projectId: string, taskId: string, updates: Partial<Task>) => {
    setProjects(prev => prev.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          tasks: project.tasks.map(task =>
            task.id === taskId ? { ...task, ...updates } : task
          )
        };
      }
      return project;
    }));

    if (selectedProject?.id === projectId) {
      setSelectedProject(prev => prev ? {
        ...prev,
        tasks: prev.tasks.map(task =>
          task.id === taskId ? { ...task, ...updates } : task
        )
      } : null);
    }
  };

  const addTask = (projectId: string, task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    setProjects(prev => prev.map(project => {
      if (project.id === projectId) {
        return { ...project, tasks: [...project.tasks, newTask] };
      }
      return project;
    }));

    if (selectedProject?.id === projectId) {
      setSelectedProject(prev => prev ? {
        ...prev,
        tasks: [...prev.tasks, newTask]
      } : null);
    }
  };

  const addMessage = (projectId: string, message: Omit<Message, 'id' | 'createdAt'>) => {
    const newMessage: Message = {
      ...message,
      id: `msg-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    setProjects(prev => prev.map(project => {
      if (project.id === projectId) {
        return { ...project, messages: [...project.messages, newMessage] };
      }
      return project;
    }));

    if (selectedProject?.id === projectId) {
      setSelectedProject(prev => prev ? {
        ...prev,
        messages: [...prev.messages, newMessage]
      } : null);
    }
  };

  const updatePayment = (projectId: string, paymentId: string, updates: Partial<Payment>) => {
    setProjects(prev => prev.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          payments: project.payments.map(payment =>
            payment.id === paymentId ? { ...payment, ...updates } : payment
          )
        };
      }
      return project;
    }));

    if (selectedProject?.id === projectId) {
      setSelectedProject(prev => prev ? {
        ...prev,
        payments: prev.payments.map(payment =>
          payment.id === paymentId ? { ...payment, ...updates } : payment
        )
      } : null);
    }
  };

  const createProject = (project: Omit<Project, 'id' | 'createdAt' | 'tasks' | 'payments' | 'messages'>) => {
    const newProject: Project = {
      ...project,
      id: `project-${Date.now()}`,
      createdAt: new Date().toISOString(),
      tasks: [],
      payments: [],
      messages: []
    };

    setProjects(prev => [...prev, newProject]);
  };

  const contextValue: ProjectContextType = {
    projects,
    selectedProject,
    setSelectedProject,
    updateTask,
    addTask,
    addMessage,
    updatePayment,
    createProject
  };

  return (
    <ProjectContext.Provider value={contextValue}>
      {children}
    </ProjectContext.Provider>
  );
};
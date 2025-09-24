import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Project, Task, Message, Payment } from '../types';
import { useAuth } from './AuthContext';

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
  if (!context) throw new Error('useProject must be used within a ProjectProvider');
  return context;
};

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Fetch projects from backend
  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;
      try {
        const res = await fetch(`http://localhost:5000/api/projects?clientId=${user.id}`);
        const data: Project[] = await res.json();

        // Ensure payments field exists (since database doesn't have it yet)
        const formattedData = data.map(p => ({
          ...p,
          payments: p.payments || [],
          tasks: p.tasks || [],
          messages: p.messages || [],
        }));

        setProjects(formattedData);
      } catch (err) {
        console.error('Failed to fetch projects:', err);
      }
    };

    fetchProjects();
  }, [user]);

  // Fetch all projects (admin dashboard)
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/projects`);
        const data: Project[] = await res.json();

        const formattedData = data.map(p => ({
          ...p,
          payments: p.payments || [],
          tasks: p.tasks || [],
          messages: p.messages || [],
        }));

        setProjects(formattedData);
      } catch (err) {
        console.error('Failed to fetch projects:', err);
      }
    };

    fetchProjects();
  }, []);

  const updateTask = (projectId: string, taskId: string, updates: Partial<Task>) => {
    setProjects(prev => prev.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          tasks: project.tasks.map(task => task.id === taskId ? { ...task, ...updates } : task)
        };
      }
      return project;
    }));

    if (selectedProject?.id === projectId) {
      setSelectedProject(prev => prev ? {
        ...prev,
        tasks: prev.tasks.map(task => task.id === taskId ? { ...task, ...updates } : task)
      } : null);
    }
  };

  const addTask = (projectId: string, task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = { ...task, id: `task-${Date.now()}`, createdAt: new Date().toISOString() };

    setProjects(prev => prev.map(project => {
      if (project.id === projectId) return { ...project, tasks: [...project.tasks, newTask] };
      return project;
    }));

    if (selectedProject?.id === projectId) {
      setSelectedProject(prev => prev ? { ...prev, tasks: [...prev.tasks, newTask] } : null);
    }
  };

  const addMessage = (projectId: string, message: Omit<Message, 'id' | 'createdAt'>) => {
    const newMessage: Message = { ...message, id: `msg-${Date.now()}`, createdAt: new Date().toISOString() };

    setProjects(prev => prev.map(project => {
      if (project.id === projectId) return { ...project, messages: [...project.messages, newMessage] };
      return project;
    }));

    if (selectedProject?.id === projectId) {
      setSelectedProject(prev => prev ? { ...prev, messages: [...prev.messages, newMessage] } : null);
    }
  };

  const updatePayment = (projectId: string, paymentId: string, updates: Partial<Payment>) => {
    setProjects(prev => prev.map(project => {
      if (project.id === projectId) {
        const updatedPayments = project.payments?.map(payment => payment.id === paymentId ? { ...payment, ...updates } : payment) || [];
        return { ...project, payments: updatedPayments };
      }
      return project;
    }));

    if (selectedProject?.id === projectId) {
      const updatedPayments = selectedProject.payments?.map(payment => payment.id === paymentId ? { ...payment, ...updates } : payment) || [];
      setSelectedProject(prev => prev ? { ...prev, payments: updatedPayments } : null);
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

  return (
    <ProjectContext.Provider value={{
      projects,
      selectedProject,
      setSelectedProject,
      updateTask,
      addTask,
      addMessage,
      updatePayment,
      createProject
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

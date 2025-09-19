import React, { useState } from 'react';
import ProjectSidebar from './ProjectSidebar';
import KanbanBoard from './KanbanBoard';
import PaymentTab from './PaymentTab';
import ChatTab from './ChatTab';
import { Project } from '../../types';

interface ProjectDashboardProps {
  project: Project;
  onBack: () => void;
}

const ProjectDashboard: React.FC<ProjectDashboardProps> = ({ project, onBack }) => {
  const [activeTab, setActiveTab] = useState<'project' | 'payment' | 'chat'>('project');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'project':
        return <KanbanBoard projectId={project.id} tasks={project.tasks} />;
      case 'payment':
        return <PaymentTab project={project} />;
      case 'chat':
        return <ChatTab projectId={project.id} messages={project.messages} />;
      default:
        return <KanbanBoard projectId={project.id} tasks={project.tasks} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <ProjectSidebar
        project={project}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onBack={onBack}
      />
      
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#3c405b] capitalize">
                {activeTab === 'project' ? 'Project Management' : activeTab}
              </h1>
              <p className="text-gray-600 mt-1">
                {activeTab === 'project' && 'Manage tasks and track project progress'}
                {activeTab === 'payment' && 'Handle payments and financial tracking'}
                {activeTab === 'chat' && 'Communicate with your team'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 p-8">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;
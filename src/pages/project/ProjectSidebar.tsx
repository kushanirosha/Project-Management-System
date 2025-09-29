import React from 'react';
import { User, Mail, Calendar, Tag, ArrowLeft } from 'lucide-react';
import { Project } from '../../types';
import { useNavigate } from 'react-router-dom';

interface ProjectSidebarProps {
  project: Project;
  activeTab: 'project' | 'payment' | 'chat';
  onTabChange: (tab: 'project' | 'payment' | 'chat') => void;
}

const ProjectSidebar: React.FC<ProjectSidebarProps> = ({ 
  project, 
  activeTab, 
  onTabChange
}) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: 'web' | 'graphic') => {
    return category === 'web' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800';
  };

  const getStatusColor = (status: 'ongoing' | 'finished') => {
    return status === 'ongoing' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  // ✅ Handle back based on role
  const handleBack = () => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (user?.role === "client") {
      navigate("/client-dashboard");
    } else if (user?.role === "admin") {
      navigate("/admin-dashboard");
    } else {
      navigate("/"); // fallback
    }
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <button
          onClick={handleBack}
          className="flex items-center text-gray-600 hover:text-[#3c405b] transition-colors mb-4"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span>Back to Dashboard</span>
        </button>
        
        <h2 className="text-xl font-bold text-[#3c405b] mb-2">{project.name}</h2>
        <div className="flex flex-wrap gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(project.category)}`}>
            {project.category}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
            {project.status}
          </span>
        </div>
      </div>

      {/* Client Details */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-[#2E3453] mb-4 uppercase tracking-wide">
          Client Details
        </h3>
        
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-3">
            {project.client.avatar ? (
              <img
                src={project.client.avatar}
                alt={project.client.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <User className="h-6 w-6 text-gray-400" />
            )}
          </div>
          <div>
            <p className="font-medium text-[#3c405b]">{project.client.name}</p>
            <p className="text-sm text-gray-600">{project.client.role}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="h-4 w-4 mr-3" />
            <span>{project.client.email}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-3" />
            <span>Due: {formatDate(project.deadline)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Tag className="h-4 w-4 mr-3" />
            <span>Started: {formatDate(project.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex-1">
        <nav className="p-4 space-y-1">
          {[
            { id: 'project', label: 'Project', icon: Tag },
            { id: 'payment', label: 'Payment', icon: Calendar },
            { id: 'chat', label: 'Chat', icon: User }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as 'project' | 'payment' | 'chat')}
              className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#3c405b] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="h-5 w-5 mr-3" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Project Description */}
      <div className="p-6 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-[#2E3453] mb-2 uppercase tracking-wide">
          Description
        </h4>
        <p className="text-sm text-gray-600 leading-relaxed">
          {project.description}
        </p>
      </div>
    </div>
  );
};

export default ProjectSidebar;

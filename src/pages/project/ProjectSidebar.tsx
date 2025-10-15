import React from 'react';
import { User, Mail, Calendar, Tag, ArrowLeft, Phone, Clock } from 'lucide-react';
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

  // Calculate project timeline info
  const getProjectTimelineStatus = () => {
    const deadline = new Date(project.deadline);
    const updatedAt = new Date(project.updatedAt);
    const now = new Date();

    if (project.status === 'ongoing') {
      const diffTime = deadline.getTime() - now.getTime();
      const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (remainingDays > 0) {
        return {
          text: `${remainingDays} day${remainingDays > 1 ? 's' : ''} remaining until deadline`,
          color: 'text-green-600',
        };
      } else {
        return {
          text: `Deadline passed ${Math.abs(remainingDays)} day${Math.abs(remainingDays) > 1 ? 's' : ''} ago`,
          color: 'text-red-600',
        };
      }
    }

    if (project.status === 'finished') {
      const diffTime = updatedAt.getTime() - deadline.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        return {
          text: `Completed the project ${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? 's' : ''} before deadline`,
          color: 'text-green-600',
        };
      } else if (diffDays === 0) {
        return {
          text: `Completed the project on the deadline date`,
          color: 'text-blue-600',
        };
      } else {
        return {
          text: `Completed project ${diffDays} day${diffDays > 1 ? 's' : ''} after deadline`,
          color: 'text-orange-600',
        };
      }
    }

    return null;
  };

  const projectTimelineStatus = getProjectTimelineStatus();

  // Handle back navigation based on role
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
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
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
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mr-3 text-white font-bold text-lg">
            {project.client.avatar ? (
              <img
                src={project.client.avatar}
                alt={project.client.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <span>{project.client.name?.charAt(0).toUpperCase()}</span>
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
            <Phone className="h-4 w-4 mr-3" />
            <span>{project.client.phone || "N/A"}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-3" />
            <span>Due: {formatDate(project.deadline)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Tag className="h-4 w-4 mr-3" />
            <span>Started: {formatDate(project.createdAt)}</span>
          </div>

          {/* Project Status Summary */}
          {projectTimelineStatus && (
            <div className="flex items-center text-sm mt-2">
              <Clock className="h-4 w-4 mr-3 text-gray-500" />
              <span className={`${projectTimelineStatus.color} font-medium`}>
                {projectTimelineStatus.text}
              </span>
            </div>
          )}
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
              className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${activeTab === tab.id
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

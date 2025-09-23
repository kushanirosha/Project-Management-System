import React from 'react';
import { Calendar, Folder, Clock, DollarSign } from 'lucide-react';
import { useProject } from '../../contexts/ProjectContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ClientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { projects, setSelectedProject } = useProject();
  const { user } = useAuth();

  const clientProjects = projects.filter(p => p.clientId === user?.id);
  const ongoingProjects = clientProjects.filter(p => p.status === 'ongoing');
  const finishedProjects = clientProjects.filter(p => p.status === 'finished');

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `${diffDays} days left`;
  };

  const getCategoryColor = (category: 'web' | 'graphic') => {
    return category === 'web' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800';
  };

  const getDeadlineColor = (deadline: string) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'text-red-600';
    if (diffDays <= 3) return 'text-orange-600';
    return 'text-green-600';
  };

  const totalAmount = clientProjects.reduce((sum, project) =>
    sum + project.payments.reduce((pSum, payment) => pSum + payment.amount, 0), 0
  );

  const paidAmount = clientProjects.reduce((sum, project) =>
    sum + project.payments.filter(p => p.status === 'paid').reduce((pSum, payment) => pSum + payment.amount, 0), 0
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-3xl font-bold text-[#3c405b]">Welcome back, {user?.name}</h1>
              <p className="text-gray-600 mt-1">Track your projects and collaborate with designers</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <span className="text-blue-600 font-medium">{ongoingProjects.length} Active Projects</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Folder className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">My Projects</p>
                <p className="text-2xl font-bold text-[#3c405b]">{clientProjects.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-[#3c405b]">{ongoingProjects.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-[#3c405b]">{finishedProjects.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Paid</p>
                <p className="text-2xl font-bold text-[#3c405b]">${paidAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Active Projects */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#3c405b] mb-6">Active Projects</h2>
          {ongoingProjects.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
              <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No active projects</h3>
              <p className="text-gray-500">You don't have any ongoing projects at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ongoingProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => {
                    setSelectedProject(project);
                    navigate(`/project-dashboard/${project.id}`);
                  }}
                  className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 cursor-pointer p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-semibold text-[#3c405b] text-lg">{project.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(project.category)}`}>
                      {project.category}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className={getDeadlineColor(project.deadline)}>
                        {formatDeadline(project.deadline)}
                      </span>
                    </div>

                    <div className="pt-2">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{project.tasks.filter(t => t.status === 'finished').length}/{project.tasks.length} tasks</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${project.tasks.length ? (project.tasks.filter(t => t.status === 'finished').length / project.tasks.length) * 100 : 0}%`
                          }}
                        />
                      </div>
                    </div>

                    {project.payments.length > 0 && (
                      <div className="pt-2 border-t">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Payment Status</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${project.payments.every(p => p.status === 'paid')
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {project.payments.every(p => p.status === 'paid') ? 'Paid' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completed Projects */}
        {finishedProjects.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-[#3c405b] mb-6">Completed Projects</h2>
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Project
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Completed
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {finishedProjects.map((project) => (
                      <tr
                        key={project.id}
                        onClick={() => {
                          setSelectedProject(project);
                          navigate(`/project-dashboard/${project.id}`);
                        }}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-[#3c405b]">{project.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(project.category)}`}>
                            {project.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(project.deadline).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          ${project.payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;
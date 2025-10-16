import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Folder, Clock, DollarSign, User } from "lucide-react";
import { useProject } from "../../contexts/ProjectContext";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

import {
  API_URL,
  STAGES,
  formatDeadline as adminFormatDeadline,
  getCategoryColor as adminGetCategoryColor,
  getDeadlineColor as adminGetDeadlineColor,
  getPaymentStatusColor as adminGetPaymentStatusColor,
} from "../dashboard/AdminDashboard/utils"; // make sure the utils path is correct

// Header Component
const Header = ({ user, ongoingCount, onNewProject }: any) => (
  <div className="bg-white shadow-sm border-b w-full z-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14">
      <div className="flex items-center justify-between py-6">
        <div>
          <h1 className="text-3xl font-bold text-[#3c405b]">
            Welcome back, {user?.name}
          </h1>
          <p className="text-gray-600 mt-1">Manage your design projects</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="bg-blue-50 px-4 py-2 rounded-lg">
            <span className="text-blue-600 font-medium">{ongoingCount} Active Projects</span>
          </div>

          <button
            onClick={onNewProject}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Create New Project
          </button>
        </div>
      </div>
    </div>
  </div>
);

// StatsCards Component
const StatsCards = ({ projects, ongoingCount, finishedCount, uncompletedPaymentsCount }: any) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 mt-5">
    <Card icon={<Folder className="h-6 w-6 text-blue-600" />} label="My Projects" value={projects.length} color="bg-blue-100" />
    <Card icon={<Clock className="h-6 w-6 text-green-600" />} label="Ongoing" value={ongoingCount} color="bg-green-100" />
    <Card icon={<Calendar className="h-6 w-6 text-purple-600" />} label="Completed" value={finishedCount} color="bg-purple-100" />
    <Card icon={<DollarSign className="h-6 w-6 text-red-600" />} label="Uncompleted Payments" value={uncompletedPaymentsCount} color="bg-red-100" />
  </div>
);

const Card = ({ icon, label, value, color }: any) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border">
    <div className="flex items-center">
      <div className={`p-2 ${color} rounded-lg`}>{icon}</div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-2xl font-bold text-[#3c405b]">{value}</p>
      </div>
    </div>
  </div>
);

// OngoingProjects Component
const OngoingProjects = ({ ongoingProjects, getProgressOutOf4, getProjectStage, getProjectPaymentStatus, getCategoryColor, getDeadlineColor, onSelectProject }: any) => (
  <div className="mb-8">
    <h2 className="text-2xl font-bold text-[#3c405b] mb-6">Ongoing Projects</h2>
    {ongoingProjects.length === 0 ? (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center transition-all hover:shadow-md">
        <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Active Projects</h3>
        <p className="text-gray-500 text-sm">You don’t have any active projects at the moment.</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {ongoingProjects.map((project: any) => {
          const { current, total, percent } = getProgressOutOf4(project);
          const stage = getProjectStage(project.id);
          const paymentStatus = getProjectPaymentStatus(project.id);

          return (
            <div
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-2xl border border-gray-200 hover:border-blue-500/30 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer p-6 group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <h3 className="font-semibold text-[#2e335a] text-lg group-hover:text-blue-600 transition-colors">
                  {project.name}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getCategoryColor(project.category)}`}>
                  {project.category}
                </span>
              </div>

              {/* Client */}
              <div className="flex items-center text-sm text-gray-700 mb-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-semibold mr-3 shadow-sm">
                  {project.client?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium">{project.client?.name}</span>
              </div>

              {/* Deadline */}
              <div className="flex items-center text-sm mb-3">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                <span className={`${getDeadlineColor(project.deadline)} font-medium`}>
                  {adminFormatDeadline(project.deadline)}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="pt-3">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span className="font-medium">Stage: {stage}</span>
                  <span className="font-semibold text-gray-700">{current}/{total}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              {/* Payment Status */}
              <div className="pt-4 flex items-center justify-between">
                <p className="font-medium text-gray-600">Payment:</p>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${adminGetPaymentStatusColor(paymentStatus)}`}>
                  {paymentStatus}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
);

// FinishedProjects Component
const FinishedProjects = ({ finishedProjects, getCategoryColor, getPaymentStatusColor, getProjectPaymentStatus, getProjectCompletionDate, onSelectProject }: any) => (
  finishedProjects.length > 0 && (
    <div>
      <h2 className="text-2xl font-bold text-[#3c405b] mb-6">Recently Completed</h2>
      <div className="bg-white rounded-lg shadow-sm border overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["Project", "Category", "Completed", "Payment"].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {finishedProjects.map((project: any) => {
              const paymentStatus = getProjectPaymentStatus(project.id);
              const completionDate = getProjectCompletionDate(project);

              return (
                <tr
                  key={project.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => onSelectProject(project)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#3c405b]">
                    {project.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(project.category)}`}>
                      {project.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {completionDate ? new Date(completionDate).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(paymentStatus)}`}>
                      {paymentStatus}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
);

// Main ClientDashboard
const ClientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { projects, setSelectedProject } = useProject();
  const { user } = useAuth();

  const clientProjects = projects.filter(p => p.clientId === user?.id);
  const ongoingProjects = clientProjects.filter(p => p.status !== "finished");
  const finishedProjects = clientProjects.filter(p => p.status === "finished")
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const [payments, setPayments] = useState<any[]>([]);
  const [projectTasks, setProjectTasks] = useState<{ [key: string]: any[] }>({});

  // Fetch project payments for the user
  useEffect(() => {
    const fetchProjectPayments = async () => {
      if (!clientProjects.length) return;
      try {
        const paymentPromises = clientProjects.map((p) =>
          axios.get(`${API_URL}/payments`, { params: { projectId: p.id } })
        );
        const results = await Promise.all(paymentPromises);
        const allPayments = results.flatMap((res) => res.data);
        setPayments(allPayments);
      } catch (err) {
        console.error("Error fetching project payments:", err);
      }
    };
    fetchProjectPayments();
  }, [clientProjects]);

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      if (!clientProjects.length) return;
      try {
        const taskPromises = clientProjects.map((p) =>
          axios.get(`${API_URL}/kanban/${p.id}/tasks`)
        );
        const results = await Promise.all(taskPromises);
        const tasksByProject: { [key: string]: any[] } = {};
        clientProjects.forEach((p, idx) => {
          tasksByProject[p.id] = results[idx].data || [];
        });
        setProjectTasks(tasksByProject);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };
    fetchTasks();
  }, [clientProjects]);

  const getProjectPayments = (projectId: string) =>
    payments.filter((p) => p.projectId === projectId);

  const getProjectPaymentStatus = (projectId: string) => {
    const projectPayments = getProjectPayments(projectId);
    if (!projectPayments.length) return "pending";
    if (projectPayments.every((p) => p.status === "paid")) return "paid";
    if (projectPayments.some((p) => p.status === "partial")) return "partial";
    return "pending";
  };

  const getProjectStage = (projectId: string) => {
    const tasks = projectTasks[projectId] || [];
    for (let i = STAGES.length - 1; i >= 0; i--) {
      if (tasks.some((t) => t.stage === STAGES[i])) return STAGES[i];
    }
    return "to do";
  };

  const getProgressOutOf4 = (project: any) => {
    const stage = getProjectStage(project.id);
    const stageIndex = STAGES.indexOf(stage);
    return { current: stageIndex, total: STAGES.length, percent: (stageIndex / STAGES.length) * 100 };
  };

  const getProjectCompletionDate = (project: any) =>
    project.status === "finished" ? project.updatedAt : null;

  const uncompletedPaymentsCount = clientProjects.filter(
    (p) => getProjectPaymentStatus(p.id) !== "paid"
  ).length;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header
        user={user}
        ongoingCount={ongoingProjects.length}
        onNewProject={() => navigate("/create-project")}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StatsCards
          projects={clientProjects}
          ongoingCount={ongoingProjects.length}
          finishedCount={finishedProjects.length}
          uncompletedPaymentsCount={uncompletedPaymentsCount}
        />

        <OngoingProjects
          ongoingProjects={ongoingProjects}
          getProgressOutOf4={getProgressOutOf4}
          getProjectStage={getProjectStage}
          getProjectPaymentStatus={getProjectPaymentStatus}
          getCategoryColor={adminGetCategoryColor}
          getDeadlineColor={adminGetDeadlineColor}
          onSelectProject={(p: any) => {
            setSelectedProject(p);
            navigate(`/project-dashboard/${p.id}`);
          }}
        />

        <FinishedProjects
          finishedProjects={finishedProjects}
          getCategoryColor={adminGetCategoryColor}
          getPaymentStatusColor={adminGetPaymentStatusColor}
          getProjectPaymentStatus={getProjectPaymentStatus}
          getProjectCompletionDate={getProjectCompletionDate}
          onSelectProject={(p: any) => {
            setSelectedProject(p);
            navigate(`/project-dashboard/${p.id}`);
          }}
        />
      </div>
    </div>
  );
};

export default ClientDashboard;

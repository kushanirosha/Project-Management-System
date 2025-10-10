import React, { useEffect, useState } from "react";
import { Calendar, User, Folder, Clock } from "lucide-react";
import { useProject } from "../../contexts/ProjectContext";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5000/api";
const STAGES = ["to do", "in progress", "review", "done"];

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { projects, setSelectedProject } = useProject();
  const { user } = useAuth();

  const [users, setUsers] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);

  // Fetch users, project tasks, and payments
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API_URL}/clients`);
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    const fetchProjectTasks = async () => {
      if (!projects.length) return;
      try {
        const taskPromises = projects.map((p) =>
          axios.get(`${API_URL}/tasks/project/${p.id}`)
        );
        const results = await Promise.all(taskPromises);
        const allTasks = results.flatMap((res) => res.data);
        setTasks(allTasks);
      } catch (err) {
        console.error("Error fetching project tasks:", err);
      }
    };

    const fetchProjectPayments = async () => {
      if (!projects.length) return;
      try {
        const paymentPromises = projects.map((p) =>
          axios.get(`${API_URL}/payments`, { params: { projectId: p.id } })
        );
        const results = await Promise.all(paymentPromises);
        const allPayments = results.flatMap((res) => res.data);
        setPayments(allPayments);
      } catch (err) {
        console.error("Error fetching project payments:", err);
      }
    };

    fetchUsers();
    fetchProjectTasks();
    fetchProjectPayments();
  }, [projects]);

  // Get all tasks for a project
  const getProjectTasks = (projectId: string) =>
    tasks.filter((t) => t.projectId === projectId);

  // Determine project stage from tasks
  const getProjectStage = (projectId: string) => {
    const projectTasks = getProjectTasks(projectId);
    if (!projectTasks.length) return "to do";

    if (projectTasks.some((t) => t.stage === "done")) return "done";
    if (projectTasks.some((t) => t.stage === "review")) return "review";
    if (projectTasks.some((t) => t.stage === "in progress")) return "in progress";
    return "to do";
  };

  // Progress bar (out of 4)
  const getProgressOutOf4 = (projectId: string) => {
    const stage = getProjectStage(projectId);
    const stageIndex = STAGES.indexOf(stage);
    return {
      current: stageIndex + 1,
      total: 4,
      percent: ((stageIndex + 1) / 4) * 100,
    };
  };

  // Get project completion date (latest done task)
  const getProjectCompletionDate = (projectId: string) => {
    const doneTasks = getProjectTasks(projectId).filter((t) => t.stage === "done");
    if (!doneTasks.length) return null;

    const latestDoneTask = doneTasks.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];

    return latestDoneTask.createdAt;
  };

  // Payments
  const getProjectPayments = (projectId: string) =>
    payments.filter((p) => p.projectId === projectId);

  const getProjectPaymentStatus = (projectId: string) => {
    const projectPayments = getProjectPayments(projectId);
    if (!projectPayments.length) return "pending";

    if (projectPayments.every((p) => p.status === "paid")) return "paid";
    if (projectPayments.some((p) => p.status === "partial")) return "partial";
    return "pending";
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-red-100 text-red-800";
      case "partial":
        return "bg-yellow-100 text-yellow-800";
      case "paid":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const uncompletedPaymentsCount = projects.filter(
    (p) => getProjectPaymentStatus(p.id) !== "paid"
  ).length;

  // Separate ongoing & finished projects
  const ongoingProjects = projects.filter((p) => getProjectStage(p.id) !== "done");
  const finishedProjects = projects
    .filter((p) => getProjectStage(p.id) === "done")
    .sort((a, b) => {
      const aDate = getProjectCompletionDate(a.id)
        ? new Date(getProjectCompletionDate(a.id)!).getTime()
        : 0;
      const bDate = getProjectCompletionDate(b.id)
        ? new Date(getProjectCompletionDate(b.id)!).getTime()
        : 0;
      return bDate - aDate;
    });

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Overdue";
    if (diffDays === 0) return "Due today";
    if (diffDays === 1) return "Due tomorrow";
    return `${diffDays} days left`;
  };

  const getCategoryColor = (category: "web" | "graphic") => {
    return category === "web"
      ? "bg-blue-100 text-blue-800"
      : "bg-purple-100 text-purple-800";
  };

  const getDeadlineColor = (deadline: string) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "text-red-600";
    if (diffDays <= 3) return "text-orange-600";
    return "text-green-600";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b fixed w-full mt-[65px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-3xl font-bold text-[#3c405b]">
                Welcome back, {user?.name}
              </h1>
              <p className="text-gray-600 mt-1">
                Manage all clients' design projects
              </p>
            </div>

            {/* Right side buttons */}
            <div className="flex items-center space-x-4">
              {/* Active Projects Info */}
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <span className="text-blue-600 font-medium">
                  {ongoingProjects.length} Active Projects
                </span>
              </div>

              {/* Create New Project Button */}
              <button
                onClick={() => navigate("/")}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Create New Project
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-8 mt-48">
          {/* Total Projects */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Folder className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Projects</p>
                <p className="text-2xl font-bold text-[#3c405b]">
                  {projects.length}
                </p>
              </div>
            </div>
          </div>

          {/* Ongoing */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ongoing</p>
                <p className="text-2xl font-bold text-[#3c405b]">
                  {ongoingProjects.length}
                </p>
              </div>
            </div>
          </div>

          {/* Clients */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <User className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Clients</p>
                <p className="text-2xl font-bold text-[#3c405b]">
                  {users.length}
                </p>
              </div>
            </div>
          </div>

          {/* Completed */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-[#3c405b]">
                  {finishedProjects.length}
                </p>
              </div>
            </div>
          </div>

          {/* Uncompleted Payments */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <Clock className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Uncompleted Payments
                </p>
                <p className="text-2xl font-bold text-[#3c405b]">
                  {uncompletedPaymentsCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Ongoing Projects Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#3c405b] mb-6">
            Ongoing Projects
          </h2>
          {ongoingProjects.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
              <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                No Active Projects
              </h3>
              <p className="text-gray-500">
                You don't have any active projects at the moment.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ongoingProjects.map((project) => {
                const { current, total, percent } = getProgressOutOf4(project.id);
                const stage = getProjectStage(project.id);
                const paymentStatus = getProjectPaymentStatus(project.id);

                return (
                  <div
                    key={project.id}
                    onClick={() => {
                      setSelectedProject(project);
                      navigate(`/project-dashboard/${project.id}`);
                    }}
                    className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 cursor-pointer p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-semibold text-[#3c405b] text-lg">
                        {project.name}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                          project.category
                        )}`}
                      >
                        {project.category}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {/* Client */}
                      <div className="flex items-center text-sm text-gray-600">
                        <div className="h-8 w-8 rounded-full bg-gray-500 flex items-center justify-center text-white font-medium mr-2">
                          {project.client?.name?.charAt(0).toUpperCase()}
                        </div>
                        <span>{project.client?.name}</span>
                      </div>

                      {/* Deadline */}
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span className={getDeadlineColor(project.deadline)}>
                          {formatDeadline(project.deadline)}
                        </span>
                      </div>

                      {/* Stage + Progress */}
                      <div className="pt-2">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Stage: {stage}</span>
                          <span>
                            {current}/{total}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>

                      {/* Payment Status */}
                      <div className="pt-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                            paymentStatus
                          )}`}
                        >
                          {paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recently Completed Section */}
        {finishedProjects.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              No Past Projects
            </h3>
            <p className="text-gray-500">
              You don't have any past projects at the moment.
            </p>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-[#3c405b] mb-6">
              Recently Completed
            </h2>
            <div className="bg-white rounded-lg shadow-sm border overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Project
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Completed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {finishedProjects.slice(0, 5).map((project) => {
                    const paymentStatus = getProjectPaymentStatus(project.id);
                    return (
                      <tr
                        key={project.id}
                        onClick={() => {
                          setSelectedProject(project);
                          navigate(`/project-dashboard/${project.id}`);
                        }}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-[#3c405b]">
                            {project.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {project.client.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                              project.category
                            )}`}
                          >
                            {project.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {getProjectCompletionDate(project.id)
                            ? new Date(getProjectCompletionDate(project.id)!).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                              paymentStatus
                            )}`}
                          >
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
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

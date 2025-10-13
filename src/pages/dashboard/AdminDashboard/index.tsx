import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useProject } from "../../../contexts/ProjectContext";
import { useAuth } from "../../../contexts/AuthContext";

import Header from "./Header";
import StatsCards from "./StatsCards";
import OngoingProjects from "./OngoingProjects";
import FinishedProjects from "./FinishedProjects";
import {
  API_URL,
  STAGES,
  formatDeadline,
  getCategoryColor,
  getDeadlineColor,
  getPaymentStatusColor,
} from "./utils";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { projects, setSelectedProject } = useProject();
  const { user } = useAuth();

  const [users, setUsers] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [projectTasks, setProjectTasks] = useState<{ [key: string]: any[] }>({});

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API_URL}/clients`);
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  // Fetch payments
  useEffect(() => {
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
    fetchProjectPayments();
  }, [projects]);

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      if (!projects.length) return;
      try {
        const taskPromises = projects.map((p) =>
          axios.get(`${API_URL}/projects/${p.id}/tasks`)
        );
        const results = await Promise.all(taskPromises);
        const tasksByProject: { [key: string]: any[] } = {};
        projects.forEach((p, idx) => {
          tasksByProject[p.id] = results[idx].data || [];
        });
        setProjectTasks(tasksByProject);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };
    fetchTasks();
  }, [projects]);

  // Payment helpers
  const getProjectPayments = (projectId: string) =>
    payments.filter((p) => p.projectId === projectId);

  const getProjectPaymentStatus = (projectId: string) => {
    const projectPayments = getProjectPayments(projectId);
    if (!projectPayments.length) return "pending";
    if (projectPayments.every((p) => p.status === "paid")) return "paid";
    if (projectPayments.some((p) => p.status === "partial")) return "partial";
    return "pending";
  };

  const uncompletedPaymentsCount = projects.filter(
    (p) => p.status === "finished" && getProjectPaymentStatus(p.id) !== "paid"
  ).length;

  // Determine stage
  const getProjectStage = (projectId: string) => {
    const tasks = projectTasks[projectId] || [];
    for (let i = STAGES.length - 1; i >= 0; i--) {
      if (tasks.some((t) => t.stage === STAGES[i])) {
        return STAGES[i];
      }
    }
    return "to do";
  };

  const getProgressOutOf4 = (project: any) => {
    const stage = getProjectStage(project.id);
    const stageIndex = STAGES.indexOf(stage);
    return {
      current: stageIndex + 1,
      total: STAGES.length,
      percent: ((stageIndex + 1) / STAGES.length) * 100,
    };
  };

  const getProjectCompletionDate = (project: any) =>
    project.status === "finished" ? project.updatedAt : null;

  const ongoingProjects = projects.filter((p) => p.status !== "finished");
  const finishedProjects = projects
    .filter((p) => p.status === "finished")
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

  return (
    <div className="min-h-screen bg-gray-100">
      <Header
        user={user}
        ongoingCount={ongoingProjects.length}
        onNewProject={() => navigate("/")}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StatsCards
          projects={projects}
          users={users}
          ongoingCount={ongoingProjects.length}
          finishedCount={finishedProjects.length}
          uncompletedPaymentsCount={uncompletedPaymentsCount}
        />

        <OngoingProjects
          ongoingProjects={ongoingProjects}
          getProgressOutOf4={getProgressOutOf4}
          getProjectStage={getProjectStage}
          getProjectPaymentStatus={getProjectPaymentStatus}
          getCategoryColor={getCategoryColor}
          getDeadlineColor={getDeadlineColor}
          getPaymentStatusColor={getPaymentStatusColor}
          formatDeadline={formatDeadline}
          onSelectProject={(p) => {
            setSelectedProject(p);
            navigate(`/project-dashboard/${p.id}`);
          }}
        />

        <FinishedProjects
          finishedProjects={finishedProjects}
          getCategoryColor={getCategoryColor}
          getPaymentStatusColor={getPaymentStatusColor}
          getProjectPaymentStatus={getProjectPaymentStatus}
          getProjectCompletionDate={getProjectCompletionDate}
          onSelectProject={(p) => {
            setSelectedProject(p);
            navigate(`/project-dashboard/${p.id}`);
          }}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;

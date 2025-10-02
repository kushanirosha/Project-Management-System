import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProjectSidebar from "./ProjectSidebar";
import KanbanBoard from "./KanbanBoard";
import PaymentTab from "./PaymentTab";
import ChatTab from "./ChatTab";
import { useProject } from "../../contexts/ProjectContext";

const ProjectDashboard: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { projects } = useProject();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"project" | "payment" | "chat">("project");

  const project = projects.find((p) => p.id === projectId);

  if (!project) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
        <p className="text-gray-600 mb-4">Project not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-[#3c405b] text-white rounded-lg hover:bg-[#2c2f45]"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "project":
        return <KanbanBoard projectId={project.id} tasks={project.tasks} />;
      case "payment":
        return <PaymentTab project={project} />;
      case "chat":
        return <ChatTab projectId={project.id} messages={project.messages} />;
      default:
        return <KanbanBoard projectId={project.id} tasks={project.tasks} />;
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <ProjectSidebar
        project={project}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onBack={() => navigate("/admin-dashboard")}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col h-screen">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#3c405b] capitalize">
                {activeTab === "project" ? "Project Management" : activeTab}
              </h1>
              <p className="text-gray-600 mt-1">
                {activeTab === "project" && "Manage tasks and track project progress"}
                {activeTab === "payment" && "Handle payments and financial tracking"}
                {activeTab === "chat" && "Communicate with your team"}
              </p>
            </div>
          </div>
        </div>

        {/* Tab content with full height */}
        <div className="flex-1 p-8 overflow-y-auto h-full">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;

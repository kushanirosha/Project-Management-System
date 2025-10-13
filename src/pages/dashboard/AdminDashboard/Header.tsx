import React from "react";

interface HeaderProps {
  user: any;
  ongoingCount: number;
  onNewProject: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, ongoingCount, onNewProject }) => (
  <div className="bg-white shadow-sm border-b fixed w-full mt-[65px] z-10">
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

        <div className="flex items-center space-x-4">
          <div className="bg-blue-50 px-4 py-2 rounded-lg">
            <span className="text-blue-600 font-medium">
              {ongoingCount} Active Projects
            </span>
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

export default Header;

import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Calendar, 
  UserCheck, 
  Mail, 
  BarChart3,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'candidates', label: 'Candidates', icon: Users },
  { id: 'assessments', label: 'Assessments', icon: FileText },
  { id: 'interviews', label: 'Interviews', icon: Calendar },
  { id: 'onboarding', label: 'Onboarding', icon: UserCheck },
  { id: 'templates', label: 'Email Templates', icon: Mail },
  { id: 'reports', label: 'Reports', icon: BarChart3 }
];

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentPage, 
  onPageChange, 
  collapsed, 
  onToggleCollapse 
}) => {
  return (
    <div className={`bg-gray-900 text-white transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} min-h-screen relative`}>
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold">HRMS</h1>
              <p className="text-gray-400 text-sm">HR Management</p>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={onToggleCollapse}
        className="absolute -right-3 top-6 bg-white text-gray-600 rounded-full p-1 shadow-lg hover:shadow-xl transition-shadow"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      <nav className="mt-8">
        <ul className="space-y-2 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onPageChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};
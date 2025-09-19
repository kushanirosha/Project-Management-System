import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProjectProvider, useProject } from './contexts/ProjectContext';
import AuthScreen from './components/auth/AuthScreen';
import AdminDashboard from './components/dashboard/AdminDashboard';
import ClientDashboard from './components/dashboard/ClientDashboard';
import ProjectDashboard from './components/project/ProjectDashboard';
import Header from './components/layout/Header';

const AppContent: React.FC = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const { selectedProject, setSelectedProject } = useProject();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3c405b] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  if (selectedProject) {
    return (
      <ProjectDashboard
        project={selectedProject}
        onBack={() => setSelectedProject(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main>
        {user?.role === 'admin' ? <AdminDashboard /> : <ClientDashboard />}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <AppContent />
      </ProjectProvider>
    </AuthProvider>
  );
}

export default App;
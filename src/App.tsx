import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ProjectProvider } from "./contexts/ProjectContext";

import AuthScreen from "./pages/auth/AuthScreen";
import AdminDashboard from "./pages/dashboard/AdminDashboard/index";
import ClientDashboard from "./pages/dashboard/ClientDashboard";
import ProjectDashboard from "./pages/project/ProjectDashboard";
import CreateProject from "./pages/project/Createproject";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import AssistantWidget from "./components/AssistantWidget";

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

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
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<AuthScreen />} />

      {/* Protected Routes */}
      <Route
        path="/create-project"
        element={
          <PrivateRoute>
            <CreateProject />
          </PrivateRoute>
        }
      />
      <Route
        path="/client-dashboard"
        element={
          <PrivateRoute>
            <div className="min-h-screen bg-gray-100">
              <Header />
              <ClientDashboard />
              <Footer />
              <AssistantWidget />
            </div>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin-dashboard"
        element={
          <PrivateRoute>
            <div className="min-h-screen bg-gray-100">
              <Header />
              <AdminDashboard />
              <Footer />
            </div>
          </PrivateRoute>
        }
      />
      <Route
        path="/project-dashboard/:projectId"
        element={
          <PrivateRoute>
            <ProjectDashboard />
            <Footer />
          </PrivateRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <Router>
          <AppContent />
        </Router>
      </ProjectProvider>
    </AuthProvider>
  );
}

export default App;

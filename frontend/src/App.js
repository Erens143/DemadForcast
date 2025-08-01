import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import Projects from './components/projects/Projects';
import ProjectDetail from './components/projects/ProjectDetail';
import Layout from './components/layout/Layout';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProjectsProvider } from './contexts/ProjectsContext';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <ProjectsProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Projects />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/:projectId"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ProjectDetail />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Router>
      </ProjectsProvider>
    </AuthProvider>
  );
}

export default App; 
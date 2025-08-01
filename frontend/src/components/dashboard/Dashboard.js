import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useProjects } from '../../contexts/ProjectsContext';

const Dashboard = () => {
  const { user } = useAuth();
  const { projects, loading, error, totalProjects } = useProjects();

  const handleCreateProject = () => {
    // Navigate to projects page
    window.location.href = '/projects';
  };

  const handleUploadDataset = () => {
    // Navigate to projects page (will be updated when dataset upload is ready)
    window.location.href = '/projects';
  };

  const handleViewAnalytics = () => {
    // Navigate to projects page (will be updated when analytics is ready)
    window.location.href = '/projects';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.full_name || user?.email}!</p>
      </div>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">📁</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Projects</p>
              <p className="text-2xl font-semibold text-gray-900">{totalProjects}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">📊</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Models</p>
              <p className="text-2xl font-semibold text-gray-900">0</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-2xl">📈</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Forecasts</p>
              <p className="text-2xl font-semibold text-gray-900">0</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-2xl">📋</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Datasets</p>
              <p className="text-2xl font-semibold text-gray-900">0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Getting Started Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
        <p className="text-gray-600 mb-4">
          Welcome to DeFo! This is your demand forecasting platform. Here's what you can do:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>Create new projects for your forecasting needs</li>
          <li>Upload your time series data</li>
          <li>Train and compare different forecasting models</li>
          <li>Analyze results and export reports</li>
        </ul>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={handleCreateProject}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Create New Project
          </button>
          <button 
            onClick={handleUploadDataset}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            Upload Dataset
          </button>
          <button 
            onClick={handleViewAnalytics}
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
          >
            View Analytics
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 
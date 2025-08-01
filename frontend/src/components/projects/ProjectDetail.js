import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useProjects } from '../../contexts/ProjectsContext';
import OverviewTab from './tabs/OverviewTab';
import DatasetTab from './tabs/DatasetTab';
import ForecastingTab from './tabs/ForecastingTab';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { projects, updateProject } = useProjects();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (projectId && projects.length > 0) {
      const foundProject = projects.find(p => p.id === projectId);
      if (foundProject) {
        setProject(foundProject);
      } else {
        setError('Project not found');
      }
      setLoading(false);
    }
  }, [projectId, projects]);

  const tabs = [
    { id: 'overview', name: '📄 Overview', icon: '📄' },
    { id: 'dataset', name: '📁 Dataset', icon: '📁' },
    { id: 'forecasting', name: '📈 Forecasting & Results', icon: '📈' },
    { id: 'models', name: '📚 Model Versions', icon: '📚' },
    { id: 'members', name: '👥 Members', icon: '👥' }
  ];

  const handleBackToProjects = () => {
    navigate('/projects');
  };

  const handleUpdateProject = async (projectId, projectData) => {
    try {
      const result = await updateProject(projectId, projectData);
      if (result.success) {
        setProject(result.project);
      } else {
        console.error('Error updating project:', result.error);
      }
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading project...</div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Project not found</h3>
          <p className="text-gray-600 mb-4">{error || 'The project you are looking for does not exist.'}</p>
          <button 
            onClick={handleBackToProjects}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <button 
              onClick={handleBackToProjects}
              className="text-blue-500 hover:text-blue-700 mb-2 flex items-center"
            >
              ← Back to Projects
            </button>
            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
            <p className="text-gray-600 mt-2">{project.description || 'No description'}</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 rounded-full text-sm ${
              project.status === 'active' ? 'bg-green-100 text-green-800' :
              project.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {project.status || 'Active'}
            </span>
            {project.tags && (
              <div className="flex space-x-2">
                {project.tags.split(',').map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow">
        {activeTab === 'overview' && (
          <OverviewTab 
            project={project} 
            onUpdateProject={handleUpdateProject}
          />
        )}

        {activeTab === 'dataset' && (
          <DatasetTab projectId={projectId} />
        )}

        {activeTab === 'forecasting' && (
          <ForecastingTab projectId={projectId} />
        )}

        {activeTab === 'models' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">📚 Model Versions</h2>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No model versions</h3>
              <p className="text-gray-600 mb-4">Model versions will appear here after training</p>
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">👥 Members</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Project Members</h3>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                  Invite Member
                </button>
              </div>
              <div className="border rounded-lg">
                <div className="px-4 py-3 border-b bg-gray-50">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Email</span>
                    <span className="font-medium">Role</span>
                    <span className="font-medium">Joined</span>
                    <span className="font-medium">Actions</span>
                  </div>
                </div>
                <div className="px-4 py-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{user?.email}</span>
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">Owner</span>
                    <span className="text-sm text-gray-500">
                      {new Date(project.created_at).toLocaleDateString()}
                    </span>
                    <span className="text-sm text-gray-500">-</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail; 
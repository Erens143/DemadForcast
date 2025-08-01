import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useProjects } from '../../contexts/ProjectsContext';

const Projects = () => {
  const { user } = useAuth();
  const { projects, loading, error, createProject } = useProjects();
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    tags: ''
  });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');



  const handleCreateProject = async (e) => {
    e.preventDefault();
    console.log('Creating project with data:', createForm);
    setCreating(true);
    setCreateError('');

    const result = await createProject(createForm);
    
    if (result.success) {
      console.log('Project created:', result.project);
      setShowCreateModal(false);
      setCreateForm({ name: '', description: '', tags: '' });
    } else {
      console.error('Error creating project:', result.error);
      setCreateError(result.error);
    }
    
    setCreating(false);
  };

  const handleInputChange = (e) => {
    setCreateForm({
      ...createForm,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateClick = () => {
    console.log('Create button clicked');
    setShowCreateModal(true);
  };

  const handleViewDetails = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading projects...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
        <p className="text-gray-600">Manage your forecasting projects</p>
      </div>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {createError && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {createError}
        </div>
      )}



      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Your Projects</h2>
          <button 
            onClick={handleCreateClick}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Create New Project
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
            <p className="text-gray-600 mb-4">Create your first project to get started with demand forecasting</p>
            <button 
              onClick={handleCreateClick}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Create Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{project.description || 'No description'}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Created: {new Date(project.created_at).toLocaleDateString()}
                  </span>
                  <button 
                    onClick={() => handleViewDetails(project.id)}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold mb-4">Create New Project</h2>
            
            <form onSubmit={handleCreateProject}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={createForm.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter project name"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={createForm.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter project description"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={createForm.tags}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter tags (comma separated)"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 transition-colors"
                >
                  {creating ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects; 
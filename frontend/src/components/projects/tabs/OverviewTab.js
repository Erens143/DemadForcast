import React, { useState } from 'react';

const OverviewTab = ({ project, onUpdateProject }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: project?.name || '',
    description: project?.description || '',
    status: project?.status || 'active',
    tags: project?.tags || ''
  });

  const handleInputChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      await onUpdateProject(project.id, editForm);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleCancel = () => {
    setEditForm({
      name: project?.name || '',
      description: project?.description || '',
      status: project?.status || 'active',
      tags: project?.tags || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">📄 Overview</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          {isEditing ? 'Cancel' : 'Edit Project'}
        </button>
      </div>

      {isEditing ? (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Name *
            </label>
            <input
              type="text"
              name="name"
              value={editForm.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={editForm.description}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter project description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              name="status"
              value={editForm.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <input
              type="text"
              name="tags"
              value={editForm.tags}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter tags (comma separated)"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Project Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1 text-sm text-gray-900">{project?.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <p className="mt-1 text-sm text-gray-900">{project?.description || 'No description'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  project?.status === 'active' ? 'bg-green-100 text-green-800' :
                  project?.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {project?.status || 'Active'}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Created</label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(project?.created_at).toLocaleDateString()}
                </p>
              </div>
              {project?.tags && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tags</label>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {project.tags.split(',').map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Datasets</span>
                <span className="text-sm font-medium">0</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Models</span>
                <span className="text-sm font-medium">0</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Forecasts</span>
                <span className="text-sm font-medium">0</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Members</span>
                <span className="text-sm font-medium">1</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OverviewTab; 
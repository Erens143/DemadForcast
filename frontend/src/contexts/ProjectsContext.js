import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ProjectsContext = createContext();

export const useProjects = () => {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
};

export const ProjectsProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get('http://localhost:8000/projects/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setProjects(response.data.projects || []);
      setError('');
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8000/projects/', projectData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setProjects([...projects, response.data]);
      return { success: true, project: response.data };
    } catch (error) {
      console.error('Error creating project:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Failed to create project' 
      };
    }
  };

  const updateProject = async (projectId, projectData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:8000/projects/${projectId}`, projectData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setProjects(projects.map(p => p.id === projectId ? response.data : p));
      return { success: true, project: response.data };
    } catch (error) {
      console.error('Error updating project:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Failed to update project' 
      };
    }
  };

  const deleteProject = async (projectId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setProjects(projects.filter(p => p.id !== projectId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting project:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Failed to delete project' 
      };
    }
  };

  const refreshProjects = () => {
    setLoading(true);
    fetchProjects();
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const value = {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    refreshProjects,
    totalProjects: projects.length
  };

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
}; 
import api from './index'; // Path to your configured api instance

export const getProjects = () => api.get('/api/projects');
export const getProject = (id) => api.get(`/api/projects/${id}`);
export const createProject = (projectData) => api.post('/api/projects', projectData);
export const updateProject = (id, projectData) => api.put(`/api/projects/${id}`, projectData);
export const deleteProject = (id) => api.delete(`/api/projects/${id}`);
export const addProjectMember = (projectId, userId) => api.post(`/api/projects/${projectId}/members`, { userId });
export const removeProjectMember = (projectId, memberId) => api.delete(`/api/projects/${projectId}/members/${memberId}`);
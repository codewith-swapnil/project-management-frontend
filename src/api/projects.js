import axios from 'axios';

export const getProjects = () => axios.get('/api/projects');
export const getProject = (id) => axios.get(`/api/projects/${id}`);
export const createProject = (projectData) => axios.post('/api/projects', projectData);
export const updateProject = (id, projectData) => axios.put(`/api/projects/${id}`, projectData);
export const deleteProject = (id) => axios.delete(`/api/projects/${id}`);
export const addProjectMember = (projectId, userId) => axios.post(`/api/projects/${projectId}/members`, { userId });
export const removeProjectMember = (projectId, memberId) => axios.delete(`/api/projects/${projectId}/members/${memberId}`);
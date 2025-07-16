import axios from 'axios';

export const getTasks = (params) => axios.get('/api/tasks', { params });
export const getTask = (id) => axios.get(`/api/tasks/${id}`);
export const createTask = (taskData) => axios.post('/api/tasks', taskData);
export const updateTask = (id, taskData) => axios.put(`/api/tasks/${id}`, taskData);
export const deleteTask = (id) => axios.delete(`/api/tasks/${id}`);
export const updateTaskStatus = (id, status) => axios.patch(`/api/tasks/${id}/status`, { status });
export const uploadTaskFiles = (taskId, formData) => axios.post(`/api/tasks/${taskId}/files`, formData);
export const getTaskFiles = (taskId) => axios.get(`/api/tasks/${taskId}/files`);
export const deleteTaskFile = (taskId, fileId) => axios.delete(`/api/tasks/${taskId}/files/${fileId}`);
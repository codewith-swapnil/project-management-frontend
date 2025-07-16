import api from './index'; // Path to your configured api instance

export const getTasks = (params) => api.get('/api/tasks', { params });
export const getTask = (id) => api.get(`/api/tasks/${id}`);
export const createTask = (taskData) => api.post('/api/tasks', taskData);
export const updateTask = (id, taskData) => api.put(`/api/tasks/${id}`, taskData);
export const deleteTask = (id) => api.delete(`/api/tasks/${id}`);
export const updateTaskStatus = (id, status) => api.patch(`/api/tasks/${id}/status`, { status });
export const uploadTaskFiles = (taskId, formData) => api.post(`/api/tasks/${taskId}/files`, formData);
export const getTaskFiles = (taskId) => api.get(`/api/tasks/${taskId}/files`);
export const deleteTaskFile = (taskId, fileId) => api.delete(`/api/tasks/${taskId}/files/${fileId}`);
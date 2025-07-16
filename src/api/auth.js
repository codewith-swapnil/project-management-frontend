import api from './index'; // Path to your configured api instance

export const login = (credentials) => api.post('/api/auth/login', credentials);
export const register = (userData) => api.post('/api/auth/register', userData);
export const getCurrentUser = () => api.get('/api/auth/me');
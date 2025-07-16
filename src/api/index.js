import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL || '';

// Add a response interceptor
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axios;
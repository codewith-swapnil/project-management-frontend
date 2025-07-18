import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
     'x-api-key': process.env.REACT_APP_API_KEY || 'your-default-api-key-here' // Keep if your backend requires it
  }
});


// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if it's a 401 error and not a request that has already been retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark the request as retried

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          // No refresh token available, redirect to login
          console.warn('No refresh token found. Redirecting to login.');
          localStorage.removeItem('token');
          window.location.href = '/login'; // Use window.location for full page reload
          return Promise.reject(error); // Reject the original request
        }

        // Use a separate Axios instance for the refresh request
        // to prevent it from being intercepted by this same interceptor,
        // which could lead to an infinite loop.
        const refreshInstance = axios.create({
          baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000',
          headers: {
            'Content-Type': 'application/json',
            // 'x-api-key': process.env.REACT_APP_API_KEY || 'your-default-api-key-here' // Include if needed for refresh endpoint
          }
        });

        const refreshResponse = await refreshInstance.post('/api/auth/refresh', { refreshToken });
        const { token: newToken, refreshToken: newRefreshToken } = refreshResponse.data;

        // Store the new tokens
        localStorage.setItem('token', newToken);
        if (newRefreshToken) { // Backend might send a new refresh token too
          localStorage.setItem('refreshToken', newRefreshToken);
        }

        // Update the Authorization header on YOUR 'api' instance
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        // Also update the header of the original failed request
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

        // Retry the original request with the new token
        return api(originalRequest); // Use your 'api' instance to retry

      } catch (err) {
        console.error('Token refresh failed:', err.response?.data?.message || err.message);
        // If refresh fails, clear all tokens and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login'; // Force full page reload to clear state
        return Promise.reject(err);
      }
    }

    // For any other error (e.g., 400, 403, 500, or a 401 that has already been retried)
    return Promise.reject(error);
  }
);

export default api;
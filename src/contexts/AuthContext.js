import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/index'; // Ensure this path is correct for your axios instance
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false); // Manages initialization state
  const navigate = useNavigate();

  // Function to set Axios default header
  const setAuthHeader = useCallback((newToken) => {
    if (newToken) {
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, []);

  // Initialize authentication state once on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      let storedToken = localStorage.getItem('token');
      let decodedUser = null;

      if (storedToken) {
        try {
          const decoded = jwtDecode(storedToken);
          if (decoded.exp * 1000 > Date.now()) { // Check token expiration
            decodedUser = decoded; // The user object might be simpler from decoded JWT
            setToken(storedToken);
            setUser(decodedUser);
            setAuthHeader(storedToken); // Set header immediately
          } else {
            console.log('Token expired. Clearing localStorage.');
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
            setAuthHeader(null); // Clear header
          }
        } catch (error) {
          console.error('Invalid token found in localStorage:', error);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          setAuthHeader(null); // Clear header
        }
      } else {
        setToken(null);
        setUser(null);
        setAuthHeader(null); // Ensure header is clear if no token
      }

      setIsInitialized(true); // Mark initialization as complete
    };

    initializeAuth();
  }, [setAuthHeader]); // Dependency on setAuthHeader to avoid lint warnings, though it's memoized

  // Login function
  const login = async (email, password) => {
    try {
      const { data } = await api.post('/api/auth/login', { email, password });
      const decoded = jwtDecode(data.token); // Assuming token contains user info

      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(decoded); // Set user from decoded token (or data.user if your backend sends it directly)
      setAuthHeader(data.token); // Set header immediately after successful login

      navigate('/dashboard');
    } catch (error) {
      // Re-throw the error so it can be caught by the calling component (e.g., Login page)
      throw error.response?.data?.message || 'Login failed';
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      // It's generally better to log in after registration, so the backend should return a token
      const { data } = await api.post('/api/auth/register', userData);
      const decoded = jwtDecode(data.token); // Assuming backend sends token upon registration

      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(decoded); // Set user from decoded token
      setAuthHeader(data.token); // Set header immediately after successful registration

      navigate('/dashboard');
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      // Clear token/user state on registration failure as well
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      setAuthHeader(null);
      throw error.response?.data?.message || 'Registration failed';
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setAuthHeader(null); // Clear header on logout
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, isInitialized, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
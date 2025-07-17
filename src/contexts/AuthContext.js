import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/index';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        if (decoded.exp * 1000 > Date.now()) { // Check token expiration
          setToken(storedToken);
          setUser(decoded);
          api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        } else {
          // Token expired, clear it
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
      }
    }
  }, []);

  // Update axios headers when token changes
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // In your AuthContext.js
  const login = async (email, password) => {
    try {
      const { data } = await api.post('/api/auth/login', { email, password });
      const decoded = jwtDecode(data.token);

      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);

      navigate('/dashboard');
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  };

  const register = async (userData) => {
    try {
      // Clear existing token
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];

      const { data } = await api.post('/api/auth/register', userData);

      const decoded = jwtDecode(data.token);
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(decoded);

      navigate('/dashboard');
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      throw error.response?.data?.message || 'Registration failed';
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
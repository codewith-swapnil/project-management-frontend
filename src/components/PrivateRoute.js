import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, isInitialized } = useAuth();

  if (!isInitialized) {
    // Show loading state while auth is being initialized
    return <div>Loading...</div>;
  }

  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
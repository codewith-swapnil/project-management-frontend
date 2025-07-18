import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom'; // Removed BrowserRouter import
import theme from './theme';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import CreateProject from './pages/CreateProject';
import ProjectDetail from './pages/ProjectDetail';
import Tasks from './pages/Tasks';
import EditTask from './pages/TaskDetail';
import CreateTask from './pages/CreateTask';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes with Layout */}
          <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/new" element={<CreateProject />} />
            <Route path="/projects/:projectId" element={<ProjectDetail />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/tasks/:taskId/edit" element={<EditTask />} />
            <Route path="/projects/:projectId/tasks/new" element={<CreateTask />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
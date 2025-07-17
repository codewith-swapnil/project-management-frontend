import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetail';
import Tasks from './pages/Tasks';
import TaskDetails from './pages/TaskDetail';
import Layout from './components/Layout';
import CreateProject from './pages/CreateProject';
import CreateTask from './pages/CreateTask';
import PrivateRoute from './components/PrivateRoute';
import NotFound from './pages/NotFound'; // Recommended for 404 handling
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Router>
          <AuthProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected routes with Layout */}
              <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />

                {/* Projects routes */}
                <Route path="projects/new" element={<CreateProject />} />
                <Route path="projects" element={<Projects />} />
                <Route path="projects/:projectId" element={<ProjectDetails />} />

                {/* Tasks routes */}
                <Route path="tasks" element={<Tasks />} />
                <Route path="tasks/:taskId" element={<TaskDetails />} />
                <Route path="projects/:projectId/tasks/new" element={<CreateTask />} />

                {/* Optional: You might want these too */}
                <Route path="projects/:projectId/tasks" element={<Tasks />} />
                <Route path="projects/:projectId/tasks/:taskId" element={<TaskDetails />} />
              </Route>

              {/* 404 Not Found - should be last route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
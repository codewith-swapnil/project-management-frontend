import { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CircularProgress,
  Button,
  Link
} from '@mui/material';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Link as RouterLink } from 'react-router-dom';
import api from '../api/index';
import { useAuth } from '../contexts/AuthContext';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/api/auth/dashboard');
        if (!data?.success || !data.data) {
          throw new Error('Invalid data format');
        }
        setStats(data.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  if (!stats) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography>No data available</Typography>
      </Box>
    );
  }

  const taskStatusData = {
    labels: ['Todo', 'In Progress', 'Completed'],
    datasets: [
      {
        data: [
          stats.statusCounts?.Todo || 0,
          stats.statusCounts?.['In Progress'] || 0,
          stats.statusCounts?.Completed || 0,
        ],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#4BC0C0',
        ],
      },
    ],
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.name || 'User'}
      </Typography>

      {/* Quick Links Section */}
      <Box mb={4}>
        <Grid container spacing={2}>
          <Grid item>
            <Button 
              variant="contained" 
              component={RouterLink} 
              to="/projects"
              color="primary"
            >
              View All Projects
            </Button>
          </Grid>
          <Grid item>
            <Button 
              variant="outlined" 
              component={RouterLink} 
              to="/tasks"
              color="primary"
            >
              View All Tasks
            </Button>
          </Grid>
          {stats.recentProject && (
            <Grid item>
              <Button 
                variant="text" 
                component={RouterLink} 
                to={`/projects/${stats.recentProject._id}`}
                color="secondary"
              >
                Go to Recent Project
              </Button>
            </Grid>
          )}
        </Grid>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="textSecondary">
                Projects
              </Typography>
              <Typography variant="h4">
                {stats.projectCount || 0}
              </Typography>
              <Box mt={2}>
                <Link 
                  component={RouterLink} 
                  to="/projects" 
                  color="primary"
                  underline="hover"
                >
                  View Projects
                </Link>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="textSecondary">
                Total Tasks
              </Typography>
              <Typography variant="h4">
                {stats.taskCount || 0}
              </Typography>
              <Box mt={2}>
                <Link 
                  component={RouterLink} 
                  to="/tasks" 
                  color="primary"
                  underline="hover"
                >
                  View All Tasks
                </Link>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="textSecondary">
                Tasks Assigned to You
              </Typography>
              <Typography variant="h4">
                {stats.assignedTasksCount || 0} {/* Assuming you add this to your stats */}
              </Typography>
              <Box mt={2}>
                <Link 
                  component={RouterLink} 
                  to="/tasks?filter=assigned" 
                  color="primary"
                  underline="hover"
                >
                  View Your Tasks
                </Link>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" gutterBottom>
                  Task Status Distribution
                </Typography>
                <Button 
                  component={RouterLink} 
                  to="/tasks" 
                  size="small"
                  color="primary"
                >
                  Manage Tasks
                </Button>
              </Box>
              <Box height={300}>
                <Pie data={taskStatusData} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Projects Section */}
        {stats.recentProjects && stats.recentProjects.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Projects
                </Typography>
                <Grid container spacing={2}>
                  {stats.recentProjects.map(project => (
                    <Grid item xs={12} sm={6} md={4} key={project._id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle1">
                            <Link 
                              component={RouterLink} 
                              to={`/projects/${project._id}`}
                              underline="hover"
                            >
                              {project.name}
                            </Link>
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {project.description?.substring(0, 50)}...
                          </Typography>
                          <Box mt={1}>
                            <Button 
                              component={RouterLink} 
                              to={`/projects/${project._id}`}
                              size="small"
                              color="primary"
                            >
                              View Details
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Dashboard;
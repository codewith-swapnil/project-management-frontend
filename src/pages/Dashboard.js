import { useAuth } from '../contexts/AuthContext';
import { Box, Typography, Card, CardContent, Grid, LinearProgress, Alert } from '@mui/material';
import { Folder, Assignment, CheckCircle, HourglassEmpty, PlayCircleFilled } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import api from '../api/index'; // Update with correct path

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    projectCount: 0,
    taskCount: 0,
    statusCounts: { Todo: 0, 'In Progress': 0, Completed: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/api/auth/dashboard');
        setStats(response.data.data);
      } catch (err) {
        console.error('Dashboard error:', err);
        if (err.response?.status === 401) {
          logout();
        } else {
          setError(err.response?.data?.message || 'Failed to load dashboard data');
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardStats();
    }
  }, [user, logout]);

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography>Please log in to view the dashboard</Typography>
      </Box>
    );
  }

  if (loading) {
    return <LinearProgress />;
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const { projectCount, taskCount, statusCounts } = stats;
  const totalTasks = statusCounts.Todo + statusCounts['In Progress'] + statusCounts.Completed;

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Welcome, {user.name}!
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Project Count Card */}
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Folder color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h5">My Projects</Typography>
              </Box>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
                {projectCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Currently participating
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Task Count Card */}
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Assignment color="secondary" sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h5">My Tasks</Typography>
              </Box>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
                {taskCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total assigned
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Status Cards */}
        {Object.entries(statusCounts).map(([status, count]) => (
          <Grid item xs={12} md={6} lg={3} key={status}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  {status === 'Completed' && <CheckCircle color="success" sx={{ fontSize: 40, mr: 2 }} />}
                  {status === 'In Progress' && <PlayCircleFilled color="info" sx={{ fontSize: 40, mr: 2 }} />}
                  {status === 'Todo' && <HourglassEmpty color="warning" sx={{ fontSize: 40, mr: 2 }} />}
                  <Typography variant="h5">{status}</Typography>
                </Box>
                <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
                  {count}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {totalTasks > 0 ? `${Math.round((count / totalTasks) * 100)}% of tasks` : 'No tasks'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Task Status Visualization */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Task Status Breakdown
              </Typography>
              <Box sx={{ height: 300, display: 'flex', flexDirection: 'column' }}>
                {Object.entries(statusCounts).map(([status, count]) => (
                  <Box key={status} sx={{ mb: 2 }}>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography>{status}</Typography>
                      <Typography>{count} ({totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0}%)</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={totalTasks > 0 ? (count / totalTasks) * 100 : 0}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor:
                            status === 'Completed' ? 'success.main' :
                              status === 'In Progress' ? 'info.main' : 'warning.main'
                        }
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Project Overview
              </Typography>
              <Box sx={{
                height: 300,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'text.secondary',
                flexDirection: 'column'
              }}>
                <Assignment sx={{ fontSize: 80, mb: 2 }} />
                <Typography variant="h6">Total Projects: {projectCount}</Typography>
                <Typography>Tasks across all projects: {taskCount}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
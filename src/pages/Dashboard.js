import { useAuth } from '../contexts/AuthContext';
import { Box, Typography, Card, CardContent, Grid, LinearProgress, Alert, CircularProgress } from '@mui/material'; // Added CircularProgress
import { Folder, Assignment, CheckCircle, HourglassEmpty, PlayCircleFilled } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import api from '../api/index';
import { styled } from '@mui/system'; // Import styled for custom components


const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[4],
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: theme.shadows[7],
  },
  height: '100%', // Ensures all cards in a grid row have equal height
  display: 'flex', // Use flex to align content within card
  flexDirection: 'column',
  justifyContent: 'space-between', // Push content to top and bottom if needed
}));

const StatusProgressBar = styled(LinearProgress)(({ theme, status }) => {
  let color;
  switch (status) {
    case 'Completed':
      color = theme.palette.success.main;
      break;
    case 'In Progress':
      color = theme.palette.info.main;
      break;
    case 'Todo':
      color = theme.palette.warning.main;
      break;
    default:
      color = theme.palette.primary.main;
  }
  return {
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.palette.grey[200],
    '& .MuiLinearProgress-bar': {
      backgroundColor: color,
    },
  };
});


const Dashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    projectCount: 0,
    taskCount: 0,
    statusCounts: { Todo: 0, 'In Progress': 0, Completed: 0, Blocked: 0, 'In Review': 0 } // Added more statuses for completeness
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        setError(null);
        // It's good practice to ensure the backend actually provides these counts
        // If your backend only gives Todo, In Progress, Completed, remove the others here.
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
      <Box display="flex" justifyContent="center" mt={8}>
        <Typography variant="h6" color="text.secondary">Please log in to view the dashboard.</Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="70vh">
        <CircularProgress size={60} />
        <Typography variant="h6" ml={2}>Loading dashboard data...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
        <Alert severity="error" sx={{ width: '100%', maxWidth: 600, borderRadius: 2 }}>{error}</Alert>
      </Box>
    );
  }

  const { projectCount, taskCount, statusCounts } = stats;
  const totalTasks = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);

  // Define icons and colors for each status
  const statusConfig = {
    'Todo': { icon: HourglassEmpty, color: 'warning' },
    'In Progress': { icon: PlayCircleFilled, color: 'info' },
    'Completed': { icon: CheckCircle, color: 'success' },
    // You can add more if your backend supports them
    // 'Blocked': { icon: Block, color: 'error' },
    // 'In Review': { icon: RateReview, color: 'primary' },
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}> {/* Responsive padding */}
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          mb: 4,
          fontWeight: 700,
          color: 'primary.dark',
          borderBottom: '2px solid',
          borderColor: 'divider',
          pb: 1
        }}
      >
        👋 Welcome, {user.name}! Your Dashboard
      </Typography>

      <Grid container spacing={4} sx={{ mb: 4 }}> {/* Increased spacing */}
        {/* Project Count Card */}
        <Grid item xs={12} sm={6} md={4} lg={3}> {/* More flexible grid sizing */}
          <StyledCard>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Folder color="primary" sx={{ fontSize: 48, mr: 2 }} /> {/* Larger icon */}
                <Typography variant="h5" component="div" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  My Projects
                </Typography>
              </Box>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
                {projectCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Projects you're currently involved in
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Task Count Card */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StyledCard>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Assignment color="secondary" sx={{ fontSize: 48, mr: 2 }} /> {/* Larger icon */}
                <Typography variant="h5" component="div" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  My Total Tasks
                </Typography>
              </Box>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', color: 'secondary.main', mb: 1 }}>
                {taskCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                All tasks assigned to you
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Status Cards */}
        {Object.entries(statusCounts).map(([status, count]) => {
          const IconComponent = statusConfig[status]?.icon;
          const iconColor = statusConfig[status]?.color;
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={status}>
              <StyledCard>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    {IconComponent && <IconComponent color={iconColor} sx={{ fontSize: 48, mr: 2 }} />} {/* Dynamic icon and color */}
                    <Typography variant="h5" component="div" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      {status}
                    </Typography>
                  </Box>
                  <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', color: `${iconColor}.main`, mb: 1 }}>
                    {count}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {totalTasks > 0 ? `${Math.round((count / totalTasks) * 100)}% of your tasks` : 'No tasks of this status'}
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
          );
        })}
      </Grid>

      <Grid container spacing={4}> {/* Consistent spacing */}
        <Grid item xs={12} md={6}>
          <StyledCard> {/* Apply StyledCard */}
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'text.primary', borderBottom: '1px solid', borderColor: 'divider', pb: 1, mb: 2 }}>
                Task Status Breakdown 📊
              </Typography>
              <Box sx={{ maxHeight: 300, overflowY: 'auto', pr: 1 }}> {/* Added overflow for long lists */}
                {Object.entries(statusCounts).map(([status, count]) => (
                  <Box key={status} sx={{ mb: 3 }}> {/* Increased margin bottom */}
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>{status}</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {count} ({totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0}%)
                      </Typography>
                    </Box>
                    <StatusProgressBar
                      variant="determinate"
                      value={totalTasks > 0 ? (count / totalTasks) * 100 : 0}
                      status={status} // Pass status to styled component
                    />
                  </Box>
                ))}
                {totalTasks === 0 && (
                  <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary', bgcolor: 'action.hover', borderRadius: 2 }}>
                    <Typography>No tasks available to show breakdown.</Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <StyledCard> {/* Apply StyledCard */}
            <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}> {/* Ensure flex column for inner content */}
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'text.primary', borderBottom: '1px solid', borderColor: 'divider', pb: 1, mb: 2 }}>
                Quick Project Stats 📈
              </Typography>
              <Box sx={{
                flexGrow: 1, // Allow content to grow
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'text.secondary',
                flexDirection: 'column',
                p: 2, // Add some padding inside
              }}>
                <Folder color="primary" sx={{ fontSize: 90, mb: 3 }} /> {/* Larger, prominent icon */}
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                  You are part of {projectCount} project{projectCount !== 1 ? 's' : ''}.
                </Typography>
                <Typography variant="body1" sx={{ textAlign: 'center' }}>
                  Managing a total of {taskCount} tasks across all your projects.
                </Typography>
                {projectCount === 0 && taskCount === 0 && (
                  <Typography variant="body2" color="text.secondary" mt={2}>
                    Start by creating your first project or task!
                  </Typography>
                )}
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
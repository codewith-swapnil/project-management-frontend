import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, Typography, Card, CardContent,
  List, ListItem, ListItemText, Divider, CircularProgress,
  Container, // Added Container for better layout
  Paper // Added Paper for elevated sections
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import api from '../api';
import { styled } from '@mui/system'; // Import styled for custom components

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2, // More rounded corners
  boxShadow: theme.shadows[5], // Deeper shadow
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)', // Lift effect on hover
    boxShadow: theme.shadows[8], // Even deeper shadow on hover
  },
}));



const StyledListItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(2, 3), // More padding
  transition: 'background-color 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    cursor: 'pointer',
    transform: 'scale(1.01)', // Slight scale effect
  },
  '&:not(:last-of-type)': {
    borderBottom: `1px solid ${theme.palette.divider}`, // Clearer separation
  },
}));


const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await api.get('/api/projects');
        setProjects(data);
      } catch (err) {
        setError("Failed to load projects. Please try again."); // More user-friendly error
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>Loading projects...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', bgcolor: 'error.light', color: 'error.contrastText' }}>
          <Typography variant="h5" gutterBottom>Error!</Typography>
          <Typography>{error}</Typography>
          <Button variant="contained" onClick={() => window.location.reload()} sx={{ mt: 3 }}>
            Reload Page
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}> {/* Use Container for max width and spacing */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
          My Projects 🚀
        </Typography>
        <Button
          variant="contained"
          size="large" // Larger button
          startIcon={<AddIcon />}
          onClick={() => navigate('/projects/new')}
          sx={{
            borderRadius: 8, // More rounded button
            boxShadow: 3, // Add shadow to button
            '&:hover': {
              boxShadow: 6, // Deeper shadow on hover
            }
          }}
        >
          New Project
        </Button>
      </Box>

      <StyledCard> {/* Use the styled card */}
        <CardContent sx={{ p: 0 }}> {/* Remove default padding to control it with ListItem */}
          {projects.length > 0 ? (
            <List>
              {projects.map((project) => (
                <StyledListItem // Use the styled list item
                  key={project._id}
                  onClick={() => navigate(`/projects/${project._id}`)}
                >
                  <ListItemText
                    primary={
                      <Typography variant="h6" component="h3" sx={{ fontWeight: 'medium', color: 'text.primary' }}>
                        {project.title}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {project.description || 'No description provided.'}
                      </Typography>
                    }
                  />
                </StyledListItem>
              ))}
            </List>
          ) : (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No projects found. Start by creating a new one!
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => navigate('/projects/new')}
                sx={{ mt: 3 }}
              >
                Create First Project
              </Button>
            </Box>
          )}
        </CardContent>
      </StyledCard>
    </Container>
  );
};

export default Projects;
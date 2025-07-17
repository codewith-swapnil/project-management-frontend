import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, Typography, Card, CardContent,
  List, ListItem, ListItemText, Divider, CircularProgress
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import api from '../api';

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
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
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
      <Box>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Projects</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/projects/new')}
        >
          New Project
        </Button>
      </Box>

      <Card>
        <CardContent>
          {projects.length > 0 ? (
            <List>
              {projects.map((project, index) => (
                <Box key={project._id}>
                  <ListItem button onClick={() => navigate(`/projects/${project._id}`)}>
                    <ListItemText
                      primary={project.title}
                      secondary={project.description}
                    />
                  </ListItem>
                  {index < projects.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          ) : (
            <Typography>No projects found</Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Projects;
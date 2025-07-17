import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';
import api from '../api/index';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await api.get('/api/projects');
        console.log('Projects data:', data); // Debugging line
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
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

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Projects</Typography>
        <Box>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/dashboard')} 
            sx={{ marginRight: 2 }}
          >
            Go to Dashboard
          </Button>
          <Button variant="contained" onClick={() => navigate('/projects/new')}>
            Create Project
          </Button>
        </Box>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell>Members</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project._id}>
                <TableCell>{project.title}</TableCell>
                <TableCell>{project.description}</TableCell>
                <TableCell>{project.createdBy?.name}</TableCell>
                <TableCell>{project.members?.length}</TableCell>
                <TableCell>
                  <Button onClick={() => {
                    if (!project._id) {
                      console.error('Project ID is missing:', project);
                      return;
                    }
                    navigate(`/projects/${project._id}`);
                  }}>
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Projects;
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress
} from '@mui/material';
import api from '../api/index';

const CreateProject = () => {
  const [projectData, setProjectData] = useState({
    title: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/api/projects', projectData);
      navigate('/projects'); // Redirect to projects list after creation
    } catch (err) {
      console.error('Error creating project:', err);
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Create New Project
      </Typography>
      
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Project Title"
                  name="title"
                  value={projectData.title}
                  onChange={handleChange}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={projectData.description}
                  onChange={handleChange}
                  multiline
                  rows={4}
                />
              </Grid>
              
              {error && (
                <Grid item xs={12}>
                  <Typography color="error">{error}</Typography>
                </Grid>
              )}
              
              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end" gap={2}>
                  <Button 
                    variant="outlined" 
                    onClick={() => navigate('/projects')}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Create Project'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreateProject;
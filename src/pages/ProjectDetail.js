import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Card, CardContent, Grid, TextField, CircularProgress, MenuItem, Chip } from '@mui/material';
import api from '../api/index'; // Path to your configured api instance

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data } = await api.get(`/api/projects/${id}`);
        setProject(data);
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/api/users');
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleAddMember = async () => {
    try {
      await api.post(`/api/projects/${id}/members`, { userId: selectedUser });
      const { data } = await api.get(`/api/projects/${id}`);
      setProject(data);
      setSelectedUser('');
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      await api.delete(`/api/projects/${id}/members/${memberId}`);
      const { data } = await api.get(`/api/projects/${id}`);
      setProject(data);
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Button onClick={() => navigate('/projects')} sx={{ mb: 2 }}>
        Back to Projects
      </Button>
      
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {project.title}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {project.description}
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            Created by: {project.createdBy?.name}
          </Typography>
        </CardContent>
      </Card>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Members
              </Typography>
              
              <Box display="flex" alignItems="center" mb={2}>
                <TextField
                  select
                  label="Add Member"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  sx={{ minWidth: 200, mr: 2 }}
                >
                  {users
                    .filter(user => !project.members.some(m => m._id === user._id))
                    .map((user) => (
                      <MenuItem key={user._id} value={user._id}>
                        {user.name} ({user.email})
                      </MenuItem>
                    ))}
                </TextField>
                <Button 
                  variant="contained" 
                  onClick={handleAddMember}
                  disabled={!selectedUser}
                >
                  Add
                </Button>
              </Box>
              
              <Box>
                {project.members.map((member) => (
                  <Chip
                    key={member._id}
                    label={`${member.name} (${member.email})`}
                    onDelete={() => handleRemoveMember(member._id)}
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tasks
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => navigate(`/projects/${id}/tasks/new`)}
                sx={{ mb: 2 }}
              >
                Create Task
              </Button>
              
              {/* Task list would go here */}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProjectDetail;
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Button, Typography, Card, CardContent, Grid,
  TextField, CircularProgress, MenuItem, Chip, Alert,
  List, ListItem, ListItemText, Divider, Badge
} from '@mui/material';
import api from '../api/index';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch project, users, and tasks in parallel
        const [projectRes, usersRes, tasksRes] = await Promise.all([
          api.get(`/api/projects/${projectId}`),
          api.get('/api/auth/users'),
          api.get(`/api/tasks/project/${projectId}`)
        ]);

        // Transform the data to match frontend expectations
        const projectData = projectRes.data;
        const allUsers = usersRes.data;
        const projectTasks = tasksRes.data;

        // Enhance project data with user details
        const enhancedProject = {
          ...projectData,
          createdBy: allUsers.find(user => user._id === projectData.createdBy) || { _id: projectData.createdBy },
          members: projectData.members.map(memberId =>
            allUsers.find(user => user._id === memberId) || { _id: memberId }
          )
        };

        setProject(enhancedProject);
        setUsers(allUsers);
        setTasks(projectTasks);
      } catch (error) {
        console.error('Error fetching data:', error);
        const errorMessage = error.response
          ? error.response.data?.message || error.response.statusText || 'Request failed'
          : error.message;
        setError(`Failed to load project data: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  const fetchTasks = async () => {
    try {
      setTasksLoading(true);
      const { data } = await api.get(`/api/tasks?project=${projectId}`);
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError(error.response?.data?.message || 'Failed to load tasks');
    } finally {
      setTasksLoading(false);
    }
  };

  const handleAddMember = async () => {
    try {
      await api.post(`/api/projects/${projectId}/members`, { userId: selectedUser });
      const { data } = await api.get(`/api/projects/${projectId}`);
      setProject(data);
      setSelectedUser('');
    } catch (error) {
      console.error('Error adding member:', error);
      setError(error.response?.data?.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      await api.delete(`/api/projects/${projectId}/members/${memberId}`);
      const { data } = await api.get(`/api/projects/${projectId}`);
      setProject(data);
    } catch (error) {
      console.error('Error removing member:', error);
      setError(error.response?.data?.message || 'Failed to remove member');
    }
  };

  const handleTaskClick = (taskId) => {
    navigate(`/projects/${projectId}/tasks/${taskId}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'To Do': return 'default';
      case 'In Progress': return 'primary';
      case 'In Review': return 'warning';
      case 'Done': return 'success';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
        <Button onClick={() => navigate('/projects')} sx={{ mt: 2 }}>
          Back to Projects
        </Button>
      </Box>
    );
  }

  if (!project) {
    return (
      <Box p={3}>
        <Alert severity="warning">Project not found</Alert>
        <Button onClick={() => navigate('/projects')} sx={{ mt: 2 }}>
          Back to Projects
        </Button>
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
            Created by: {project.createdBy?.name || 'Unknown'}
          </Typography>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Members ({project.members?.length || 0})
              </Typography>

              <Box display="flex" alignItems="center" mb={2}>
                <TextField
                  select
                  label="Add Member"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  sx={{ minWidth: 200, mr: 2 }}
                  disabled={!users.length}
                >
                  <MenuItem value="" disabled>
                    Select a user
                  </MenuItem>
                  {users
                    .filter(user => !project.members?.some(m => m._id === user._id))
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
                {project.members?.length ? (
                  project.members.map((member) => (
                    <Chip
                      key={member._id}
                      label={`${member.name} (${member.email})`}
                      onDelete={() => handleRemoveMember(member._id)}
                      sx={{ m: 0.5 }}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No members yet
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" gutterBottom>
                  Tasks ({tasks.length})
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate(`/projects/${projectId}/tasks/new`)}
                >
                  Create Task
                </Button>
              </Box>

              {tasksLoading ? (
                <Box display="flex" justifyContent="center" mt={2}>
                  <CircularProgress size={24} />
                </Box>
              ) : tasks.length > 0 ? (
                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                  {tasks.map((task, index) => (
                    <Box key={task._id}>
                      <ListItem 
                        alignItems="flex-start" 
                        button 
                        onClick={() => handleTaskClick(task._id)}
                        sx={{
                          '&:hover': {
                            backgroundColor: 'action.hover',
                          }
                        }}
                      >
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center">
                              <Badge
                                color={getStatusColor(task.status)}
                                variant="dot"
                                sx={{ mr: 1 }}
                              />
                              <Typography variant="subtitle1" component="span">
                                {task.title}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <>
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.primary"
                                display="block"
                              >
                                {task.description}
                              </Typography>
                              <Typography
                                component="span"
                                variant="caption"
                                color="text.secondary"
                              >
                                {task.status} • Due: {new Date(task.dueDate).toLocaleDateString()}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                      {index < tasks.length - 1 && <Divider component="li" />}
                    </Box>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No tasks yet. Create one to get started!
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProjectDetail;
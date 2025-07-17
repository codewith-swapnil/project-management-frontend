import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Button, Typography, Card, CardContent, Grid,
  TextField, CircularProgress, MenuItem, Chip, Alert,
  List, ListItem, ListItemText, Divider, Badge, Avatar,
  IconButton, Tooltip
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  PersonAdd as AddMemberIcon,
  PersonRemove as RemoveMemberIcon,
  AddTask as AddTaskIcon,
  MoreVert as MoreIcon
} from '@mui/icons-material';
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
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button 
          onClick={() => navigate('/projects')} 
          startIcon={<BackIcon />}
          variant="outlined"
        >
          Back to Projects
        </Button>
      </Box>
    );
  }

  if (!project) {
    return (
      <Box p={3}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Project not found
        </Alert>
        <Button 
          onClick={() => navigate('/projects')} 
          startIcon={<BackIcon />}
          variant="outlined"
        >
          Back to Projects
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      <Button 
        onClick={() => navigate('/projects')} 
        startIcon={<BackIcon />}
        sx={{ 
          mb: 3,
          textTransform: 'none',
          color: 'primary.main',
          '&:hover': {
            backgroundColor: 'primary.light',
            color: 'primary.dark'
          }
        }}
      >
        Back to Projects
      </Button>

      <Card sx={{ 
        mb: 4, 
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: 'background.paper'
      }}>
        <CardContent>
          <Typography 
            variant="h4" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {project.title}
          </Typography>
          <Typography 
            variant="body1" 
            gutterBottom
            sx={{ 
              color: 'text.secondary',
              lineHeight: 1.6
            }}
          >
            {project.description}
          </Typography>
          <Box display="flex" alignItems="center" mt={2}>
            <Avatar 
              src={project.createdBy?.avatar} 
              sx={{ 
                width: 32, 
                height: 32, 
                mr: 1,
                border: '1px solid',
                borderColor: 'divider'
              }} 
            />
            <Typography variant="subtitle2" color="textSecondary">
              Created by: {project.createdBy?.name || 'Unknown'}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            borderRadius: 1,
            boxShadow: 1
          }}
        >
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Members Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            height: '100%',
            borderRadius: 2,
            boxShadow: 3,
            backgroundColor: 'background.paper'
          }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 600,
                    color: 'text.primary'
                  }}
                >
                  Team Members ({project.members?.length || 0})
                </Typography>
              </Box>

              <Box 
                display="flex" 
                alignItems="center" 
                mb={3}
                sx={{
                  backgroundColor: 'action.hover',
                  p: 2,
                  borderRadius: 1
                }}
              >
                <TextField
                  select
                  label="Add Team Member"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  sx={{ 
                    minWidth: 200, 
                    mr: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1
                    }
                  }}
                  size="small"
                  disabled={!users.length}
                >
                  <MenuItem value="" disabled>
                    Select a user
                  </MenuItem>
                  {users
                    .filter(user => !project.members?.some(m => m._id === user._id))
                    .map((user) => (
                      <MenuItem key={user._id} value={user._id}>
                        <Box display="flex" alignItems="center">
                          <Avatar 
                            src={user.avatar} 
                            sx={{ 
                              width: 24, 
                              height: 24, 
                              mr: 1.5,
                              border: '1px solid',
                              borderColor: 'divider'
                            }} 
                          />
                          {user.name} ({user.email})
                        </Box>
                      </MenuItem>
                    ))}
                </TextField>
                <Button
                  variant="contained"
                  startIcon={<AddMemberIcon />}
                  onClick={handleAddMember}
                  disabled={!selectedUser}
                  sx={{
                    borderRadius: 1,
                    textTransform: 'none',
                    boxShadow: 'none',
                    '&:hover': {
                      boxShadow: 'none'
                    }
                  }}
                >
                  Add
                </Button>
              </Box>

              <Box>
                {project.members?.length ? (
                  <Box 
                    sx={{ 
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 1
                    }}
                  >
                    {project.members.map((member) => (
                      <Chip
                        key={member._id}
                        avatar={<Avatar src={member.avatar} />}
                        label={`${member.name || 'Unknown'}${member.email ? ` (${member.email})` : ''}`}
                        onDelete={() => handleRemoveMember(member._id)}
                        deleteIcon={
                          <Tooltip title="Remove member">
                            <RemoveMemberIcon />
                          </Tooltip>
                        }
                        sx={{ 
                          borderRadius: 1,
                          '& .MuiChip-avatar': {
                            width: 32,
                            height: 32
                          }
                        }}
                        variant="outlined"
                      />
                    ))}
                  </Box>
                ) : (
                  <Box 
                    sx={{ 
                      p: 3,
                      textAlign: 'center',
                      backgroundColor: 'action.hover',
                      borderRadius: 1
                    }}
                  >
                    <Typography variant="body2" color="textSecondary">
                      No team members yet. Add members to collaborate on this project.
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Tasks Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            height: '100%',
            borderRadius: 2,
            boxShadow: 3,
            backgroundColor: 'background.paper'
          }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 600,
                    color: 'text.primary'
                  }}
                >
                  Project Tasks ({tasks.length})
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddTaskIcon />}
                  onClick={() => navigate(`/projects/${projectId}/tasks/new`)}
                  sx={{
                    borderRadius: 1,
                    textTransform: 'none',
                    boxShadow: 'none',
                    '&:hover': {
                      boxShadow: 'none'
                    }
                  }}
                >
                  New Task
                </Button>
              </Box>

              {tasksLoading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="100px">
                  <CircularProgress size={40} />
                </Box>
              ) : tasks.length > 0 ? (
                <List sx={{ 
                  width: '100%', 
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  overflow: 'hidden'
                }}>
                  {tasks.map((task, index) => (
                    <Box key={task._id}>
                      <ListItem
                        alignItems="flex-start"
                        button
                        onClick={() => handleTaskClick(task._id)}
                        sx={{
                          '&:hover': {
                            backgroundColor: 'action.hover',
                          },
                          transition: 'background-color 0.2s',
                          py: 2
                        }}
                      >
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center">
                              <Badge
                                color={getStatusColor(task.status)}
                                variant="dot"
                                sx={{ mr: 2 }}
                              />
                              <Typography 
                                variant="subtitle1" 
                                component="span"
                                sx={{ fontWeight: 500 }}
                              >
                                {task.title}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <>
                              {task.description && (
                                <Typography
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                  display="block"
                                  sx={{ 
                                    mt: 0.5,
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                  }}
                                >
                                  {task.description}
                                </Typography>
                              )}
                              <Box 
                                display="flex" 
                                alignItems="center"
                                sx={{ mt: 1 }}
                              >
                                <Chip
                                  label={task.status}
                                  size="small"
                                  color={getStatusColor(task.status)}
                                  sx={{ 
                                    mr: 1,
                                    fontWeight: 500
                                  }}
                                />
                                <Typography
                                  component="span"
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  Due: {new Date(task.dueDate).toLocaleDateString()}
                                </Typography>
                              </Box>
                            </>
                          }
                        />
                        <IconButton edge="end" aria-label="more">
                          <MoreIcon />
                        </IconButton>
                      </ListItem>
                      {index < tasks.length - 1 && (
                        <Divider 
                          component="li" 
                          sx={{ 
                            mx: 2,
                            borderColor: 'divider'
                          }} 
                        />
                      )}
                    </Box>
                  ))}
                </List>
              ) : (
                <Box 
                  sx={{ 
                    p: 3,
                    textAlign: 'center',
                    backgroundColor: 'action.hover',
                    borderRadius: 1
                  }}
                >
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    No tasks yet. Create one to get started!
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddTaskIcon />}
                    onClick={() => navigate(`/projects/${projectId}/tasks/new`)}
                    sx={{
                      borderRadius: 1,
                      textTransform: 'none'
                    }}
                  >
                    Create First Task
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProjectDetail;
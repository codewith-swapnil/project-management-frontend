import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Button, Typography, Card, CardContent, Grid,
  TextField, CircularProgress, MenuItem, Chip, Alert,
  List, ListItem, ListItemText, Divider, Badge, Avatar,
  IconButton, Tooltip, Container, Paper
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  PersonAdd as AddMemberIcon,
  PersonRemove as RemoveMemberIcon,
  AddTask as AddTaskIcon,
  Edit as EditIcon,
  Group as GroupIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import api from '../api/index';
import { styled } from '@mui/system';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[4],
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: theme.shadows[7],
  },
  backgroundColor: theme.palette.background.paper,
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(1.5, 2.5),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    cursor: 'pointer',
    transform: 'translateX(5px)',
  },
  transition: 'background-color 0.2s ease-in-out, transform 0.2s ease-in-out',
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(0.5),
}));

const statusColors = {
  'Todo': 'info',
  'In Progress': 'primary',
  'Completed': 'success',
  'Blocked': 'error',
  'In Review': 'warning',
};

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

        const [projectRes, usersRes, tasksRes] = await Promise.all([
          api.get(`/api/projects/${projectId}`),
          api.get('/api/auth/users'),
          api.get(`/api/tasks/project/${projectId}`)
        ]);

        const projectData = projectRes.data;
        const allUsers = usersRes.data;
        const projectTasks = tasksRes.data;

        const enhancedProject = {
          ...projectData,
          createdBy: allUsers.find(user => user._id === projectData.createdBy) || { _id: projectData.createdBy, name: 'Unknown User' },
          members: projectData.members.map(memberId =>
            allUsers.find(user => user._id === memberId) || { _id: memberId, name: 'Unknown User' }
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
        setError(`Failed to load project details: ${errorMessage}. Please try refreshing.`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  const fetchTasksForProject = async () => {
    try {
      setTasksLoading(true);
      const { data } = await api.get(`/api/tasks/project/${projectId}`);
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError(error.response?.data?.message || 'Failed to load tasks for this project.');
    } finally {
      setTasksLoading(false);
    }
  };

  const handleAddMember = async () => {
    if (!selectedUser) return;
    try {
      await api.post(`/api/projects/${projectId}/members`, { userId: selectedUser });
      const { data: updatedProjectData } = await api.get(`/api/projects/${projectId}`);
      const updatedMembers = updatedProjectData.members.map(memberId =>
        users.find(user => user._id === memberId) || { _id: memberId, name: 'Unknown User' }
      );
      setProject(prev => ({ ...prev, members: updatedMembers }));
      setSelectedUser('');
    } catch (error) {
      console.error('Error adding member:', error);
      setError(error.response?.data?.message || 'Failed to add member.');
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      await api.delete(`/api/projects/${projectId}/members/${memberId}`);
      const { data: updatedProjectData } = await api.get(`/api/projects/${projectId}`);
      const updatedMembers = updatedProjectData.members.map(mId =>
        users.find(user => user._id === mId) || { _id: mId, name: 'Unknown User' }
      );
      setProject(prev => ({ ...prev, members: updatedMembers }));
    } catch (error) {
      console.error('Error removing member:', error);
      setError(error.response?.data?.message || 'Failed to remove member.');
    }
  };

  const handleTaskClick = (taskId) => {
    navigate(`/tasks/${taskId}`);
  };

  const handleEditTask = (taskId, e) => {
    e.stopPropagation();
    navigate(`/tasks/${taskId}/edit`);
  };

  const getStatusChipColor = (status) => {
    return statusColors[status] || 'default';
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 8, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress size={60} sx={{ mb: 2 }} />
        <Typography variant="h6" color="text.secondary">Loading project details...</Typography>
      </Container>
    );
  }

  if (error && !project) {
    return (
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', bgcolor: 'error.main', color: 'error.contrastText', borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom>Error Loading Project</Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>{error}</Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/projects')}
            startIcon={<BackIcon />}
            sx={{ bgcolor: 'error.light', '&:hover': { bgcolor: 'error.dark' } }}
          >
            Back to Projects
          </Button>
        </Paper>
      </Container>
    );
  }

  if (!project) {
    return (
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', bgcolor: 'warning.main', color: 'warning.contrastText', borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom>Project Not Found</Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>The project you are looking for does not exist or you do not have access.</Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/projects')}
            startIcon={<BackIcon />}
            color="warning"
          >
            Back to Projects
          </Button>
        </Paper>
      </Container>
    );
  }

  const availableUsersToAdd = users.filter(user =>
    !project.members?.some(m => m._id === user._id)
  );

  return (
    <Container maxWidth="lg" sx={{ pt: 4, pb: 6, backgroundColor: 'transparent' }}>
      <Box mb={4} display="flex" justifyContent="flex-start" alignItems="center"> {/* Changed justifyContent to flex-start */}
        <Button
          onClick={() => navigate('/projects')}
          startIcon={<BackIcon />}
          sx={{
            textTransform: 'none',
            color: 'text.secondary',
            '&:hover': {
              backgroundColor: 'action.hover',
            }
          }}
        >
          Back to Projects
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 1, boxShadow: 1 }}>
          {error}
        </Alert>
      )}

      <StyledCard sx={{ mb: 4, '&:hover': { transform: 'none', boxShadow: 4 } }}>
        <CardContent>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: 'primary.dark',
              display: 'flex',
              alignItems: 'center',
              mb: 2
            }}
          >
            {project.title}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              lineHeight: 1.6,
              mb: 2
            }}
          >
            {project.description || 'No description provided for this project.'}
          </Typography>
          <Box display="flex" alignItems="center" mt={2} sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 2 }}>
            <Avatar
              src={project.createdBy?.avatar || '/default-user.png'}
              alt={project.createdBy?.name || 'Unknown User'}
              sx={{
                width: 36,
                height: 36,
                mr: 1.5,
                border: '2px solid',
                borderColor: 'primary.light'
              }}
            />
            <Typography variant="subtitle2" color="text.secondary">
              Created by: <Typography component="span" variant="subtitle2" fontWeight="medium">{project.createdBy?.name || 'Unknown'}</Typography> on {new Date(project.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
        </CardContent>
      </StyledCard>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <GroupIcon color="primary" sx={{ mr: 1.5, fontSize: 30 }} />
                <Typography
                  variant="h5"
                  component="h2"
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
                  backgroundColor: 'action.selected',
                  p: 2,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <TextField
                  select
                  label="Add Team Member"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  fullWidth
                  sx={{
                    mr: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                    },
                    '& .MuiInputLabel-root': {
                      color: 'text.secondary'
                    }
                  }}
                  size="small"
                  disabled={!availableUsersToAdd.length}
                >
                  <MenuItem value="" disabled>
                    <em>{availableUsersToAdd.length ? "Select a user" : "No new users to add"}</em>
                  </MenuItem>
                  {availableUsersToAdd.map((user) => (
                    <MenuItem key={user._id} value={user._id}>
                      <Box display="flex" alignItems="center">
                        <Avatar
                          src={user.avatar || '/default-user.png'}
                          alt={user.name}
                          sx={{
                            width: 28,
                            height: 28,
                            mr: 1.5,
                            border: '1px solid',
                            borderColor: 'divider'
                          }}
                        />
                        <Typography variant="body2">{user.name} ({user.email})</Typography>
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
                    boxShadow: 2,
                    '&:hover': {
                      boxShadow: 4,
                      backgroundColor: 'primary.dark'
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
                      gap: 1.5,
                      maxHeight: 200,
                      overflowY: 'auto',
                      p: 1,
                      border: '1px dashed',
                      borderColor: 'divider',
                      borderRadius: 1
                    }}
                  >
                    {project.members.map((member) => (
                      <Chip
                        key={member._id}
                        avatar={<Avatar src={member.avatar || '/default-user.png'} alt={member.name} />}
                        label={`${member.name || 'Unknown'}${member.email ? ` (${member.email.split('@')[0]})` : ''}`}
                        onDelete={() => handleRemoveMember(member._id)}
                        deleteIcon={
                          <Tooltip title="Remove member from project">
                            <RemoveMemberIcon />
                          </Tooltip>
                        }
                        color="primary"
                        variant="outlined"
                        sx={{
                          borderRadius: 2,
                          pr: 0.5,
                          '& .MuiChip-avatar': {
                            width: 28,
                            height: 28,
                            bgcolor: 'primary.light'
                          }
                        }}
                      />
                    ))}
                  </Box>
                ) : (
                  <Box
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      backgroundColor: 'action.hover',
                      borderRadius: 1,
                      border: '1px dashed',
                      borderColor: 'divider'
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      No team members yet. Use the selector above to add members and collaborate!
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box display="flex" alignItems="center">
                  <AssignmentIcon color="primary" sx={{ mr: 1.5, fontSize: 30 }} />
                  <Typography
                    variant="h5"
                    component="h2"
                    sx={{
                      fontWeight: 600,
                      color: 'text.primary'
                    }}
                  >
                    Project Tasks ({tasks.length})
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<AddTaskIcon />}
                  onClick={() => navigate(`/projects/${projectId}/tasks/new`)}
                  sx={{
                    borderRadius: 1,
                    textTransform: 'none',
                    boxShadow: 2,
                    '&:hover': {
                      boxShadow: 4,
                      backgroundColor: 'secondary.dark'
                    }
                  }}
                >
                  New Task
                </Button>
              </Box>

              {tasksLoading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="150px">
                  <CircularProgress size={40} />
                </Box>
              ) : tasks.length > 0 ? (
                <List sx={{
                  width: '100%',
                  bgcolor: 'background.default',
                  borderRadius: 1,
                  overflow: 'hidden',
                  maxHeight: 400,
                  overflowY: 'auto',
                  border: '1px solid',
                  borderColor: 'divider'
                }}>
                  {tasks.map((task, index) => (
                    <Box key={task._id}>
                      <StyledListItem
                        alignItems="flex-start"
                        onClick={() => handleTaskClick(task._id)}
                      >
                        <ListItemText
                          primary={
                            <Box component="span" display="flex" alignItems="center">
                              <Badge
                                color={getStatusChipColor(task.status)}
                                variant="dot"
                                sx={{ mr: 1.5, '& .MuiBadge-dot': { width: 10, height: 10, borderRadius: '50%' } }}
                              />
                              <Typography
                                component="span"
                                variant="subtitle1"
                                sx={{ fontWeight: 500, color: 'text.primary' }}
                              >
                                {task.title}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Box component="span">
                              {task.description && (
                                <Typography
                                  component="span"
                                  variant="body2"
                                  color="text.secondary"
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
                                component="span"
                                display="flex"
                                alignItems="center"
                                sx={{ mt: 1 }}
                              >
                                <Chip
                                  label={task.status}
                                  size="small"
                                  color={getStatusChipColor(task.status)}
                                  sx={{
                                    mr: 1,
                                    fontWeight: 500,
                                    borderRadius: 1,
                                    fontSize: '0.75rem'
                                  }}
                                />
                                {task.dueDate && (
                                  <Typography
                                    component="span"
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    Due: {new Date(task.dueDate).toLocaleDateString()}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          }
                        />
                        <Tooltip title="Edit Task">
                          <IconButton
                            edge="end"
                            aria-label="edit"
                            onClick={(e) => handleEditTask(task._id, e)}
                            sx={{ color: 'text.secondary' }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      </StyledListItem>
                      {index < tasks.length - 1 && (
                        <Divider
                          component="li"
                          variant="inset"
                          sx={{
                            mx: 2,
                            borderColor: 'divider',
                            opacity: 0.7
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
                    borderRadius: 1,
                    border: '1px dashed',
                    borderColor: 'divider'
                  }}
                >
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    No tasks yet for this project. Be the first to create one!
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
          </StyledCard>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProjectDetail;
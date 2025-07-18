import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box, Button, TextField, Typography,
  MenuItem, Alert, CircularProgress, Card,
  Avatar, Divider, Stack
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import api from '../api/index';

const CreateTask = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState({
    title: '',
    description: '',
    dueDate: null,
    assignedUser: ''
  });
  const [projectMembers, setProjectMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [projectLoading, setProjectLoading] = useState(true);

  // Fetch project members with user details
  useEffect(() => {
    const fetchProjectMembers = async () => {
      try {
        setProjectLoading(true);
        
        // First get the project details including members
        const projectResponse = await api.get(`/api/projects/${projectId}`);
        const memberIds = projectResponse.data.members || [];
        
        // Then get all users to match with member IDs
        const usersResponse = await api.get('/api/auth/users');
        const allUsers = usersResponse.data || [];
        
        // Filter users to only include project members
        const members = allUsers.filter(user => memberIds.includes(user._id));
        
        setProjectMembers(members);
      } catch (err) {
        console.error('Failed to fetch project members:', err);
        setError('Failed to load project members');
      } finally {
        setProjectLoading(false);
      }
    };
    
    fetchProjectMembers();
  }, [projectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!task.title) {
      setError('Title is required');
      return;
    }

    try {
      setLoading(true);

      const taskData = {
        title: task.title,
        description: task.description,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : undefined,
        project: projectId,
        assignedUser: task.assignedUser || undefined
      };

      await api.post('/api/tasks', taskData);
      setSuccess(true);
      setTimeout(() => navigate(`/projects/${projectId}`), 1500);
    } catch (err) {
      console.error('Task creation failed:', err);
      setError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ 
        maxWidth: 800, 
        mx: 'auto', 
        p: 3,
        backgroundColor: '#f5f7fa',
        minHeight: '100vh'
      }}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate(`/projects/${projectId}`)}
          sx={{
            mb: 3,
            textTransform: 'none',
            color: 'primary.main',
            '&:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.08)'
            }
          }}
        >
          Back to Project
        </Button>

        <Card sx={{ 
          p: 4,
          borderRadius: 2,
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
          backgroundColor: 'background.paper'
        }}>
          <Typography 
            variant="h4" 
            gutterBottom
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              mb: 3,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            Create New Task
          </Typography>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 1,
                boxShadow: 'none',
                border: '1px solid',
                borderColor: 'error.light'
              }}
              onClose={() => setError('')}
            >
              {error}
            </Alert>
          )}

          {success && (
            <Alert 
              severity="success" 
              sx={{ 
                mb: 3,
                borderRadius: 1,
                boxShadow: 'none',
                border: '1px solid',
                borderColor: 'success.light'
              }}
            >
              Task created successfully! Redirecting...
            </Alert>
          )}

          <Box 
            component="form" 
            onSubmit={handleSubmit}
            sx={{ mt: 2 }}
          >
            <TextField
              label="Task Title"
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              fullWidth
              margin="normal"
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                  '&:hover fieldset': {
                    borderColor: 'primary.main'
                  }
                },
                mb: 3
              }}
              InputLabelProps={{
                shrink: true
              }}
            />

            <TextField
              label="Description"
              value={task.description}
              onChange={(e) => setTask({ ...task, description: e.target.value })}
              fullWidth
              margin="normal"
              multiline
              rows={4}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                  '&:hover fieldset': {
                    borderColor: 'primary.main'
                  }
                },
                mb: 3
              }}
              InputLabelProps={{
                shrink: true
              }}
            />

            <DatePicker
              label="Due Date"
              value={task.dueDate}
              onChange={(newValue) => setTask({ ...task, dueDate: newValue })}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  fullWidth 
                  margin="normal"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                      '&:hover fieldset': {
                        borderColor: 'primary.main'
                      }
                    },
                    mb: 3
                  }}
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              )}
            />

            {projectLoading ? (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 3,
                p: 2,
                backgroundColor: 'action.hover',
                borderRadius: 1
              }}>
                <CircularProgress size={20} />
                <Typography variant="body2" sx={{ ml: 2 }}>
                  Loading project members...
                </Typography>
              </Box>
            ) : (
              <TextField
                select
                label="Assign To"
                value={task.assignedUser}
                onChange={(e) => setTask({ ...task, assignedUser: e.target.value })}
                fullWidth
                margin="normal"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                    '&:hover fieldset': {
                      borderColor: 'primary.main'
                    }
                  },
                  mb: 3
                }}
                InputLabelProps={{
                  shrink: true
                }}
              >
                <MenuItem value="">
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <PersonIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      Unassigned
                    </Typography>
                  </Stack>
                </MenuItem>
                {projectMembers.map((member) => (
                  <MenuItem key={member._id} value={member._id}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar
                        src={member.avatar}
                        sx={{ 
                          width: 32, 
                          height: 32,
                          bgcolor: 'primary.light',
                          color: 'primary.contrastText',
                          fontSize: 14,
                          fontWeight: 500
                        }}
                      >
                        {member.name?.split(' ').map(n => n[0]).join('') || 'U'}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                          {member.name || 'Unknown User'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {member.email || ''}
                        </Typography>
                      </Box>
                    </Stack>
                  </MenuItem>
                ))}
                {projectMembers.length === 0 && (
                  <MenuItem disabled>
                    <Typography variant="body2" color="text.secondary">
                      No members available in this project
                    </Typography>
                  </MenuItem>
                )}
              </TextField>
            )}

            <Divider sx={{ my: 3 }} />

            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'flex-end',
              gap: 2,
              mt: 3
            }}>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={() => navigate(`/projects/${projectId}`)}
                disabled={loading}
                sx={{
                  borderRadius: 1,
                  textTransform: 'none',
                  px: 4,
                  py: 1,
                  fontWeight: 500,
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2
                  }
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                disabled={loading || success || projectLoading}
                sx={{
                  borderRadius: 1,
                  textTransform: 'none',
                  px: 4,
                  py: 1,
                  fontWeight: 500,
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: 'none',
                    backgroundColor: 'primary.dark'
                  }
                }}
              >
                {loading ? 'Creating...' : 'Create Task'}
              </Button>
            </Box>
          </Box>
        </Card>
      </Box>
    </LocalizationProvider>
  );
};

export default CreateTask;
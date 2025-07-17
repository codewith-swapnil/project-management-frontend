import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box, Button, TextField, Typography,
  MenuItem, Alert, CircularProgress, Card,
  Avatar, Divider, Chip
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
    assignedTo: ''
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Fetch users for assignment
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/api/auth/users');
        setUsers(data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    };
    fetchUsers();
  }, []);

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

      // Format the payload according to your API
      const taskData = {
        title: task.title,
        description: task.description,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : undefined,
        project: projectId,
        assignedTo: task.assignedTo || undefined
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
            backgroundColor: 'primary.light',
            color: 'primary.dark'
          }
        }}
      >
        Back to Project
      </Button>

      <Card sx={{ 
        p: 4,
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: 'background.paper'
      }}>
        <Typography 
          variant="h4" 
          gutterBottom
          sx={{
            fontWeight: 700,
            color: 'primary.main',
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
              boxShadow: 1
            }}
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
              boxShadow: 1
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
                borderRadius: 1
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
            rows={5}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1
              },
              mb: 3
            }}
            InputLabelProps={{
              shrink: true
            }}
          />

          <LocalizationProvider dateAdapter={AdapterDateFns}>
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
                      borderRadius: 1
                    },
                    mb: 3
                  }}
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              )}
            />
          </LocalizationProvider>

          <TextField
            select
            label="Assign To"
            value={task.assignedTo}
            onChange={(e) => setTask({ ...task, assignedTo: e.target.value })}
            fullWidth
            margin="normal"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1
              },
              mb: 3
            }}
            InputLabelProps={{
              shrink: true
            }}
          >
            <MenuItem value="">
              <Box display="flex" alignItems="center">
                <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <em>Unassigned</em>
              </Box>
            </MenuItem>
            {users.map((user) => (
              <MenuItem key={user._id} value={user._id}>
                <Box display="flex" alignItems="center">
                  <Avatar
                    src={user.avatar}
                    sx={{ 
                      width: 24, 
                      height: 24, 
                      mr: 2,
                      border: '1px solid',
                      borderColor: 'divider'
                    }}
                  />
                  {user.name} ({user.email})
                </Box>
              </MenuItem>
            ))}
          </TextField>

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
                px: 3,
                py: 1
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              disabled={loading || success}
              sx={{
                borderRadius: 1,
                textTransform: 'none',
                px: 3,
                py: 1,
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: 'none'
                }
              }}
            >
              {loading ? 'Creating...' : 'Create Task'}
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default CreateTask;
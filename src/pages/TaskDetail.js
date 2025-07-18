import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, TextField, Button, Card, CardContent,
  Grid, CircularProgress, Alert, Avatar, Divider,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ArrowBack as BackIcon } from '@mui/icons-material';
import api from '../api';

const statusOptions = ['Todo', 'In Progress', 'Completed', 'Blocked'];

const EditTask = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Todo',
    dueDate: null,
    assignedUser: '',
    project: ''
  });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [taskRes, usersRes, projectsRes] = await Promise.all([
          api.get(`/api/tasks/${taskId}`),
          api.get('/api/auth/users'),
          api.get('/api/projects')
        ]);

        setTask(taskRes.data);
        setUsers(usersRes.data);
        setProjects(projectsRes.data);

        // Set form data from the fetched task
        setFormData({
          title: taskRes.data.title,
          description: taskRes.data.description,
          status: taskRes.data.status,
          dueDate: taskRes.data.dueDate ? new Date(taskRes.data.dueDate) : null,
          assignedUser: taskRes.data.assignedUser?._id || '',
          project: taskRes.data.project?._id || ''
        });
      } catch (err) {
        setError(err.message || 'Failed to fetch task data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [taskId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, dueDate: date }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        dueDate: formData.dueDate,
        assignedUser: formData.assignedUser,
        project: formData.project
      };

      await api.put(`/api/tasks/${taskId}`, updateData);
      setSuccess(true);
      setTimeout(() => navigate(`/tasks/${taskId}`), 1500);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Your session has expired. Please login again.');
        // Don't redirect here, let the user decide
      } else {
        setError(err.response?.data?.message || 'Failed to update task');
      }
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
      <Box>
        <Alert severity="error">{error}</Alert>
        <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 3 }}
        >
          Back
        </Button>

        <Card>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              Edit Task
            </Typography>

            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Task updated successfully! Redirecting...
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={4}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      name="status"
                      value={formData.status}
                      label="Status"
                      onChange={handleChange}
                      required
                    >
                      {statusOptions.map(status => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="Due Date"
                    value={formData.dueDate}
                    onChange={handleDateChange}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Assigned To</InputLabel>
                    <Select
                      name="assignedUser"
                      value={formData.assignedUser}
                      label="Assigned To"
                      onChange={handleChange}
                    >
                      <MenuItem value="">Unassigned</MenuItem>
                      {users.map(user => (
                        <MenuItem key={user._id} value={user._id}>
                          <Box display="flex" alignItems="center">
                            <Avatar
                              src={user.avatar}
                              sx={{ width: 24, height: 24, mr: 1 }}
                            />
                            {user.name}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Project</InputLabel>
                    <Select
                      name="project"
                      value={formData.project}
                      label="Project"
                      onChange={handleChange}
                    >
                      <MenuItem value="">No Project</MenuItem>
                      {projects.map(project => (
                        <MenuItem key={project._id} value={project._id}>
                          {project.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Box display="flex" justifyContent="flex-end" gap={2}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate(-1)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                    >
                      Save Changes
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Box>
    </LocalizationProvider>
  );
};

export default EditTask;
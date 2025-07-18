import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, TextField, Button, Card, CardContent,
  Grid, CircularProgress, Alert, Avatar, Divider,
  FormControl, InputLabel, Select, MenuItem,
  Container,
  Paper,
  IconButton, // Added IconButton for file delete
  List, ListItem, ListItemText, ListItemSecondaryAction // For displaying uploaded files
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
  AttachFile as AttachFileIcon, // Icon for file upload
  Delete as DeleteIcon, // Icon for file delete
  CloudDownload as DownloadIcon // Icon for file download
} from '@mui/icons-material';
import api from '../api';
import { styled } from '@mui/system';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[5],
  padding: theme.spacing(3),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 4,
  padding: theme.spacing(1.5, 3),
  fontWeight: 'bold',
  textTransform: 'none',
  boxShadow: theme.shadows[3],
  '&:hover': {
    boxShadow: theme.shadows[6],
    transform: 'translateY(-1px)',
  },
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
}));

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
  const [selectedFiles, setSelectedFiles] = useState([]); // State for new files to upload
  const [uploadingFiles, setUploadingFiles] = useState(false); // State for file upload progress
  const [filesError, setFilesError] = useState(null); // Error for file uploads

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

        setFormData({
          title: taskRes.data.title,
          description: taskRes.data.description,
          status: taskRes.data.status,
          dueDate: taskRes.data.dueDate ? new Date(taskRes.data.dueDate) : null,
          assignedUser: taskRes.data.assignedUser?._id || '',
          project: taskRes.data.project?._id || ''
        });
      } catch (err) {
        setError(err.message || 'Failed to fetch task data. Please check your network connection.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [taskId]);

  // Function to re-fetch task data after file operations
  const refreshTaskData = async () => {
    try {
      const taskRes = await api.get(`/api/tasks/${taskId}`);
      setTask(taskRes.data);
      setFilesError(null); // Clear file-specific errors on refresh
    } catch (err) {
      console.error('Failed to refresh task data after file operation:', err);
      setFilesError('Failed to refresh task files. Please reload the page.');
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, dueDate: date }));
  };

  // Handler for file input change
  const handleFileChange = (event) => {
    setFilesError(null); // Clear previous file errors
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  // Handler for uploading selected files
  const handleFileUpload = async () => {
    if (selectedFiles.length === 0) {
      setFilesError('Please select files to upload.');
      return;
    }

    setUploadingFiles(true);
    setFilesError(null);

    const formDataForFiles = new FormData();
    selectedFiles.forEach(file => {
      formDataForFiles.append('files', file); // 'files' must match the Multer field name
    });

    try {
      await api.post(`/api/tasks/${taskId}/files`, formDataForFiles, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSelectedFiles([]); // Clear selected files after successful upload
      setSuccess(true); // Indicate overall success
      refreshTaskData(); // Re-fetch task to show new files
    } catch (err) {
      console.error('File upload error:', err.response?.data || err.message);
      setFilesError(err.response?.data?.message || 'Failed to upload files. Please try again.');
    } finally {
      setUploadingFiles(false);
    }
  };

  // Handler for deleting an existing file
  const handleDeleteFile = async (fileId) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        await api.delete(`/api/tasks/${taskId}/files/${fileId}`);
        setSuccess(true);
        refreshTaskData(); // Re-fetch task to remove deleted file
      } catch (err) {
        console.error('File deletion error:', err.response?.data || err.message);
        setFilesError(err.response?.data?.message || 'Failed to delete file.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const updateData = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        dueDate: formData.dueDate,
        assignedUser: formData.assignedUser || null,
        project: formData.project || null
      };

      await api.put(`/api/tasks/${taskId}`, updateData);
      setSuccess(true);
      setTimeout(() => navigate(`/tasks/${taskId}`), 1500); // Redirect after successful update
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Your session has expired. Please login again to save changes.');
      } else {
        setError(err.response?.data?.message || 'Failed to update task. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress size={60} sx={{ mb: 2 }} />
        <Typography variant="h6" color="text.secondary">Loading task details...</Typography>
      </Container>
    );
  }

  if (error && !success) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', bgcolor: 'error.main', color: 'error.contrastText', borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom>Oops! Something Went Wrong</Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>{error}</Typography>
          <Button
            variant="contained"
            onClick={() => navigate(-1)}
            startIcon={<BackIcon />}
            sx={{ bgcolor: 'error.light', '&:hover': { bgcolor: 'error.dark' } }}
          >
            Go Back
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 3, textTransform: 'none', color: 'text.secondary' }}
        >
          Back to Task Details
        </Button>

        <StyledCard>
          <CardContent>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              Edit Task 📝
            </Typography>

            {success && (
              <Alert severity="success" sx={{ mb: 3, borderRadius: 1 }}>
                Task updated successfully! Redirecting...
              </Alert>
            )}
            {error && !success && ( // Show general form errors
              <Alert severity="error" sx={{ mb: 3, borderRadius: 1 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Task Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    fullWidth
                    required
                    variant="outlined"
                    color="primary"
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
                    rows={5}
                    variant="outlined"
                    color="primary"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined">
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
                      <TextField
                        {...params}
                        fullWidth
                        variant="outlined"
                        color="primary"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Assigned To</InputLabel>
                    <Select
                      name="assignedUser"
                      value={formData.assignedUser}
                      label="Assigned To"
                      onChange={handleChange}
                    >
                      <MenuItem value="">
                        <em>Unassigned</em>
                      </MenuItem>
                      {users.map(user => (
                        <MenuItem key={user._id} value={user._id}>
                          <Box display="flex" alignItems="center">
                            <Avatar
                              src={user.avatar || '/default-avatar.png'}
                              alt={user.name}
                              sx={{ width: 28, height: 28, mr: 1, border: '1px solid #e0e0e0' }}
                            />
                            <Typography variant="body1">{user.name}</Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Project</InputLabel>
                    <Select
                      name="project"
                      value={formData.project}
                      label="Project"
                      onChange={handleChange}
                    >
                      <MenuItem value="">
                        <em>No Project</em>
                      </MenuItem>
                      {projects.map(project => (
                        <MenuItem key={project._id} value={project._id}>
                          {project.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* --- File Upload Section --- */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 3 }}>
                    <Typography variant="overline" color="text.secondary">Attached Files</Typography>
                  </Divider>

                  {filesError && (
                    <Alert severity="error" sx={{ mb: 2, borderRadius: 1 }}>
                      {filesError}
                    </Alert>
                  )}

                  {task?.files && task.files.length > 0 ? (
                    <List dense>
                      {task.files.map((file) => (
                        <ListItem
                          key={file._id}
                          secondaryAction={
                            <Box>
                              <IconButton
                                edge="end"
                                aria-label="download"
                                onClick={() => window.open(`${api.defaults.baseURL}${file.filePath}`, '_blank')} // Assuming file path is accessible
                                sx={{ mr: 1 }}
                              >
                                <DownloadIcon />
                              </IconButton>
                              <IconButton
                                edge="end"
                                aria-label="delete"
                                onClick={() => handleDeleteFile(file._id)}
                              >
                                <DeleteIcon color="error" />
                              </IconButton>
                            </Box>
                          }
                          sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                            mb: 1,
                            bgcolor: 'background.paper',
                            '&:hover': {
                              bgcolor: 'action.hover'
                            }
                          }}
                        >
                          <ListItemText
                            primary={
                              <Typography variant="body1" component="span" sx={{ fontWeight: 'bold' }}>
                                {file.originalName}
                              </Typography>
                            }
                            secondary={
                              <Typography variant="caption" color="text.secondary">
                                {new Date(file.uploadedAt).toLocaleDateString()} by {file.uploadedBy?.name || 'Unknown'} ({(file.size / 1024).toFixed(2)} KB)
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      No files attached to this task yet.
                    </Typography>
                  )}

                  <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <input
                      accept="image/*,application/pdf" // Specify allowed file types
                      style={{ display: 'none' }}
                      id="upload-task-files"
                      multiple
                      type="file"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="upload-task-files">
                      <StyledButton
                        variant="outlined"
                        component="span" // Makes the button act as a label for the input
                        startIcon={<AttachFileIcon />}
                        disabled={uploadingFiles}
                      >
                        {selectedFiles.length > 0 ? `${selectedFiles.length} File(s) Selected` : 'Choose Files'}
                      </StyledButton>
                    </label>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleFileUpload}
                      disabled={selectedFiles.length === 0 || uploadingFiles}
                      startIcon={uploadingFiles ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                      sx={{ borderRadius: 2, textTransform: 'none', px: 3, py: 1.5 }}
                    >
                      {uploadingFiles ? 'Uploading...' : 'Upload Selected'}
                    </Button>
                  </Box>
                </Grid>
                {/* --- End File Upload Section --- */}

                <Grid item xs={12}>
                  <Divider sx={{ my: 3 }} />
                  <Box display="flex" justifyContent="flex-end" gap={2}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate(-1)}
                      sx={{ textTransform: 'none', px: 3, py: 1.5, borderRadius: 2 }}
                    >
                      Cancel
                    </Button>
                    <StyledButton
                      type="submit"
                      variant="contained"
                      color="primary"
                      startIcon={<SaveIcon />}
                    >
                      Save Task Changes
                    </StyledButton>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </StyledCard>
      </Container>
    </LocalizationProvider>
  );
};

export default EditTask;
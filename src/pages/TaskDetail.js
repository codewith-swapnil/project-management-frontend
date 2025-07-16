import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Button, Typography, Card, CardContent, Grid, TextField, 
  CircularProgress, MenuItem, Chip, Divider, Avatar, List, 
  ListItem, ListItemAvatar, ListItemText, IconButton 
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Delete, CloudUpload } from '@mui/icons-material';
import axios from 'axios';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: '',
    dueDate: null,
    assignedTo: ''
  });
  const [users, setUsers] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const { data } = await axios.get(`/api/tasks/${id}`);
        setTask(data);
        setFormData({
          title: data.title,
          description: data.description,
          status: data.status,
          dueDate: data.dueDate ? new Date(data.dueDate) : null,
          assignedTo: data.assignedTo?._id
        });
      } catch (error) {
        console.error('Error fetching task:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get('/api/users');
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, dueDate: date });
  };

  const handleSubmit = async () => {
    try {
      await axios.put(`/api/tasks/${id}`, formData);
      const { data } = await axios.get(`/api/tasks/${id}`);
      setTask(data);
      setEditing(false);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleStatusChange = async (status) => {
    try {
      await axios.patch(`/api/tasks/${id}/status`, { status });
      const { data } = await axios.get(`/api/tasks/${id}`);
      setTask(data);
      setFormData(prev => ({ ...prev, status }));
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) return;
    
    try {
      const formData = new FormData();
      formData.append('files', file);
      
      await axios.post(`/api/tasks/${id}/files`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      const { data } = await axios.get(`/api/tasks/${id}`);
      setTask(data);
      setFile(null);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleFileDelete = async (fileId) => {
    try {
      await axios.delete(`/api/tasks/${id}/files/${fileId}`);
      const { data } = await axios.get(`/api/tasks/${id}`);
      setTask(data);
    } catch (error) {
      console.error('Error deleting file:', error);
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
      <Button onClick={() => navigate('/tasks')} sx={{ mb: 2 }}>
        Back to Tasks
      </Button>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          {editing ? (
            <Box>
              <TextField
                label="Title"
                name="title"
                fullWidth
                margin="normal"
                value={formData.title}
                onChange={handleChange}
              />
              <TextField
                label="Description"
                name="description"
                fullWidth
                margin="normal"
                multiline
                rows={4}
                value={formData.description}
                onChange={handleChange}
              />
              <TextField
                select
                label="Status"
                name="status"
                fullWidth
                margin="normal"
                value={formData.status}
                onChange={handleChange}
              >
                <MenuItem value="Todo">Todo</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </TextField>
              <DatePicker
                label="Due Date"
                value={formData.dueDate}
                onChange={handleDateChange}
                renderInput={(params) => (
                  <TextField {...params} fullWidth margin="normal" />
                )}
              />
              <TextField
                select
                label="Assigned To"
                name="assignedTo"
                fullWidth
                margin="normal"
                value={formData.assignedTo}
                onChange={handleChange}
              >
                {users.map(user => (
                  <MenuItem key={user._id} value={user._id}>
                    {user.name} ({user.email})
                  </MenuItem>
                ))}
              </TextField>
              
              <Box mt={2}>
                <Button 
                  variant="contained" 
                  onClick={handleSubmit}
                  sx={{ mr: 2 }}
                >
                  Save
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          ) : (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h4">{task.title}</Typography>
                <Button onClick={() => setEditing(true)}>Edit</Button>
              </Box>
              
              <Typography variant="body1" paragraph sx={{ mt: 2 }}>
                {task.description}
              </Typography>
              
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2">Status</Typography>
                  <Box mt={1}>
                    <Chip 
                      label={task.status} 
                      color={
                        task.status === 'Completed' ? 'success' : 
                        task.status === 'In Progress' ? 'warning' : 'default'
                      } 
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2">Due Date</Typography>
                  <Typography>
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2">Assigned To</Typography>
                  <Typography>
                    {task.assignedTo?.name || '-'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2">Project</Typography>
                  <Typography>
                    {task.project?.title || '-'}
                  </Typography>
                </Grid>
              </Grid>
              
              <Box mt={3}>
                <Typography variant="h6">Quick Status Update</Typography>
                <Box mt={1}>
                  <Button 
                    variant={task.status === 'Todo' ? 'contained' : 'outlined'} 
                    sx={{ mr: 1 }}
                    onClick={() => handleStatusChange('Todo')}
                  >
                    Todo
                  </Button>
                  <Button 
                    variant={task.status === 'In Progress' ? 'contained' : 'outlined'} 
                    sx={{ mr: 1 }}
                    onClick={() => handleStatusChange('In Progress')}
                  >
                    In Progress
                  </Button>
                  <Button 
                    variant={task.status === 'Completed' ? 'contained' : 'outlined'} 
                    onClick={() => handleStatusChange('Completed')}
                  >
                    Completed
                  </Button>
                </Box>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Attachments
          </Typography>
          
          <Box display="flex" alignItems="center" mb={2}>
            <input
              accept="image/*,.pdf"
              style={{ display: 'none' }}
              id="file-upload"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<CloudUpload />}
              >
                Select File
              </Button>
            </label>
            {file && (
              <>
                <Typography sx={{ ml: 2, mr: 2 }}>{file.name}</Typography>
                <Button 
                  variant="contained" 
                  onClick={handleFileUpload}
                  startIcon={<CloudUpload />}
                >
                  Upload
                </Button>
              </>
            )}
          </Box>
          
          {task.files && task.files.length > 0 ? (
            <List>
              {task.files.map((file) => (
                <ListItem 
                  key={file._id}
                  secondaryAction={
                    <IconButton 
                      edge="end" 
                      onClick={() => handleFileDelete(file._id)}
                    >
                      <Delete />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar>
                      {file.mimetype.includes('image') ? 'IMG' : 'PDF'}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={<a href={`/uploads/${file.filename}`} target="_blank" rel="noopener noreferrer">{file.originalName}</a>}
                    secondary={`${(file.size / 1024).toFixed(2)} KB - Uploaded by ${file.uploadedBy?.name}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="textSecondary">
              No attachments yet
            </Typography>
          )}
        </CardContent>
      </Card>
      
      {/* Comments section could be added here */}
    </Box>
  );
};

export default TaskDetail;
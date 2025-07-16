import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Button, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, CircularProgress, TextField, MenuItem, 
  Grid, Chip 
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import axios from 'axios';
import { Card } from '@mui/material';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    assignedUser: '',
    dueDateFrom: null,
    dueDateTo: null
  });
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const params = {};
        if (filters.status) params.status = filters.status;
        if (filters.assignedUser) params.assignedUser = filters.assignedUser;
        if (filters.dueDateFrom) params.dueDateFrom = filters.dueDateFrom.toISOString();
        if (filters.dueDateTo) params.dueDateTo = filters.dueDateTo.toISOString();
        
        const { data } = await axios.get('/api/tasks', { params });
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [filters]);

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

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      assignedUser: '',
      dueDateFrom: null,
      dueDateTo: null
    });
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Tasks</Typography>
        <Button variant="contained" onClick={() => navigate('/tasks/new')}>
          Create Task
        </Button>
      </Box>
      
      <Card sx={{ mb: 3, p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              label="Status"
              fullWidth
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Todo">Todo</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </TextField>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              label="Assigned To"
              fullWidth
              value={filters.assignedUser}
              onChange={(e) => handleFilterChange('assignedUser', e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {users.map(user => (
                <MenuItem key={user._id} value={user._id}>
                  {user.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <DatePicker
              label="Due Date From"
              value={filters.dueDateFrom}
              onChange={(date) => handleFilterChange('dueDateFrom', date)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <DatePicker
              label="Due Date To"
              value={filters.dueDateTo}
              onChange={(date) => handleFilterChange('dueDateTo', date)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Button onClick={clearFilters} variant="outlined" sx={{ mr: 2 }}>
              Clear Filters
            </Button>
            <Button 
              onClick={() => setFilters({ ...filters })} 
              variant="contained"
            >
              Apply Filters
            </Button>
          </Grid>
        </Grid>
      </Card>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Project</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task._id}>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.project?.title}</TableCell>
                <TableCell>
                  <Chip 
                    label={task.status} 
                    color={
                      task.status === 'Completed' ? 'success' : 
                      task.status === 'In Progress' ? 'warning' : 'default'
                    } 
                  />
                </TableCell>
                <TableCell>
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
                </TableCell>
                <TableCell>{task.assignedTo?.name}</TableCell>
                <TableCell>
                  <Button onClick={() => navigate(`/tasks/${task._id}`)}>
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Tasks;
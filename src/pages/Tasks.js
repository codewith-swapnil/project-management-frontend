import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Button, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, CircularProgress, TextField, MenuItem, 
  Grid, Chip, Card, Snackbar, Alert, IconButton, Tooltip, Avatar, 
  TablePagination, Dialog, DialogTitle, DialogContent, DialogActions 
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { 
  Add as AddIcon, 
  FilterAlt as FilterIcon, 
  Clear as ClearIcon, 
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import api from '../api/index';

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'Todo', label: 'To Do' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Blocked', label: 'Blocked' }
];

const priorityOptions = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' }
];

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [pagination, setPagination] = useState({
    page: 0,
    rowsPerPage: 10,
    totalCount: 0
  });

  const [filters, setFilters] = useState({
    status: '',
    assignedUser: '',
    project: '',
    dueDateFrom: null,
    dueDateTo: null,
    searchQuery: '',
    priority: ''
  });

  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page + 1,
        limit: pagination.rowsPerPage,
        ...filters
      };

      if (filters.dueDateFrom) params.dueDateFrom = filters.dueDateFrom.toISOString();
      if (filters.dueDateTo) params.dueDateTo = filters.dueDateTo.toISOString();

      const { data } = await api.get('/api/tasks', { params });
      setTasks(data?.tasks || []);
      setPagination(prev => ({ 
        ...prev, 
        totalCount: data?.totalCount || 0 
      }));
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to load tasks. Please try again.');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, pagination.page, pagination.rowsPerPage]);

  useEffect(() => {
    const fetchUsersAndProjects = async () => {
      try {
        const [usersRes, projectsRes] = await Promise.all([
          api.get('/api/users'),
          api.get('/api/projects')
        ]);
        setUsers(usersRes?.data || []);
        setProjects(projectsRes?.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load required data. Please try again.');
        setUsers([]);
        setProjects([]);
      }
    };
    fetchUsersAndProjects();
  }, []);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, page: 0 }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      assignedUser: '',
      project: '',
      dueDateFrom: null,
      dueDateTo: null,
      searchQuery: '',
      priority: ''
    });
  };

  const handlePageChange = (event, newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleRowsPerPageChange = (event) => {
    setPagination(prev => ({
      ...prev,
      rowsPerPage: parseInt(event.target.value, 10),
      page: 0
    }));
  };

  const handleCreateTask = () => {
    navigate('/tasks/new');
  };

  const handleViewTask = (taskId) => {
    navigate(`/tasks/${taskId}`);
  };

  const handleEditTask = (taskId) => {
    navigate(`/tasks/${taskId}/edit`);
  };

  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/api/tasks/${taskToDelete._id}`);
      fetchTasks();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task. Please try again.');
    }
  };

  const handleCloseError = () => {
    setError(null);
  };

  const handleRefresh = () => {
    fetchTasks();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'In Progress': return 'warning';
      case 'Blocked': return 'error';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">Task Management</Typography>
        <Box>
          <Tooltip title="Refresh">
            <IconButton onClick={handleRefresh} sx={{ mr: 1 }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={handleCreateTask}
          >
            Create Task
          </Button>
        </Box>
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
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
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
              <MenuItem value="">All Users</MenuItem>
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
            </TextField>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              label="Project"
              fullWidth
              value={filters.project}
              onChange={(e) => handleFilterChange('project', e.target.value)}
            >
              <MenuItem value="">All Projects</MenuItem>
              {projects.map(project => (
                <MenuItem key={project._id} value={project._id}>
                  {project.title}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              label="Priority"
              fullWidth
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
            >
              <MenuItem value="">All Priorities</MenuItem>
              {priorityOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Search"
              fullWidth
              value={filters.searchQuery}
              onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
              placeholder="Search tasks..."
            />
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
          
          <Grid item xs={12} display="flex" justifyContent="flex-end">
            <Button 
              onClick={clearFilters} 
              startIcon={<ClearIcon />}
              variant="outlined" 
              sx={{ mr: 2 }}
            >
              Clear Filters
            </Button>
            <Button 
              startIcon={<FilterIcon />}
              variant="contained"
              onClick={fetchTasks}
            >
              Apply Filters
            </Button>
          </Grid>
        </Grid>
      </Card>
      
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Project</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : tasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No tasks found. Create a new task to get started.
                  </TableCell>
                </TableRow>
              ) : (
                tasks.map((task) => (
                  <TableRow key={task._id} hover>
                    <TableCell>{task.title}</TableCell>
                    <TableCell>
                      {task.project?.title || 'No Project'}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={task.status} 
                        color={getStatusColor(task.status)}
                      />
                    </TableCell>
                    <TableCell>
                      {task.dueDate ? format(parseISO(task.dueDate), 'MMM dd, yyyy') : '-'}
                    </TableCell>
                    <TableCell>
                      {task.assignedTo ? (
                        <Box display="flex" alignItems="center">
                          <Avatar 
                            src={task.assignedTo.avatar} 
                            sx={{ width: 24, height: 24, mr: 1 }} 
                          />
                          {task.assignedTo.name}
                        </Box>
                      ) : 'Unassigned'}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={task.priority || 'Medium'} 
                        color={getPriorityColor(task.priority)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex">
                        <Tooltip title="View">
                          <IconButton onClick={() => handleViewTask(task._id)}>
                            <ViewIcon color="primary" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton onClick={() => handleEditTask(task._id)}>
                            <EditIcon color="secondary" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton onClick={() => handleDeleteClick(task)}>
                            <DeleteIcon color="error" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={pagination.totalCount}
          rowsPerPage={pagination.rowsPerPage}
          page={pagination.page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Card>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          {taskToDelete && (
            <Typography>
              Are you sure you want to delete the task "{taskToDelete.title}"?
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Tasks;
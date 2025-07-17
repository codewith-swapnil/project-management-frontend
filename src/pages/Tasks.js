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
import { Dashboard as DashboardIcon } from '@mui/icons-material';
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
          api.get('/api/auth/users'),
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
    <Box sx={{ 
      p: 3,
      backgroundColor: '#f5f7fa',
      minHeight: '100vh'
    }}>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseError} 
          severity="error" 
          sx={{ 
            width: '100%',
            boxShadow: 3
          }}
        >
          {error}
        </Alert>
      </Snackbar>

      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        mb={3}
      >
        <Typography 
          variant="h4" 
          component="h1"
          sx={{
            fontWeight: 700,
            color: 'primary.main',
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
          }}
        >
          Task Management
        </Typography>
        <Box display="flex" alignItems="center">
          {/* <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateTask}
            sx={{
              mr: 2,
              backgroundColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.dark',
                transform: 'translateY(-1px)'
              },
              transition: 'all 0.2s',
              boxShadow: 2
            }}
          >
            New Task
          </Button> */}
          <Tooltip title="Go to Dashboard">
            <IconButton
              onClick={() => navigate('/dashboard')}
              sx={{ 
                mr: 1,
                backgroundColor: 'background.paper',
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
            >
              <DashboardIcon color="primary" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Refresh">
            <IconButton 
              onClick={handleRefresh} 
              sx={{ 
                backgroundColor: 'background.paper',
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
            >
              <RefreshIcon color="primary" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Card 
        sx={{ 
          mb: 3, 
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: 'background.paper'
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 2,
            color: 'text.secondary',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <FilterIcon sx={{ mr: 1 }} />
          Filters
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              label="Status"
              fullWidth
              size="small"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1
                }
              }}
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
              size="small"
              value={filters.assignedUser}
              onChange={(e) => handleFilterChange('assignedUser', e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1
                }
              }}
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
              size="small"
              value={filters.project}
              onChange={(e) => handleFilterChange('project', e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1
                }
              }}
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
              size="small"
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1
                }
              }}
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
              size="small"
              value={filters.searchQuery}
              onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
              placeholder="Search tasks..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1
                }
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <DatePicker
              label="Due Date From"
              value={filters.dueDateFrom}
              onChange={(date) => handleFilterChange('dueDateFrom', date)}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  fullWidth 
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1
                    }
                  }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <DatePicker
              label="Due Date To"
              value={filters.dueDateTo}
              onChange={(date) => handleFilterChange('dueDateTo', date)}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  fullWidth 
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1
                    }
                  }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} display="flex" justifyContent="flex-end">
            <Button
              onClick={clearFilters}
              startIcon={<ClearIcon />}
              variant="outlined"
              sx={{ 
                mr: 2,
                borderRadius: 1,
                textTransform: 'none'
              }}
            >
              Clear Filters
            </Button>
            <Button
              startIcon={<FilterIcon />}
              variant="contained"
              onClick={fetchTasks}
              sx={{
                borderRadius: 1,
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: 'none'
                }
              }}
            >
              Apply Filters
            </Button>
          </Grid>
        </Grid>
      </Card>

      <Card
        sx={{
          borderRadius: 2,
          boxShadow: 3,
          overflow: 'hidden'
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.light' }}>
                <TableCell sx={{ color: 'common.white', fontWeight: 600 }}>Title</TableCell>
                <TableCell sx={{ color: 'common.white', fontWeight: 600 }}>Project</TableCell>
                <TableCell sx={{ color: 'common.white', fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ color: 'common.white', fontWeight: 600 }}>Due Date</TableCell>
                <TableCell sx={{ color: 'common.white', fontWeight: 600 }}>Assigned To</TableCell>
                <TableCell sx={{ color: 'common.white', fontWeight: 600 }}>Priority</TableCell>
                <TableCell sx={{ color: 'common.white', fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                    <CircularProgress />
                    <Typography variant="body2" sx={{ mt: 2 }}>Loading tasks...</Typography>
                  </TableCell>
                </TableRow>
              ) : tasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      color: 'text.secondary'
                    }}>
                      <Typography variant="h6" sx={{ mb: 1 }}>No tasks found</Typography>
                      <Typography variant="body2">Try adjusting your filters or create a new task</Typography>
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleCreateTask}
                        sx={{ mt: 2 }}
                      >
                        Create Task
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                tasks.map((task) => (
                  <TableRow 
                    key={task._id} 
                    hover
                    sx={{
                      '&:nth-of-type(even)': {
                        backgroundColor: 'action.hover'
                      },
                      '&:hover': {
                        backgroundColor: 'action.selected'
                      }
                    }}
                  >
                    <TableCell sx={{ fontWeight: 500 }}>{task.title}</TableCell>
                    <TableCell>
                      {task.project?.title || 'No Project'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={task.status}
                        color={getStatusColor(task.status)}
                        size="small"
                        sx={{
                          fontWeight: 500,
                          minWidth: 100
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {task.dueDate ? (
                        <Box 
                          sx={{ 
                            display: 'inline-flex',
                            alignItems: 'center',
                            p: 1,
                            borderRadius: 1,
                            backgroundColor: new Date(task.dueDate) < new Date() && task.status !== 'Completed' 
                              ? 'error.light' 
                              : 'transparent'
                          }}
                        >
                          {format(parseISO(task.dueDate), 'MMM dd, yyyy')}
                        </Box>
                      ) : '-'}
                    </TableCell>
                    <TableCell>
                      {task.assignedTo ? (
                        <Box display="flex" alignItems="center">
                          <Avatar
                            src={task.assignedTo.avatar}
                            sx={{ 
                              width: 28, 
                              height: 28, 
                              mr: 1.5,
                              border: '1px solid',
                              borderColor: 'divider'
                            }}
                          />
                          <Typography variant="body2">
                            {task.assignedTo.name}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Unassigned
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={task.priority || 'Medium'}
                        color={getPriorityColor(task.priority)}
                        size="small"
                        sx={{
                          fontWeight: 500,
                          minWidth: 80
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex">
                        <Tooltip title="View">
                          <IconButton 
                            onClick={() => handleViewTask(task._id)}
                            sx={{
                              color: 'primary.main',
                              '&:hover': {
                                backgroundColor: 'primary.light',
                                color: 'primary.dark'
                              }
                            }}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton 
                            onClick={() => handleEditTask(task._id)}
                            sx={{
                              color: 'secondary.main',
                              '&:hover': {
                                backgroundColor: 'secondary.light',
                                color: 'secondary.dark'
                              }
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton 
                            onClick={() => handleDeleteClick(task)}
                            sx={{
                              color: 'error.main',
                              '&:hover': {
                                backgroundColor: 'error.light',
                                color: 'error.dark'
                              }
                            }}
                          >
                            <DeleteIcon />
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
          sx={{
            borderTop: '1px solid',
            borderColor: 'divider'
          }}
        />
      </Card>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 400
          }
        }}
      >
        <DialogTitle sx={{ 
          backgroundColor: 'primary.main',
          color: 'common.white',
          fontWeight: 600
        }}>
          Confirm Delete
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {taskToDelete && (
            <Typography>
              Are you sure you want to delete the task <strong>"{taskToDelete.title}"</strong>?
              <br />
              This action cannot be undone.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
            sx={{
              borderRadius: 1,
              textTransform: 'none'
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            sx={{
              borderRadius: 1,
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none'
              }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Tasks;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Paper,
  Container,
  Fade,
  Chip,
  Avatar,
  Autocomplete,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Checkbox
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Add as AddIcon,
  Person as PersonIcon,
  Group as GroupIcon
} from '@mui/icons-material';
import api from '../api/index';

const CreateProject = () => {
  const [projectData, setProjectData] = useState({
    title: '',
    description: '',
    members: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all users when component mounts
    const fetchUsers = async () => {
      try {
        const response = await api.get('/api/users');
        setUsers(response.data);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    // Filter users based on search input
    if (userSearch.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearch.toLowerCase())
    );
    setSearchResults(filtered);
  }, [userSearch, users]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddMember = (user) => {
    if (!projectData.members.some(member => member._id === user._id)) {
      setProjectData(prev => ({
        ...prev,
        members: [...prev.members, user]
      }));
    }
    setUserSearch('');
    setSearchResults([]);
  };

  const handleRemoveMember = (userId) => {
    setProjectData(prev => ({
      ...prev,
      members: prev.members.filter(member => member._id !== userId)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...projectData,
        members: projectData.members.map(member => member._id)
      };
      await api.post('/api/projects', payload);
      navigate('/projects');
    } catch (err) {
      console.error('Error creating project:', err);
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fade in={true}>
      <Container maxWidth="md" sx={{ 
        py: 6,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Paper elevation={0} sx={{ 
          width: '100%',
          p: { xs: 3, sm: 5 },
          borderRadius: 4,
          background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
          boxShadow: '0 12px 40px -12px rgba(0,0,0,0.1)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          position: 'relative',
          overflow: 'hidden',
          '&:before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(90deg, #1976d2, #2196f3)'
          }
        }}>
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            mb: 5,
            gap: 2
          }}>
            <Button 
              onClick={() => navigate('/projects')} 
              startIcon={<BackIcon />}
              sx={{ 
                textTransform: 'none',
                color: 'text.secondary',
                px: 2,
                py: 1,
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  color: 'primary.main'
                }
              }}
            >
              Back
            </Button>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                color: 'text.primary',
                flexGrow: 1,
                textAlign: 'center',
                fontSize: { xs: '1.75rem', sm: '2rem' },
                letterSpacing: '-0.5px'
              }}
            >
              Create New Project
            </Typography>
          </Box>
          
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 4,
                borderRadius: 2,
                boxShadow: 'none',
                border: '1px solid',
                borderColor: 'error.light',
                backgroundColor: 'error.lighter'
              }}
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Project Title"
                  name="title"
                  value={projectData.title}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  size="medium"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '& fieldset': {
                        borderColor: 'rgba(0, 0, 0, 0.12)',
                        transition: 'all 0.3s ease'
                      },
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                        boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.1)'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                        borderWidth: '2px',
                        boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.1)'
                      }
                    },
                    '& .MuiInputLabel-root': {
                      color: 'text.secondary',
                      '&.Mui-focused': {
                        color: 'primary.main'
                      }
                    }
                  }}
                  InputProps={{
                    style: {
                      fontSize: '1.1rem',
                      padding: '14px 16px'
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Project Description"
                  name="description"
                  value={projectData.description}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '& fieldset': {
                        borderColor: 'rgba(0, 0, 0, 0.12)',
                        transition: 'all 0.3s ease'
                      },
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                        boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.1)'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                        borderWidth: '2px',
                        boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.1)'
                      }
                    },
                    '& .MuiInputLabel-root': {
                      color: 'text.secondary',
                      '&.Mui-focused': {
                        color: 'primary.main'
                      }
                    }
                  }}
                  InputProps={{
                    style: {
                      fontSize: '1rem',
                      padding: '14px 16px'
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }}>
                  <Chip 
                    icon={<GroupIcon />} 
                    label="Project Members" 
                    sx={{ px: 2, color: 'text.secondary' }}
                  />
                </Divider>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                    Selected Members
                  </Typography>
                  {projectData.members.length > 0 ? (
                    <Box sx={{ 
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 1,
                      mb: 2,
                      p: 1.5,
                      borderRadius: 2,
                      border: '1px dashed rgba(0, 0, 0, 0.12)'
                    }}>
                      {projectData.members.map(member => (
                        <Chip
                          key={member._id}
                          avatar={<Avatar src={member.avatar}>{member.name.charAt(0)}</Avatar>}
                          label={member.name}
                          onDelete={() => handleRemoveMember(member._id)}
                          sx={{
                            '& .MuiChip-deleteIcon': {
                              color: 'text.secondary',
                              '&:hover': {
                                color: 'error.main'
                              }
                            }
                          }}
                        />
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      No members added yet
                    </Typography>
                  )}

                  <Autocomplete
                    freeSolo
                    options={searchResults}
                    getOptionLabel={(option) => typeof option === 'string' ? option : `${option.name} (${option.email})`}
                    inputValue={userSearch}
                    onInputChange={(event, newValue) => {
                      setUserSearch(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Add team members"
                        placeholder="Search by name or email"
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          }
                        }}
                      />
                    )}
                    renderOption={(props, option) => (
                      <ListItem 
                        {...props} 
                        key={option._id}
                        sx={{ py: 0.5 }}
                        secondaryAction={
                          <Button 
                            size="small"
                            onClick={() => handleAddMember(option)}
                            sx={{ textTransform: 'none' }}
                          >
                            Add
                          </Button>
                        }
                      >
                        <ListItemAvatar>
                          <Avatar src={option.avatar}>
                            {option.name.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText 
                          primary={option.name} 
                          secondary={option.email} 
                        />
                      </ListItem>
                    )}
                    sx={{ mt: 2 }}
                  />
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ 
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 2,
                  mt: 1
                }}>
                  <Button 
                    variant="outlined" 
                    onClick={() => navigate('/projects')}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      px: 4,
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 500,
                      borderWidth: '1.5px',
                      color: 'text.secondary',
                      '&:hover': {
                        borderWidth: '1.5px',
                        backgroundColor: 'action.hover',
                        color: 'text.primary'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    disabled={loading}
                    startIcon={!loading && <AddIcon />}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      px: 4,
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 600,
                      boxShadow: 'none',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                        transform: 'translateY(-1px)',
                        backgroundColor: 'primary.dark'
                      },
                      '&:active': {
                        transform: 'translateY(0)'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} sx={{ color: 'white' }} />
                    ) : (
                      'Create Project'
                    )}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </Fade>
  );
};

export default CreateProject;
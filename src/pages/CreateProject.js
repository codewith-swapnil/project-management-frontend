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
  // Checkbox // Not used in the provided code, so commented out
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Add as AddIcon,
  // Person as PersonIcon, // Not directly used in the current structure
  Group as GroupIcon
} from '@mui/icons-material';
import api from '../api/index'; // Assuming this is your API utility

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
        const response = await api.get('/api/auth/users');
        setUsers(response.data);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users for member selection.'); // User-friendly error
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
    setUserSearch(''); // Clear search after adding a member
    setSearchResults([]); // Clear search results after adding a member
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

    // Basic validation
    if (!projectData.title.trim()) {
      setError('Project title cannot be empty.');
      setLoading(false);
      return;
    }
    if (!projectData.description.trim()) {
      setError('Project description cannot be empty.');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...projectData,
        members: projectData.members.map(member => member._id)
      };
      await api.post('/api/projects', payload);
      navigate('/projects'); // Navigate on success
    } catch (err) {
      console.error('Error creating project:', err);
      setError(err.response?.data?.message || 'Failed to create project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fade in={true}>
      <Container
        maxWidth="md"
        sx={{
          py: 6,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // Optional: Add a subtle background to the page itself
          background: 'linear-gradient(135deg, #e0eafc, #cfdef3)',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            background: 'linear-gradient(145deg, #ffffff, #f8f9fa)', // Soft subtle gradient
            boxShadow: '0 15px 45px -15px rgba(0,0,0,0.18)', // Enhanced, deeper shadow
            border: '1px solid rgba(0, 0, 0, 0.05)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.3s ease-in-out', // Smooth transition on hover
            '&:hover': {
              transform: 'translateY(-5px)', // Slight lift effect on hover
            },
            '&:before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '6px',
              background: 'linear-gradient(90deg, #1976d2, #2196f3)', // Blue gradient top border
              borderRadius: '4px 4px 0 0', // Match paper border radius
            }
          }}
        >
          {/* Header Section: Back Button and Title */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 5,
              gap: 2,
              justifyContent: 'space-between', // Space out items
            }}
          >
            <Button
              onClick={() => navigate('/projects')}
              startIcon={<BackIcon />}
              sx={{
                textTransform: 'none',
                color: 'text.secondary',
                px: 2,
                py: 1,
                borderRadius: 2,
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'action.hover', // Use theme hover color
                  color: 'primary.main',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
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
                flexGrow: 1, // Allows title to take available space
                textAlign: 'center',
                fontSize: { xs: '1.75rem', sm: '2rem' },
                letterSpacing: '-0.5px',
              }}
            >
              Create New Project 🚀
            </Typography>
            <Box sx={{ width: 100 }} /> {/* Spacer to balance the Back button on the left */}
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 4,
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(255, 0, 0, 0.1)', // Soft shadow for alert
                border: '1px solid',
                borderColor: 'error.main', // Stronger border for error
                backgroundColor: 'error.light', // Use light error color
                color: 'error.dark', // Darker text for contrast
              }}
            >
              {error}
            </Alert>
          )}

          {/* Project Form */}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={4}> {/* Increased spacing between grid items */}
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
                      borderRadius: 2.5, // More rounded input fields
                      transition: 'all 0.3s ease',
                      '& fieldset': {
                        borderColor: 'rgba(0, 0, 0, 0.12)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                        boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.1)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                        borderWidth: '2px', // Thicker border when focused
                        boxShadow: '0 0 0 4px rgba(25, 118, 210, 0.15)', // Larger shadow when focused
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
                      padding: '12px 16px', // Adjust padding for a consistent look
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
                  rows={5} // Increased rows for more description space
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2.5, // More rounded input fields
                      transition: 'all 0.3s ease',
                      '& fieldset': {
                        borderColor: 'rgba(0, 0, 0, 0.12)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                        boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.1)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                        borderWidth: '2px', // Thicker border when focused
                        boxShadow: '0 0 0 4px rgba(25, 118, 210, 0.15)', // Larger shadow when focused
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
                      padding: '14px 16px',
                    }
                  }}
                />
              </Grid>

              {/* Project Members Section */}
              <Grid item xs={12}>
                <Divider sx={{ my: 3 }}> {/* Increased vertical margin */}
                  <Chip
                    icon={<GroupIcon />}
                    label="Project Members"
                    sx={{
                      px: 2,
                      color: 'text.secondary',
                      fontWeight: 600, // Bolder chip text
                      fontSize: '1rem',
                      backgroundColor: 'rgba(0, 0, 0, 0.04)', // Light background for chip
                    }}
                  />
                </Divider>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 600, color: 'text.primary' }}>
                    Selected Members
                  </Typography>
                  {projectData.members.length > 0 ? (
                    <Box sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 1.5, // Increased gap between chips
                      mb: 2,
                      p: 2, // Increased padding
                      borderRadius: 3, // More rounded border
                      border: '1px dashed',
                      borderColor: 'primary.light', // Dashed border with primary color hint
                      minHeight: '60px', // Ensure some height even if empty
                      alignItems: 'center', // Vertically align chips
                      backgroundColor: 'background.default', // Light background for the chip container
                    }}>
                      {projectData.members.map(member => (
                        <Chip
                          key={member._id}
                          avatar={<Avatar src={member.avatar || ''} alt={member.name.charAt(0)} sx={{ bgcolor: 'primary.light', color: 'primary.dark' }}>{member.name.charAt(0)}</Avatar>}
                          label={member.name}
                          onDelete={() => handleRemoveMember(member._id)}
                          color="primary" // Primary color for selected chips
                          variant="outlined" // Outlined variant for a cleaner look
                          sx={{
                            fontWeight: 500,
                            transition: 'all 0.2s ease',
                            '& .MuiChip-deleteIcon': {
                              color: 'primary.dark',
                              '&:hover': {
                                color: 'error.main',
                              }
                            },
                            '&:hover': {
                              backgroundColor: 'primary.lighter', // Light hover background
                              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                            }
                          }}
                        />
                      ))}
                    </Box>
                  ) : (
                    <Box sx={{
                      p: 2,
                      borderRadius: 3,
                      border: '1px dashed rgba(0, 0, 0, 0.1)',
                      minHeight: '60px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'background.default',
                    }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        No members added yet. Search below to add team members.
                      </Typography>
                    </Box>
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
                          mt: 2, // Margin top for separation
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2.5,
                            '& fieldset': {
                              borderColor: 'rgba(0, 0, 0, 0.12)',
                            },
                            '&:hover fieldset': {
                              borderColor: 'primary.main',
                              boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.1)',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: 'primary.main',
                              borderWidth: '2px',
                              boxShadow: '0 0 0 4px rgba(25, 118, 210, 0.15)',
                            }
                          }
                        }}
                      />
                    )}
                    renderOption={(props, option) => (
                      <ListItem
                        {...props}
                        key={option._id}
                        sx={{ py: 1, '&:hover': { backgroundColor: 'action.hover' } }} // Increased padding, hover effect
                        secondaryAction={
                          <Button
                            size="small"
                            onClick={() => handleAddMember(option)}
                            sx={{ textTransform: 'none', px: 2, py: 0.5, borderRadius: 1.5 }}
                            variant="outlined" // Outlined add button
                            color="primary"
                            disabled={projectData.members.some(member => member._id === option._id)} // Disable if already added
                          >
                            {projectData.members.some(member => member._id === option._id) ? 'Added' : 'Add'}
                          </Button>
                        }
                      >
                        <ListItemAvatar>
                          <Avatar src={option.avatar || ''} sx={{ bgcolor: 'info.light', color: 'info.dark' }}>
                            {option.name.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={option.name}
                          secondary={option.email}
                          primaryTypographyProps={{ fontWeight: 500 }}
                          secondaryTypographyProps={{ fontSize: '0.85rem' }}
                        />
                      </ListItem>
                    )}
                    sx={{ mt: 2 }}
                  />
                </Box>
              </Grid>

              {/* Action Buttons */}
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 2,
                    mt: 3 // Increased margin top
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/projects')}
                    sx={{
                      borderRadius: 2.5, // Match input field rounding
                      textTransform: 'none',
                      px: 4,
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 500,
                      borderWidth: '1.5px',
                      color: 'text.secondary',
                      borderColor: 'rgba(0, 0, 0, 0.15)',
                      '&:hover': {
                        borderWidth: '1.5px',
                        backgroundColor: 'action.hover',
                        borderColor: 'text.primary',
                        color: 'text.primary',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      },
                      transition: 'all 0.2s ease',
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
                      borderRadius: 2.5, // Match input field rounding
                      textTransform: 'none',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.05rem', // Slightly adjusted font size
                      fontWeight: 600,
                      boxShadow: '0 6px 15px rgba(25, 118, 210, 0.25)', // More prominent shadow for action button
                      background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)', // Gradient primary button
                      color: 'white',
                      '&:hover': {
                        boxShadow: '0 8px 20px rgba(25, 118, 210, 0.35)', // Larger shadow on hover
                        transform: 'translateY(-2px)', // Lift effect
                        background: 'linear-gradient(45deg, #2196f3 30%, #1976d2 90%)', // Reverse gradient on hover
                      },
                      '&:active': {
                        transform: 'translateY(0)', // Push down on click
                        boxShadow: '0 3px 8px rgba(25, 118, 210, 0.2)',
                      },
                      '&:disabled': {
                        background: (theme) => theme.palette.grey[300],
                        color: (theme) => theme.palette.grey[600],
                        boxShadow: 'none',
                        transform: 'none',
                      },
                      transition: 'all 0.2s ease',
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
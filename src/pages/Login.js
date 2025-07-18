import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, TextField, Typography, Container,
  Paper, Link, CircularProgress, Alert
} from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // The `login` function in AuthContext should handle navigation on success
      // and throw an error on failure. It doesn't return a `success` boolean.
      // So, if no error is caught, it means login was successful and navigation
      // was handled by AuthContext.
      await login(email, password);
      // If login successfully navigates, this line won't be reached.
      // If login *doesn't* navigate (e.g., if you remove navigate from AuthContext's login),
      // then you'd handle navigation here.
    } catch (err) {
      // The AuthContext's login function throws a string message or the error object.
      // err.message is used if it's a standard Error object, otherwise,
      // it might be the raw string message from the thrown error.
      setError(err?.message || err || 'Failed to log in');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center', // Center content horizontally too
        // Optional: Add a subtle background gradient or image to the whole page
        background: 'linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%)',
      }}
    >
      <Paper
        elevation={6} // Increased elevation for more prominent shadow
        sx={{
          p: { xs: 3, sm: 5 }, // Responsive padding
          width: '100%',
          borderRadius: 3, // Slightly more rounded corners
          boxShadow: '0 12px 25px rgba(0,0,0,0.15)', // Enhanced shadow for depth
          backgroundColor: 'background.paper',
          transition: 'transform 0.3s ease-in-out', // Smooth transition on hover
          '&:hover': {
            transform: 'translateY(-5px)', // Slight lift effect on hover
          },
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <LockIcon
            sx={{
              fontSize: 60, // Larger icon
              color: 'primary.dark', // Deeper primary color
              backgroundColor: 'primary.light',
              p: 1.5, // Increased padding
              borderRadius: '50%',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)', // Shadow for the icon
            }}
          />
        </Box>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            mb: 2, // Slightly reduced margin
            letterSpacing: '-0.02em', // Tighter letter spacing for modern look
          }}
        >
          Welcome Back ✨
        </Typography>
        <Typography
          variant="body1"
          align="center"
          sx={{
            color: 'text.secondary',
            mb: 4,
            lineHeight: 1.5,
          }}
        >
          Please sign in to access your task management dashboard.
        </Typography>

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 1,
              // Subtle error background for a softer look
              backgroundColor: (theme) => theme.palette.error.light + '20', // Light background with some transparency
              color: 'error.dark', // Darker text for contrast
              borderColor: 'error.main',
            }}
          >
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Email Address"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            variant="outlined" // Explicitly outlined
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1.5, // Slightly more rounded input fields
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main', // Highlight focused border
                },
              },
              mb: 2,
            }}
            InputLabelProps={{
              shrink: true, // Always shrink label
            }}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            variant="outlined" // Explicitly outlined
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1.5, // Slightly more rounded input fields
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main', // Highlight focused border
                },
              },
              mb: 1,
            }}
            InputLabelProps={{
              shrink: true, // Always shrink label
            }}
          />
          <Box sx={{ textAlign: 'right', mb: 3 }}>
            <Link
              href="/forgot-password"
              underline="hover"
              sx={{
                fontSize: '0.875rem',
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main', // Highlight on hover
                },
              }}
            >
              Forgot password?
            </Link>
          </Box>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{
              mt: 2,
              mb: 2,
              py: 1.75, // Taller button
              borderRadius: 1.5, // Match input field rounding
              textTransform: 'none',
              fontSize: '1.1rem', // Slightly larger font
              fontWeight: 600, // Bolder text
              boxShadow: '0 6px 15px rgba(0,0,0,0.2)', // More pronounced shadow
              background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)', // Gradient background
              transition: 'all 0.3s ease', // Smooth transition
              '&:hover': {
                boxShadow: '0 8px 20px rgba(0,0,0,0.3)', // Larger shadow on hover
                transform: 'translateY(-2px)', // Slight lift
                background: 'linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)', // Reverse gradient on hover
              },
              '&:disabled': {
                background: (theme) => theme.palette.grey[300], // Custom disabled background
                color: (theme) => theme.palette.grey[600], // Custom disabled color
                boxShadow: 'none',
              },
            }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Sign In'
            )}
          </Button>
          <Typography
            align="center"
            sx={{
              mt: 3,
              color: 'text.secondary',
            }}
          >
            Don't have an account?{' '}
            <Link
              href="/register"
              underline="hover"
              sx={{
                fontWeight: 600, // Bolder link
                color: 'primary.main',
                '&:hover': {
                  color: 'primary.dark', // Deeper color on hover
                },
              }}
            >
              Create one
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
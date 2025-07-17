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
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Failed to log in');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          width: '100%',
          borderRadius: 2,
          boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
          backgroundColor: 'background.paper'
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <LockIcon sx={{ 
            fontSize: 50, 
            color: 'primary.main',
            backgroundColor: 'primary.light',
            p: 1,
            borderRadius: '50%'
          }} />
        </Box>
        <Typography 
          variant="h4" 
          align="center" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            color: 'text.primary',
            mb: 3
          }}
        >
          Welcome Back
        </Typography>
        <Typography 
          variant="body1" 
          align="center" 
          sx={{ 
            color: 'text.secondary',
            mb: 4
          }}
        >
          Please enter your credentials to continue
        </Typography>
        
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: 1
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
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1
              },
              mb: 2
            }}
            InputLabelProps={{
              shrink: true
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
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1
              },
              mb: 1
            }}
            InputLabelProps={{
              shrink: true
            }}
          />
          <Box sx={{ textAlign: 'right', mb: 2 }}>
            <Link 
              href="/forgot-password" 
              underline="hover" 
              sx={{ 
                fontSize: '0.875rem',
                color: 'text.secondary'
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
              py: 1.5,
              borderRadius: 1,
              textTransform: 'none',
              fontSize: '1rem',
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none'
              }
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
              color: 'text.secondary'
            }}
          >
            Don't have an account?{' '}
            <Link 
              href="/register" 
              underline="hover"
              sx={{ 
                fontWeight: 500,
                color: 'primary.main'
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
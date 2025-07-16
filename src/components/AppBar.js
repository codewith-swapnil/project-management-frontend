import { AppBar as MuiAppBar, Toolbar, Typography, Button, Avatar, Box } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const AppBar = () => {
  const { user, logout } = useAuth();

  return (
    <MuiAppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Project Management
        </Typography>
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ mr: 2 }}>{user.name?.charAt(0)}</Avatar>
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;
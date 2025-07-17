import { Box, AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { Link, Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" elevation={1}>
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Typography variant="h6" component={Link} to="/" sx={{ textDecoration: 'none', color: 'inherit' }}>
              Task Manager
            </Typography>
            <Box>
              <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
              <Button color="inherit" component={Link} to="/projects">Projects</Button>
              <Button color="inherit" component={Link} to="/tasks">Tasks</Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 3, flex: 1 }}>
        <Outlet /> {/* This renders the matched child route */}
      </Container>

      <Box component="footer" sx={{ py: 3, backgroundColor: 'primary.main', color: 'white' }}>
        <Container maxWidth="xl">
          <Typography variant="body2" align="center">
            © {new Date().getFullYear()} Task Manager App
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
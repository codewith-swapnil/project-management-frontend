import { Box, AppBar, Toolbar, Typography, Button, Container, Avatar, Menu, MenuItem } from '@mui/material';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import { Logout as LogoutIcon, Dashboard as DashboardIcon, FolderOpen as ProjectsIcon, Assignment as TasksIcon } from '@mui/icons-material'; // Added specific icons
import { styled } from '@mui/system'; // Import styled for custom components

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`, // Subtle gradient
  boxShadow: theme.shadows[6], // Deeper shadow for prominence
  padding: theme.spacing(1, 0), // Vertical padding
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  justifyContent: 'space-between',
  minHeight: 64, // Ensure a minimum height for the toolbar
  [theme.breakpoints.up('sm')]: {
    minHeight: 72,
  },
}));


const NavButton = styled(Button)(({ theme }) => ({
  color: theme.palette.common.white, // White text for contrast
  textTransform: 'none', // Keep original casing
  fontWeight: 600,
  fontSize: '1rem',
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius * 2, // More rounded corners
  transition: 'background-color 0.3s ease-in-out, transform 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.primary.light, // Lighter primary on hover
    transform: 'translateY(-2px)', // Subtle lift effect
    boxShadow: theme.shadows[3], // Add a subtle shadow on hover
  },
  '&.active': { // Style for active link (if using NavLink)
    backgroundColor: theme.palette.primary.light,
    boxShadow: theme.shadows[3],
  }
}));

const UserAvatarButton = styled(Button)(({ theme }) => ({
  color: theme.palette.common.white,
  textTransform: 'none',
  fontWeight: 600,
  borderRadius: theme.shape.borderRadius * 3, // Highly rounded
  padding: theme.spacing(0.8, 2),
  transition: 'background-color 0.3s ease-in-out, transform 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[3],
  },
  '& .MuiAvatar-root': {
    width: 32,
    height: 32,
    border: `2px solid ${theme.palette.common.white}`, // White border around avatar
  },
}));


const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: theme.shape.borderRadius * 2, // Rounded menu corners
    boxShadow: theme.shadows[8], // Prominent shadow for the menu
    minWidth: 180,
    marginTop: theme.spacing(1),
    backgroundColor: theme.palette.background.paper, // White background
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    borderRadius: theme.shape.borderRadius, // Rounded hover effect
  },
  '& .MuiSvgIcon-root': {
    marginRight: theme.spacing(1.5),
    color: theme.palette.text.secondary, // Icon color
  },
  color: theme.palette.text.primary, // Text color
  fontWeight: 500,
}));


const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f0f2f5' }}> {/* Subtle background */}
      <StyledAppBar position="static">
        <Container maxWidth="xl">
          <StyledToolbar>
            <Typography
              variant="h5" // Larger and bolder title
              component={Link}
              to="/"
              sx={{
                textDecoration: 'none',
                color: 'white',
                fontWeight: 700,
                letterSpacing: 1.2,
                '&:hover': {
                  opacity: 0.8,
                },
                transition: 'opacity 0.2s ease-in-out',
              }}
            >
             Project-Task Management
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}> {/* Increased gap between buttons */}
              <NavButton component={Link} to="/dashboard" startIcon={<DashboardIcon />}>Dashboard</NavButton>
              <NavButton component={Link} to="/projects" startIcon={<ProjectsIcon />}>Projects</NavButton>
              <NavButton component={Link} to="/tasks" startIcon={<TasksIcon />}>Tasks</NavButton>

              {user && (
                <>
                  <UserAvatarButton
                    onClick={handleMenuOpen}
                    startIcon={<Avatar src={user.avatar || '/default-user.png'} alt={user.name} />}
                  >
                    {user.name}
                  </UserAvatarButton>
                  <StyledMenu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                  >
                    <StyledMenuItem onClick={handleLogout}>
                      <LogoutIcon fontSize="small" /> Logout
                    </StyledMenuItem>
                  </StyledMenu>
                </>
              )}
            </Box>
          </StyledToolbar>
        </Container>
      </StyledAppBar>

      <Container maxWidth="xl" sx={{ py: 4, flex: 1 }}> {/* Increased vertical padding */}
        <Outlet />
      </Container>

      <Box component="footer" sx={{ py: 3, backgroundColor: 'primary.dark', color: 'white', boxShadow: '0 -2px 10px rgba(0,0,0,0.1)' }}> {/* Darker primary for footer, subtle shadow */}
        <Container maxWidth="xl">
          <Typography variant="body2" align="center" sx={{ opacity: 0.8 }}> {/* Slightly less opaque text */}
            © {new Date().getFullYear()} TaskFlow Pro. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
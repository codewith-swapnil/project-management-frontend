import { Drawer as MuiDrawer, List, ListItem, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  Work as ProjectsIcon,
  Assignment as TasksIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const drawerWidth = 240;

const Drawer = () => {
  return (
    <MuiDrawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <List>
        <ListItem button component={Link} to="/">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/projects">
          <ListItemIcon>
            <ProjectsIcon />
          </ListItemIcon>
          <ListItemText primary="Projects" />
        </ListItem>
        <ListItem button component={Link} to="/tasks">
          <ListItemIcon>
            <TasksIcon />
          </ListItemIcon>
          <ListItemText primary="Tasks" />
        </ListItem>
      </List>
    </MuiDrawer>
  );
};

export default Drawer;
import { Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Box textAlign="center" mt={10}>
      <Typography variant="h3" gutterBottom>
        404 - Page Not Found
      </Typography>
      <Typography variant="body1" paragraph>
        The page you are looking for doesn't exist.
      </Typography>
      <Button variant="contained" component={Link} to="/">
        Go to Home
      </Button>
    </Box>
  );
};

export default NotFound;
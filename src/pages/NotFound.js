import { Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/system'; // Import styled for custom button

// Optional: Styled component for the Button to add more complex styles or animations
const AnimatedButton = styled(Button)(({ theme }) => ({
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-3px)', // Lifts the button slightly on hover
    boxShadow: theme.shadows[6], // More pronounced shadow on hover
  },
}));

const NotFound = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh', // Ensures it takes full viewport height
        backgroundColor: (theme) => theme.palette.background.default, // Use theme background color
        color: (theme) => theme.palette.text.primary,
        p: 3, // Add some padding around the whole box
      }}
    >
      <Typography
        variant="h1" // Larger, more impactful heading for 404
        component="h1"
        gutterBottom
        sx={{
          fontSize: { xs: '4rem', sm: '6rem', md: '8rem' }, // Responsive font size
          fontWeight: 900, // Extra bold
          color: (theme) => theme.palette.primary.main, // Use primary color for impact
          textShadow: '2px 2px 4px rgba(0,0,0,0.2)', // Subtle text shadow
          animation: 'fadeIn 1.5s ease-out', // Simple fade-in animation
          '@keyframes fadeIn': {
            '0%': { opacity: 0, transform: 'translateY(-20px)' },
            '100%': { opacity: 1, transform: 'translateY(0)' },
          },
        }}
      >
        404 😔
      </Typography>
      <Typography
        variant="h4" // Stronger message
        component="h2"
        gutterBottom
        sx={{
          mb: 2,
          fontWeight: 600,
          textAlign: 'center',
          color: (theme) => theme.palette.text.secondary,
        }}
      >
        Page Not Found
      </Typography>
      <Typography
        variant="body1"
        paragraph
        sx={{
          mb: 4, // More space below the text
          maxWidth: '500px', // Constrain width for better readability
          textAlign: 'center',
          color: (theme) => theme.palette.text.secondary,
        }}
      >
        Oops! The page you're trying to reach seems to have vanished into thin air.
        It might have been moved, deleted, or never existed.
      </Typography>
      <AnimatedButton
        variant="contained"
        component={Link}
        to="/"
        size="large" // Larger button
        sx={{
          borderRadius: 2, // Slightly rounded corners
          px: 4, // More horizontal padding
          py: 1.5, // More vertical padding
          fontWeight: 'bold',
          textTransform: 'none', // Keep natural casing
          boxShadow: (theme) => theme.shadows[4], // Initial shadow
          background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`, // Gradient background
          color: 'white', // Ensure text is white for contrast
          '&:hover': {
            background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.light} 30%, ${theme.palette.primary.main} 90%)`, // Invert gradient on hover
          },
        }}
      >
        Go to Home 🏠
      </AnimatedButton>
    </Box>
  );
};

export default NotFound;
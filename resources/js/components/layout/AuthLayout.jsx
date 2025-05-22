import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Box, Container, Paper, Typography, useTheme } from '@mui/material';
import RecyclingIcon from '@mui/icons-material/Recycling';

const AuthLayout = () => {
  const theme = useTheme();
  const location = useLocation();

  // Determine background style based on current route
  const isLoginPage = location.pathname === '/login';

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/forgot-password';

  const backgroundStyle = isAuthPage
    ? "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url('/assets/images/bg1.jpeg')"
    : 'url(/assets/images/auth-bg.jpg)';

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: theme.palette.background.default,
        backgroundImage: backgroundStyle,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        py: 4
      }}
    >
      <Container maxWidth="sm">
        <Box 
          sx={{ 
            textAlign: 'center', 
            mb: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <RecyclingIcon 
            color="primary" 
            sx={{ 
              fontSize: 60, 
              mb: 2
            }} 
          />
          <Typography 
            variant="h4" 
            component={Link} 
            to="/" 
            sx={{ 
              fontWeight: 700, 
              textDecoration: 'none',
              color: 'white'
            }}
          >
            Revalio
          </Typography>
          <Typography variant="body2" sx={{ color: 'white', mt: 1 }}>
            Aplikasi Edukasi Digital untuk Memberdayakan Sampah
          </Typography>
        </Box>

        <Paper 
          elevation={3} 
          sx={{ 
            p: { xs: 3, md: 4 },
            borderRadius: 2
          }}
        >
          <Outlet />
        </Paper>

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2" sx={{ color: 'white' }}>
            &copy; {new Date().getFullYear()} Revalio. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default AuthLayout;

import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Box, Container, Paper, Typography, useTheme } from '@mui/material';
import RecyclingIcon from '@mui/icons-material/Recycling';

const AuthLayout = () => {
  const theme = useTheme();

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: theme.palette.background.default,
        backgroundImage: 'url(/assets/images/auth-bg.jpg)',
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
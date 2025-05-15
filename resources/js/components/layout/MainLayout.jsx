import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container, useMediaQuery, useTheme } from '@mui/material';

// Import komponen layout
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const MainLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header toggleSidebar={toggleSidebar} />
      
      <Box sx={{ display: 'flex', flex: 1 }}>
        <Sidebar open={sidebarOpen} onClose={toggleSidebar} />
        
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1,
            p: { xs: 2, md: 3 },
            marginLeft: sidebarOpen && !isMobile ? '240px' : 0,
            transition: theme.transitions.create('margin', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          }}
        >
          <Container maxWidth="lg" sx={{ mt: '70px' }}>
            <Outlet />
          </Container>
        </Box>
      </Box>
      
      <Footer />
    </Box>
  );
};

export default MainLayout; 
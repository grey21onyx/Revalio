import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container, useMediaQuery, useTheme } from '@mui/material';

// Import komponen layout
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const drawerWidth = 240;

const AdminLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header toggleSidebar={toggleSidebar} isAdminLayout={true} />
      
      <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', flex: 1 }}>
          <Box
            sx={{
              width: sidebarOpen && !isMobile ? drawerWidth : 0,
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
              overflowX: 'hidden',
            }}
          >
            <Sidebar open={sidebarOpen} onClose={toggleSidebar} isAdminLayout={true} />
          </Box>
          
          <Box 
            component="main" 
            sx={{ 
              flexGrow: 1,
              p: { xs: 2, md: 3 },
              marginLeft: 0,
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
        
        <Footer sidebarOpen={sidebarOpen} isMobile={isMobile} drawerWidth={drawerWidth} />
      </Box>
    </Box>
  );
};

export default AdminLayout; 
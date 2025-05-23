import React, { useState, useEffect } from 'react';
import { Fab, useScrollTrigger, Zoom, Box } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// Register ScrollToPlugin
gsap.registerPlugin(ScrollToPlugin);

const ScrollToTop = ({ threshold = 300, color = 'primary', size = 'medium' }) => {
  // Menggunakan hooks useScrollTrigger untuk mengecek posisi scroll
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: threshold,
  });

  // Handle scroll to top action
  const handleClick = () => {
    // Gunakan GSAP ScrollToPlugin untuk animasi scroll yang halus
    gsap.to(window, {
      duration: 0.8,
      scrollTo: { y: 0 },
      ease: 'power3.out'
    });
  };

  return (
    <Zoom in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 2000,
        }}
      >
        <Fab 
          size={size} 
          aria-label="scroll back to top"
          sx={{
            bgcolor: '#2E7D32', // Warna hijau yang sesuai dengan tema Material UI
            color: '#fff',
            boxShadow: '0 4px 12px rgba(46, 125, 50, 0.2)',
            '&:hover': {
              bgcolor: '#1B5E20', // Warna hijau yang lebih gelap saat hover
              transform: 'translateY(-3px)',
              boxShadow: '0 6px 15px rgba(46, 125, 50, 0.3)',
            },
            transition: 'all 0.3s ease'
          }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </Box>
    </Zoom>
  );
};

export default ScrollToTop;
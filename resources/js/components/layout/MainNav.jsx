import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const MainNav = () => {
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Button
        component={Link}
        to="/peta-pengepul"
        startIcon={<LocationOnIcon />}
        color="inherit"
      >
        Peta Pengepul
      </Button>
    </Box>
  );
};

export default MainNav; 
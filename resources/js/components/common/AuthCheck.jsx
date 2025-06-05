import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import Swal from 'sweetalert2';

/**
 * AuthCheck component - Verifies that authentication is working correctly
 * Usage: Wrap protected page content with this component
 */
const AuthCheck = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [checking, setChecking] = useState(true);
  const [authError, setAuthError] = useState(null);
  
  useEffect(() => {
    // Only run checks when user is supposedly authenticated
    if (!isAuthenticated) {
      setChecking(false);
      return;
    }
    
    const checkAuth = async () => {
      try {
        // Call the diagnostic endpoint
        const token = localStorage.getItem('userToken');
        
        if (!token) {
          setAuthError('No authentication token found');
          setChecking(false);
          return;
        }
        
        // Ensure headers are set
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        api.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
        
        const response = await api.get('/auth-test');
        
        // Check if authentication is working
        if (!response.data.is_authenticated) {
          console.error('Authentication check failed - server returned:', response.data);
          setAuthError('Server does not recognize your authentication');
          
          // Show warning to user
          Swal.fire({
            icon: 'warning',
            title: 'Sesi Berakhir',
            text: 'Sesi login Anda telah berakhir. Silakan login ulang.',
            confirmButtonText: 'Login Ulang'
          }).then(() => {
            localStorage.removeItem('userToken');
            navigate('/login', { state: { from: window.location.pathname } });
          });
        } else {
          console.log('Authentication verified successfully:', response.data);
        }
      } catch (error) {
        console.error('Authentication check error:', error);
        setAuthError('Failed to verify authentication status');
      } finally {
        setChecking(false);
      }
    };
    
    checkAuth();
  }, [isAuthenticated, navigate]);
  
  // If checking, show loading state
  if (checking) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '200px'
      }}>
        <CircularProgress size={40} />
        <Typography sx={{ mt: 2 }}>Verifikasi autentikasi...</Typography>
      </Box>
    );
  }
  
  // If not authenticated, don't render children
  if (!isAuthenticated) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        p: 4,
        minHeight: '300px'
      }}>
        <Typography variant="h6" gutterBottom>
          Anda belum login
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Silakan login untuk mengakses fitur ini
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/login', { state: { from: window.location.pathname } })}
        >
          Login
        </Button>
      </Box>
    );
  }
  
  // If there's an auth error but we're supposedly authenticated,
  // show error but still render children
  if (authError) {
    console.warn('Authentication issue detected but continuing anyway:', authError);
    // We could show a warning banner here, but for now we'll just let the children render
  }
  
  // All good, render children
  return children;
};

export default AuthCheck; 
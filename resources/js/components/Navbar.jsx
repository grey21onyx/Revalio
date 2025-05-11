import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  Box, 
  Container,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import { selectIsAuthenticated, logout } from '../store/slices/authSlice';

const Navbar = () => {
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  const navItems = [
    { name: 'Beranda', path: '/' },
    { name: 'Tentang', path: '/about' },
    { name: 'Katalog Sampah', path: '/katalog' },
    { name: 'Daur Ulang', path: '/daur-ulang' },
    { name: 'Tracking', path: '/tracking' },
    { name: 'Forum', path: '/forum' },
  ];

  const renderNavItems = () => {
    return navItems.map((item) => (
      <Button
        key={item.path}
        component={Link}
        to={item.path}
        color="inherit"
        sx={{ 
          mx: 1,
          fontWeight: location.pathname === item.path ? 'bold' : 'normal',
          borderBottom: location.pathname === item.path ? '2px solid white' : 'none',
          borderRadius: 0,
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        {item.name}
      </Button>
    ));
  };

  const renderDrawerItems = () => {
    return (
      <List>
        {navItems.map((item) => (
          <ListItem 
            button 
            key={item.path} 
            component={Link} 
            to={item.path}
            selected={location.pathname === item.path}
            onClick={() => setDrawerOpen(false)}
            sx={{
              backgroundColor: location.pathname === item.path ? 'rgba(76, 175, 80, 0.1)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
              },
            }}
          >
            <ListItemText 
              primary={item.name} 
              primaryTypographyProps={{ 
                fontWeight: location.pathname === item.path ? 'bold' : 'normal' 
              }} 
            />
          </ListItem>
        ))}
      </List>
    );
  };

  return (
    <AppBar position="sticky" color="primary">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              mr: 2,
              color: 'white',
              textDecoration: 'none',
              flexGrow: isMobile ? 1 : 0,
              fontWeight: 'bold',
            }}
          >
            REVALIO
          </Typography>

          {isMobile ? (
            <>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={() => setDrawerOpen(true)}
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
              >
                <Box
                  sx={{ width: 250 }}
                  role="presentation"
                >
                  {renderDrawerItems()}
                  <Box sx={{ p: 2 }}>
                    {isAuthenticated ? (
                      <Button 
                        fullWidth 
                        variant="contained" 
                        color="secondary" 
                        onClick={handleLogout}
                      >
                        Logout
                      </Button>
                    ) : (
                      <>
                        <Button 
                          fullWidth 
                          variant="contained" 
                          color="secondary" 
                          component={Link} 
                          to="/login"
                          sx={{ mb: 1 }}
                        >
                          Login
                        </Button>
                        <Button 
                          fullWidth 
                          variant="outlined" 
                          sx={{ 
                            color: theme.palette.secondary.main,
                            borderColor: theme.palette.secondary.main
                          }}
                          component={Link} 
                          to="/register"
                        >
                          Daftar
                        </Button>
                      </>
                    )}
                  </Box>
                </Box>
              </Drawer>
            </>
          ) : (
            <>
              <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                {renderNavItems()}
              </Box>
              <Box sx={{ display: 'flex' }}>
                {isAuthenticated ? (
                  <Button 
                    variant="contained" 
                    color="secondary"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                ) : (
                  <>
                    <Button 
                      variant="outlined" 
                      color="inherit" 
                      component={Link} 
                      to="/login"
                      sx={{ mr: 1 }}
                    >
                      Login
                    </Button>
                    <Button 
                      variant="contained" 
                      color="secondary" 
                      component={Link} 
                      to="/register"
                    >
                      Daftar
                    </Button>
                  </>
                )}
              </Box>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;

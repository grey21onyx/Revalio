import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  InputBase,
  Badge,
  Tooltip,
  Avatar,
  Button,
  useTheme,
  useMediaQuery,
  alpha
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  AccountCircle,
  Notifications as NotificationsIcon,
  MoreVert as MoreIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon
} from '@mui/icons-material';
import RecyclingIcon from '@mui/icons-material/Recycling';

const Header = ({ toggleSidebar }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const isAuthenticated = useSelector(state => state.auth?.isAuthenticated);

  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  // Handle menu open/close
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  // Search handling
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  // Profile menu
  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
        <PersonIcon fontSize="small" sx={{ mr: 1 }} />
        Profil
      </MenuItem>
      <MenuItem onClick={() => { navigate('/settings'); handleMenuClose(); }}>
        <SettingsIcon fontSize="small" sx={{ mr: 1 }} />
        Pengaturan
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
        Keluar
      </MenuItem>
    </Menu>
  );

  // Mobile menu
  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {isAuthenticated ? (
        [
          <MenuItem key="notifications-mobile" onClick={() => { navigate('/notifications'); handleMobileMenuClose(); }}>
            <IconButton size="large" aria-label="show new notifications" color="inherit">
              <Badge badgeContent={4} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <p>Notifikasi</p>
          </MenuItem>,
          <MenuItem key="profile-mobile" onClick={handleProfileMenuOpen}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <p>Profil</p>
          </MenuItem>
        ]
      ) : (
        [
          <MenuItem key="login-mobile" onClick={() => { navigate('/login'); handleMobileMenuClose(); }}>
            <IconButton size="large" color="inherit">
              <AccountCircle />
            </IconButton>
            <p>Masuk</p>
          </MenuItem>,
          <MenuItem key="register-mobile" onClick={() => { navigate('/register'); handleMobileMenuClose(); }}>
            <IconButton size="large" color="inherit">
              <PersonIcon />
            </IconButton>
            <p>Daftar</p>
          </MenuItem>
        ]
      )}
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" color="primary">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
            onClick={toggleSidebar}
          >
            <MenuIcon />
          </IconButton>
          
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              textDecoration: 'none' 
            }} 
            component={Link} 
            to="/"
          >
            <RecyclingIcon sx={{ mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ color: 'white', display: { xs: 'none', sm: 'block' } }}
            >
              REVALIO
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />
          
          {/* Search input */}
          <Box 
            component="form"
            onSubmit={handleSearchSubmit}
            sx={{ 
              position: 'relative',
              borderRadius: theme.shape.borderRadius,
              backgroundColor: alpha(theme.palette.common.white, 0.15),
              '&:hover': {
                backgroundColor: alpha(theme.palette.common.white, 0.25),
              },
              mr: 2,
              ml: 2,
              width: { xs: '100%', sm: 'auto' },
              display: { xs: 'none', sm: 'block' },
            }}
          >
            <Box sx={{ position: 'absolute', height: '100%', display: 'flex', alignItems: 'center', pointerEvents: 'none', pl: 2 }}>
              <SearchIcon />
            </Box>
            <InputBase
              placeholder="Cari..."
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{
                color: 'inherit',
                pl: 5,
                pr: 1,
                py: 1,
                transition: theme.transitions.create('width'),
                width: '100%',
                [theme.breakpoints.up('md')]: {
                  width: '20ch',
                  '&:focus': {
                    width: '30ch',
                  },
                },
              }}
              inputProps={{ 'aria-label': 'cari' }}
            />
          </Box>

          {/* User Menu */}
          {isAuthenticated ? (
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Tooltip title="Notifikasi">
                <IconButton size="large" aria-label="show new notifications" color="inherit" onClick={() => navigate('/notifications')}>
                  <Badge badgeContent={4} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Tooltip title="Profil">
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <Avatar sx={{ width: 32, height: 32 }} />
                </IconButton>
              </Tooltip>
            </Box>
          ) : (
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button 
                color="inherit" 
                component={Link} 
                to="/login"
                sx={{ mr: 1 }}
              >
                Masuk
              </Button>
              <Button 
                variant="contained" 
                color="secondary" 
                component={Link} 
                to="/register"
              >
                Daftar
              </Button>
            </Box>
          )}

          {/* Mobile Menu Icon */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
};

export default Header;

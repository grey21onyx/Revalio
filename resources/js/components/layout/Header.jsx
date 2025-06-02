import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
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
  const { isAuthenticated, logout, user } = useAuth();
  const [profileImage, setProfileImage] = useState(null);
  const [imageError, setImageError] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  // Effect untuk update foto profil saat user berubah
  useEffect(() => {
    console.log('User data changed in Header.jsx:', user);
    setImageError(false); // Reset error state ketika user berubah
    
    if (user) {
      updateProfileImage();
    }
  }, [user]);

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

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  // Handle image load error
  const handleImageError = () => {
    console.error('Error loading profile image');
    
    // Prevent infinite loop of error handling attempts
    if (imageError) {
      return;
    }
    
    // Coba cari sumber gambar alternatif
    if (user) {
      // Jika foto_profil gagal, coba gunakan avatar jika ada
      if (user.avatar && user.avatar !== user.foto_profil) {
        console.log('Trying alternative image source (avatar):', user.avatar);
        const avatarUrl = user.avatar.startsWith('/') 
          ? user.avatar 
          : `/storage/${user.avatar}`;
        setProfileImage(avatarUrl);
        return;
      }
      
      // Jika masih gagal, coba gunakan path default tanpa cek file
      setImageError(true);
      setProfileImage(null);
      return;
    }
    
    // Jika semua upaya gagal, tandai sebagai error
    setImageError(true);
    // Reset profileImage agar tidak mencoba load gambar yang sama lagi
    setProfileImage(null);
  };

  // Update profile image state
  const updateProfileImage = () => {
    if (!user) {
      console.log('No user data available');
      setProfileImage(null);
      return;
    }
    
    console.log('Updating profile image from user data:', user);
    console.log('Profile image field:', user.foto_profil);
    
    if (!user.foto_profil) {
      console.log('No profile image in user data');
      setProfileImage(null);
      return;
    }
    
    let imageUrl;
    
    // Cek apakah foto_profil sudah berupa URL lengkap atau relatif
    if (user.foto_profil.startsWith('http')) {
      imageUrl = user.foto_profil;
    } else if (user.foto_profil.startsWith('/storage/')) {
      // Jika sudah berformat /storage/...
      imageUrl = user.foto_profil;
    } else {
      // Jika hanya nama file, tambahkan path
      imageUrl = `/storage/${user.foto_profil}`;
    }
    
    console.log('Final profile image URL:', imageUrl);
    setProfileImage(imageUrl);
  };

  // Get profile image URL from user data
  const getProfileImageUrl = () => {
    if (imageError) {
      console.log('Image error occurred, returning null');
      // Gunakan avatar default dari sistem jika gambar error
      return null;
    }
    
    if (profileImage) {
      console.log('Using cached profile image URL:', profileImage);
      return profileImage;
    }
    
    if (user && user.foto_profil) {
      console.log('Generating profile image URL from user data:', user.foto_profil);
      // Cek apakah foto_profil sudah berupa URL lengkap atau relatif
      if (user.foto_profil.startsWith('http')) {
        return user.foto_profil;
      } else if (user.foto_profil.startsWith('/storage/')) {
        // Jika sudah berformat /storage/...
        return user.foto_profil;
      } else {
        // Jika hanya nama file, tambahkan path
        return `/storage/${user.foto_profil}`;
      }
    }
    
    console.log('No profile image available, returning null');
    return null; // Return null jika tidak ada foto profil
  };
  
  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user) return null;
    
    // Coba dapatkan nama dari berbagai kemungkinan properti
    const name = user.nama_lengkap || user.nama || user.name;
    if (!name) return null;
    
    // Split nama dan ambil inisial
    const nameParts = name.split(' ').filter(part => part.trim().length > 0);
    if (nameParts.length === 0) return null;
    
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    } else {
      return (nameParts[0].charAt(0) + nameParts[nameParts.length > 1 ? 1 : 0].charAt(0)).toUpperCase();
    }
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
      <MenuItem onClick={handleLogout}>
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
          <MenuItem key="profile-mobile" onClick={handleProfileMenuOpen}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              color="inherit"
            >
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32,
                  bgcolor: theme.palette.primary.main
                }}
                src={getProfileImageUrl()}
                alt={user?.nama_lengkap || "User Profile"}
                onError={handleImageError}
              >
                {getUserInitials() || (user?.nama_lengkap?.charAt(0) || 'U').toUpperCase()}
              </Avatar>
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
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32,
                      bgcolor: theme.palette.primary.main 
                    }}
                    src={getProfileImageUrl()}
                    alt={user?.nama_lengkap || "User Profile"}
                    onError={handleImageError}
                  >
                    {/* Improved initials display */}
                    {getUserInitials() || (user?.nama_lengkap?.charAt(0) || 'U').toUpperCase()}
                  </Avatar>
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

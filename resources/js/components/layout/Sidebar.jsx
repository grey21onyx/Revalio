import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Home as HomeIcon,
  AutoAwesome as KatalogIcon,
  Refresh as DaurUlangIcon,
  Insights as TrackingIcon,
  MonetizationOn as MonetisasiIcon,
  Forum as ForumIcon,
  Info as InfoIcon,
  LocationOn as LocationIcon,
  Dashboard as DashboardIcon,
  Category as CategoryIcon,
  PriceChange as PriceIcon,
  Article as ArticleIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

// Definisi menu untuk user biasa
const userMenuItems = [
  { name: 'Beranda', path: '/', icon: <HomeIcon /> },
  { name: 'Katalog Sampah', path: '/katalog', icon: <KatalogIcon /> },
  { name: 'Daur Ulang', path: '/daur-ulang', icon: <DaurUlangIcon /> },
  { name: 'Tracking Sampah', path: '/tracking', icon: <TrackingIcon /> },
  { name: 'Tips Monetisasi', path: '/monetisasi', icon: <MonetisasiIcon /> },
  { name: 'Forum Diskusi', path: '/forum', icon: <ForumIcon /> },
  { name: 'Peta Pengepul', path: '/peta-pengepul', icon: <LocationIcon /> },
];

// Definisi menu untuk admin
const adminMenuItems = [
  { name: 'Beranda', path: '/admin/dashboard', icon: <DashboardIcon /> },
  { name: 'Manajemen Data Sampah', path: '/admin/data-sampah', icon: <CategoryIcon /> },
  { name: 'Kelola Harga Sampah', path: '/admin/harga-sampah', icon: <PriceIcon /> },
  { name: 'Forum Diskusi', path: '/admin/forum-diskusi', icon: <ForumIcon /> },
  { name: 'Manajemen Lokasi Pengepul', path: '/admin/lokasi-pengepul', icon: <LocationIcon /> },
  { name: 'CMS', path: '/admin/cms', icon: <ArticleIcon /> },
];

const drawerWidth = 240;

const Sidebar = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const { user } = useAuth();
  
  // Check if user is admin
  const isAdmin = user?.role === 'admin' || user?.is_admin;
  
  // Choose which menu items to display based on user role
  const menuItems = isAdmin ? adminMenuItems : userMenuItems;

  const drawer = (
    <Box sx={{ mt: 2 }}>
      <Typography 
        variant="h6" 
        sx={{ 
          fontWeight: 600, 
          mx: 3, 
          my: 2, 
          color: theme.palette.primary.main,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {isAdmin && <AdminIcon sx={{ mr: 1 }} />}
        {isAdmin ? 'MENU ADMIN' : 'MENU UTAMA'}
      </Typography>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              TouchRippleProps={{ color: 'white' }}
              sx={{
                mx: 1,
                mb: 1,
                borderRadius: 1,
                color: 'inherit',
                '&:hover': {
                  backgroundColor: theme.palette.primary.main,
                  color: '#fff',
                  '& .MuiListItemIcon-root': {
                    color: '#fff',
                  },
                },
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.light,
                  color: 'black',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.light,
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'black',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      {!isAdmin && (
        <>
          <Divider sx={{ my: 2 }} />
          <List>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/about"
                selected={location.pathname === '/about'}
                sx={{
                  mx: 1,
                  borderRadius: 1,
                  color: 'inherit',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.main,
                    color: '#fff',
                    '& .MuiListItemIcon-root': {
                      color: '#fff',
                    },
                  },
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.light,
                    color: 'black',
                    '& .MuiListItemIcon-root': {
                      color: 'black',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <InfoIcon />
                </ListItemIcon>
                <ListItemText primary="Tentang Revalio" />
              </ListItemButton>
            </ListItem>
          </List>
        </>
      )}
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      aria-label="menu navigasi"
    >
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={open}
          onClose={onClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
            disableScrollLock: false,
            disablePortal: false,
            disableEnforceFocus: false,
            disableAutoFocus: false,
            disableRestoreFocus: false,
            hideBackdrop: false
          }}
          componentsprops={{
            backdrop: {
              inert: !open ? "true" : undefined
            },
            paper: {
              inert: !open ? "true" : undefined,
              tabIndex: "-1"
            }
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              marginTop: '64px',
              height: 'calc(100% - 64px)',
            },
          }}
        >
          {drawer}
        </Drawer>
      ) : (
        <Drawer
          variant="persistent"
          open={open}
          componentsprops={{
            paper: {
              inert: !open ? "true" : undefined,
              tabIndex: "-1"
            }
          }}
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              marginTop: '64px',
              height: 'calc(100% - 64px)',
              borderRight: '1px solid rgba(0, 0, 0, 0.12)',
              transition: 'transform 0.3s ease-in-out',
              transform: open ? 'translateX(0)' : `translateX(-${drawerWidth}px)`,
            },
          }}
        >
          {drawer}
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;

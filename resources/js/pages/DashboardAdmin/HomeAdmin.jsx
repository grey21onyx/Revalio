import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Container, 
  Button,
  Card,
  CardContent,
  IconButton,
  CircularProgress,
  Alert,
  Divider,
  useTheme,
  useMediaQuery,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  LinearProgress
} from '@mui/material';
import {
  Person as PersonIcon,
  Forum as ForumIcon,
  DeleteOutline as DeleteIcon,
  Flag as FlagIcon,
  PeopleAlt as PeopleAltIcon,
  BarChart as BarChartIcon,
  Timeline as TimelineIcon,
  Comment as CommentIcon,
  ArrowForward as ArrowForwardIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

// Create SectionHeading component similar to Home.jsx
const SectionHeading = ({ title, subtitle, actionText, actionLink }) => {
  const theme = useTheme();
  
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography 
          variant="h5" 
          component="h2" 
          fontWeight={700}
          sx={{
            position: 'relative',
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: -8,
              left: 0,
              width: 60,
              height: 3,
              borderRadius: 3,
              backgroundColor: theme.palette.primary.main
            }
          }}
        >
          {title}
        </Typography>
        
        {actionText && actionLink && (
          <Button 
            component={Link} 
            to={actionLink}
            endIcon={<ArrowForwardIcon />}
            variant="text"
            color="primary"
            sx={{
              fontWeight: 600,
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateX(4px)'
              }
            }}
          >
            {actionText}
          </Button>
        )}
      </Box>
      
      {subtitle && (
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ mt: 2.5, mb: 3, maxWidth: '70ch' }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

// Main component
const HomeAdmin = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // States for various dashboard data
  const [loading, setLoading] = useState({
    users: true,
    forums: true,
    moderations: true
  });
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    newUsersToday: 0,
    activeUsers: 0,
    totalForumThreads: 0,
    totalComments: 0,
    reportedContent: 0,
    pendingModeration: 0,
    resolvedIssues: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [flaggedContent, setFlaggedContent] = useState([]);

  // Format relative time for activities
  const formatTimeAgo = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.floor((now - date) / 1000);
      
      if (diffInSeconds < 60) return `${diffInSeconds} detik yang lalu`;
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`;
      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) return `${diffInHours} jam yang lalu`;
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 30) return `${diffInDays} hari yang lalu`;
      const diffInMonths = Math.floor(diffInDays / 30);
      if (diffInMonths < 12) return `${diffInMonths} bulan yang lalu`;
      const diffInYears = Math.floor(diffInMonths / 12);
      return `${diffInYears} tahun yang lalu`;
    } catch {
      return 'waktu tidak valid';
    }
  };

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading({ users: true, forums: true, moderations: true });
        
        // In a real implementation, you would fetch this data from your API
        // For now, we'll use dummy data
        
        // Simulating API request delay
        setTimeout(() => {
          // Set dummy stats
          setStats({
            totalUsers: 1250,
            newUsersToday: 17,
            activeUsers: 322,
            totalForumThreads: 385,
            totalComments: 2437,
            reportedContent: 12,
            pendingModeration: 5,
            resolvedIssues: 35
          });
          
          // Set dummy recent activities
          setRecentActivities([
            { 
              id: 1, 
              type: 'comment_report', 
              user: 'Budi Santoso', 
              content: 'menandai komentar di topik "Pengelolaan Sampah Organik"',
              timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
              status: 'pending'
            },
            { 
              id: 2, 
              type: 'thread_delete', 
              user: 'Admin Arya', 
              content: 'menghapus thread "Cara Menjual Sampah Elektronik"',
              timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
              status: 'completed'
            },
            { 
              id: 3, 
              type: 'user_register', 
              user: 'Dian Pertiwi', 
              content: 'mendaftar sebagai pengguna baru',
              timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
              status: 'completed'
            },
            { 
              id: 4, 
              type: 'thread_report', 
              user: 'Rina Wulandari', 
              content: 'menandai thread "Pertanyaan tentang Bank Sampah"',
              timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
              status: 'resolved'
            },
            { 
              id: 5, 
              type: 'price_update', 
              user: 'Admin Bayu', 
              content: 'memperbarui harga sampah kategori Plastik',
              timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'completed'
            }
          ]);
          
          // Set dummy flagged content
          setFlaggedContent([
            {
              id: 101,
              contentType: 'thread',
              title: 'Kritik Keras untuk Pengelolaan Sampah Kota',
              reportReason: 'Konten provokatif dan tidak akurat',
              reportedBy: 'Adhi Prasetyo',
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
              reportCount: 3
            },
            {
              id: 102,
              contentType: 'comment',
              title: 'Balasan pada "Cara Efektif Daur Ulang"',
              reportReason: 'Mengandung kata-kata kasar',
              reportedBy: 'Siti Rahma',
              timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
              reportCount: 2
            },
            {
              id: 103,
              contentType: 'comment',
              title: 'Komentar pada "Monetisasi Sampah"',
              reportReason: 'Spam / Promosi tidak relevan',
              reportedBy: 'Kevin Wijaya',
              timestamp: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
              reportCount: 1
            }
          ]);
          
          setLoading({ users: false, forums: false, moderations: false });
        }, 1000);
        
      } catch (err) {
        console.error('Error fetching admin dashboard data:', err);
        setError('Terjadi kesalahan saat memuat data dashboard');
        setLoading({ users: false, forums: false, moderations: false });
      }
    };
    
    fetchData();
  }, []);

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get status chip for activities
  const getStatusChip = (status) => {
    switch (status) {
      case 'pending':
        return <Chip size="small" color="warning" label="Menunggu" sx={{ height: 20, fontSize: '0.7rem' }} />;
      case 'resolved':
        return <Chip size="small" color="success" label="Teratasi" sx={{ height: 20, fontSize: '0.7rem' }} />;
      case 'completed':
        return <Chip size="small" color="info" label="Selesai" sx={{ height: 20, fontSize: '0.7rem' }} />;
      default:
        return <Chip size="small" color="default" label={status} sx={{ height: 20, fontSize: '0.7rem' }} />;
    }
  };

  // Get icon for activity type
  const getActivityIcon = (type) => {
    switch (type) {
      case 'comment_report':
        return <CommentIcon sx={{ color: theme.palette.warning.main }} />;
      case 'thread_delete':
        return <DeleteIcon sx={{ color: theme.palette.error.main }} />;
      case 'thread_report':
        return <FlagIcon sx={{ color: theme.palette.warning.main }} />;
      case 'user_register':
        return <PersonIcon sx={{ color: theme.palette.info.main }} />;
      case 'price_update':
        return <BarChartIcon sx={{ color: theme.palette.success.main }} />;
      default:
        return <InfoIcon sx={{ color: theme.palette.text.secondary }} />;
    }
  };

  return (
    <Box sx={{ backgroundColor: '#f8f9fa', minHeight: '100vh', py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg">
        {/* Header Section with Welcome Message */}
        <Box sx={{ mb: { xs: 4, md: 6 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" component="h1" fontWeight={700} gutterBottom sx={{ mb: 1 }}>
              Dashboard Admin
            </Typography>
            <Button 
              variant="outlined" 
              color="error"
              onClick={handleLogout}
              sx={{ borderRadius: 8 }}
            >
              Logout
            </Button>
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Selamat datang di panel admin Revalio. Kelola pengguna, forum diskusi, dan harga sampah dalam satu tempat.
          </Typography>

          {/* Admin Stats Cards */}
          <Grid container spacing={3}>
            {/* User Stats */}
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, boxShadow: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" fontWeight={600}>Pengguna</Typography>
                    <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 40, height: 40 }}>
                      <PeopleAltIcon />
                    </Avatar>
                  </Box>
                  <Typography variant="h4" color="primary.main" fontWeight={700}>{stats.totalUsers}</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      +{stats.newUsersToday} hari ini
                    </Typography>
                    <Typography variant="body2" color="success.main">
                      {stats.activeUsers} aktif
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Forum Stats */}
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, boxShadow: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" fontWeight={600}>Forum</Typography>
                    <Avatar sx={{ bgcolor: theme.palette.info.main, width: 40, height: 40 }}>
                      <ForumIcon />
                    </Avatar>
                  </Box>
                  <Typography variant="h4" color="info.main" fontWeight={700}>{stats.totalForumThreads}</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Diskusi
                    </Typography>
                    <Typography variant="body2" color="info.main">
                      {stats.totalComments} komentar
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Moderation Stats */}
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, boxShadow: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" fontWeight={600}>Moderasi</Typography>
                    <Avatar sx={{ bgcolor: theme.palette.warning.main, width: 40, height: 40 }}>
                      <FlagIcon />
                    </Avatar>
                  </Box>
                  <Typography variant="h4" color="warning.main" fontWeight={700}>{stats.reportedContent}</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="body2" color="error.main">
                      {stats.pendingModeration} menunggu
                    </Typography>
                    <Typography variant="body2" color="success.main">
                      {stats.resolvedIssues} teratasi
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Quick Action Card */}
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: 3, 
                boxShadow: 3,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                color: 'white'
              }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: 'white' }}>Aksi Cepat</Typography>
                  <Button 
                    variant="contained" 
                    component={Link}
                    to="/admin/forum-diskusi"
                    sx={{ 
                      mb: 1, 
                      bgcolor: 'rgba(255,255,255,0.15)', 
                      color: 'white',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' }
                    }}
                    fullWidth
                  >
                    Moderasi Forum
                  </Button>
                  <Button 
                    variant="contained" 
                    component={Link}
                    to="/admin/harga-sampah"
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.15)', 
                      color: 'white',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' }
                    }}
                    fullWidth
                  >
                    Kelola Harga
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Content Sections - Main Area */}
        <Grid container spacing={4}>
          {/* Activity Feed Section */}
          <Grid item xs={12} md={7}>
            <SectionHeading 
              title="Aktivitas Terbaru" 
              subtitle="Riwayat aktivitas pengguna dan admin dalam platform" 
            />
            
            {loading.moderations ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            ) : (
              <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                  {recentActivities.map((activity, index) => (
                    <React.Fragment key={activity.id}>
                      <ListItem 
                        alignItems="flex-start"
                        secondaryAction={getStatusChip(activity.status)}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'transparent' }}>
                            {getActivityIcon(activity.type)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {activity.user}
                            </Typography>
                          }
                          secondary={
                            <>
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.primary"
                              >
                                {activity.content}
                              </Typography>
                              <Typography
                                component="span"
                                variant="caption"
                                sx={{ display: 'block', color: 'text.secondary', mt: 0.5 }}
                              >
                                {formatTimeAgo(activity.timestamp)}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                      {index < recentActivities.length - 1 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                  ))}
                </List>
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', bgcolor: 'rgba(0, 0, 0, 0.01)' }}>
                  <Button 
                    component={Link}
                    to="/admin/activity-log" 
                    endIcon={<ArrowForwardIcon />}
                  >
                    Lihat Semua Aktivitas
                  </Button>
                </Box>
              </Paper>
            )}
          </Grid>
          
          {/* Flagged Content Section */}
          <Grid item xs={12} md={5}>
            <SectionHeading 
              title="Konten yang Dilaporkan" 
              subtitle="Daftar thread dan komentar yang perlu ditinjau" 
              actionText="Lihat Semua"
              actionLink="/admin/forum-diskusi"
            />
            
            {loading.forums ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            ) : (
              <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                  {flaggedContent.map((item, index) => (
                    <React.Fragment key={item.id}>
                      <ListItem 
                        alignItems="flex-start"
                        secondaryAction={
                          <Chip 
                            icon={<WarningIcon fontSize="small" />}
                            size="small" 
                            color="error" 
                            label={`${item.reportCount} laporan`} 
                            sx={{ height: 24, fontSize: '0.75rem' }} 
                          />
                        }
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: item.contentType === 'thread' ? theme.palette.error.light : theme.palette.warning.light }}>
                            {item.contentType === 'thread' ? <ForumIcon color="error" /> : <CommentIcon color="warning" />}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {item.title}
                            </Typography>
                          }
                          secondary={
                            <>
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.primary"
                                sx={{ display: 'block' }}
                              >
                                {item.reportReason}
                              </Typography>
                              <Typography
                                component="span"
                                variant="caption"
                                sx={{ display: 'block', color: 'text.secondary', mt: 0.5 }}
                              >
                                Dilaporkan oleh {item.reportedBy}, {formatTimeAgo(item.timestamp)}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                      {index < flaggedContent.length - 1 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                  ))}
                </List>
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', bgcolor: 'rgba(0, 0, 0, 0.01)' }}>
                  <Button 
                    variant="contained"
                    color="warning"
                    component={Link}
                    to="/admin/forum-diskusi"
                    startIcon={<FlagIcon />}
                  >
                    Tinjau Semua Laporan
                  </Button>
                </Box>
              </Paper>
            )}
            
            {/* Quick Action Cards */}
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={6}>
                <Card sx={{ backgroundColor: theme.palette.info.light, color: 'white', p: 2, borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>Manajemen User</Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>Kelola akun pengguna dan atur hak akses</Typography>
                  <Button 
                    variant="contained" 
                    size="small"
                    component={Link}
                    to="/admin/users"
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)', 
                      color: 'white',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                    }}
                  >
                    Buka
                  </Button>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card sx={{ backgroundColor: theme.palette.success.light, color: 'white', p: 2, borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>Data Sampah</Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>Tambah & edit kategori dan jenis sampah</Typography>
                  <Button 
                    variant="contained" 
                    size="small"
                    component={Link}
                    to="/admin/data-sampah"
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)', 
                      color: 'white',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                    }}
                  >
                    Buka
                  </Button>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HomeAdmin;

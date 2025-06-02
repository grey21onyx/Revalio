import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Container, 
  Button, 
  TextField, 
  MenuItem, 
  Chip, 
  Stack,
  CircularProgress,
  Avatar,
  IconButton,
  Divider,
  Pagination,
  Rating,
  Badge,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tab,
  Tabs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Card,
  CardContent,
  useTheme
} from '@mui/material';
import ForumIcon from '@mui/icons-material/Forum';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StarIcon from '@mui/icons-material/Star';
import FlagIcon from '@mui/icons-material/Flag';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import CommentIcon from '@mui/icons-material/Comment';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import Swal from 'sweetalert2';

// Komponen error boundary sederhana
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by error boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error" gutterBottom>
            Terjadi Kesalahan
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Maaf, terjadi kesalahan saat menampilkan data forum.
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              this.setState({ hasError: false });
              window.location.reload();
            }}
          >
            Coba Lagi
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

const Forum = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const theme = useTheme();

  // State for all tabs
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories] = useState([
    { id: '', name: 'Semua Kategori' },
    { id: 'general', name: 'Umum' },
    { id: 'tips', name: 'Tips & Trik' },
    { id: 'recycling', name: 'Daur Ulang' },
  ]);
  
  // State untuk tab "Semua Diskusi"
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOption, setSortOption] = useState('latest'); // 'latest' or 'popular'
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredThreads, setFilteredThreads] = useState([]);
  const [allThreadsPage, setAllThreadsPage] = useState(1);
  const ITEMS_PER_PAGE = 5;
  
  // State untuk tab "Diskusi Saya"
  const [myThreads, setMyThreads] = useState([]);
  const [myThreadsCategory, setMyThreadsCategory] = useState('');
  const [myThreadsSortOption, setMyThreadsSortOption] = useState('latest');
  const [filteredMyThreads, setFilteredMyThreads] = useState([]);
  const [myThreadsPage, setMyThreadsPage] = useState(1);
  
  // State untuk tab "Komentar Saya"
  const [myComments, setMyComments] = useState([]);
  const [myCommentsCategory, setMyCommentsCategory] = useState('');
  const [myCommentsSortOption, setMyCommentsSortOption] = useState('latest');
  const [filteredMyComments, setFilteredMyComments] = useState([]);
  const [myCommentsPage, setMyCommentsPage] = useState(1);
  
  // New state for admin features
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'myThreads', 'myComments', 'reports', 'moderation'
  const [loadingMyData, setLoadingMyData] = useState(false);
  
  // Admin-specific state
  const [reportedComments, setReportedComments] = useState([]);
  const [reportedThreads, setReportedThreads] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [reportFilter, setReportFilter] = useState('all'); // 'all', 'pending', 'resolved', 'rejected'
  const [reportsPage, setReportsPage] = useState(1);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState(null);
  
  // Enhanced state for reports
  const [reportStats, setReportStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
    rejected: 0
  });

  // Check if user is admin
  const isAdmin = user && (user.role === 'admin' || user.user_type === 'admin');

  // Add these to the state variables section (near the top of the component)
  const [reportSortOrder, setReportSortOrder] = useState('newest'); // 'newest' or 'oldest'

  // Add this function near the top of the component
  const getAvatarUrl = (user) => {
    if (!user || !user.avatar) return null;
    
    // Handle different formats of avatar URL
    if (user.avatar.startsWith('http')) {
      return user.avatar;
    } else if (user.avatar.startsWith('/storage/')) {
      return user.avatar;
    } else {
      return `/storage/${user.avatar}`;
    }
  };

  // Fetch threads from API
  useEffect(() => {
    const fetchThreads = async () => {
      try {
        setLoading(true);
        // Pilih endpoint yang sesuai berdasarkan sortOption
        const endpoint = sortOption === 'popular' 
          ? '/public/forum-threads'  // Changed to fetch all threads for manual sorting
          : '/public/forum-threads';
        
        // Siapkan parameter untuk filter category dan search
        let params = {};
        if (searchQuery) {
          params.search = searchQuery;
        }
        
        if (selectedCategory) {
          params.tags = selectedCategory;
        }
        
        console.log('Fetching forum threads from:', endpoint, 'with params:', params);
        const response = await api.get(endpoint, { params });
        console.log('Forum threads response:', response.data);
        
        // Validasi format response
        if (!response.data || !Array.isArray(response.data.data)) {
          console.error('Invalid response format:', response.data);
          setError('Format data tidak valid. Silakan coba lagi.');
          return;
        }
        
        // Format data dari API ke format yang digunakan di frontend
        const formattedThreads = response.data.data.map(thread => {
          // Debug data yang diterima untuk memastikan format average_rating
          console.log(`Thread ${thread.id || thread.thread_id} raw rating data:`, {
            rating: thread.average_rating,
            rating_type: typeof thread.average_rating,
            rating_count: thread.rating_count
          });
          
          // Validasi data dan pastikan tipe data numerik dengan fallback
          const commentsCount = parseInt(thread.comments_count) || 0;
          const likesCount = parseInt(thread.likes_count) || 0;
          const viewCount = parseInt(thread.view_count) || 0;
          
          // Penanganan khusus untuk average_rating dengan validasi yang lebih ketat
          let avgRating = 0;
          if (thread.average_rating !== undefined && thread.average_rating !== null) {
            // Coba konversi ke float dengan sanitasi
            if (typeof thread.average_rating === 'string') {
              avgRating = parseFloat(thread.average_rating.replace(/[^\d.-]/g, '')) || 0;
            } else {
              avgRating = parseFloat(thread.average_rating) || 0;
            }
          }
          
          // Validasi kisaran rating (1-5)
          const validRating = avgRating > 0 && avgRating <= 5 ? avgRating : 0;
          
          // Penanganan khusus untuk rating_count
          const ratingCount = thread.rating_count !== undefined && thread.rating_count !== null
            ? parseInt(thread.rating_count)
            : 0;
          
          // Calculate popularity score dengan validasi
          const commentScore = commentsCount * 2;
          const likeScore = likesCount * 3;
          const viewScore = viewCount * 0.5;
          const ratingScore = validRating * 5;
          const popularityScore = commentScore + likeScore + viewScore + ratingScore;
          
          // Log untuk debugging hasil processing
          console.log(`Thread ${thread.id || thread.thread_id} processed rating:`, { 
            originalRating: thread.average_rating,
            parsedRating: avgRating,
            finalRating: validRating,
            ratingCount: ratingCount
          });
          
          return {
            id: thread.id || thread.thread_id,
            title: thread.judul || 'Tanpa Judul',
            author: thread.user ? (thread.user.nama || thread.user.name || 'Pengguna') : 'Pengguna',
            replies: commentsCount,
            likes: likesCount,
            views: viewCount,
            rating: validRating,
            rating_count: ratingCount,
            lastPost: thread.tanggal_posting || new Date().toISOString(),
            category: getCategoryFromTags(thread.tags),
            tags: thread.tags ? thread.tags.split(',').filter(tag => tag.trim()) : [],
            avatar: thread.user ? thread.user.foto_profil || thread.user.avatar : null,
            popularityScore: popularityScore
          };
        });
        
        console.log('Formatted threads with popularity scores:', formattedThreads.map(t => ({ 
          id: t.id, 
          title: t.title, 
          popularityScore: t.popularityScore 
        })));
        
        // Sort by popularity if needed
        if (sortOption === 'popular') {
          formattedThreads.sort((a, b) => b.popularityScore - a.popularityScore);
        }
        
        setThreads(formattedThreads);
        setFilteredThreads(formattedThreads);
      } catch (err) {
        console.error('Error fetching threads:', err);
        console.error('Error details:', err.response?.status, err.response?.data);
        setError('Gagal mengambil data forum. Silakan coba lagi nanti.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchThreads();
  }, [sortOption, selectedCategory, searchQuery]);

  // Helper function untuk mendapatkan kategori dari tags
  const getCategoryFromTags = (tags) => {
    if (!tags) return 'Umum';
    
    try {
      // Pastikan tags adalah string, bukan array atau null
      const tagString = typeof tags === 'string' ? tags : '';
      if (!tagString) return 'Umum';
      
      const tagList = tagString.toLowerCase().split(',');
      console.log('Tag list for category mapping:', tagList);
      
      // Cek secara case-insensitive
      if (tagList.some(tag => tag.includes('tips') || tag.includes('trik'))) {
        return 'Tips & Trik';
      } else if (tagList.some(tag => tag.includes('daur') || tag.includes('recycling'))) {
        return 'Daur Ulang';
      }
      return 'Umum';
    } catch (error) {
      console.error('Error processing tags:', error);
      return 'Umum';
    }
  };

  // Pagination handlers
  const handleAllThreadsPageChange = (event, value) => {
    setAllThreadsPage(value);
  };

  const handleMyThreadsPageChange = (event, value) => {
    setMyThreadsPage(value);
  };

  const handleMyCommentsPageChange = (event, value) => {
    setMyCommentsPage(value);
  };

  // Handle category change untuk setiap tab
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setAllThreadsPage(1); // Reset pagination when filter changes
  };

  const handleMyThreadsCategoryChange = (e) => {
    setMyThreadsCategory(e.target.value);
    filterMyThreads(myThreads, e.target.value, myThreadsSortOption);
    setMyThreadsPage(1); // Reset pagination when filter changes
  };

  const handleMyCommentsCategoryChange = (e) => {
    setMyCommentsCategory(e.target.value);
    filterMyComments(myComments, e.target.value, myCommentsSortOption);
    setMyCommentsPage(1); // Reset pagination when filter changes
  };

  // Handle sort option change untuk setiap tab
  const handleSortChange = (e) => {
    const newSortOption = e.target.value;
    setSortOption(newSortOption);
    
    // Apply sorting
    if (newSortOption === 'popular') {
      const sortedThreads = [...threads].sort((a, b) => b.popularityScore - a.popularityScore);
      setFilteredThreads(sortedThreads);
    } else {
      // Default sort by latest date
      const sortedThreads = [...threads].sort((a, b) => new Date(b.lastPost) - new Date(a.lastPost));
      setFilteredThreads(sortedThreads);
    }
    
    setAllThreadsPage(1); // Reset pagination when filter changes
  };

  const handleMyThreadsSortChange = (e) => {
    const newSortOption = e.target.value;
    setMyThreadsSortOption(newSortOption);
    filterMyThreads(myThreads, myThreadsCategory, newSortOption);
    setMyThreadsPage(1); // Reset pagination when filter changes
  };

  const handleMyCommentsSortChange = (e) => {
    const newSortOption = e.target.value;
    setMyCommentsSortOption(newSortOption);
    filterMyComments(myComments, myCommentsCategory, newSortOption);
    setMyCommentsPage(1); // Reset pagination when filter changes
  };

  // Handle search change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setAllThreadsPage(1); // Reset pagination when filter changes
  };

  // Function untuk filter diskusi saya
  const filterMyThreads = (threads, category, sortOpt) => {
    let filtered = [...threads];
    
    // Apply category filter
    if (category) {
      filtered = filtered.filter(thread => {
        const threadCategory = getCategoryFromTags(thread.tags);
        return threadCategory === category;
      });
    }
    
    // Apply sorting
    if (sortOpt === 'latest') {
      filtered.sort((a, b) => new Date(b.lastPost) - new Date(a.lastPost));
    } else if (sortOpt === 'popular') {
      filtered.sort((a, b) => b.popularityScore - a.popularityScore);
    }
    
    setFilteredMyThreads(filtered);
    setMyThreadsPage(1); // Reset to first page when filter changes
  };

  // Function untuk filter komentar saya
  const filterMyComments = (comments, category, sortOpt) => {
    let filtered = [...comments];
    
    // Apply category filter
    if (category) {
      filtered = filtered.filter(comment => {
        return comment.category === category;
      });
    }
    
    // Apply sorting
    if (sortOpt === 'latest') {
      filtered.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));
    } else if (sortOpt === 'popular') {
      // Sort berdasarkan length komentar sebagai proxy untuk popularitas
      filtered.sort((a, b) => b.text.length - a.text.length);
    }
    
    setFilteredMyComments(filtered);
    setMyCommentsPage(1); // Reset to first page when filter changes
  };

  // Calculate paginated items
  const getPaginatedThreads = (threads, page) => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return threads.slice(startIndex, endIndex);
  };

  // Calculate total pages
  const getTotalPages = (itemsCount) => {
    return Math.ceil(itemsCount / ITEMS_PER_PAGE);
  };

  // Handle tab change
  const handleTabChange = (tabValue) => {
    // Jika tab yang sama diklik lagi, refresh data
    const isTabChange = activeTab !== tabValue;
    
    // Check if the tab is admin-only and user is not admin
    if ((tabValue === 'reports' || tabValue === 'moderation') && !isAdmin) {
      Swal.fire({
        title: 'Akses Dibatasi',
        text: 'Hanya administrator yang dapat mengakses fitur moderasi forum.',
        icon: 'warning',
        confirmButtonText: 'Kembali ke Forum'
      });
      return; // Don't change tab
    }
    
    setActiveTab(tabValue);
    
    if (isAuthenticated) {
      // Always refresh the data when switching tabs or clicking the same tab again
      if (tabValue === 'myThreads') {
        fetchMyThreads();
        setMyThreadsPage(1); // Reset to first page when changing tabs
      } else if (tabValue === 'myComments') {
        fetchMyComments();
        setMyCommentsPage(1); // Reset to first page when changing tabs
      } else if (tabValue === 'reports' && isAdmin) {
        fetchReportedContent();
        setReportsPage(1); // Reset to first page when changing tabs
      }
    }
    
    // For "All Discussions" tab, trigger data refresh
    if (tabValue === 'all') {
      // Reset pagination
      setAllThreadsPage(1);
      
      // Reset search and filter params when coming from other tabs
      if (isTabChange) {
        setSelectedCategory('');
        setSortOption('latest');
        setSearchQuery('');
      } else {
        // Jika tab yang sama diklik lagi, trigger refresh dengan parameter yang sama
        const endpoint = sortOption === 'popular' 
          ? '/public/forum-threads'
          : '/public/forum-threads';
        
        setLoading(true);
        
        // Panggil API dengan parameter yang ada
        let params = {};
        if (searchQuery) {
          params.search = searchQuery;
        }
        if (selectedCategory) {
          params.tags = selectedCategory;
        }
        
        api.get(endpoint, { params })
          .then(response => {
            if (response.data && Array.isArray(response.data.data)) {
              const formattedThreads = response.data.data.map(thread => ({
                id: thread.id,
                title: thread.judul || 'Tanpa Judul',
                author: thread.user ? (thread.user.nama || thread.user.name || 'Pengguna') : 'Pengguna',
                replies: thread.comments_count || 0,
                likes: thread.likes_count || 0,
                views: thread.view_count || 0,
                rating: thread.average_rating || 0,
                lastPost: thread.tanggal_posting || new Date().toISOString(),
                category: getCategoryFromTags(thread.tags),
                tags: thread.tags ? thread.tags.split(',').filter(tag => tag.trim()) : [],
                avatar: thread.user ? thread.user.foto_profil || thread.user.avatar : null,
                popularityScore: thread.popularityScore
              }));
              setThreads(formattedThreads);
              setFilteredThreads(formattedThreads);
            }
          })
          .catch(err => {
            console.error('Error refreshing threads:', err);
            setError('Gagal memuat ulang data forum');
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  };
  
  // Fetch threads created by the authenticated user
  const fetchMyThreads = async () => {
    if (!isAuthenticated || !user) return;
    
    try {
      setLoadingMyData(true);
      const response = await api.get('/forum-threads/my-threads');
      
      if (response.data && Array.isArray(response.data.data)) {
        const formattedThreads = response.data.data.map(thread => ({
          id: thread.id,
          title: thread.judul || 'Tanpa Judul',
          author: thread.user ? (thread.user.nama || thread.user.nama_lengkap || thread.user.name || 'Pengguna') : 'Pengguna',
          replies: thread.comments_count || 0,
          likes: thread.likes_count || 0,
          views: thread.view_count || 0,
          rating: thread.average_rating || 0,
          lastPost: thread.tanggal_posting || new Date().toISOString(),
          category: getCategoryFromTags(thread.tags),
          tags: thread.tags ? thread.tags.split(',').filter(tag => tag.trim()) : [],
          avatar: thread.user ? thread.user.foto_profil || thread.user.avatar : null,
          popularityScore: thread.popularityScore
        }));
        
        setMyThreads(formattedThreads);
        // Apply current filter ke data baru
        filterMyThreads(formattedThreads, myThreadsCategory, myThreadsSortOption);
      } else {
        // Set empty array if no data
        setMyThreads([]);
        setFilteredMyThreads([]);
      }
    } catch (error) {
      console.error('Error fetching my threads:', error);
      Swal.fire('Error', 'Gagal mengambil data diskusi Anda', 'error');
      // Set empty arrays on error
      setMyThreads([]);
      setFilteredMyThreads([]);
    } finally {
      setLoadingMyData(false);
    }
  };
  
  // Fetch comments posted by the authenticated user
  const fetchMyComments = async () => {
    if (!isAuthenticated || !user) return;
    
    try {
      setLoadingMyData(true);
      const response = await api.get('/forum-threads/my-comments');
      
      if (response.data && Array.isArray(response.data.data)) {
        const formattedComments = response.data.data.map(comment => ({
          id: comment.komentar_id,
          threadId: comment.thread_id,
          threadTitle: comment.thread ? comment.thread.judul : 'Tidak diketahui',
          text: comment.konten,
          postedAt: comment.tanggal_komentar,
          parentCommentId: comment.parent_komentar_id,
          tags: comment.thread && comment.thread.tags ? 
                comment.thread.tags.split(',').filter(tag => tag.trim()) : [],
          category: comment.thread ? getCategoryFromTags(comment.thread.tags) : 'Umum',
        }));
        
        setMyComments(formattedComments);
        // Apply current filter ke data baru
        filterMyComments(formattedComments, myCommentsCategory, myCommentsSortOption);
      } else {
        // Set empty array if no data
        setMyComments([]);
        setFilteredMyComments([]);
      }
    } catch (error) {
      console.error('Error fetching my comments:', error);
      Swal.fire('Error', 'Gagal mengambil data komentar Anda', 'error');
      // Set empty arrays on error
      setMyComments([]);
      setFilteredMyComments([]);
    } finally {
      setLoadingMyData(false);
    }
  };

  const handleCreateThread = () => {
    navigate('/forum/new-topic');
  };

  // Handle klik pada thread
  const handleThreadClick = (threadId) => {
    console.log('Navigating to forum detail with ID:', threadId);
    if (!threadId) {
      console.error('Invalid thread ID:', threadId);
      Swal.fire('Error', 'ID thread tidak valid', 'error');
      return;
    }
    
    // Validasi lebih jauh untuk memastikan ID adalah angka atau string yang valid 
    if (isNaN(parseInt(threadId))) {
      console.error('Thread ID is not a valid number:', threadId);
      Swal.fire('Error', 'Format ID thread tidak valid', 'error');
      return;
    }
    
    try {
      navigate(`/detail-forum/${threadId}`);
    } catch (error) {
      console.error('Navigation error:', error);
      Swal.fire('Error', 'Gagal membuka detail thread', 'error');
    }
  };

  // Handle thread deletion
  const handleDeleteThread = async (e, threadId) => {
    e.stopPropagation(); // Prevent navigating to the thread when clicking delete button
    
    // Confirm deletion with user
    const result = await Swal.fire({
      title: 'Hapus Diskusi',
      text: 'Apakah Anda yakin ingin menghapus diskusi ini? Tindakan ini tidak dapat dibatalkan.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        // Tampilkan loading state
        Swal.fire({
          title: 'Menghapus Diskusi',
          text: 'Mohon tunggu...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        
        setLoadingMyData(true);
        console.log(`Menghapus thread dengan ID: ${threadId}`);
        
        // Call API to delete the thread
        const response = await api.delete(`/forum-threads/${threadId}`);
        console.log('API response:', response.data);
        
        // Remove thread from both state arrays
        const updatedThreads = myThreads.filter(thread => thread.id !== threadId);
        setMyThreads(updatedThreads);
        setFilteredMyThreads(filteredMyThreads.filter(thread => thread.id !== threadId));
        
        // Force refresh data to ensure consistency
        fetchMyThreads();
        
        Swal.fire({
          icon: 'success',
          title: 'Terhapus!',
          text: 'Diskusi berhasil dihapus.',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (error) {
        console.error('Error deleting thread:', error);
        
        let errorMessage = 'Gagal menghapus diskusi. Silakan coba lagi nanti.';
        let errorDetails = '';
        
        if (error.response) {
          console.error('API response error:', error.response.status, error.response.data);
          
          if (error.response.status === 403) {
            errorMessage = 'Anda tidak memiliki izin untuk menghapus diskusi ini.';
          } else if (error.response.status === 404) {
            errorMessage = 'Diskusi tidak ditemukan atau sudah dihapus sebelumnya.';
          } else if (error.response.status === 500) {
            errorMessage = 'Terjadi kesalahan pada server saat menghapus diskusi.';
            if (error.response.data && error.response.data.error) {
              errorDetails = `Detail error: ${error.response.data.error}`;
            }
          }
        }
        
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage,
          footer: errorDetails,
          confirmButtonText: 'Tutup'
        });
        
        // Refresh data untuk memastikan tampilan UI konsisten
        await fetchMyThreads();
      } finally {
        setLoadingMyData(false);
      }
    }
  };

  // Fetch reported content for admin - enhanced version
  const fetchReportedContent = async () => {
    if (!isAdmin) return;
    
    try {
      setLoadingReports(true);
      
      // Call API to get reports data
      try {
        const response = await api.get('/forum-reports');
        console.log('Reports data:', response.data);
        
        if (response.data && Array.isArray(response.data.data)) {
          // Set the reports
          const reportsData = response.data.data;
          
          const commentReports = reportsData.filter(report => report.reportable_type === 'comment');
          const threadReports = reportsData.filter(report => report.reportable_type === 'thread');
          
          console.log('Comment reports:', commentReports.length);
          console.log('Thread reports:', threadReports.length);
          
          setReportedComments(commentReports);
          setReportedThreads(threadReports);
          
          // Calculate report statistics
          if (response.data.stats) {
            setReportStats(response.data.stats);
          } else {
            // Calculate stats from data if not provided by API
            const totalReports = reportsData.length;
            const pendingReports = reportsData.filter(report => report.status === 'reported').length;
            const resolvedReports = reportsData.filter(report => report.status === 'resolved').length;
            const rejectedReports = reportsData.filter(report => report.status === 'rejected').length;
            
            setReportStats({
              total: totalReports,
              pending: pendingReports,
              resolved: resolvedReports,
              rejected: rejectedReports
            });
          }
        }
      } catch (error) {
        console.error('Error fetching reports data:', error);
        
        // Check if this is a 500 server error
        if (error.response && error.response.status === 500) {
          console.error('Server error details:', error.response.data);
          
          // Show a more descriptive message to the user
          Swal.fire({
            title: 'Server Error',
            text: 'Terjadi kesalahan pada server saat mengambil data laporan. Fitur laporan mungkin belum diaktifkan atau memerlukan konfigurasi lebih lanjut.',
            icon: 'error',
            confirmButtonText: 'Kembali ke Forum',
            showCancelButton: true,
            cancelButtonText: 'Coba Lagi'
          }).then((result) => {
            if (result.isConfirmed) {
              // Switch back to the main forum tab
              handleTabChange('all');
            } else {
              // Try again
              fetchReportedContent();
            }
          });
        } else {
          // Generic error for other cases
          Swal.fire('Error', 'Gagal mengambil data laporan. Silakan coba lagi nanti.', 'error');
        }
        
        // Fallback to empty data in case of error
        setReportedComments([]);
        setReportedThreads([]);
        setReportStats({
          total: 0,
          pending: 0,
          resolved: 0,
          rejected: 0
        });
      }
      
      setLoadingReports(false);
    } catch (error) {
      console.error('Error fetching reported content:', error);
      Swal.fire('Error', 'Gagal mengambil data laporan', 'error');
      setLoadingReports(false);
    }
  };

  // Filter reported content - enhanced version
  const getFilteredReports = () => {
    // Combine comment and thread reports
    let allReports = [
      ...reportedComments.map(report => ({ ...report, reportType: 'comment' })),
      ...reportedThreads.map(report => ({ ...report, reportType: 'thread' }))
    ];
    
    if (reportFilter !== 'all') {
      // Map 'pending' filter to 'reported' status in our data model
      const statusToFilter = reportFilter === 'pending' ? 'reported' : reportFilter;
      allReports = allReports.filter(report => report.status === statusToFilter);
    }
    
    // Sort by reported time
    return allReports.sort((a, b) => {
      const dateA = new Date(a.reported_at);
      const dateB = new Date(b.reported_at);
      
      if (reportSortOrder === 'newest') {
        return dateB - dateA; // Newest first
      } else {
        return dateA - dateB; // Oldest first
      }
    });
  };

  // Enhanced preview dialog
  const handleOpenPreviewDialog = (report) => {
    setPreviewContent({
      id: report.id,
      reportType: report.reportType,
      commentId: report.reportType === 'comment' ? report.comment_id : null,
      threadId: report.thread_id,
      threadTitle: report.thread?.judul || 'Thread tidak tersedia',
      content: report.reportType === 'comment' ? report.konten : report.description || 'Tidak ada deskripsi',
      reportReason: report.report_reason,
      reportedBy: report.reported_by?.name || 'Pengguna tidak diketahui',
      reportedAt: report.reported_at,
      authorName: report.user?.name || 'Pengguna tidak diketahui',
      authorId: report.user?.id,
      authorAvatar: report.user?.avatar || null,
      status: report.status,
      resolutionNote: report.resolution_note,
      resolvedAt: report.resolved_at
    });
    setPreviewDialogOpen(true);
  };

  // Function to handle closing the preview dialog
  const handleClosePreviewDialog = () => {
    setPreviewDialogOpen(false);
    setPreviewContent(null);
  };

  // Handle action on reported content - enhanced version
  const handleReportAction = async (reportId, action) => {
    try {
      Swal.fire({
        title: 'Memproses...',
        text: 'Menjalankan tindakan moderasi',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Find the report to determine its type
      const report = getFilteredReports().find(r => r.id === reportId);
      if (!report) {
        throw new Error('Report not found');
      }

      const resolutionNote = action === 'approve' ? 'Laporan valid, konten telah ditinjau' :
                            action === 'delete' ? 'Konten melanggar pedoman' :
                            'Laporan ditolak, konten tidak melanggar pedoman';
      
      // Call API to moderate the report based on report type
      let response;
      if (report.reportType === 'comment') {
        response = await api.patch(`/forum-reports/${reportId}/moderate`, {
          action: action,
          resolution_note: resolutionNote
        });
      } else {
        // For thread reports, use the appropriate API endpoint
        response = await api.patch(`/forum-reports/${reportId}/moderate`, {
          action: action,
          resolution_note: resolutionNote,
          report_type: 'thread'
        });
      }
      
      console.log('Report moderation response:', response.data);
      
      if (response.data && response.data.data) {
        // Refresh reports data to get updated status
        fetchReportedContent();
      }
      
      Swal.fire({
        title: 'Berhasil!',
        text: action === 'approve' 
          ? 'Laporan telah ditandai sebagai teratasi' 
          : action === 'delete' 
            ? `${report.reportType === 'comment' ? 'Komentar' : 'Thread'} berhasil dihapus` 
            : 'Konten telah ditolak dan dibiarkan',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
      
      // Close preview dialog if open
      if (previewDialogOpen) {
        setPreviewDialogOpen(false);
      }
      
    } catch (error) {
      console.error('Error processing report action:', error);
      Swal.fire('Error', 'Gagal memproses tindakan moderasi', 'error');
    }
  };

  // Add function to handle deleting all reports
  const handleDeleteAllReports = () => {
    if (reportedComments.length === 0 && reportedThreads.length === 0) {
      Swal.fire('Info', 'Tidak ada laporan untuk dihapus', 'info');
      return;
    }

    Swal.fire({
      title: 'Hapus Semua Laporan?',
      text: "Anda akan menghapus semua laporan. Tindakan ini tidak dapat dibatalkan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus Semua',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        // Show loading
        Swal.fire({
          title: 'Menghapus Laporan',
          text: 'Mohon tunggu...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        
        // Call API to delete all reports
        api.delete('/forum-reports/all')
          .then(response => {
            console.log('All reports deleted:', response.data);
            
            // Reset report states
            setReportedComments([]);
            setReportedThreads([]);
            setReportStats({
              total: 0,
              pending: 0,
              resolved: 0,
              rejected: 0
            });
            
            Swal.fire(
              'Terhapus!',
              'Semua laporan berhasil dihapus.',
              'success'
            );
          })
          .catch(error => {
            console.error('Error deleting all reports:', error);
            
            let errorMessage = 'Gagal menghapus laporan. Silakan coba lagi nanti.';
            if (error.response && error.response.data && error.response.data.message) {
              errorMessage = error.response.data.message;
            }
            
            Swal.fire(
              'Error!',
              errorMessage,
              'error'
            );
          });
      }
    });
  };

  return (
    <Box sx={{ backgroundColor: '#f9f9f9', py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg">
        {/* Header */}
        <ErrorBoundary>
          <Box sx={{ mb: { xs: 4, md: 5 } }}>
            <Typography 
              variant="h4" 
              component="h1" 
              fontWeight={800} 
              gutterBottom 
              sx={{ 
                position: 'relative', 
                display: 'inline-block',
                mb: 3
              }}
            >
              Forum Diskusi Revalio
              <Box 
                sx={{ 
                  position: 'absolute',
                  bottom: -5,
                  left: 0,
                  width: '50%',
                  height: 4,
                  backgroundColor: (theme) => theme.palette.primary.main,
                  borderRadius: 2
                }}
              />
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ 
                mt: 2, 
                maxWidth: '800px',
                fontSize: '1.1rem',
                lineHeight: 1.6
              }}
            >
              Temukan dan diskusikan berbagai topik terkait pengelolaan sampah dan daur ulang.
            </Typography>
          </Box>
          
          {/* Sub-menu tabs */}
          <Box sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
            <Stack 
              direction="row" 
              spacing={{ xs: 1, sm: 2 }}
              sx={{ overflowX: 'auto', pb: 1 }}
            >
              <Button 
                variant={activeTab === 'all' ? "contained" : "text"}
                onClick={() => handleTabChange('all')}
                sx={{ 
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  fontWeight: activeTab === 'all' ? 700 : 500,
                  color: activeTab === 'all' ? 'white' : 'text.primary',
                  backgroundColor: activeTab === 'all' ? 'primary.main' : 'transparent',
                  '&:hover': {
                    backgroundColor: activeTab === 'all' ? 'primary.dark' : 'action.hover',
                  }
                }}
              >
                Semua Diskusi
              </Button>
              
              {isAuthenticated && (
                <>
                  <Button 
                    variant={activeTab === 'myThreads' ? "contained" : "text"}
                    onClick={() => handleTabChange('myThreads')}
                    sx={{ 
                      px: 3,
                      py: 1,
                      borderRadius: 2,
                      fontWeight: activeTab === 'myThreads' ? 700 : 500,
                      color: activeTab === 'myThreads' ? 'white' : 'text.primary',
                      backgroundColor: activeTab === 'myThreads' ? 'primary.main' : 'transparent',
                      '&:hover': {
                        backgroundColor: activeTab === 'myThreads' ? 'primary.dark' : 'action.hover',
                      }
                    }}
                  >
                    Diskusi Saya
                  </Button>
                  
                  <Button 
                    variant={activeTab === 'myComments' ? "contained" : "text"}
                    onClick={() => handleTabChange('myComments')}
                    sx={{ 
                      px: 3,
                      py: 1,
                      borderRadius: 2,
                      fontWeight: activeTab === 'myComments' ? 700 : 500,
                      color: activeTab === 'myComments' ? 'white' : 'text.primary',
                      backgroundColor: activeTab === 'myComments' ? 'primary.main' : 'transparent',
                      '&:hover': {
                        backgroundColor: activeTab === 'myComments' ? 'primary.dark' : 'action.hover',
                      }
                    }}
                  >
                    Komentar Saya
                  </Button>
                </>
              )}

              {/* Admin-only tabs */}
              {isAdmin && (
                <>
                  <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                  
                  <Button 
                    variant={activeTab === 'reports' ? "contained" : "text"}
                    onClick={() => handleTabChange('reports')}
                    sx={{ 
                      px: 3,
                      py: 1,
                      borderRadius: 2,
                      fontWeight: activeTab === 'reports' ? 700 : 500,
                      color: activeTab === 'reports' ? 'white' : 'error.main',
                      backgroundColor: activeTab === 'reports' ? 'error.main' : 'transparent',
                      '&:hover': {
                        backgroundColor: activeTab === 'reports' ? 'error.dark' : 'action.hover',
                      }
                    }}
                    startIcon={<FlagIcon />}
                  >
                    <Badge 
                      badgeContent={
                        reportedComments.filter(item => item.status === 'reported').length + 
                        reportedThreads.filter(item => item.status === 'reported').length
                      } 
                      color="error"
                      sx={{
                        '& .MuiBadge-badge': {
                          backgroundColor: activeTab === 'reports' ? 'white' : 'error.main',
                          color: activeTab === 'reports' ? 'error.main' : 'white',
                        }
                      }}
                    >
                      Laporan
                    </Badge>
                  </Button>

                  <Button 
                    variant={activeTab === 'moderation' ? "contained" : "text"}
                    onClick={() => handleTabChange('moderation')}
                    sx={{ 
                      px: 3,
                      py: 1,
                      borderRadius: 2,
                      fontWeight: activeTab === 'moderation' ? 700 : 500,
                      color: activeTab === 'moderation' ? 'white' : 'success.main',
                      backgroundColor: activeTab === 'moderation' ? 'success.main' : 'transparent',
                      '&:hover': {
                        backgroundColor: activeTab === 'moderation' ? 'success.dark' : 'action.hover',
                      }
                    }}
                    startIcon={<CheckCircleIcon />}
                  >
                    Moderasi
                  </Button>
                </>
              )}
            </Stack>
          </Box>

          {/* Filter and Search Panel - Only show on "all" tab */}
          {activeTab === 'all' && (
            <Paper sx={{ p: 3, mb: 4, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
              <TextField
                select
                label="Kategori"
                value={selectedCategory}
                onChange={handleCategoryChange}
                sx={{ minWidth: 180 }}
                size="small"
              >
                {categories.map(cat => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Urutkan"
                value={sortOption}
                onChange={handleSortChange}
                sx={{ minWidth: 140 }}
                size="small"
              >
                <MenuItem value="latest">Terbaru</MenuItem>
                <MenuItem value="popular">Terpopuler</MenuItem>
              </TextField>

              <TextField
                label="Cari topik..."
                value={searchQuery}
                onChange={handleSearchChange}
                size="small"
                sx={{ flexGrow: 1, minWidth: 200 }}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
              />

              <Button
                variant="contained"
                color="primary"
                onClick={handleCreateThread}
                sx={{ whiteSpace: 'nowrap' }}
              >
                Buat Topik Baru
              </Button>
            </Paper>
          )}
          
          {/* Filter Panel untuk My Threads Tab */}
          {activeTab === 'myThreads' && isAuthenticated && (
            <Paper sx={{ p: 3, mb: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', gap: 2 }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                  <TextField
                    select
                    label="Kategori"
                    value={myThreadsCategory}
                    onChange={handleMyThreadsCategoryChange}
                    sx={{ minWidth: 180 }}
                    size="small"
                    InputProps={{
                      startAdornment: <FilterListIcon fontSize="small" sx={{ mr: 1, color: 'action.active' }} />
                    }}
                  >
                    {[
                      { id: '', name: 'Semua Kategori' },
                      { id: 'Umum', name: 'Umum' },
                      { id: 'Tips & Trik', name: 'Tips & Trik' },
                      { id: 'Daur Ulang', name: 'Daur Ulang' }
                    ].map(cat => (
                      <MenuItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    select
                    label="Urutkan"
                    value={myThreadsSortOption}
                    onChange={handleMyThreadsSortChange}
                    sx={{ minWidth: 140 }}
                    size="small"
                    InputProps={{
                      startAdornment: <SortIcon fontSize="small" sx={{ mr: 1, color: 'action.active' }} />
                    }}
                  >
                    <MenuItem value="latest">Terbaru</MenuItem>
                    <MenuItem value="popular">Terpopuler</MenuItem>
                  </TextField>
                </Box>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCreateThread}
                  sx={{ whiteSpace: 'nowrap', alignSelf: { xs: 'stretch', sm: 'auto' } }}
                >
                  Buat Topik Baru
                </Button>
              </Box>
            </Paper>
          )}
          
          {/* Filter Panel untuk My Comments Tab */}
          {activeTab === 'myComments' && isAuthenticated && (
            <Paper sx={{ p: 3, mb: 4 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  <TextField
                    select
                    label="Kategori Thread"
                    value={myCommentsCategory}
                    onChange={handleMyCommentsCategoryChange}
                    sx={{ minWidth: 180 }}
                    size="small"
                    InputProps={{
                      startAdornment: <FilterListIcon fontSize="small" sx={{ mr: 1, color: 'action.active' }} />
                    }}
                  >
                    {[
                      { id: '', name: 'Semua Kategori' },
                      { id: 'Umum', name: 'Umum' },
                      { id: 'Tips & Trik', name: 'Tips & Trik' },
                      { id: 'Daur Ulang', name: 'Daur Ulang' }
                    ].map(cat => (
                      <MenuItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    select
                    label="Urutkan"
                    value={myCommentsSortOption}
                    onChange={handleMyCommentsSortChange}
                    sx={{ minWidth: 140 }}
                    size="small"
                    InputProps={{
                      startAdornment: <SortIcon fontSize="small" sx={{ mr: 1, color: 'action.active' }} />
                    }}
                  >
                    <MenuItem value="latest">Terbaru</MenuItem>
                    <MenuItem value="popular">Panjang Komentar</MenuItem>
                  </TextField>
                </Box>
                
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleTabChange('all')}
                >
                  Jelajahi Diskusi
                </Button>
              </Box>
            </Paper>
          )}

          {/* Reports Tab - Admin Only - Enhanced Version */}
          {activeTab === 'reports' && isAdmin && (
            <>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" component="h2" gutterBottom fontWeight={700}>
                  Manajemen Laporan Forum
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Kelola laporan konten dari pengguna dan ambil tindakan yang sesuai untuk menjaga komunitas tetap sehat.
                </Typography>
              </Box>

              {/* Stats Cards */}
              <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={6} sm={3}>
                  <Card sx={{ backgroundColor: theme.palette.grey[100] }}>
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">Total Laporan</Typography>
                      <Typography variant="h4" fontWeight={700}>{reportStats.total}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Card sx={{ backgroundColor: theme.palette.warning.light }}>
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">Menunggu</Typography>
                      <Typography variant="h4" fontWeight={700} color="warning.dark">{reportStats.pending}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Card sx={{ backgroundColor: theme.palette.success.light }}>
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">Teratasi</Typography>
                      <Typography variant="h4" fontWeight={700} color="success.dark">{reportStats.resolved}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Card sx={{ backgroundColor: theme.palette.grey[200] }}>
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">Ditolak</Typography>
                      <Typography variant="h4" fontWeight={700} color="text.secondary">{reportStats.rejected}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Paper sx={{ p: 3, mb: 4 }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <TextField
                      select
                      label="Filter Status"
                      value={reportFilter}
                      onChange={(e) => setReportFilter(e.target.value)}
                      sx={{ minWidth: 180 }}
                      size="small"
                      InputProps={{
                        startAdornment: <FilterListIcon fontSize="small" sx={{ mr: 1, color: 'action.active' }} />
                      }}
                    >
                      <MenuItem value="all">Semua Laporan</MenuItem>
                      <MenuItem value="pending">Menunggu Tindakan</MenuItem>
                      <MenuItem value="resolved">Telah Diatasi</MenuItem>
                      <MenuItem value="rejected">Ditolak</MenuItem>
                    </TextField>
                    
                    {/* Tambah filter sortir laporan */}
                    <TextField
                      select
                      label="Urutkan"
                      value={reportSortOrder}
                      onChange={(e) => setReportSortOrder(e.target.value)}
                      sx={{ minWidth: 150 }}
                      size="small"
                      InputProps={{
                        startAdornment: <SortIcon fontSize="small" sx={{ mr: 1, color: 'action.active' }} />
                      }}
                    >
                      <MenuItem value="newest">Terbaru</MenuItem>
                      <MenuItem value="oldest">Terlama</MenuItem>
                    </TextField>
                  </Box>
                  
                  {reportStats.total > 0 && (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleDeleteAllReports}
                      startIcon={<DeleteIcon />}
                    >
                      Hapus Semua Laporan
                    </Button>
                  )}
                  
                  {reportFilter === 'pending' && reportStats.pending > 0 && (
                    <Typography variant="body2" color="warning.main" fontWeight={500}>
                      <WarningIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                      {reportStats.pending} laporan menunggu tindakan
                    </Typography>
                  )}
                </Box>
              </Paper>

              {/* Main reports rendering section */}
              {loadingReports ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                  <CircularProgress />
                </Box>
              ) : getFilteredReports().length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <FlagIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.3 }} />
                    <Typography variant="h6" gutterBottom>
                      Tidak Ada Laporan
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {reportFilter === 'all' 
                        ? 'Tidak ada laporan konten yang ditemukan saat ini.' 
                        : `Tidak ada laporan dengan status "${
                            reportFilter === 'pending' ? 'menunggu tindakan' : 
                            reportFilter === 'resolved' ? 'telah diatasi' : 
                            'ditolak'
                          }" saat ini.`
                      }
                    </Typography>
                  </Box>
                </Paper>
              ) : (
                <Grid container spacing={3}>
                  {getPaginatedThreads(getFilteredReports(), reportsPage).map((report) => (
                    <Grid item xs={12} key={`report-${report.id}`}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          borderRadius: '12px',
                          border: '1px solid',
                          borderColor: report.status === 'reported' 
                            ? 'warning.light' 
                            : report.status === 'resolved' 
                              ? 'success.light'
                              : 'divider',
                          boxShadow: report.status === 'reported' ? '0 0 0 2px rgba(255,152,0,0.2)' : 'none'
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box>
                            <Typography variant="h6" gutterBottom>
                              Laporan {report.reportType === 'comment' ? 'Komentar' : 'Thread'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Dilaporkan oleh <strong>{report.reported_by.name}</strong> • {formatDateTime(report.reported_at)}
                            </Typography>
                          </Box>
                          <Chip
                            label={
                              report.status === 'reported'
                                ? 'Menunggu Tindakan'
                                : report.status === 'resolved'
                                ? 'Telah Diatasi'
                                : 'Ditolak'
                            }
                            color={
                              report.status === 'reported'
                                ? 'warning'
                                : report.status === 'resolved'
                                ? 'success'
                                : 'default'
                            }
                            size="small"
                          />
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            <strong>Pada thread:</strong> {report.thread?.judul || 'Thread tidak tersedia'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            <strong>Alasan Laporan:</strong>
                          </Typography>
                          <Typography variant="body1" sx={{ mb: 2 }}>
                            {report.report_reason}
                          </Typography>
                        </Box>

                        <Paper
                          variant="outlined"
                          sx={{ p: 2, mb: 3, backgroundColor: 'grey.50' }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar 
                              src={report.user?.avatar ? getAvatarUrl(report.user) : null} 
                              alt={report.user?.name || 'Pengguna'} 
                              sx={{ mr: 2 }}
                              // Add error handling for avatar
                              onError={(e) => {
                                e.target.src = ''; // Clear src to show fallback
                                e.target.onerror = null; // Prevent infinite error loops
                              }}
                            >
                              {report.user?.name ? report.user.name.charAt(0).toUpperCase() : 'U'}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2">
                                {report.user?.name || 'Pengguna'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Penulis {report.reportType === 'comment' ? 'Komentar' : 'Thread'}
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Typography variant="body1" sx={{ 
                            whiteSpace: 'pre-wrap',
                            mb: 0,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                          }}>
                            {report.reportType === 'comment' ? report.konten : 
                             (report.thread?.judul ? `${report.thread.judul} - ${report.description || 'Tidak ada deskripsi'}` : 
                             'Konten tidak tersedia')}
                          </Typography>
                        </Paper>

                        {report.status === 'reported' && (
                          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                            <Button
                              variant="outlined"
                              color="info"
                              onClick={() => handleOpenPreviewDialog(report)}
                            >
                              Lihat Detail
                            </Button>
                            <Button
                              variant="contained"
                              color="success"
                              onClick={() => handleReportAction(report.id, 'approve')}
                              startIcon={<CheckCircleIcon />}
                            >
                              Setujui Laporan
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              onClick={() => handleReportAction(report.id, 'delete')}
                              startIcon={<DeleteIcon />}
                            >
                              Hapus {report.reportType === 'comment' ? 'Komentar' : 'Thread'}
                            </Button>
                          </Box>
                        )}
                        
                        {(report.status === 'resolved' || report.status === 'rejected') && report.resolution_note && (
                          <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              <strong>Catatan Resolusi:</strong>
                            </Typography>
                            <Typography variant="body2">
                              {report.resolution_note} • {formatDateTime(report.resolved_at)}
                            </Typography>
                          </Box>
                        )}
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              )}

              {/* Pagination for Reports */}
              {getTotalPages(getFilteredReports().length) > 1 && (
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                  <Pagination 
                    count={getTotalPages(getFilteredReports().length)} 
                    page={reportsPage}
                    onChange={(e, page) => setReportsPage(page)}
                    color="primary"
                    showFirstButton
                    showLastButton
                  />
                </Box>
              )}
            </>
          )}
          
          {/* Moderation Tab - Admin Only */}
          {activeTab === 'moderation' && isAdmin && (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <CheckCircleIcon sx={{ fontSize: 60, color: 'success.main', opacity: 0.8 }} />
                <Typography variant="h6" gutterBottom>
                  Panel Moderasi Forum
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mb: 2 }}>
                  Fitur lanjutan untuk moderasi forum sedang dalam pengembangan. Di sini Anda akan dapat melihat statistik forum, tindakan moderasi yang telah diambil, dan alat bantu moderasi lainnya.
                </Typography>

                <Grid container spacing={3} sx={{ mt: 2, maxWidth: 800, mx: 'auto' }}>
                  <Grid item xs={12} sm={6}>
                    <Paper elevation={2} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="h6" gutterBottom fontWeight={600}>Statistik Forum</Typography>
                      <Typography variant="body2" sx={{ mb: 2, flexGrow: 1 }}>
                        Lihat statistik mendetail tentang diskusi di forum
                      </Typography>
                      <Button variant="outlined" color="primary" onClick={() => navigate('/admin/forum-stats')}>
                        Buka Statistik
                      </Button>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Paper elevation={2} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="h6" gutterBottom fontWeight={600}>Log Aktivitas</Typography>
                      <Typography variant="body2" sx={{ mb: 2, flexGrow: 1 }}>
                        Lihat riwayat semua aktivitas moderasi yang telah dilakukan
                      </Typography>
                      <Button variant="outlined" color="primary" onClick={() => navigate('/admin/activity-log')}>
                        Buka Log
                      </Button>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          )}

          {/* Threads List - All Discussions Tab */}
          {activeTab === 'all' && (
            <>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                  <CircularProgress />
                </Box>
              ) : error ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography color="error">{error}</Typography>
                  <Button 
                    variant="outlined" 
                    sx={{ mt: 2 }}
                    onClick={() => window.location.reload()}
                  >
                    Coba Lagi
                  </Button>
                </Box>
              ) : filteredThreads.length === 0 ? (
                <Typography variant="body1" color="text.secondary" align="center" sx={{ mt: 6 }}>
                  Tidak ada topik yang ditemukan.
                </Typography>
              ) : (
                <>
                  <Grid container spacing={3}>
                    {getPaginatedThreads(filteredThreads, allThreadsPage).map(thread => (
                      <Grid item xs={12} key={thread.id}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 3,
                            cursor: 'pointer',
                            borderRadius: '12px',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': { 
                              backgroundColor: 'grey.100',
                              transform: 'translateY(-6px)',
                              boxShadow: '0 8px 16px rgba(0,0,0,0.08)'
                            },
                            border: '1px solid',
                            borderColor: 'grey.200',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                          }}
                          onClick={() => handleThreadClick(thread.id)}
                        >
                          <Typography variant="h6" color="primary" gutterBottom>
                            {thread.title}
                          </Typography>
                          <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                            <Typography>Oleh: {thread.author || 'Pengguna'}</Typography>
                            <Typography>{thread.replies} komentar</Typography>
                            <Typography>Terakhir: {formatDateTime(thread.lastPost)}</Typography>
                            <Typography sx={{ textTransform: 'capitalize' }}>Kategori: {thread.category}</Typography>
                          </Stack>
                          
                          {/* Added Ratings and Views */}
                          <Stack direction="row" spacing={2} mt={1} sx={{ color: 'text.secondary', fontSize: '0.875rem', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <VisibilityIcon fontSize="small" sx={{ mr: 0.5 }} />
                              <Typography>{thread.views || 0} dilihat</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <StarIcon 
                                fontSize="small" 
                                sx={{ 
                                  mr: 0.5, 
                                  color: thread.rating > 0 ? 'gold' : 'text.secondary' 
                                }} 
                              />
                              <Typography sx={{ mr: 1 }}>
                                {thread.rating > 0 ? parseFloat(thread.rating).toFixed(1) : '0.0'}
                              </Typography>
                              {thread.rating > 0 ? (
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Rating 
                                    value={parseFloat(thread.rating)} 
                                    readOnly 
                                    size="small" 
                                    precision={0.5} 
                                  />
                                  {thread.rating_count > 0 && (
                                    <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                                      ({thread.rating_count})
                                    </Typography>
                                  )}
                                </Box>
                              ) : (
                                <Typography variant="caption" color="text.secondary">
                                  (Belum ada rating)
                                </Typography>
                              )}
                            </Box>
                            {sortOption === 'popular' && (
                              <Chip 
                                label={`Skor: ${Math.round(thread.popularityScore)}`} 
                                size="small" 
                                color="primary"
                                sx={{ height: 24 }}
                              />
                            )}
                          </Stack>
                          
                          {thread.tags && thread.tags.length > 0 && (
                            <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
                              {thread.tags.map((tag, idx) => (
                                <Chip key={idx} label={`#${tag}`} size="small" color="primary" sx={{ borderRadius: '8px' }} />
                              ))}
                            </Stack>
                          )}
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                  
                  {/* Pagination for All Threads */}
                  {getTotalPages(filteredThreads.length) > 1 && (
                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                      <Pagination 
                        count={getTotalPages(filteredThreads.length)} 
                        page={allThreadsPage}
                        onChange={handleAllThreadsPageChange}
                        color="primary"
                        showFirstButton
                        showLastButton
                      />
                    </Box>
                  )}
                </>
              )}
            </>
          )}
          
          {/* My Threads Tab */}
          {activeTab === 'myThreads' && (
            <>
              {!isAuthenticated ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Typography variant="h6" gutterBottom>Login Diperlukan</Typography>
                  <Typography variant="body1" sx={{ mb: 3 }}>
                    Silakan login untuk melihat diskusi yang Anda buat.
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/login')}
                  >
                    Login
                  </Button>
                </Box>
              ) : loadingMyData ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                  <CircularProgress />
                </Box>
              ) : filteredMyThreads.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                  {myThreads.length === 0 ? (
                    <>
                      <Typography variant="h6" gutterBottom>Belum Ada Diskusi</Typography>
                      <Typography variant="body1" sx={{ mb: 3 }}>
                        Anda belum membuat diskusi apa pun di forum ini.
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={handleCreateThread}
                      >
                        Buat Diskusi Baru
                      </Button>
                    </>
                  ) : (
                    <>
                      <Typography variant="h6" gutterBottom>Tidak Ada Hasil</Typography>
                      <Typography variant="body1" sx={{ mb: 3 }}>
                        Tidak ada diskusi yang sesuai dengan filter yang Anda pilih.
                      </Typography>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setMyThreadsCategory('');
                          setMyThreadsSortOption('latest');
                          filterMyThreads(myThreads, '', 'latest');
                        }}
                      >
                        Reset Filter
                      </Button>
                    </>
                  )}
                </Paper>
              ) : (
                <>
                  <Grid container spacing={3}>
                    {getPaginatedThreads(filteredMyThreads, myThreadsPage).map(thread => (
                      <Grid item xs={12} key={thread.id}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 3,
                            cursor: 'pointer',
                            borderRadius: '12px',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': { 
                              backgroundColor: 'grey.100',
                              transform: 'translateY(-6px)',
                              boxShadow: '0 8px 16px rgba(0,0,0,0.08)'
                            },
                            border: '1px solid',
                            borderColor: 'grey.200',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                            position: 'relative' // Add position relative for absolute positioning of delete button
                          }}
                          onClick={() => handleDeleteThread(e, thread.id)}
                        >
                          {/* Delete button */}
                          <IconButton 
                            aria-label="delete" 
                            color="error"
                            onClick={(e) => handleDeleteThread(e, thread.id)}
                            sx={{
                              position: 'absolute',
                              top: 8,
                              right: 8,
                              zIndex: 2
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>

                          <Typography variant="h6" color="primary" gutterBottom>
                            {thread.title}
                          </Typography>
                          <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                            <Typography>{thread.replies} komentar</Typography>
                            <Typography>Terakhir: {formatDateTime(thread.lastPost)}</Typography>
                            <Typography sx={{ textTransform: 'capitalize' }}>Kategori: {thread.category}</Typography>
                          </Stack>
                          {thread.tags && thread.tags.length > 0 && (
                            <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
                              {thread.tags.map((tag, idx) => (
                                <Chip key={idx} label={`#${tag}`} size="small" color="primary" sx={{ borderRadius: '8px' }} />
                              ))}
                            </Stack>
                          )}
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                  
                  {/* Pagination for My Threads */}
                  {getTotalPages(filteredMyThreads.length) > 1 && (
                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                      <Pagination 
                        count={getTotalPages(filteredMyThreads.length)} 
                        page={myThreadsPage}
                        onChange={handleMyThreadsPageChange}
                        color="primary"
                        showFirstButton
                        showLastButton
                      />
                    </Box>
                  )}
                </>
              )}
            </>
          )}
          
          {/* My Comments Tab */}
          {activeTab === 'myComments' && (
            <>
              {!isAuthenticated ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Typography variant="h6" gutterBottom>Login Diperlukan</Typography>
                  <Typography variant="body1" sx={{ mb: 3 }}>
                    Silakan login untuk melihat komentar yang Anda buat.
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/login')}
                  >
                    Login
                  </Button>
                </Box>
              ) : loadingMyData ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                  <CircularProgress />
                </Box>
              ) : filteredMyComments.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                  {myComments.length === 0 ? (
                    <>
                      <Typography variant="h6" gutterBottom>Belum Ada Komentar</Typography>
                      <Typography variant="body1" sx={{ mb: 3 }}>
                        Anda belum mengirim komentar apa pun di forum ini.
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={() => handleTabChange('all')}
                      >
                        Jelajahi Diskusi
                      </Button>
                    </>
                  ) : (
                    <>
                      <Typography variant="h6" gutterBottom>Tidak Ada Hasil</Typography>
                      <Typography variant="body1" sx={{ mb: 3 }}>
                        Tidak ada komentar yang sesuai dengan filter yang Anda pilih.
                      </Typography>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setMyCommentsCategory('');
                          setMyCommentsSortOption('latest');
                          filterMyComments(myComments, '', 'latest');
                        }}
                      >
                        Reset Filter
                      </Button>
                    </>
                  )}
                </Paper>
              ) : (
                <>
                  <Grid container spacing={3}>
                    {getPaginatedThreads(filteredMyComments, myCommentsPage).map(comment => (
                      <Grid item xs={12} key={comment.id}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 3,
                            cursor: 'pointer',
                            borderRadius: '12px',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': { 
                              backgroundColor: 'grey.100',
                              transform: 'translateY(-6px)',
                              boxShadow: '0 8px 16px rgba(0,0,0,0.08)'
                            },
                            border: '1px solid',
                            borderColor: 'grey.200',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                          }}
                          onClick={() => handleThreadClick(comment.threadId)}
                        >
                          <Typography variant="subtitle1" color="primary" gutterBottom>
                            Re: {comment.threadTitle}
                          </Typography>
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              mb: 2,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                            }}
                          >
                            {comment.text}
                          </Typography>
                          <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                            <Typography>Diposting: {formatDateTime(comment.postedAt)}</Typography>
                            <Typography sx={{ textTransform: 'capitalize' }}>Kategori: {comment.category}</Typography>
                            {comment.parentCommentId && (
                              <Typography>
                                <em>(Balasan komentar)</em>
                              </Typography>
                            )}
                          </Stack>
                          {comment.tags && comment.tags.length > 0 && (
                            <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
                              {comment.tags.map((tag, idx) => (
                                <Chip key={idx} label={`#${tag}`} size="small" color="primary" sx={{ borderRadius: '8px' }} />
                              ))}
                            </Stack>
                          )}
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                  
                  {/* Pagination for My Comments */}
                  {getTotalPages(filteredMyComments.length) > 1 && (
                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                      <Pagination 
                        count={getTotalPages(filteredMyComments.length)} 
                        page={myCommentsPage}
                        onChange={handleMyCommentsPageChange}
                        color="primary"
                        showFirstButton
                        showLastButton
                      />
                    </Box>
                  )}
                </>
              )}
            </>
          )}
        </ErrorBoundary>

        {/* Enhanced Preview Dialog */}
        <Dialog
          open={previewDialogOpen}
          onClose={handleClosePreviewDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ 
            pb: 1, 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderBottom: '1px solid',
            borderColor: 'divider'
          }}>
            <Typography variant="h6">Detail Konten yang Dilaporkan</Typography>
            <Chip 
              label={
                previewContent && previewContent.status === 'reported'
                  ? 'Menunggu Tindakan'
                  : previewContent && previewContent.status === 'resolved'
                  ? 'Telah Diatasi'
                  : 'Ditolak'
              }
              color={
                previewContent && previewContent.status === 'reported'
                  ? 'warning'
                  : previewContent && previewContent.status === 'resolved'
                  ? 'success'
                  : 'default'
              }
              size="small"
            />
          </DialogTitle>
          <DialogContent>
            {previewContent && (
              <>
                <Box sx={{ mb: 4, mt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Dilaporkan oleh:
                        </Typography>
                        <Typography variant="body1">
                          {previewContent.reportedBy}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDateTime(previewContent.reportedAt)}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Pada thread:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {previewContent.threadTitle}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom color="error" sx={{ display: 'flex', alignItems: 'center' }}>
                    <FlagIcon sx={{ mr: 1, fontSize: 20 }} />
                    Alasan Laporan
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: 'error.lightest', borderColor: 'error.light' }}>
                    <Typography variant="body1">
                      {previewContent.reportReason}
                    </Typography>
                  </Paper>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    {previewContent.reportType === 'comment' ? (
                      <>
                        <CommentIcon sx={{ mr: 1, fontSize: 20 }} />
                        Komentar yang Dilaporkan
                      </>
                    ) : (
                      <>
                        <ForumIcon sx={{ mr: 1, fontSize: 20 }} />
                        Thread yang Dilaporkan
                      </>
                    )}
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 3, mb: 2, bgcolor: 'grey.50' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ mr: 2 }}
                        src={previewContent.authorName ? getAvatarUrl({ avatar: previewContent.authorAvatar }) : null}
                        onError={(e) => {
                          e.target.src = '';
                          e.target.onerror = null;
                        }}
                      >
                        {previewContent.authorName ? previewContent.authorName.charAt(0) : '?'}
                      </Avatar>
                      <Typography variant="subtitle1" fontWeight={500}>
                        {previewContent.authorName || 'Pengguna'}
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                      {previewContent.content}
                    </Typography>
                  </Paper>
                </Box>
                
                {previewContent.status !== 'reported' && previewContent.resolutionNote && (
                  <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Catatan Resolusi:
                    </Typography>
                    <Typography variant="body2">
                      {previewContent.resolutionNote} • {formatDateTime(previewContent.resolvedAt)}
                    </Typography>
                  </Box>
                )}
              </>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>
            <Button onClick={handleClosePreviewDialog}>
              Tutup
            </Button>
            
            {previewContent && previewContent.status === 'reported' && (
              <Box>
                <Button 
                  onClick={() => handleReportAction(previewContent.id, 'approve')}
                  variant="contained"
                  color="success"
                  sx={{ mr: 1 }}
                >
                  Setujui Laporan
                </Button>
                <Button 
                  onClick={() => handleReportAction(previewContent.id, 'delete')}
                  variant="contained"
                  color="error"
                  sx={{ mr: 1 }}
                >
                  Hapus {previewContent.reportType === 'comment' ? 'Komentar' : 'Thread'}
                </Button>
                <Button 
                  onClick={() => handleReportAction(previewContent.id, 'reject')}
                  variant="outlined"
                  color="error"
                >
                  Tolak Laporan
                </Button>
              </Box>
            )}
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

// Fungsi formatDateTime untuk digunakan di page Forum
const formatDateTime = (isoString) => {
  try {
    if (!isoString) return '-';
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      console.warn('Invalid date format:', isoString);
      return '-';
    }
    return date.toLocaleString();
  } catch (error) {
    console.error('Error formatting date:', error, isoString);
    return '-';
  }
};

export default Forum;
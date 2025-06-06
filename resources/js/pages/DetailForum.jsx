import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Button, 
  Avatar, 
  Paper, 
  Divider, 
  CircularProgress, 
  Stack, 
  TextField, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  IconButton,
  Chip,
  Rating,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  MenuItem
} from '@mui/material';
import {
  ArrowBack,
  ThumbUp as ThumbUpIcon,
  Reply as ReplyIcon,
  Close as CloseIcon,
  Send as SendIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ArrowDownward as ArrowDownwardIcon,
  Forum as ForumIcon,
  CalendarToday as CalendarTodayIcon,
  Category as CategoryIcon,
  Visibility as VisibilityIcon,
  Star as StarIcon,
  Flag as FlagIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import Alert from '@mui/material/Alert';

const formatDateTime = (isoString) => {
  try {
    if (!isoString) return '-';
    
    // Normalisasi format string
    let dateStr = isoString;
    if (typeof isoString === 'object') {
      // Jika sudah objek Date
      dateStr = isoString.toISOString();
    }
    
    const date = new Date(dateStr);
    // Cek apakah date valid (tidak NaN)
    if (isNaN(date.getTime())) {
      console.warn('Invalid date format:', isoString);
      return '-';
    }
    
    // Gunakan format yang lebih ramah pengguna
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting date:', error, isoString);
    return '-';
  }
};

// Helper function untuk mendapatkan nama display dari user
const getUserDisplayName = (user) => {
  if (!user) return 'Pengguna';
  
  // Coba ambil nama dari semua kemungkinan field
  return user.nama || user.nama_lengkap || user.name || 'Pengguna';
};

// Helper function untuk mendapatkan avatar URL
const getUserAvatarUrl = (user) => {
  if (!user) return '';
  
  // Try to get avatar from different possible fields
  let avatarUrl = user.foto_profil || user.avatar || '';
  
  // If empty, return empty string
  if (!avatarUrl) return '';
  
  // If the URL is already absolute, return it as is
  if (avatarUrl.startsWith('http') || avatarUrl.startsWith('https')) {
    return avatarUrl;
  }
  
  // If it already starts with /storage/, use it as is
  if (avatarUrl.startsWith('/storage/')) {
    return avatarUrl;
  }
  
  // Add /storage/ prefix if not already there
  if (avatarUrl && !avatarUrl.startsWith('/')) {
    avatarUrl = `/${avatarUrl}`;
  }
  
  // If it's a relative path but doesn't include storage/, add it
  if (!avatarUrl.includes('/storage/')) {
    avatarUrl = `/storage${avatarUrl}`;
  }
  
  return avatarUrl;
};

const categoryNames = {
  '': 'Semua Kategori',
  'general': 'Umum',
  'tips': 'Tips & Trik',
  'recycling': 'Daur ulang'
};

const DetailForum = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [thread, setThread] = useState(null);
  const [loadingThread, setLoadingThread] = useState(true);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyingToUser, setReplyingToUser] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [likes, setLikes] = useState({});
  const [visibleReplies, setVisibleReplies] = useState({});
  const [commentFilter, setCommentFilter] = useState('terbaru');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState('');
  const [expandedComments, setExpandedComments] = useState({});
  const [visibleCommentsCount, setVisibleCommentsCount] = useState(5);
  const [isThreadContentExpanded, setIsThreadContentExpanded] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [viewCountUpdated, setViewCountUpdated] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [reportingCommentId, setReportingCommentId] = useState(null);
  const [reportingComment, setReportingComment] = useState(null);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [reportThreadDialogOpen, setReportThreadDialogOpen] = useState(false);
  const [reportThreadReason, setReportThreadReason] = useState('');
  const [reportThreadDescription, setReportThreadDescription] = useState('');
  const [isSubmittingThreadReport, setIsSubmittingThreadReport] = useState(false);

  // Definisikan loadComments sebagai fungsi di level komponen 
  // agar bisa diakses dari manapun dalam komponen
  const loadComments = async () => {
    try {
      setLoadingComments(true);
      console.log('Loading comments for thread ID:', id);
      console.log('Current user data:', user ? `ID: ${user.id || user.user_id}, Name: ${user.name || user.nama}` : 'Not logged in');
      
      try {
        // Coba mendapatkan komentar dari API
        const response = await api.get(`/forum-threads/${id}/comments`);
        console.log('API response for comments:', response.data);
        
        // Debug data to see user fields
        if (response.data && response.data.data && response.data.data.length > 0) {
          const firstComment = response.data.data[0];
          console.log('First comment user data example:', firstComment.user);
          if (firstComment.replies && firstComment.replies.length > 0) {
            console.log('First reply user data example:', firstComment.replies[0].user);
          }
        }
        
        // Validasi format respons
        if (!response.data || !response.data.data) {
          console.error('Invalid response format:', response.data);
          throw new Error('Invalid response format for comments');
        }
        
        // Ambil data komentar dari respons API
        const commentData = response.data.data;
        console.log('Raw comment data:', commentData);
        
        // Proses ke format yang dibutuhkan frontend
        const allComments = [];
        // Inisialisasi map untuk status likes
        const likesMap = {};
        
        // Extract current user ID for ownership comparison
        const currentUserId = user ? (user.id || user.user_id) : null;
        console.log('Current user ID for comparison:', currentUserId);
        
        // Proses komentar utama dan balasannya
        commentData.forEach(comment => {
          try {
            // Validasi struktur data komentar untuk mencegah error
            const isValidComment = comment && 
                              comment.komentar_id && 
                              comment.user_id;
            
            if (!isValidComment) {
              console.warn('Skipping invalid comment data:', comment);
              return; // Skip komentar yang tidak valid
            }

            // Extract comment user ID for comparison
            const commentUserId = comment.user ? (comment.user.id || comment.user.user_id || comment.user_id) : comment.user_id;
            
            // Determine ownership by direct comparison of IDs
            const isOwned = Boolean(currentUserId && commentUserId && 
                          (String(currentUserId) === String(commentUserId)));
            
            console.log(`Comment ID: ${comment.komentar_id}, Comment User ID: ${commentUserId}, Current User ID: ${currentUserId}, Is Owned: ${isOwned}`);

            // Format komentar utama
            const mainComment = {
              id: comment.komentar_id,
              user: {
                id: commentUserId,
                name: getUserDisplayName(comment.user),
                avatar: getUserAvatarUrl(comment.user)
              },
              postedAt: comment.tanggal_komentar,
              text: comment.konten,
              parentId: null,
              likes: comment.likes_count || 0,
              isOwnComment: isOwned,
              isEdited: comment.updated_at && comment.updated_at !== comment.tanggal_komentar
            };
            
            // Jika komentar disukai oleh user, catat di likesMap
            if (comment.is_liked) {
              likesMap[comment.komentar_id] = true;
            }
            
            // Tambahkan komentar utama ke daftar
            allComments.push(mainComment);
            console.log('Added valid comment:', mainComment.id, mainComment.text.substring(0, 30), `isOwnComment: ${mainComment.isOwnComment}`);
            
            // Proses balasan jika ada
            if (comment.replies && Array.isArray(comment.replies) && comment.replies.length > 0) {
              comment.replies.forEach(reply => {
                try {
                  // Validasi data balasan
                  const isValidReply = reply && 
                                    reply.komentar_id &&
                                    reply.user_id;
                  
                  if (!isValidReply) {
                    console.warn('Skipping invalid reply data:', reply);
                    return; // Skip balasan yang tidak valid
                  }

                  // Extract reply user ID for comparison
                  const replyUserId = reply.user ? (reply.user.id || reply.user.user_id || reply.user_id) : reply.user_id;
                  
                  // Determine reply ownership by direct comparison of IDs
                  const isReplyOwned = Boolean(currentUserId && replyUserId && 
                                    (String(currentUserId) === String(replyUserId)));
                  
                  console.log(`Reply ID: ${reply.komentar_id}, Reply User ID: ${replyUserId}, Current User ID: ${currentUserId}, Is Owned: ${isReplyOwned}`);
                  
                  const replyComment = {
                    id: reply.komentar_id,
                    user: {
                      id: replyUserId,
                      name: getUserDisplayName(reply.user),
                      avatar: getUserAvatarUrl(reply.user)
                    },
                    postedAt: reply.tanggal_komentar,
                    text: reply.konten,
                    parentId: comment.komentar_id,
                    likes: reply.likes_count || 0,
                    isOwnComment: isReplyOwned,
                    isEdited: reply.updated_at && reply.updated_at !== reply.tanggal_komentar
                  };
                  
                  // Jika balasan disukai oleh user, catat di likesMap
                  if (reply.is_liked) {
                    likesMap[reply.komentar_id] = true;
                  }
                  
                  // Tambahkan balasan ke daftar
                  allComments.push(replyComment);
                  console.log('Added valid reply:', replyComment.id, replyComment.text.substring(0, 30), `isOwnComment: ${replyComment.isOwnComment}`);
                } catch (replyError) {
                  console.error('Error processing reply:', replyError, reply);
                }
              });
            }
          } catch (commentError) {
            console.error('Error processing comment:', commentError, comment);
          }
        });
        
        console.log('Processed comments for UI:', allComments);
        console.log('Initial likes state:', likesMap);
        
        // Set comments dan likes state
        setComments(allComments);
        setLikes(likesMap);
      } catch (error) {
        console.error('Error loading comments:', error);
        console.error('Error details:', error.response?.status, error.response?.data);
        
        // Fallback ke API publik jika terjadi error autentikasi
        if (error.response && error.response.status === 401) {
          console.log('Attempting to load public comments');
          const publicResponse = await api.get(`/public/forum-threads/${id}/comments`);
          
          if (publicResponse.data && publicResponse.data.data) {
            // Proses data dari API publik dengan cara yang sama
            const { comments: publicComments, likes: publicLikes } = processPublicComments(publicResponse.data.data);
            setComments(publicComments);
            setLikes(publicLikes);
            return;
          }
        }
        
        // Default ke array kosong jika semua upaya gagal
        setComments([]);
        setLikes({});
      }
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    console.log('DetailForum component mounted with ID:', id);
    
    // Reset state ketika komponen dimount untuk mencegah data ganda
    setThread(null);
    setComments([]);
    setLoadingThread(true);
    setLoadingComments(true);
    setCommentText('');
    setReplyingTo(null);
    setReplyingToUser(null);
    setReplyText('');
    setLikes({});
    setVisibleReplies({});
    setEditingCommentId(null);
    setEditText('');
    
    // Inisialisasi rating
    setUserRating(0);
    
    // Penting: set flag ke false saat komponen dimount
    setViewCountUpdated(false);
    
    loadThread();
    loadComments();
    
    // Cleanup function saat unmount
    return () => {
      console.log('DetailForum component unmounting');
      // Clear timeouts, subscriptions or any other async actions
      setComments([]);
      setThread(null);
    };
  }, [id, isAuthenticated, user]); // Added isAuthenticated and user as dependencies

  // Fungsi untuk memuat thread detail dengan view count yang diperbarui
  const loadThread = async () => {
    try {
      setLoadingThread(true);
      console.log('Fetching forum thread details for ID:', id);
      
      try {
        // Coba mendapatkan thread dari API utama dulu
        const response = await api.get(`/forum-threads/${id}`);
        console.log('Forum thread detail response:', response.data);
        
        // Defensive check untuk memastikan data yang diharapkan ada
        if (!response.data || !response.data.thread) {
          console.error('Thread data missing or in unexpected format:', response.data);
          throw new Error('Invalid response format');
        }
        
        const threadData = response.data.thread;
        
        // Jika view count belum diupdate, panggil API increment view secara asinkron
        // tanpa menunggu hasilnya agar tidak menghambat rendering thread
        if (!viewCountUpdated) {
          try {
            console.log('Attempting to increment view count for thread:', id);
            // Panggil API untuk increment view count tanpa await
            api.post(`/forum-threads/${id}/view`)
              .then(viewResponse => {
                console.log('View count incremented for thread:', id, viewResponse.data);
                
                // Set flag bahwa view sudah diupdate
                setViewCountUpdated(true);
              })
              .catch(viewError => {
                console.error('Error incrementing view count, trying public API:', viewError);
                
                // Coba API publik sebagai fallback
                api.post(`/public/forum-threads/${id}/view`)
                  .then(publicViewResponse => {
                    console.log('View count incremented via public API:', id, publicViewResponse.data);
                    
                    // Set flag bahwa view sudah diupdate
                    setViewCountUpdated(true);
                  })
                  .catch(publicViewError => {
                    console.error('Error incrementing view count via public API:', publicViewError);
                    // Gagal menambah view count, tapi tetap tampilkan thread
                    setViewCountUpdated(true); // Tandai sudah mencoba untuk mencegah percobaan berulang
                  });
              });
          } catch (error) {
            console.error('Unexpected error when trying to increment view count:', error);
            // Gagal menambah view count, tapi tetap tampilkan thread
            setViewCountUpdated(true);
          }
        }
        
        // Get user's rating from API if user is authenticated
        if (isAuthenticated && user) {
          try {
            console.log('Fetching user rating for thread ID:', id);
            const ratingResponse = await api.get(`/forum-threads/${id}/rating`);
            console.log('Rating response:', ratingResponse.data);
            
            if (ratingResponse.data && ratingResponse.data.data) {
              // Pastikan nilai rating dikonversi ke tipe number
              const userRatingValue = Number(ratingResponse.data.data.user_rating || 0);
              console.log('Setting user rating to:', userRatingValue);
              setUserRating(userRatingValue);
            } else {
              console.log('No user rating data found, setting to 0');
              setUserRating(0);
            }
          } catch (ratingError) {
            console.error('Error getting user rating:', ratingError);
            // Fallback to 0 if API fails
            setUserRating(0);
          }
        }
        
        // Proses data thread untuk tampilan
        processThreadData(threadData);
      } catch (error) {
        console.error('Error loading thread:', error);
        console.error('Error details:', error.response?.status, error.response?.data);
        
        // Coba API public sebagai fallback
        console.log('Trying public API as fallback');
        try {
          const publicResponse = await api.get(`/public/forum-threads/${id}`);
          console.log('Public API response:', publicResponse.data);
          
          if (publicResponse.data && publicResponse.data.thread) {
            const threadData = publicResponse.data.thread;
            
            // Jika view count belum diupdate, coba increment melalui API publik secara asinkron
            if (!viewCountUpdated) {
              api.post(`/public/forum-threads/${id}/view`)
                .then(publicViewResponse => {
                  console.log('View count incremented via public API fallback:', id, publicViewResponse.data);
                  
                  // Set flag bahwa view sudah diupdate
                  setViewCountUpdated(true);
                })
                .catch(publicViewError => {
                  console.error('Error incrementing view count via public API fallback:', publicViewError);
                  // Gagal menambah view count, tapi tetap tampilkan thread
                  setViewCountUpdated(true);
                });
            }
            
            processThreadData(threadData);
            return;
          } else {
            throw new Error('Invalid format from public API');
          }
        } catch (publicError) {
          console.error('Public API fallback also failed:', publicError);
          throw error;
        }
      }
    } catch (error) {
      console.error('Error loading thread:', error);
      console.error('Error details:', error.response?.status, error.response?.data);
      
      // Set thread ke null agar UI menampilkan pesan error
      setThread(null);
      
      // Informasi error yang lebih spesifik
      let errorMessage = 'Gagal memuat data thread forum';
      
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = 'Thread forum tidak ditemukan';
        } else if (error.response.status === 403) {
          errorMessage = 'Anda tidak memiliki akses ke thread ini';
        } else if (error.response.status === 500) {
          // Error dari server, tampilkan detail jika tersedia
          if (error.response.data && error.response.data.message) {
            errorMessage = `Error Server: ${error.response.data.message}`;
            
            // Jika error berkaitan dengan kolom database
            if (error.response.data.message.includes('Column not found')) {
              errorMessage = 'Terjadi kesalahan pada struktur database. Harap hubungi administrator.';
            }
          } else {
            errorMessage = 'Terjadi kesalahan pada server. Silakan coba lagi nanti.';
          }
        }
      }
      
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        confirmButtonText: 'Kembali ke Forum',
        showCancelButton: true,
        cancelButtonText: 'Coba Lagi'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/forum');
        } else {
          window.location.reload();
        }
      });
    } finally {
      setLoadingThread(false);
    }
  };

  // Fungsi untuk memproses data thread dan memastikan nilai rating dikonversi dengan benar
  const processThreadData = (threadData) => {
    console.log('Processing thread data for rating display:', threadData);
    console.log('Average rating from API:', threadData.average_rating, 'type:', typeof threadData.average_rating);
    
    // Konversi nilai numerik ke tipe number dengan fallback yang aman
    const viewCount = threadData.view_count ? Number(threadData.view_count) : 0;
    const rating = threadData.average_rating !== undefined && threadData.average_rating !== null
      ? Number(threadData.average_rating) 
      : 0;
    const ratingCount = threadData.rating_count ? Number(threadData.rating_count) : 0;
    
    console.log('Processed rating value:', rating);
    
    // Sanitasi data untuk mencegah error
    setThread({
      id: threadData.id || id,
      title: threadData.judul || 'Tanpa Judul',
      author: getUserDisplayName(threadData.user),
      authorId: threadData.user ? threadData.user.id || threadData.user.user_id : null,
      authorAvatar: getUserAvatarUrl(threadData.user),
      authorRole: threadData.user ? threadData.user.role : null,
      authorJoinDate: threadData.user ? (threadData.user.tanggal_registrasi || threadData.user.created_at) : null,
      replies: threadData.comments_count || 0,
      lastPost: threadData.tanggal_posting || new Date().toISOString(),
      category: threadData.tags ? getCategoryFromTags(threadData.tags) : 'Umum',
      tags: threadData.tags ? threadData.tags.split(',').filter(tag => tag.trim()) : [],
      content: threadData.konten || '',
      viewCount: viewCount,
      rating: rating, // Pastikan sudah dikonversi ke number
      rating_count: ratingCount
    });
    
    console.log('Processed thread state:', {
      rating: rating,
      rating_count: ratingCount
    });
  };

  // Helper function untuk memproses komentar dari API publik
  const processPublicComments = (commentsData) => {
    if (!Array.isArray(commentsData)) return { comments: [], likes: {} };
    
    const processedComments = [];
    const likesMap = {};
    
    // Extract current user ID for ownership comparison
    const currentUserId = user ? (user.id || user.user_id) : null;
    console.log('Current user ID for public comments comparison:', currentUserId);
    
    commentsData.forEach(comment => {
      // Extract comment user ID for comparison
      const commentUserId = comment.user ? (comment.user.id || comment.user.user_id || comment.user_id) : comment.user_id;
      
      // Determine ownership by direct comparison of IDs
      const isOwned = Boolean(currentUserId && commentUserId && 
                    (String(currentUserId) === String(commentUserId)));
                        
      console.log(`Public comment ID: ${comment.id || comment.komentar_id}, User ID: ${commentUserId}, Current User ID: ${currentUserId}, Is Owned: ${isOwned}`);
      
      const commentId = comment.id || comment.komentar_id;
      
      processedComments.push({
        id: commentId,
        user: {
          id: commentUserId,
          name: getUserDisplayName(comment.user),
          avatar: getUserAvatarUrl(comment.user)
        },
        postedAt: comment.tanggal_komentar,
        text: comment.konten,
        parentId: comment.parent_komentar_id,
        likes: comment.likes_count || 0,
        isOwnComment: isOwned,
        isEdited: comment.updated_at && comment.updated_at !== comment.tanggal_komentar
      });
      
      // Catat like jika ada
      if (comment.is_liked) {
        likesMap[commentId] = true;
      }
      
      // Proses balasan jika ada dalam format API publik
      if (comment.replies && Array.isArray(comment.replies)) {
        comment.replies.forEach(reply => {
          // Extract reply user ID for comparison
          const replyUserId = reply.user ? (reply.user.id || reply.user.user_id || reply.user_id) : reply.user_id;
          
          // Determine reply ownership by direct comparison of IDs
          const isReplyOwned = Boolean(currentUserId && replyUserId && 
                            (String(currentUserId) === String(replyUserId)));
                              
          console.log(`Public reply ID: ${reply.id || reply.komentar_id}, User ID: ${replyUserId}, Current User ID: ${currentUserId}, Is Owned: ${isReplyOwned}`);
          
          const replyId = reply.id || reply.komentar_id;
          
          processedComments.push({
            id: replyId,
            user: {
              id: replyUserId,
              name: getUserDisplayName(reply.user),
              avatar: getUserAvatarUrl(reply.user)
            },
            postedAt: reply.tanggal_komentar,
            text: reply.konten,
            parentId: commentId,
            likes: reply.likes_count || 0,
            isOwnComment: isReplyOwned,
            isEdited: reply.updated_at && reply.updated_at !== reply.tanggal_komentar
          });
          
          // Catat like jika ada
          if (reply.is_liked) {
            likesMap[replyId] = true;
          }
        });
      }
    });
    
    console.log('Processed public comments:', processedComments);
    console.log('Processed public likes:', likesMap);
    
    return { comments: processedComments, likes: likesMap };
  };

  // Helper function untuk mendapatkan kategori dari tags
  const getCategoryFromTags = (tags) => {
    if (!tags) return 'Umum';
    
    try {
      // Pastikan tags adalah string, bukan array atau null
      let tagString = '';
      
      if (Array.isArray(tags)) {
        tagString = tags.join(',');
      } else if (typeof tags === 'string') {
        tagString = tags;
      } else {
        return 'Umum';
      }
      
      if (!tagString) return 'Umum';
      
      const tagList = tagString.toLowerCase().split(',').map(tag => tag.trim()).filter(Boolean);
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

  // Cleanup Sweet Alert ketika komponen unmount
  useEffect(() => {
    return () => {
      Swal.close();
    };
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      console.log('Mengirim komentar baru ke thread ID:', id);
      console.log('Konten komentar:', commentText);
      console.log('User data:', user);
      
      Swal.fire({
        title: 'Mengirim Komentar',
        text: 'Mohon tunggu...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const response = await api.post(
        `/forum-threads/${id}/comments`, 
        { konten: commentText }
      );
      
      console.log('Respon API komentar baru:', response.data);
      
      // Pastikan data komentar valid
      if (!response.data || !response.data.comment) {
        console.error('Format respon komentar tidak valid:', response.data);
        Swal.fire('Error', 'Format data tidak valid', 'error');
        return;
      }
      
      // Atur status berhasil
      Swal.fire({
        title: 'Berhasil!',
        text: 'Komentar telah ditambahkan',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
      
      setCommentText(''); // Reset form komentar
      
      // Langsung muat ulang komentar dari server setelah berhasil menambahkan komentar baru
      // ini untuk memastikan komentar yang baru ditambahkan benar-benar tersimpan dan dapat ditampilkan
      await loadComments();
      
      // Update thread replies count
      if (thread) {
        setThread(prevThread => ({
          ...prevThread,
          replies: (prevThread.replies || 0) + 1
        }));
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      console.error('Error response status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      console.error('Error request config:', error.config);
      
      let errorMessage = 'Gagal mengirim komentar';
      
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Sesi login telah berakhir. Silakan login kembali.';
        } else if (error.response.status === 422) {
          errorMessage = `Format komentar tidak valid: ${error.response.data.message || 'Periksa panjang komentar Anda'}`;
        } else if (error.response.status === 500) {
          errorMessage = `Terjadi kesalahan pada server: ${error.response.data.message || 'Silakan coba lagi nanti'}`;
        }
      }
      
      Swal.fire('Error', errorMessage, 'error');
    }
  };

  const handleReplySubmit = async (e, parentId) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    
    if (!isAuthenticated) {
      navigate('/login');
      
      // Reset form dan state
      setReplyText('');
      setReplyingTo(null);
      setReplyingToUser(null);
      return;
    }
    
    // Format teks dengan menambahkan tag @ jika diperlukan
    let finalText = replyText;
    if (replyingToUser) {
      finalText = `@${replyingToUser} ${replyText}`;
    }
    
    try {
      console.log(`Mengirim balasan ke komentar ID: ${parentId} di thread ID: ${id}`);
      console.log('Konten balasan:', finalText);
      
      // Tampilkan loading indicator
      Swal.fire({
        title: 'Mengirim Balasan',
        text: 'Mohon tunggu...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      
      // Validasi input
      if (!parentId || !id) {
        console.error('ID thread atau ID parent komentar tidak valid', { threadId: id, parentId });
        Swal.fire('Error', 'Data tidak valid untuk mengirim balasan', 'error');
        return;
      }
      
      const response = await api.post(
        `/forum-threads/${id}/comments`, 
        { 
          konten: finalText,
          parent_komentar_id: parentId 
        }
      );
      
      console.log('Respon API balasan komentar:', response.data);
      
      if (!response.data || !response.data.comment) {
        console.error('Format respon tidak valid:', response.data);
        Swal.fire('Error', 'Format data tidak valid', 'error');
        return;
      }
      
      // Reset form dan state
      setReplyText('');
      setReplyingTo(null);
      setReplyingToUser(null);
      
      // Tampilkan notifikasi sukses
      Swal.fire({
        title: 'Berhasil!',
        text: 'Balasan telah ditambahkan',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
      
      // Selalu muat ulang komentar setelah menambah balasan
      await loadComments();
      
      // Update thread replies count
      if (thread) {
        setThread(prevThread => ({
          ...prevThread,
          replies: (prevThread.replies || 0) + 1
        }));
      }
      
      // Pastikan balasan yang baru ditambahkan terlihat
      setVisibleReplies((prev) => ({
        ...prev,
        [parentId]: true
      }));
      
    } catch (error) {
      console.error('Error posting reply:', error);
      let errorMessage = 'Gagal mengirim balasan';
      
      if (error.response) {
        console.error('Error status:', error.response.status);
        console.error('Error data:', error.response.data);
        
        if (error.response.status === 401) {
          errorMessage = 'Sesi login telah berakhir. Silakan login kembali.';
        } else if (error.response.status === 403) {
          errorMessage = 'Anda tidak memiliki izin untuk membalas komentar ini.';
        } else if (error.response.status === 404) {
          errorMessage = 'Komentar tidak ditemukan atau telah dihapus.';
        } else if (error.response.status === 422) {
          errorMessage = 'Data yang dikirim tidak valid. Periksa panjang komentar Anda.';
        }
      }
      
      Swal.fire('Error', errorMessage, 'error');
    }
  };

  // Fungsi toggleLike yang diperbaiki - mengandalkan sepenuhnya data dari server
  const toggleLike = async (commentId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      // Cari komentar yang akan dilike/unlike untuk validasi
      const commentToUpdate = comments.find(c => c.id === commentId);
      
      if (!commentToUpdate) {
        console.error('Comment not found:', commentId);
        return;
      }
      
      // Tampilkan loading jika diperlukan (opsional)
      // Ini bisa menggunakan state loading per comment jika UI perlu responsif
      
      // Panggil API
      const response = await api.post(
        `/forum-threads/${id}/comments/${commentId}/like`
      );
      
      console.log('Like response:', response.data);
      
      // Hanya update UI setelah menerima response dari server
      if (response.data) {
        // Update status like berdasarkan data dari server
        const isLiked = response.data.is_liked;
        const likesCount = response.data.likes_count;
        
        // Update state likes berdasarkan response server
        setLikes(prev => {
          const newLikes = { ...prev };
          if (isLiked) {
            newLikes[commentId] = true;
          } else {
            delete newLikes[commentId];
          }
          return newLikes;
        });
        
        // Update likes count berdasarkan data dari server
        if (likesCount !== undefined) {
          setComments(prev => 
            prev.map(comment => {
              if (comment.id === commentId) {
                return {
                  ...comment,
                  likes: likesCount
                };
              }
              return comment;
            })
          );
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      console.error('Error details:', error.response?.status, error.response?.data);
      Swal.fire('Error', 'Gagal menyukai komentar', 'error');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Find the comment to check ownership
    const commentToDelete = comments.find(c => c.id === commentId);
    if (!commentToDelete) {
      console.error('Comment not found:', commentId);
      Swal.fire('Error', 'Komentar tidak ditemukan', 'error');
      return;
    }
    
    // Verify ownership - extra safety check
    if (!commentToDelete.isOwnComment) {
      console.error('Cannot delete comment - not the owner:', commentId);
      Swal.fire('Error', 'Anda hanya dapat menghapus komentar milik Anda sendiri', 'error');
      return;
    }

    // Confirm deletion
    const result = await Swal.fire({
      title: 'Hapus Komentar',
      text: 'Apakah Anda yakin ingin menghapus komentar ini? Tindakan ini tidak dapat dibatalkan.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        console.log(`Menghapus komentar dengan ID: ${commentId} pada thread ID: ${id}`);
        
        // Validasi input
        if (!id || !commentId) {
          console.error('ID thread atau ID komentar tidak valid', { threadId: id, commentId });
          Swal.fire('Error!', 'Data tidak valid untuk penghapusan komentar', 'error');
          return;
        }
        
        // Pastikan ID adalah angka
        if (isNaN(parseInt(commentId))) {
          console.error('ID komentar bukan angka valid:', commentId);
          Swal.fire('Error!', 'Format ID komentar tidak valid', 'error');
          return;
        }
        
        // Hitung jumlah item yang akan dihapus (komentar + balasannya)
        const isParentComment = !commentToDelete.parentId;
        let totalToDelete = 1; // Komentar itu sendiri
        
        // Jika komentar utama, tambahkan jumlah balasan yang akan dihapus
        if (isParentComment) {
          const replies = comments.filter(c => c.parentId === commentId);
          totalToDelete += replies.length;
        }
        
        // Tampilkan loading state
        Swal.fire({
          title: 'Menghapus Komentar',
          text: 'Mohon tunggu...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        
        // Lakukan API call untuk menghapus komentar dengan timeout yang lebih panjang
        const response = await api.delete(`/forum-threads/${id}/comments/${commentId}`);
        console.log('Respon penghapusan komentar:', response.data);
        
        // Daripada memanipulasi state, lebih baik memuat ulang semua komentar
        // untuk memastikan konsistensi data
        await loadComments();
        
        // Update thread replies count
        if (thread) {
          setThread(prevThread => ({
            ...prevThread,
            replies: Math.max(0, (prevThread.replies || 0) - totalToDelete)
          }));
        }
        
        Swal.fire(
          'Terhapus!',
          'Komentar berhasil dihapus.',
          'success'
        );
      } catch (error) {
        console.error('Error deleting comment:', error);
        let errorMessage = 'Gagal menghapus komentar.';
        
        // Pesan error yang lebih informatif
        if (error.response) {
          console.error('Error status:', error.response.status);
          console.error('Error data:', error.response.data);
          
          if (error.response.status === 403) {
            errorMessage = 'Anda tidak dapat menghapus komentar milik pengguna lain.';
          } else if (error.response.status === 404) {
            errorMessage = 'Komentar tidak ditemukan. Mungkin sudah dihapus sebelumnya.';
          } else if (error.response.status === 500) {
            errorMessage = 'Terjadi kesalahan pada server. Silakan coba lagi nanti.';
          } else if (error.response.status === 408 || error.code === 'ECONNABORTED') {
            errorMessage = 'Waktu permintaan habis. Server mungkin sedang sibuk, silakan coba lagi.';
          } else if (error.response.status === 0) {
            errorMessage = 'Gangguan koneksi. Pastikan internet Anda aktif dan coba lagi.';
          }
        } else if (error.code === 'ECONNABORTED') {
          errorMessage = 'Waktu permintaan habis. Server mungkin sedang sibuk, silakan coba lagi.';
        } else if (error.message && error.message.includes('Network Error')) {
          errorMessage = 'Gangguan koneksi. Pastikan internet Anda aktif dan coba lagi.';
        }
        
        Swal.fire(
          'Error!',
          errorMessage,
          'error'
        );
        
        // Muat ulang komentar untuk jaga-jaga jika server berhasil menghapus
        // tapi respons tidak dapat diterima klien
        try {
          await loadComments();
        } catch (refreshError) {
          console.error('Error refreshing comments after failed delete:', refreshError);
        }
      }
    }
  };

  const rootComments = comments.filter((c) => c.parentId === null);

  // Apply sorting based on commentFilter
  const sortedRootComments = [...rootComments].sort((a, b) => {
    if (commentFilter === 'terbaru') {
      return new Date(b.postedAt) - new Date(a.postedAt);
    } else if (commentFilter === 'teratas') {
      // Gunakan nilai likes dari server tanpa optimistic update
      return b.likes - a.likes;
    }
    return 0;
  });

  // Terapkan filter untuk pagination
  const visibleRootComments = sortedRootComments.slice(0, visibleCommentsCount);
  const hasMoreComments = sortedRootComments.length > visibleCommentsCount;

  const getReplies = (commentId) => comments.filter((c) => c.parentId === commentId);
  
  // Calculate total comments (root comments + replies)
  const totalComments = comments.length;

  // Update thread replies count when comments change
  useEffect(() => {
    if (thread && totalComments !== thread.replies) {
      setThread(prevThread => ({
        ...prevThread,
        replies: totalComments
      }));
    }
  }, [totalComments]);

  // Fungsi untuk memulai balasan dengan menyimpan username
  const handleStartReply = (commentId, username) => {
    setReplyingTo(commentId === replyingTo ? null : commentId);
    setReplyingToUser(commentId === replyingTo ? null : username);
    if (commentId === replyingTo) {
      setReplyText('');
    }
  };

  const handleEditComment = async (commentId, commentText) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Find the comment to check ownership
    const commentToEdit = comments.find(c => c.id === commentId);
    if (!commentToEdit) {
      console.error('Comment not found:', commentId);
      Swal.fire('Error', 'Komentar tidak ditemukan', 'error');
      return;
    }
    
    // Verify ownership - extra safety check
    if (!commentToEdit.isOwnComment) {
      console.error('Cannot edit comment - not the owner:', commentId);
      Swal.fire('Error', 'Anda hanya dapat mengedit komentar milik Anda sendiri', 'error');
      return;
    }
    
    setEditingCommentId(commentId);
    setEditText(commentText);
  };
  
  const handleSaveEdit = async (commentId) => {
    if (!editText.trim()) return;
    
    // Find the comment to check ownership
    const commentToSave = comments.find(c => c.id === commentId);
    if (!commentToSave) {
      console.error('Comment not found:', commentId);
      Swal.fire('Error', 'Komentar tidak ditemukan', 'error');
      setEditingCommentId(null);
      setEditText('');
      return;
    }
    
    // Verify ownership - extra safety check
    if (!commentToSave.isOwnComment) {
      console.error('Cannot save edit - not the owner:', commentId);
      Swal.fire('Error', 'Anda hanya dapat mengedit komentar milik Anda sendiri', 'error');
      setEditingCommentId(null);
      setEditText('');
      return;
    }
    
    try {
      await api.put(
        `/forum-threads/${id}/comments/${commentId}`,
        { konten: editText }
      );
      
      setComments((prev) => 
        prev.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              text: editText,
              isEdited: true
            };
          }
          return comment;
        })
      );
      
      setEditingCommentId(null);
      setEditText('');
      
      // Tampilkan notifikasi bahwa komentar telah diperbarui
      Swal.fire({
        title: 'Berhasil!',
        text: 'Komentar berhasil diperbarui.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error updating comment:', error);
      console.error('Error details:', error.response?.status, error.response?.data);
      Swal.fire('Error', 'Gagal memperbarui komentar', 'error');
    }
  };
  
  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditText('');
  };

  // Fungsi untuk memotong teks ke jumlah kata tertentu
  const truncateText = (text, maxWords = 30) => {
    try {
      if (!text || typeof text !== 'string') {
        return { isTruncated: false, text: text || '' };
      }
      
      // Strip HTML tags untuk keamanan dan konsistensi
      const cleanText = text.replace(/<[^>]*>?/gm, ' ')
                             .replace(/\s+/g, ' ')  // Normalize whitespace
                             .trim(); 
      
      const words = cleanText.split(' ');
      
      if (words.length <= maxWords) {
        return { isTruncated: false, text: cleanText };
      }
      
      const truncated = words.slice(0, maxWords).join(' ');
      return { isTruncated: true, text: truncated };
    } catch (error) {
      console.error('Error truncating text:', error);
      return { isTruncated: false, text: text || '' };
    }
  };

  // Fungsi untuk mengelola ekspansi komentar
  const toggleCommentExpansion = (commentId) => {
    setExpandedComments(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  const loadMoreComments = () => {
    setVisibleCommentsCount(prev => prev + 5);
  };

  // Menggunakan API untuk fitur rating
  const handleRatingChange = async (event, newValue) => {
    if (!isAuthenticated) {
      Swal.fire({
        title: 'Login Diperlukan',
        text: 'Anda harus login terlebih dahulu untuk memberikan rating.',
        icon: 'info',
        confirmButtonText: 'Login',
        showCancelButton: true,
        cancelButtonText: 'Batal',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login', { state: { from: `/detail-forum/${id}` } });
        }
      });
      return;
    }
    
    try {
      // Simpan rating saat ini untuk fallback jika gagal
      const prevRating = userRating;
      
      // Pastikan newValue adalah number
      const ratingValue = Number(newValue);
      
      // Update UI secara optimistic
      setUserRating(ratingValue);
      
      // Tampilkan loading
      Swal.fire({
        title: 'Menyimpan Rating',
        text: 'Mohon tunggu...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      
      // Panggil API untuk menyimpan rating
      console.log('Sending rating to API:', ratingValue);
      const response = await api.post(`/forum-threads/${id}/rating`, {
        rating: ratingValue
      });
      
      console.log('Rating saved to API:', response.data);
      
      // Update thread rating dari response API
      if (response.data && response.data.data) {
        const avgRating = response.data.data.average_rating ? 
          Number(response.data.data.average_rating) : 
          0;
        
        const ratingCount = response.data.data.rating_count ? 
          Number(response.data.data.rating_count) : 
          0;
        
        // Update thread state dengan nilai rating baru
        setThread(prevThread => {
          if (!prevThread) return null;
          
          return {
            ...prevThread,
            rating: avgRating,
            rating_count: ratingCount
          };
        });
        
        // Update nilai userRating dengan nilai yang dikonfirmasi dari server
        setUserRating(Number(response.data.data.rating));
      }
      
      // Tampilkan pesan sukses
      Swal.fire({
        title: 'Berhasil!',
        text: 'Rating berhasil disimpan.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error saving rating:', error);
      
      // Tampilkan pesan error
      Swal.fire({
        title: 'Error',
        text: 'Gagal menyimpan rating. Silakan coba lagi.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      
      // Reset ke nilai awal jika gagal
      setUserRating(prevRating);
    }
  };

  // Function to handle opening the report dialog
  const handleOpenReportDialog = (comment) => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      Swal.fire({
        title: 'Login Diperlukan',
        text: 'Anda harus login terlebih dahulu untuk melaporkan komentar.',
        icon: 'info',
        confirmButtonText: 'Login',
        showCancelButton: true,
        cancelButtonText: 'Batal'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login', { state: { from: `/detail-forum/${id}` } });
        }
      });
      return;
    }
    
    // Set the comment to report
    setReportingCommentId(comment.id);
    setReportingComment(comment);
    setReportReason('');
    setReportDescription('');
    setReportDialogOpen(true);
  };

  // Function to handle closing the report dialog
  const handleCloseReportDialog = () => {
    setReportDialogOpen(false);
    setReportingCommentId(null);
    setReportingComment(null);
    setReportReason('');
    setReportDescription('');
  };

  // Function to handle submitting a report
  const handleSubmitReport = async () => {
    if (!reportReason) {
      Swal.fire({
        title: 'Alasan Diperlukan',
        text: 'Silakan pilih alasan untuk melaporkan komentar ini.',
        icon: 'warning'
      });
      return;
    }

    setIsSubmittingReport(true);

    try {
      console.log('Mengirim laporan untuk komentar ID:', reportingCommentId);
      console.log('Alasan:', reportReason);
      console.log('Deskripsi:', reportDescription);
      
      // Call API to submit comment report
      const response = await api.post(`/forum-threads/${id}/comments/${reportingCommentId}/report`, {
        reason: reportReason,
        description: reportDescription
      });
      
      console.log('Report response:', response.data);
      
      // Close the dialog
      handleCloseReportDialog();
      
      // Show success message
      Swal.fire({
        title: 'Laporan Terkirim',
        text: 'Terima kasih telah melaporkan konten yang tidak pantas. Tim moderator kami akan segera meninjau laporan Anda.',
        icon: 'success'
      });
      
    } catch (error) {
      console.error('Error submitting report:', error);
      
      let errorMessage = 'Gagal mengirim laporan. Silakan coba lagi nanti.';
      
      if (error.response) {
        console.error('Error response:', error.response);
        
        if (error.response.status === 500) {
          errorMessage = 'Terjadi kesalahan pada server saat mengirim laporan. Sistem pelaporan mungkin belum diaktifkan sepenuhnya atau memerlukan konfigurasi lebih lanjut.';
        } else if (error.response.status === 422) {
          errorMessage = 'Format laporan tidak valid. Pastikan alasan laporan dipilih dengan benar.';
        } else if (error.response.status === 404) {
          errorMessage = 'Komentar yang dilaporkan tidak ditemukan atau mungkin telah dihapus.';
        } else if (error.response.status === 401) {
          errorMessage = 'Sesi login Anda telah berakhir. Silakan login kembali untuk melaporkan komentar.';
          
          // Optionally redirect to login page after confirmation
          Swal.fire({
            title: 'Error',
            text: errorMessage,
            icon: 'error',
            confirmButtonText: 'Login',
            showCancelButton: true,
            cancelButtonText: 'Batal'
          }).then((result) => {
            if (result.isConfirmed) {
              navigate('/login', { state: { from: `/detail-forum/${id}` } });
            }
            handleCloseReportDialog();
          });
          return; // Return early to prevent showing another Swal dialog
        }
        
        // Check if error response has a specific error message
        if (error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error;
        }
      }
      
      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error'
      });
    } finally {
      setIsSubmittingReport(false);
    }
  };

  // Function untuk melaporkan thread
  const handleOpenReportThreadDialog = () => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      Swal.fire({
        title: 'Login Diperlukan',
        text: 'Anda harus login terlebih dahulu untuk melaporkan thread.',
        icon: 'info',
        confirmButtonText: 'Login',
        showCancelButton: true,
        cancelButtonText: 'Batal'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login', { state: { from: `/detail-forum/${id}` } });
        }
      });
      return;
    }
    
    setReportThreadReason('');
    setReportThreadDescription('');
    setReportThreadDialogOpen(true);
  };

  // Function untuk menutup dialog laporan thread
  const handleCloseReportThreadDialog = () => {
    setReportThreadDialogOpen(false);
    setReportThreadReason('');
    setReportThreadDescription('');
  };

  // Function untuk submit laporan thread
  const handleSubmitThreadReport = async () => {
    if (!reportThreadReason) {
      Swal.fire({
        title: 'Alasan Diperlukan',
        text: 'Silakan pilih alasan untuk melaporkan thread ini.',
        icon: 'warning'
      });
      return;
    }

    setIsSubmittingThreadReport(true);

    try {
      console.log('Mengirim laporan untuk thread ID:', id);
      console.log('Alasan:', reportThreadReason);
      console.log('Deskripsi:', reportThreadDescription);
      
      // Call API to submit thread report
      const response = await api.post(`/forum-threads/${id}/report`, {
        reason: reportThreadReason,
        description: reportThreadDescription
      });
      
      console.log('Report response:', response.data);
      
      // Close the dialog
      handleCloseReportThreadDialog();
      
      // Show success message
      Swal.fire({
        title: 'Laporan Terkirim',
        text: 'Terima kasih telah melaporkan thread ini. Tim moderator kami akan segera meninjau laporan Anda.',
        icon: 'success'
      });
      
    } catch (error) {
      console.error('Error submitting thread report:', error);
      
      let errorMessage = 'Gagal mengirim laporan. Silakan coba lagi nanti.';
      
      if (error.response) {
        console.error('Error response:', error.response);
        
        if (error.response.status === 500) {
          errorMessage = 'Terjadi kesalahan pada server saat mengirim laporan. Sistem pelaporan mungkin belum diaktifkan sepenuhnya atau memerlukan konfigurasi lebih lanjut.';
        } else if (error.response.status === 422) {
          errorMessage = 'Format laporan tidak valid. Pastikan alasan laporan dipilih dengan benar.';
        } else if (error.response.status === 404) {
          errorMessage = 'Thread yang dilaporkan tidak ditemukan atau mungkin telah dihapus.';
        } else if (error.response.status === 401) {
          errorMessage = 'Sesi login Anda telah berakhir. Silakan login kembali untuk melaporkan thread.';
          
          // Optionally redirect to login page after confirmation
          Swal.fire({
            title: 'Error',
            text: errorMessage,
            icon: 'error',
            confirmButtonText: 'Login',
            showCancelButton: true,
            cancelButtonText: 'Batal'
          }).then((result) => {
            if (result.isConfirmed) {
              navigate('/login', { state: { from: `/detail-forum/${id}` } });
            }
            handleCloseReportThreadDialog();
          });
          return; // Return early to prevent showing another Swal dialog
        }
        
        // Check if error response has a specific error message
        if (error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error;
        }
      }
      
      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error'
      });
    } finally {
      setIsSubmittingThreadReport(false);
    }
  };

  return (
    <Box sx={{ backgroundColor: '#f9f9f9', py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg" sx={{ py: 0 }}>
        <Button 
          startIcon={<ArrowBack />}
          onClick={handleBack}
          sx={{ mb: 3 }}
        >
          Kembali ke Forum
        </Button>

        {loadingThread ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            <CircularProgress />
          </Box>
        ) : thread ? (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" fontWeight={800} gutterBottom>
              {thread.title}
            </Typography>
            <Box sx={{ mb: 3 }}>
              {isThreadContentExpanded ? (
                <Box 
                  dangerouslySetInnerHTML={{ 
                    __html: thread.content 
                      ? thread.content 
                      : '<p>Tidak ada konten.</p>' 
                  }} 
                  sx={{ 
                    '& h2': { fontSize: '1.5rem', fontWeight: 700, mb: 2, mt: 3 },
                    '& h3': { fontSize: '1.25rem', fontWeight: 600, mb: 1.5, mt: 2.5 },
                    '& p': { mb: 2 },
                    '& ul, & ol': { ml: 2, mb: 2 },
                    '& li': { mb: 0.5 },
                    '& blockquote': { 
                      borderLeft: '4px solid', 
                      borderColor: 'primary.main', 
                      pl: 2, 
                      py: 0.5,
                      my: 2,
                      fontStyle: 'italic',
                      bgcolor: 'rgba(0, 0, 0, 0.03)' 
                    }
                  }} 
                />
              ) : (
                <Box 
                  sx={{ 
                    '& *': { 
                      display: 'inline',
                      lineHeight: '1.5',
                      fontSize: '1rem',
                      fontWeight: 'normal',
                      fontFamily: 'inherit',
                      color: 'text.secondary'
                    },
                    '& h1, & h2, & h3, & h4, & h5, & h6, & ul, & ol, & blockquote': {
                      margin: 0,
                      padding: 0
                    }
                  }}
                >
                  {/* Remove HTML tags for truncated view */}
                  <Box 
                    dangerouslySetInnerHTML={{ 
                      __html: truncateText(
                        thread.content 
                          ? thread.content.replace(/<[^>]*>?/gm, ' ') 
                          : 'Tidak ada konten.', 
                        50
                      ).text + 
                      (truncateText(
                        thread.content 
                          ? thread.content.replace(/<[^>]*>?/gm, ' ') 
                          : '', 
                        50
                      ).isTruncated ? '...' : '')
                    }} 
                  />
                </Box>
              )}
            </Box>
            {thread.content && truncateText(thread.content.replace(/<[^>]*>?/gm, ' '), 50).isTruncated && (
              <Button 
                variant="text" 
                size="small" 
                onClick={() => setIsThreadContentExpanded(!isThreadContentExpanded)}
                sx={{ mb: 3, p: 0, minWidth: 'auto', fontWeight: 400 }}
              >
                {isThreadContentExpanded ? 'Lihat lebih sedikit' : 'Baca selengkapnya'}
              </Button>
            )}
            <Box sx={{ mb: 4 }}>
              <Paper elevation={0} sx={{ 
                p: 3, 
                mb: 3, 
                borderRadius: '12px',
                border: '1px solid',
                borderColor: 'grey.200',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar 
                    alt={thread.author || 'Pengguna'}
                    src={thread.authorAvatar || ''}
                    sx={{ width: 40, height: 40 }}
                  >
                    {thread.author ? thread.author.charAt(0).toUpperCase() : '?'}
                  </Avatar>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6" fontWeight={600}>
                        {thread.author || 'Pengguna'}
                      </Typography>
                      {thread.authorRole && (
                        <Chip 
                          label={thread.authorRole === 'admin' ? 'Admin' : 'Member'} 
                          size="small" 
                          color={thread.authorRole === 'admin' ? 'primary' : 'default'}
                          sx={{ height: 22 }}
                        />
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Bergabung: {thread.authorJoinDate ? formatDateTime(thread.authorJoinDate) : 'Tidak diketahui'}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                    <ForumIcon fontSize="small" sx={{ mr: 0.5 }} /> {thread.replies} komentar
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                    <CalendarTodayIcon fontSize="small" sx={{ mr: 0.5 }} /> Diposting: {formatDateTime(thread.lastPost)}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                    <CategoryIcon fontSize="small" sx={{ mr: 0.5 }} /> 
                    <span style={{ textTransform: 'capitalize' }}>{categoryNames[thread.category] || thread.category}</span>
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                    <VisibilityIcon fontSize="small" sx={{ mr: 0.5 }} /> {thread.viewCount} dilihat
                  </Typography>
                </Box>
                
                {/* Add Rating Component */}
                <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                      Rating:
                    </Typography>
                    <Rating 
                      value={thread && thread.rating ? Number(thread.rating) : 0} 
                      precision={0.5} 
                      readOnly 
                      size="small"
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      ({thread && thread.rating ? parseFloat(thread.rating).toFixed(1) : '0'}/5)
                      {thread && thread.rating_count > 0 && ` (${thread.rating_count} penilaian)`}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                      Beri Rating:
                    </Typography>
                    <Tooltip title={isAuthenticated ? "Klik untuk memberi rating" : "Login untuk memberi rating"}>
                      <Box>
                        <Rating
                          value={Number(userRating)}
                          onChange={handleRatingChange}
                          size="medium"
                          icon={<StarIcon fontSize="inherit" />}
                        />
                      </Box>
                    </Tooltip>
                  </Box>
                </Box>
                
                {thread.tags && thread.tags.length > 0 && (
                  <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap', gap: 0.5 }}>
                    {thread.tags.map((tag, idx) => (
                      <Chip
                        key={idx}
                        label={`#${tag}`}
                        size="small"
                        color="primary"
                        sx={{ borderRadius: '8px' }}
                      />
                    ))}
                  </Stack>
                )}
                
                {/* Add Report Thread button */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                  {isAuthenticated && thread && user && user.id !== thread.authorId && (
                    <Button
                      variant="outlined"
                      color="warning"
                      startIcon={<FlagIcon />}
                      onClick={handleOpenReportThreadDialog}
                      size="small"
                    >
                      Laporkan Thread
                    </Button>
                  )}
                </Box>
              </Paper>
            </Box>
            <Box sx={{ mb: 6 }}>
              <Typography variant="h5" component="h2" fontWeight={700} gutterBottom>
                Komentar
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Paper elevation={0} sx={{ 
                p: 3, 
                mb: 2, 
                border: '1px solid', 
                borderColor: 'grey.200', 
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Tulis Komentar
                </Typography>
                <form onSubmit={handleCommentSubmit}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    placeholder="Tulis komentar Anda di sini..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <Button 
                    type="submit" 
                    variant="contained" 
                    disabled={!commentText.trim()}
                    sx={{ borderRadius: 8 }}
                  >
                    Kirim
                  </Button>
                </form>
              </Paper>
            </Box>

            {/* Comment filter buttons */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button
                variant={commentFilter === 'terbaru' ? 'contained' : 'outlined'}
                onClick={() => setCommentFilter('terbaru')}
              >
                Komentar Terbaru
              </Button>
              <Button
                variant={commentFilter === 'teratas' ? 'contained' : 'outlined'}
                onClick={() => setCommentFilter('teratas')}
              >
                Komentar Teratas
              </Button>
            </Box>
            {sortedRootComments.length > 0 ? (
              <>
              <List>
              {visibleRootComments.map((comment) => (
                <Box key={comment.id} sx={{ mb: 3 }}>
                  <ListItem
                    alignItems="flex-start"
                    sx={{
                      p: { xs: 1, sm: 2 },
                      mb: 1,
                      backgroundColor: '#fff',
                      borderRadius: 2,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      display: 'flex',
                      gap: 1,
                      alignItems: 'flex-start',
                      width: '100%', // Memastikan tidak melebihi lebar parent
                    }}
                  >
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 1, flexShrink: 0 }}>
                      <Avatar src={comment.user.avatar} alt={comment.user.name} />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}> {/* minWidth: 0 penting untuk text overflow handling */}
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: { xs: 'column', sm: 'row' }, 
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        gap: { xs: 0.5, sm: 1 }
                      }}>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {comment.user.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDateTime(comment.postedAt)}
                          {comment.isEdited && " (diedit)"}
                        </Typography>
                      </Box>
                      
                      {editingCommentId === comment.id ? (
                        <Box sx={{ mt: 1 }}>
                          <TextField
                            fullWidth
                            multiline
                            rows={3}
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            variant="outlined"
                            sx={{ mb: 1 }}
                          />
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button 
                              size="small" 
                              variant="contained" 
                              onClick={() => handleSaveEdit(comment.id)}
                              disabled={!editText.trim()}
                            >
                              Simpan
                            </Button>
                            <Button 
                              size="small" 
                              variant="outlined" 
                              onClick={handleCancelEdit}
                            >
                              Batal
                            </Button>
                          </Box>
                        </Box>
                      ) : (
                        <>
                          <Typography 
                            variant="body2" 
                            color="text.primary" 
                            sx={{ 
                              whiteSpace: 'pre-line', 
                              mt: 0.5,
                              wordBreak: 'break-word',
                              overflowWrap: 'break-word'
                            }}
                          >
                            {expandedComments[comment.id] ? (
                              comment.text
                            ) : (
                              <>
                                {truncateText(comment.text).text}
                                {truncateText(comment.text).isTruncated && '...'}
                              </>
                            )}
                          </Typography>
                          {truncateText(comment.text).isTruncated && (
                            <Button 
                              variant="text" 
                              size="small" 
                              onClick={() => toggleCommentExpansion(comment.id)}
                              sx={{ mt: 0.5, p: 0, minWidth: 'auto', fontWeight: 400 }}
                            >
                              {expandedComments[comment.id] ? 'Lihat lebih sedikit' : 'Baca selengkapnya'}
                            </Button>
                          )}
                        </>
                      )}
                    </Box>
                  </ListItem>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'flex-start', 
                    ml: { xs: 2, sm: 5, md: 7 }, 
                    mb: 1
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      flexWrap: 'wrap',
                      alignItems: 'center', 
                      gap: { xs: 0.5, sm: 1 },
                      mb: 1 
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                          size="small"
                          color={likes[comment.id] ? 'primary' : 'default'}
                          onClick={() => toggleLike(comment.id)}
                        >
                          <ThumbUpIcon fontSize="small" />
                        </IconButton>
                        <Typography variant="body2" sx={{ mr: { xs: 1, sm: 2 } }}>
                          {comment.likes}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: 0.5,
                        alignItems: 'center'
                      }}>
                        <Button
                          size="small"
                          onClick={() => handleStartReply(comment.id, comment.user.name)}
                          disabled={editingCommentId !== null}
                          sx={{ minWidth: { xs: 'auto', sm: '64px' }, px: { xs: 1, sm: 2 } }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {/* Hanya tampilkan ikon di mobile, teks di desktop */}
                            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                              <ReplyIcon fontSize="small" />
                            </Box>
                            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                              Balas
                            </Box>
                          </Box>
                        </Button>
                        
                        {isAuthenticated && comment.isOwnComment === true && (
                          <Button
                            size="small"
                            color="primary"
                            onClick={() => handleEditComment(comment.id, comment.text)}
                            disabled={editingCommentId !== null}
                            sx={{ 
                              minWidth: { xs: 'auto', sm: '64px' }, 
                              px: { xs: 1, sm: 2 },
                              ml: { xs: 0, sm: 1 }
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                                <EditIcon fontSize="small" />
                              </Box>
                              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                                Edit
                              </Box>
                            </Box>
                          </Button>
                        )}
                        
                        {isAuthenticated && comment.isOwnComment === true && (
                          <Button
                            size="small"
                            color="error"
                            onClick={() => handleDeleteComment(comment.id)}
                            disabled={editingCommentId !== null}
                            sx={{ 
                              minWidth: { xs: 'auto', sm: '64px' }, 
                              px: { xs: 1, sm: 2 },
                              ml: { xs: 0, sm: 1 }
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                                <DeleteIcon fontSize="small" />
                              </Box>
                              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                                Hapus
                              </Box>
                            </Box>
                          </Button>
                        )}

                        {/* Add Report Button */}
                        {isAuthenticated && !comment.isOwnComment && (
                          <Button
                            size="small"
                            color="warning"
                            onClick={() => handleOpenReportDialog(comment)}
                            disabled={editingCommentId !== null}
                            sx={{ 
                              minWidth: { xs: 'auto', sm: '64px' }, 
                              px: { xs: 1, sm: 2 },
                              ml: { xs: 0, sm: 1 }
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                                <FlagIcon fontSize="small" />
                              </Box>
                              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                                Laporkan
                              </Box>
                            </Box>
                          </Button>
                        )}
                      </Box>
                    </Box>
                    
                    {getReplies(comment.id).length > 0 && (
                      <Button
                        size="small"
                        onClick={() =>
                          setVisibleReplies((prev) => ({
                            ...prev,
                            [comment.id]: !prev[comment.id],
                          }))
                        }
                        sx={{ mt: 0 }}
                      >
                        {visibleReplies[comment.id] ? 'Sembunyikan balasan' : 'Lihat balasan'}
                      </Button>
                    )}
                  </Box>
                  {replyingTo === comment.id && (
                    <Box sx={{ ml: { xs: 2, sm: 5, md: 7 }, mb: 3, width: { xs: '90%', sm: '95%' } }}>
                      <form onSubmit={(e) => handleReplySubmit(e, comment.id)}>
                        {replyingToUser && (
                          <Typography variant="caption" sx={{ mb: 1, display: 'block', color: 'primary.main' }}>
                            Membalas ke @{replyingToUser}
                          </Typography>
                        )}
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          variant="outlined"
                          placeholder="Tulis balasan Anda di sini..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          sx={{ mb: 1 }}
                        />
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            type="submit"
                            variant="contained"
                            disabled={!replyText.trim()}
                            size="small"
                          >
                            Kirim
                          </Button>
                          <Button size="small" variant="outlined" onClick={() => setReplyingTo(null)}>
                            Batal
                          </Button>
                        </Box>
                      </form>
                    </Box>
                  )}
                  {visibleReplies[comment.id] &&
                    getReplies(comment.id).map((reply) => (
                      <React.Fragment key={reply.id}>
                        <ListItem
                          alignItems="flex-start"
                          sx={{
                            p: 1,
                            mb: 1,
                            ml: { xs: 3, sm: 6, md: 9 }, // Responsive margin kiri
                            backgroundColor: '#f9f9f9',
                            borderRadius: 2,
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                            maxWidth: { xs: 'calc(100% - 24px)', sm: 'calc(100% - 48px)', md: 'calc(100% - 72px)' }, // Responsive max-width
                            wordBreak: 'break-word',
                            overflowWrap: 'break-word',
                            boxSizing: 'border-box',
                            display: 'flex',
                            gap: 1,
                            alignItems: 'flex-start',
                            width: '100%', // Memastikan tidak melebihi lebar parent
                          }}
                        >
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 1 }}>
                            <Avatar src={reply.user.avatar} alt={reply.user.name} />
                          </Box>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Box sx={{ 
                              display: 'flex', 
                              flexDirection: { xs: 'column', sm: 'row' }, 
                              alignItems: { xs: 'flex-start', sm: 'center' }, 
                              gap: { xs: 0.5, sm: 1 }
                            }}>
                              <Typography variant="subtitle2" fontWeight={600}>
                                {reply.user.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {formatDateTime(reply.postedAt)}
                                {reply.isEdited && " (diedit)"}
                              </Typography>
                            </Box>
                            
                            {editingCommentId === reply.id ? (
                              <Box sx={{ mt: 1 }}>
                                <TextField
                                  fullWidth
                                  multiline
                                  rows={2}
                                  value={editText}
                                  onChange={(e) => setEditText(e.target.value)}
                                  variant="outlined"
                                  sx={{ mb: 1 }}
                                />
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  <Button 
                                    size="small" 
                                    variant="contained" 
                                    onClick={() => handleSaveEdit(reply.id)}
                                    disabled={!editText.trim()}
                                  >
                                    Simpan
                                  </Button>
                                  <Button 
                                    size="small" 
                                    variant="outlined" 
                                    onClick={handleCancelEdit}
                                  >
                                    Batal
                                  </Button>
                                </Box>
                              </Box>
                            ) : (
                              <>
                                <Typography 
                                  variant="body2" 
                                  color="text.primary" 
                                  sx={{ 
                                    whiteSpace: 'pre-line', 
                                    mt: 0.5, 
                                    wordBreak: 'break-word',
                                    overflowWrap: 'break-word'
                                  }}
                                >
                                  {expandedComments[reply.id] ? (
                                    reply.text
                                  ) : (
                                    <>
                                      {truncateText(reply.text).text}
                                      {truncateText(reply.text).isTruncated && '...'}
                                    </>
                                  )}
                                </Typography>
                                {truncateText(reply.text).isTruncated && (
                                  <Button 
                                    variant="text" 
                                    size="small" 
                                    onClick={() => toggleCommentExpansion(reply.id)}
                                    sx={{ mt: 0.5, p: 0, minWidth: 'auto', fontWeight: 400 }}
                                  >
                                    {expandedComments[reply.id] ? 'Lihat lebih sedikit' : 'Baca selengkapnya'}
                                  </Button>
                                )}
                              </>
                            )}
                          </Box>
                        </ListItem>
                        
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            flexWrap: 'wrap',
                            alignItems: 'center', 
                            ml: { xs: 4.5, sm: 7.5, md: 11 }, 
                            mb: 1,
                            mt: 0.5,
                            gap: { xs: 0.5, sm: 1 } 
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton
                              size="small"
                              color={likes[reply.id] ? 'primary' : 'default'}
                              onClick={() => toggleLike(reply.id)}
                            >
                              <ThumbUpIcon fontSize="small" />
                            </IconButton>
                            <Typography variant="body2" sx={{ mr: { xs: 1, sm: 2 } }}>
                              {reply.likes}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            gap: 0.5,
                            alignItems: 'center'
                          }}>
                            <Button
                              size="small"
                              onClick={() => handleStartReply(reply.id, reply.user.name)}
                              disabled={editingCommentId !== null}
                              sx={{ minWidth: { xs: 'auto', sm: '64px' }, px: { xs: 1, sm: 2 } }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                {/* Hanya tampilkan ikon di mobile, teks di desktop */}
                                <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                                  <ReplyIcon fontSize="small" />
                                </Box>
                                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                                  Balas
                                </Box>
                              </Box>
                            </Button>
                            
                            {isAuthenticated && reply.isOwnComment === true && (
                              <Button
                                size="small"
                                color="primary"
                                onClick={() => handleEditComment(reply.id, reply.text)}
                                disabled={editingCommentId !== null}
                                sx={{ 
                                  minWidth: { xs: 'auto', sm: '64px' }, 
                                  px: { xs: 1, sm: 2 },
                                  ml: { xs: 0, sm: 1 }
                                }}
                              >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                                    <EditIcon fontSize="small" />
                                  </Box>
                                  <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                                    Edit
                                  </Box>
                                </Box>
                              </Button>
                            )}
                            
                            {isAuthenticated && reply.isOwnComment === true && (
                              <Button
                                size="small"
                                color="error"
                                onClick={() => handleDeleteComment(reply.id)}
                                disabled={editingCommentId !== null}
                                sx={{ 
                                  minWidth: { xs: 'auto', sm: '64px' }, 
                                  px: { xs: 1, sm: 2 },
                                  ml: { xs: 0, sm: 1 }
                                }}
                              >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                                    <DeleteIcon fontSize="small" />
                                  </Box>
                                  <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                                    Hapus
                                  </Box>
                                </Box>
                              </Button>
                            )}

                            {/* Add Report Button for replies */}
                            {isAuthenticated && !reply.isOwnComment && (
                              <Button
                                size="small"
                                color="warning"
                                onClick={() => handleOpenReportDialog(reply)}
                                disabled={editingCommentId !== null}
                                sx={{ 
                                  minWidth: { xs: 'auto', sm: '64px' }, 
                                  px: { xs: 1, sm: 2 },
                                  ml: { xs: 0, sm: 1 }
                                }}
                              >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                                    <FlagIcon fontSize="small" />
                                  </Box>
                                  <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                                    Laporkan
                                  </Box>
                                </Box>
                              </Button>
                            )}
                          </Box>
                        </Box>

                        {replyingTo === reply.id && (
                          <Box sx={{ 
                            ml: { xs: 4.5, sm: 7.5, md: 11 }, 
                            mb: 3,
                            width: { xs: '85%', sm: '90%' } 
                          }}>
                            <form onSubmit={(e) => handleReplySubmit(e, comment.id)}>
                              {replyingToUser && (
                                <Typography variant="caption" sx={{ mb: 1, display: 'block', color: 'primary.main' }}>
                                  Membalas ke @{replyingToUser}
                                </Typography>
                              )}
                              <TextField
                                fullWidth
                                multiline
                                rows={2}
                                variant="outlined"
                                placeholder="Tulis balasan Anda di sini..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                sx={{ mb: 1 }}
                              />
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                  type="submit"
                                  variant="contained"
                                  disabled={!replyText.trim()}
                                  size="small"
                                >
                                  Kirim
                                </Button>
                                <Button size="small" variant="outlined" onClick={() => setReplyingTo(null)}>
                                  Batal
                                </Button>
                              </Box>
                            </form>
                          </Box>
                        )}
                      </React.Fragment>
                    ))}
              </Box>
              ))}
              </List>
              
              {/* Tombol Load More Comments */}
              {hasMoreComments && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 4 }}>
                  <Button 
                    variant="outlined" 
                    onClick={loadMoreComments}
                    endIcon={<ArrowDownwardIcon />}
                  >
                    Lihat Komentar Lainnya
                  </Button>
                </Box>
              )}
              </>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                Belum ada komentar. Jadilah yang pertama memberikan komentar!
              </Typography>
            )}
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" color="error" gutterBottom>
              Tidak dapat memuat data forum
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Terjadi kesalahan saat memuat detail forum. Silakan coba lagi.
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => window.location.reload()}
              sx={{ mr: 2 }}
            >
              Coba Lagi
            </Button>
            <Button 
              variant="outlined" 
              onClick={handleBack}
            >
              Kembali ke Forum
            </Button>
          </Box>
        )}

        {/* Add Report Dialog at the end of the component before the last closing tag */}
        <Dialog open={reportDialogOpen} onClose={handleCloseReportDialog}>
          <DialogTitle>Laporkan Komentar</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>
              Bantu kami menjaga forum ini agar tetap bermanfaat bagi semua orang dengan melaporkan konten yang tidak pantas.
            </DialogContentText>
            
            {reportingComment && (
              <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
                <Typography variant="caption" color="text.secondary">
                  Komentar oleh {reportingComment.user.name}:
                </Typography>
                <Typography variant="body2">
                  {reportingComment.text.length > 100 
                    ? `${reportingComment.text.substring(0, 100)}...` 
                    : reportingComment.text}
                </Typography>
              </Paper>
            )}
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Alasan Laporan*
              </Typography>
              <RadioGroup
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
              >
                <FormControlLabel value="inappropriate" control={<Radio />} label="Konten tidak pantas atau menyinggung" />
                <FormControlLabel value="spam" control={<Radio />} label="Spam atau iklan" />
                <FormControlLabel value="harassment" control={<Radio />} label="Pelecehan atau intimidasi" />
                <FormControlLabel value="misinformation" control={<Radio />} label="Informasi salah atau menyesatkan" />
                <FormControlLabel value="other" control={<Radio />} label="Lainnya" />
              </RadioGroup>
            </FormControl>
            
            <TextField
              label="Deskripsi Tambahan (opsional)"
              multiline
              rows={3}
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              fullWidth
              variant="outlined"
              placeholder="Jelaskan lebih detail mengapa komentar ini harus ditinjau oleh moderator..."
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseReportDialog} disabled={isSubmittingReport}>
              Batal
            </Button>
            <Button 
              onClick={handleSubmitReport} 
              variant="contained" 
              color="warning" 
              disabled={!reportReason || isSubmittingReport}
              startIcon={isSubmittingReport ? <CircularProgress size={16} /> : <FlagIcon />}
            >
              {isSubmittingReport ? 'Mengirim...' : 'Kirim Laporan'}
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Add Thread Report Dialog */}
        <Dialog open={reportThreadDialogOpen} onClose={handleCloseReportThreadDialog}>
          <DialogTitle>Laporkan Thread</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>
              Bantu kami menjaga forum ini agar tetap bermanfaat bagi semua orang dengan melaporkan thread yang tidak pantas.
            </DialogContentText>
            
            {thread && (
              <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
                <Typography variant="caption" color="text.secondary">
                  Thread oleh {thread.author}:
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {thread.title}
                </Typography>
              </Paper>
            )}
            
            <Alert severity="info" sx={{ mb: 2 }}>
              Laporan akan ditinjau oleh tim moderator kami. Terima kasih telah membantu menjaga kualitas forum.
            </Alert>
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Alasan Laporan*
              </Typography>
              <RadioGroup
                value={reportThreadReason}
                onChange={(e) => setReportThreadReason(e.target.value)}
              >
                <FormControlLabel value="inappropriate" control={<Radio />} label="Konten tidak pantas atau menyinggung" />
                <FormControlLabel value="spam" control={<Radio />} label="Spam atau iklan" />
                <FormControlLabel value="harassment" control={<Radio />} label="Pelecehan atau intimidasi" />
                <FormControlLabel value="misinformation" control={<Radio />} label="Informasi salah atau menyesatkan" />
                <FormControlLabel value="other" control={<Radio />} label="Lainnya" />
              </RadioGroup>
            </FormControl>
            
            <TextField
              label="Deskripsi Tambahan (opsional)"
              multiline
              rows={3}
              value={reportThreadDescription}
              onChange={(e) => setReportThreadDescription(e.target.value)}
              fullWidth
              variant="outlined"
              placeholder="Jelaskan lebih detail mengapa thread ini harus ditinjau oleh moderator..."
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseReportThreadDialog} disabled={isSubmittingThreadReport}>
              Batal
            </Button>
            <Button 
              onClick={handleSubmitThreadReport} 
              variant="contained" 
              color="warning" 
              disabled={!reportThreadReason || isSubmittingThreadReport}
              startIcon={isSubmittingThreadReport ? <CircularProgress size={16} /> : <FlagIcon />}
            >
              {isSubmittingThreadReport ? 'Mengirim...' : 'Kirim Laporan'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default DetailForum;
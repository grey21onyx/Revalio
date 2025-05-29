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
  Chip
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
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

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
  
  let avatarUrl = user.foto_profil || user.avatar || '';
  
  // If the URL is already absolute, return it as is
  if (avatarUrl.startsWith('http') || avatarUrl.startsWith('https')) {
    return avatarUrl;
  }
  
  // If it's a relative path, check if it includes storage/app/public
  // but only attach domain if the path is non-empty
  if (avatarUrl && !avatarUrl.startsWith('/')) {
    avatarUrl = `/${avatarUrl}`; // Ensure it starts with a slash
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
        setComments(allComments);
      } catch (error) {
        console.error('Error loading comments:', error);
        console.error('Error details:', error.response?.status, error.response?.data);
        
        // Fallback ke API publik jika terjadi error autentikasi
        if (error.response && error.response.status === 401) {
          console.log('Attempting to load public comments');
          const publicResponse = await api.get(`/public/forum-threads/${id}/comments`);
          
          if (publicResponse.data && publicResponse.data.data) {
            // Proses data dari API publik dengan cara yang sama
            const publicComments = processPublicComments(publicResponse.data.data);
            setComments(publicComments);
            return;
          }
        }
        
        // Default ke array kosong jika semua upaya gagal
        setComments([]);
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
          processThreadData(threadData);
        } catch (error) {
          console.error('Error loading thread:', error);
          console.error('Error details:', error.response?.status, error.response?.data);
          
          // Coba API public sebagai fallback
          console.log('Trying public API as fallback');
          const publicResponse = await api.get(`/public/forum-threads/${id}`);
          if (publicResponse.data && publicResponse.data.thread) {
            processThreadData(publicResponse.data.thread);
            return;
          } else {
            throw new Error('Invalid format from public API');
          }
        }
      } catch (error) {
        console.error('Error loading thread:', error);
        console.error('Error details:', error.response?.status, error.response?.data);
        
        // Coba API public sebagai fallback dalam kasus error
        if (error.response && (error.response.status === 401 || error.response.status === 500)) {
          try {
            console.log('Trying public API after main API error');
            const publicResponse = await api.get(`/public/forum-threads/${id}`);
            if (publicResponse.data && publicResponse.data.thread) {
              processThreadData(publicResponse.data.thread);
              return;
            }
          } catch (publicError) {
            console.error('Public API also failed:', publicError);
          }
        }
        
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
    
    // Fungsi untuk memproses data thread dari API
    const processThreadData = (threadData) => {
      console.log('Processing thread data:', threadData);
      console.log('User data:', threadData.user);
      
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
        viewCount: threadData.view_count || 0
      });
      
      console.log('Processed thread state:', {
        author: getUserDisplayName(threadData.user),
        authorAvatar: getUserAvatarUrl(threadData.user),
        authorRole: threadData.user ? threadData.user.role : null
      });
    };
    
    // Helper function untuk memproses komentar dari API publik
    const processPublicComments = (commentsData) => {
      if (!Array.isArray(commentsData)) return [];
      
      const processedComments = [];
      
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
        
        processedComments.push({
          id: comment.id || comment.komentar_id,
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
        
        // Proses balasan jika ada dalam format API publik
        if (comment.replies && Array.isArray(comment.replies)) {
          comment.replies.forEach(reply => {
            // Extract reply user ID for comparison
            const replyUserId = reply.user ? (reply.user.id || reply.user.user_id || reply.user_id) : reply.user_id;
            
            // Determine reply ownership by direct comparison of IDs
            const isReplyOwned = Boolean(currentUserId && replyUserId && 
                              (String(currentUserId) === String(replyUserId)));
                              
            console.log(`Public reply ID: ${reply.id || reply.komentar_id}, User ID: ${replyUserId}, Current User ID: ${currentUserId}, Is Owned: ${isReplyOwned}`);
            
            processedComments.push({
              id: reply.id || reply.komentar_id,
              user: {
                id: replyUserId,
                name: getUserDisplayName(reply.user),
                avatar: getUserAvatarUrl(reply.user)
              },
              postedAt: reply.tanggal_komentar,
              text: reply.konten,
              parentId: comment.id || comment.komentar_id,
              likes: reply.likes_count || 0,
              isOwnComment: isReplyOwned,
              isEdited: reply.updated_at && reply.updated_at !== reply.tanggal_komentar
            });
          });
        }
      });
      
      return processedComments;
    };

    loadThread();
    
    // Komentar diatur untuk selalu dimuat saat komponen dimount
    loadComments();
    
    // Cleanup function saat unmount
    return () => {
      console.log('DetailForum component unmounting');
      // Clear timeouts, subscriptions or any other async actions
      setComments([]);
      setThread(null);
    };
  }, [id]); // Dependency hanya pada ID, tidak pada user

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

  const toggleLike = async (commentId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const response = await api.post(
        `/forum-threads/${id}/comments/${commentId}/like`
      );
      
      // Update local state
      setLikes((prev) => {
        const newLikes = { ...prev };
        if (response.data.is_liked) {
          newLikes[commentId] = true;
        } else {
          delete newLikes[commentId];
        }
        return newLikes;
      });
      
      // Update comment likes count
      setComments((prev) => 
        prev.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              likes: response.data.likes_count
            };
          }
          return comment;
        })
      );
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
      // Calculate likes including user likes
      const likesA = a.likes + (likes[a.id] ? 1 : 0);
      const likesB = b.likes + (likes[b.id] ? 1 : 0);
      return likesB - likesA;
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
                          {comment.likes + (likes[comment.id] ? 1 : 0)}
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
                              {reply.likes + (likes[reply.id] ? 1 : 0)}
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
      </Container>
    </Box>
  );
};

export default DetailForum;
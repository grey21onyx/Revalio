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
  IconButton
} from '@mui/material';
import {
  ArrowBack,
  ThumbUp as ThumbUpIcon,
  Reply as ReplyIcon,
  Close as CloseIcon,
  Send as SendIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ArrowDownward as ArrowDownwardIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../hooks/useAuth';

// Mock API calls - replace with real API integration
const fetchThreadById = async (id) => {
  const threads = {
    1: {
      id: 1,
      title: 'Cara efektif mengelola sampah plastik',
      author: 'Budi Santoso',
      replies: 12,
      lastPost: '2024-06-01T10:30:00Z',
      category: 'recycling',
      tags: ['plastik', 'daur ulang', 'lingkungan', 'zero waste'],
      content: `<h2>Selamat siang teman-teman forum Revalio!</h2>

<p>Saya ingin mengajak diskusi mengenai cara-cara efektif dalam mengelola sampah plastik agar lebih ramah lingkungan dan bernilai ekonomis. Seperti yang kita ketahui, sampah plastik telah menjadi masalah lingkungan global yang semakin mengkhawatirkan.</p>

<h3>Beberapa poin yang bisa kita diskusikan:</h3>

<ol>
  <li>Pemilahan sampah plastik berdasarkan jenisnya <strong>(PET, HDPE, PVC, dll)</strong></li>
  <li>Teknik daur ulang yang bisa dilakukan di rumah dengan peralatan sederhana</li>
  <li>Program bank sampah dan bagaimana mengimplementasikannya di tingkat RT/RW</li>
  <li>Ide produk bernilai ekonomi dari sampah plastik</li>
  <li>Mengurangi penggunaan plastik sekali pakai dalam kehidupan sehari-hari</li>
</ol>

<p>Di daerah saya, kami telah memulai program bank sampah kecil-kecilan dan hasilnya cukup menjanjikan. Dalam 3 bulan terakhir, kami berhasil mengumpulkan <strong>lebih dari 500 kg sampah plastik</strong> yang kemudian dijual ke pengepul dan hasilnya dimasukkan ke kas RT.</p>

<blockquote>Sampah plastik bukanlah musuh, tetapi sumber daya yang belum dimanfaatkan dengan bijak.</blockquote>

<p>Bagaimana pengalaman teman-teman dalam mengelola sampah plastik? Apa tantangan terbesar yang dihadapi? Mari berbagi pengalaman dan solusi!</p>

<p>Terima kasih.</p>`
    },
    2: {
      id: 2,
      title: 'Tips memulai usaha daur ulang sampah',
      author: 'Sari Dewi',
      replies: 8,
      lastPost: '2024-05-30T15:45:00Z',
      category: 'tips',
      tags: ['usaha', 'daur ulang', 'ekonomi kreatif', 'umkm'],
      content: `<h2>Halo para pecinta lingkungan!</h2>

<p>Saya ingin berbagi pengalaman dan tips untuk memulai usaha daur ulang sampah yang menguntungkan. Sebagai owner dari <strong>"EcoCraft Indonesia"</strong>, saya telah menjalani bisnis ini selama 3 tahun dan merasakan berbagai tantangan dan keberhasilan.</p>

<h3>PERSIAPAN AWAL:</h3>
<ul>
  <li>Riset pasar: Tentukan jenis sampah yang akan didaur ulang <span style="color: #2196f3;">(plastik, kertas, kaca, elektronik)</span></li>
  <li>Pelajari teknik daur ulang: Ikuti pelatihan atau kursus singkat</li>
  <li>Siapkan modal: Bisa dimulai dari skala kecil (Rp 5-10 juta)</li>
  <li>Cari supplier sampah: Jalin kerjasama dengan bank sampah atau pengepul</li>
  <li>Siapkan lokasi: Pastikan ada tempat untuk produksi dan penyimpanan</li>
</ul>

<h3>PELUANG PRODUK:</h3>
<ol>
  <li>Kerajinan dari botol plastik (pot tanaman, tempat pensil, dll)</li>
  <li>Tas dan dompet dari bungkus kemasan</li>
  <li>Furnitur dari kayu bekas atau palet</li>
  <li>Kompos dari sampah organik</li>
  <li>Bahan baku untuk industri (cacahan plastik, bubur kertas)</li>
</ol>

<h3>STRATEGI PEMASARAN:</h3>
<ul>
  <li>Media sosial <strong>(Instagram, TikTok)</strong></li>
  <li>Marketplace online</li>
  <li>Pameran kerajinan dan produk ramah lingkungan</li>
  <li>Kerjasama dengan komunitas lingkungan</li>
  <li>Edukasi masyarakat melalui workshop</li>
</ul>

<p>Berdasarkan pengalaman saya, kunci sukses dalam bisnis ini adalah <em>konsistensi, inovasi produk, dan edukasi konsumen</em> tentang pentingnya produk daur ulang.</p>

<blockquote>Kesuksesan dalam bisnis daur ulang tidak hanya diukur dari profit, tetapi juga dari dampak positif terhadap lingkungan.</blockquote>

<p>Apakah teman-teman tertarik memulai usaha serupa? Atau sudah ada yang menjalankan bisnis daur ulang? Mari berbagi pengalaman!</p>`
    },
    3: {
      id: 3,
      title: 'Diskusi umum tentang pengelolaan sampah',
      author: 'Andi Wijaya',
      replies: 20,
      lastPost: '2024-06-02T08:20:00Z',
      category: 'general',
      tags: ['diskusi', 'sampah', 'tpa', 'kebijakan publik'],
      content: `<h2>Selamat pagi semua,</h2>

<p>Saya ingin membuka diskusi umum tentang pengelolaan sampah di Indonesia. Menurut data Kementerian Lingkungan Hidup dan Kehutanan, Indonesia menghasilkan <strong>68 juta ton sampah</strong> pada tahun 2023, di mana <span style="color: #4caf50;">40% adalah sampah organik</span>, <span style="color: #f44336;">30% plastik</span>, dan sisanya adalah sampah anorganik lainnya.</p>

<h3>PERMASALAHAN:</h3>
<ul>
  <li>Tempat Pembuangan Akhir (TPA) yang sudah overload</li>
  <li>Kurangnya kesadaran masyarakat tentang pemilahan sampah</li>
  <li>Infrastruktur pengolahan sampah yang belum memadai</li>
  <li>Regulasi yang belum optimal dalam mendorong pengelolaan sampah</li>
  <li>Minimnya inovasi teknologi pengolahan sampah</li>
</ul>

<h3>SOLUSI YANG SUDAH DITERAPKAN:</h3>
<ol>
  <li>Program <strong>3R</strong> <em>(Reduce, Reuse, Recycle)</em></li>
  <li>Bank Sampah di berbagai daerah</li>
  <li>Extended Producer Responsibility (EPR)</li>
  <li>Teknologi Refuse-Derived Fuel (RDF)</li>
  <li>Pembangkit Listrik Tenaga Sampah (PLTSa)</li>
</ol>

<p>Saya tertarik mendengar pendapat dari teman-teman tentang:</p>
<ul>
  <li>Bagaimana kondisi pengelolaan sampah di daerah masing-masing?</li>
  <li>Apa kebijakan pemerintah daerah yang sudah diterapkan?</li>
  <li>Inovasi apa yang menurut teman-teman perlu dikembangkan?</li>
  <li>Bagaimana cara meningkatkan partisipasi masyarakat?</li>
</ul>

<blockquote>Permasalahan sampah adalah tanggung jawab bersama. Setiap aksi kecil yang konsisten akan memberikan dampak besar.</blockquote>

<p>Mari kita diskusikan secara terbuka untuk mencari solusi bersama atas permasalahan sampah di Indonesia.</p>`
    }
  };
  return threads[id] || null;
};

const fetchCommentsByThreadId = async (threadId) => {
  // Tambahkan lebih banyak komentar dummy untuk testing pagination
  return [
    {
      id: 1,
      user: {
        name: 'Sari Dewi',
        avatar: '/assets/images/avatars/user1.png'
      },
      postedAt: '2024-06-01T12:00:00Z',
      text: 'Saya setuju, pengelolaan sampah plastik harus dimulai dari rumah tangga.',
      parentId: null,
      likes: 3
    },
    {
      id: 2,
      user: {
        name: 'Andi Wijaya',
        avatar: '/assets/images/avatars/user2.png'
      },
      postedAt: '2024-06-01T13:15:00Z',
      text: 'Mengelola sampah plastik adalah tantangan besar dalam kehidupan modern saat ini. Sebagai warga yang peduli dengan lingkungan, kita perlu memulai dari hal-hal kecil seperti memilah sampah organik dan anorganik di rumah. Sampah plastik bisa didaur ulang menjadi berbagai produk bernilai ekonomi tinggi. Program bank sampah juga menjadi solusi efektif untuk mengelola sampah plastik di tingkat komunitas. Dengan mengumpulkan, memilah, dan menjual sampah plastik ke bank sampah, kita tidak hanya mengurangi dampak lingkungan tetapi juga mendapatkan keuntungan ekonomi. Mari kita bersama-sama berkontribusi untuk mengurangi sampah plastik dan menjaga kelestarian lingkungan kita.',
      parentId: null,
      likes: 5
    },
    {
      id: 3,
      user: {
        name: 'Sari Dewi',
        avatar: '/assets/images/avatars/user1.png'
      },
      postedAt: '2024-06-01T14:00:00Z',
      text: 'Pengumpulan bisa dilakukan dengan sistem bank sampah yang terorganisir. Pengumpulan sampah plastik secara terpisah memudahkan proses daur ulang dan mencegah pencemaran lingkungan. Dengan menerapkan sistem yang baik, kita bisa mengubah sampah plastik menjadi sumber daya ekonomi yang menguntungkan masyarakat. Pendidikan kepada masyarakat juga penting agar mereka memahami pentingnya pengelolaan sampah plastik dan cara-cara efektif melakukannya.',
      parentId: 2,
      likes: 2
    },
    {
      id: 4,
      user: {
        name: 'Budi Santoso',
        avatar: '/assets/images/avatars/user3.png'
      },
      postedAt: '2024-06-01T15:30:00Z',
      text: 'Di daerah saya sudah menerapkan bank sampah dan hasilnya sangat positif.',
      parentId: null,
      likes: 1
    },
    // Tambahkan lebih banyak komentar untuk pengujian pagination
    {
      id: 5,
      user: {
        name: 'Indra Kusuma',
        avatar: '/assets/images/avatars/user4.png'
      },
      postedAt: '2024-06-01T16:20:00Z',
      text: 'Saya telah menjalankan bank sampah di lingkungan RT saya selama 2 tahun. Hasilnya luar biasa.',
      parentId: null,
      likes: 7
    },
    {
      id: 6,
      user: {
        name: 'Lina Wijaya',
        avatar: '/assets/images/avatars/user5.png'
      },
      postedAt: '2024-06-01T17:05:00Z',
      text: 'Apakah ada panduan resmi untuk memulai bank sampah di level RT/RW?',
      parentId: null,
      likes: 2
    },
    {
      id: 7,
      user: {
        name: 'Indra Kusuma',
        avatar: '/assets/images/avatars/user4.png'
      },
      postedAt: '2024-06-01T17:30:00Z',
      text: 'Ada! Kementerian Lingkungan Hidup dan Kehutanan memiliki panduan lengkap. Saya bisa berbagi link atau dokumen jika Anda berminat.',
      parentId: 6,
      likes: 4
    },
    {
      id: 8,
      user: {
        name: 'Rina Putri',
        avatar: '/assets/images/avatars/user6.png'
      },
      postedAt: '2024-06-01T18:15:00Z',
      text: 'Bagaimana cara mengajak warga yang masih kurang peduli untuk bergabung dengan program bank sampah?',
      parentId: null,
      likes: 6
    },
    {
      id: 9,
      user: {
        name: 'Ahmad Fauzi',
        avatar: '/assets/images/avatars/user7.png'
      },
      postedAt: '2024-06-01T18:45:00Z',
      text: 'Berdasarkan pengalaman saya, edukasi dan sosialisasi secara rutin sangat penting. Terutama dengan menunjukkan manfaat ekonomis dari bank sampah.',
      parentId: 8,
      likes: 5
    },
    {
      id: 10,
      user: {
        name: 'Dewi Lestari',
        avatar: '/assets/images/avatars/user8.png'
      },
      postedAt: '2024-06-01T19:10:00Z',
      text: 'Di sekolah kami juga sudah menerapkan program serupa. Anak-anak jadi lebih paham tentang pemilahan sampah.',
      parentId: null,
      likes: 8
    },
    {
      id: 11,
      user: {
        name: 'Rudi Hartono',
        avatar: '/assets/images/avatars/user9.png'
      },
      postedAt: '2024-06-01T19:30:00Z',
      text: 'Ada yang punya contoh produk daur ulang yang bernilai jual tinggi dari sampah plastik?',
      parentId: null,
      likes: 3
    },
    {
      id: 12,
      user: {
        name: 'Nita Sari',
        avatar: '/assets/images/avatars/user10.png'
      },
      postedAt: '2024-06-01T20:00:00Z',
      text: 'Saya membuat kerajinan tas dan dompet dari sampah plastik kemasan. Permintaannya cukup tinggi di pasar lokal dan online.',
      parentId: 11,
      likes: 9
    },
    {
      id: 13,
      user: {
        name: 'Dimas Prawira',
        avatar: '/assets/images/avatars/user11.png'
      },
      postedAt: '2024-06-01T20:15:00Z',
      text: 'Bagaimana untuk sampah elektronik? Apakah ada sistem bank sampah khusus untuk ini?',
      parentId: null,
      likes: 4
    },
    {
      id: 14,
      user: {
        name: 'Fitri Handayani',
        avatar: '/assets/images/avatars/user12.png'
      },
      postedAt: '2024-06-01T20:45:00Z',
      text: 'Sampah elektronik butuh penanganan khusus. Di kota besar seperti Jakarta dan Surabaya sudah ada drop point khusus untuk sampah jenis ini.',
      parentId: 13,
      likes: 5
    },
    {
      id: 15,
      user: {
        name: 'Agus Setiawan',
        avatar: '/assets/images/avatars/user13.png'
      },
      postedAt: '2024-06-01T21:00:00Z',
      text: 'Apakah komentarnya sudah cukup banyak untuk menguji pagination? Saya rasa dengan 15 komentar seharusnya sudah cukup untuk menampilkan fiturnya.',
      parentId: null,
      likes: 2
    }
  ];
};

const postComment = async (threadId, content, parentId = null) => {
  return {
    id: Math.floor(Math.random() * 10000),
    user: {
      name: 'You',
      avatar: ''
    },
    postedAt: new Date().toISOString(),
    text: content,
    parentId,
    likes: 0
  };
};

const deleteComment = async (commentId) => {
  // In real implementation, this would call an API endpoint
  return true;
};

const formatDateTime = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleString();
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

  useEffect(() => {
    const loadThread = async () => {
      setLoadingThread(true);
      const data = await fetchThreadById(id);
      setThread(data);
      setLoadingThread(false);
    };

    const loadComments = async () => {
      setLoadingComments(true);
      const data = await fetchCommentsByThreadId(id);
      setComments(data);
      setLoadingComments(false);
    };

    loadThread();
    loadComments();
  }, [id]);

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
    
    // Gunakan objek comment kustom dengan menandai komentar sebagai milik user saat ini
    const posted = {
      id: Math.floor(Math.random() * 10000),
      user: {
        name: user?.name || 'You',
        avatar: ''
      },
      postedAt: new Date().toISOString(),
      text: commentText,
      parentId: replyingTo,
      likes: 0,
      isOwnComment: true // Flag untuk menandai komentar sendiri
    };
    
    setComments((prev) => [...prev, posted]);
    setCommentText('');
    setReplyingTo(null);
    setReplyText('');
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
    
    // Gunakan objek comment kustom dengan menandai balasan sebagai milik user saat ini
    const posted = {
      id: Math.floor(Math.random() * 10000),
      user: {
        name: user?.name || 'You', 
        avatar: ''
      },
      postedAt: new Date().toISOString(),
      text: finalText,
      parentId,
      likes: 0,
      isOwnComment: true // Flag untuk menandai komentar sendiri
    };
    
    setComments((prev) => [...prev, posted]);
    setReplyText('');
    setReplyingTo(null);
    setReplyingToUser(null);
  };

  const toggleLike = (commentId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Jika sudah login, lakukan toggle like
    setLikes((prev) => {
      const newLikes = { ...prev };
      if (newLikes[commentId]) {
        delete newLikes[commentId];
      } else {
        newLikes[commentId] = true;
      }
      return newLikes;
    });
  };

  const handleDeleteComment = async (commentId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Confirm deletion
    const result = await Swal.fire({
      title: 'Hapus Komentar',
      text: 'Apakah Anda yakin ingin menghapus komentar ini?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        // Delete comment
        await deleteComment(commentId);
        
        // Update state
        setComments((prev) => prev.filter(comment => comment.id !== commentId));
        
        Swal.fire(
          'Terhapus!',
          'Komentar Anda telah dihapus.',
          'success'
        );
      } catch (error) {
        Swal.fire(
          'Error!',
          'Gagal menghapus komentar.',
          'error'
        );
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

  // Fungsi untuk memulai balasan dengan menyimpan username
  const handleStartReply = (commentId, username) => {
    setReplyingTo(commentId === replyingTo ? null : commentId);
    setReplyingToUser(commentId === replyingTo ? null : username);
    if (commentId === replyingTo) {
      setReplyText('');
    }
  };

  const handleEditComment = (commentId, commentText) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    setEditingCommentId(commentId);
    setEditText(commentText);
  };
  
  const handleSaveEdit = (commentId) => {
    if (!editText.trim()) return;
    
    setComments((prev) => 
      prev.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            text: editText,
            isEdited: true // Tandai komentar telah diedit
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
  };
  
  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditText('');
  };

  // Fungsi untuk memotong teks ke jumlah kata tertentu
  const truncateText = (text, maxWords = 30) => {
    const words = text.split(' ');
    
    if (words.length <= maxWords) {
      return { isTruncated: false, text };
    }
    
    const truncated = words.slice(0, maxWords).join(' ');
    return { isTruncated: true, text: truncated };
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
        ) : (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" fontWeight={800} gutterBottom>
              {thread.title}
            </Typography>
              <Box sx={{ mb: 3 }}>
                {isThreadContentExpanded ? (
                  <Box 
                    dangerouslySetInnerHTML={{ __html: thread.content }} 
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
                        __html: truncateText(thread.content.replace(/<[^>]*>?/gm, ' '), 50).text + 
                                (truncateText(thread.content.replace(/<[^>]*>?/gm, ' '), 50).isTruncated ? '...' : '')
                      }} 
                    />
                  </Box>
                )}
              </Box>
              {truncateText(thread.content.replace(/<[^>]*>?/gm, ' '), 50).isTruncated && (
                <Button 
                  variant="text" 
                  size="small" 
                  onClick={() => setIsThreadContentExpanded(!isThreadContentExpanded)}
                  sx={{ mb: 3, p: 0, minWidth: 'auto', fontWeight: 400 }}
                >
                  {isThreadContentExpanded ? 'Lihat lebih sedikit' : 'Baca selengkapnya'}
                </Button>
              )}
              <>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar 
                    alt={thread.author}
                    sx={{ width: 32, height: 32, mr: 1 }}
                  >
                    {thread.author.charAt(0)}
                  </Avatar>
                  <Typography variant="body2">{thread.author}</Typography>
                </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                {thread.replies} balasan
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                Terakhir: {new Date(thread.lastPost).toLocaleString()}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mr: 2, textTransform: 'capitalize' }}>
                Kategori: {categoryNames[thread.category] || thread.category}
              </Typography>

              <Box>
                {thread.tags.map((tag, idx) => (
                  <Typography 
                    key={idx} 
                    variant="body2" 
                    sx={{ 
                      backgroundColor: 'primary.main', 
                      color: 'white', 
                      px: 1, 
                      borderRadius: 1,
                      display: 'inline-block',
                      mr: 1
                    }}
                  >
                    #{tag}
                  </Typography>
                ))}
                </Box>
              </Box>
            </>
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
                          
                          {isAuthenticated && ((comment.isOwnComment === true) || (user && user.name === comment.user.name)) && (
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
                          
                          {isAuthenticated && ((comment.isOwnComment === true) || (user && user.name === comment.user.name)) && (
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
                              
                              {isAuthenticated && ((reply.isOwnComment === true) || (user && user.name === reply.user.name)) && (
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
                              
                              {isAuthenticated && ((reply.isOwnComment === true) || (user && user.name === reply.user.name)) && (
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
        )}
      </Container>
    </Box>
  );
};

export default DetailForum;
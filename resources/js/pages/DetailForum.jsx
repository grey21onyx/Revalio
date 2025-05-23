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
  Send as SendIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';

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
      tags: ['plastik', 'daur ulang'],
      content: 'Diskusi tentang cara-cara efektif dalam mengelola sampah plastik agar lebih ramah lingkungan dan bernilai ekonomis.'
    },
    2: {
      id: 2,
      title: 'Tips memulai usaha daur ulang sampah',
      author: 'Sari Dewi',
      replies: 8,
      lastPost: '2024-05-30T15:45:00Z',
      category: 'tips',
      tags: ['usaha', 'daur ulang'],
      content: 'Panduan dan tips untuk memulai usaha daur ulang sampah yang sukses.'
    },
    3: {
      id: 3,
      title: 'Diskusi umum tentang pengelolaan sampah',
      author: 'Andi Wijaya',
      replies: 20,
      lastPost: '2024-06-02T08:20:00Z',
      category: 'general',
      tags: ['diskusi', 'sampah'],
      content: 'Diskusi terbuka mengenai pengelolaan sampah di masyarakat.'
    }
  };
  return threads[id] || null;
};

const fetchCommentsByThreadId = async (threadId) => {
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
      text: 'Bagaimana dengan pengumpulan sampah plastik di lingkungan sekitar?',
      parentId: null,
      likes: 1
    },
    {
      id: 3,
      user: {
        name: 'Sari Dewi',
        avatar: '/assets/images/avatars/user1.png'
      },
      postedAt: '2024-06-01T14:00:00Z',
      text: 'Pengumpulan bisa dilakukan dengan sistem bank sampah yang terorganisir.',
      parentId: 2,
      likes: 2
    },
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
  const [thread, setThread] = useState(null);
  const [loadingThread, setLoadingThread] = useState(true);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [likes, setLikes] = useState({}); // key: commentId, value: boolean liked
  const [visibleReplies, setVisibleReplies] = useState({}); // key: commentId, value: boolean
  const [commentFilter, setCommentFilter] = useState('terbaru'); // 'terbaru' or 'teratas'

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

  const handleBack = () => {
    navigate(-1);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const posted = await postComment(id, commentText, replyingTo);
    setComments((prev) => [...prev, posted]);
    setCommentText('');
    setReplyingTo(null);
    setReplyText('');
  };

  const handleReplySubmit = async (e, parentId) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    const posted = await postComment(id, replyText, parentId);
    setComments((prev) => [...prev, posted]);
    setReplyText('');
    setReplyingTo(null);
  };

  const toggleLike = (commentId) => {
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

  const getReplies = (commentId) => comments.filter((c) => c.parentId === commentId);

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
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {thread.content}
              </Typography>
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
                <List>
                {sortedRootComments.map((comment) => (
                  <Box key={comment.id} sx={{ mb: 3 }}>
                    <ListItem
                      alignItems="flex-start"
                      sx={{
                        p: 1,
                        mb: 1,
                        backgroundColor: '#fff',
                        borderRadius: 2,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        display: 'flex',
                        gap: 1,
                        alignItems: 'flex-start',
                      }}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 1 }}>
                        <Avatar src={comment.user.avatar} alt={comment.user.name} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {comment.user.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                            {formatDateTime(comment.postedAt)}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.primary" sx={{ whiteSpace: 'pre-line', mt: 0.5 }}>
                          {comment.text}
                        </Typography>
                      </Box>
                    </ListItem>
                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 7, mb: 1 }}>
                      <IconButton
                        size="small"
                        color={likes[comment.id] ? 'primary' : 'default'}
                        onClick={() => toggleLike(comment.id)}
                      >
                        <ThumbUpIcon fontSize="small" />
                      </IconButton>
                      <Typography variant="body2" sx={{ mr: 2 }}>
                        {comment.likes + (likes[comment.id] ? 1 : 0)}
                      </Typography>
                      <Button
                        size="small"
                        startIcon={<ReplyIcon />}
                        onClick={() => setReplyingTo(comment.id === replyingTo ? null : comment.id)}
                      >
                        Balas
                      </Button>
                      {getReplies(comment.id).length > 0 && (
                        <Button
                          size="small"
                          onClick={() =>
                            setVisibleReplies((prev) => ({
                              ...prev,
                              [comment.id]: !prev[comment.id],
                            }))
                          }
                          sx={{ ml: 2 }}
                        >
                          {visibleReplies[comment.id] ? 'Sembunyikan balasan' : 'Lihat balasan'}
                        </Button>
                      )}
                    </Box>
                    {replyingTo === comment.id && (
                      <Box sx={{ ml: 7, mb: 3 }}>
                        <form onSubmit={(e) => handleReplySubmit(e, comment.id)}>
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
                        <ListItem
                          key={reply.id}
                          alignItems="flex-start"
                          sx={{
                            p: 1,
                            mb: 1,
                            ml: 9,
                            backgroundColor: '#f9f9f9',
                            borderRadius: 2,
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                            maxWidth: 'calc(100% - 72px)', // prevent overflow, considering ml:9 (9*8px=72px)
                            wordBreak: 'break-word',
                            overflowWrap: 'break-word',
                            boxSizing: 'border-box',
                            display: 'flex',
                            gap: 1,
                            alignItems: 'flex-start',
                          }}
                        >
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 1 }}>
                            <Avatar src={reply.user.avatar} alt={reply.user.name} />
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="subtitle2" fontWeight={600}>
                                {reply.user.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                                {formatDateTime(reply.postedAt)}
                              </Typography>
                            </Box>
                            <Typography variant="body2" color="text.primary" sx={{ whiteSpace: 'pre-line', mt: 0.5 }}>
                              {reply.text}
                            </Typography>
                          </Box>
                        </ListItem>
                      ))}
                  </Box>
                ))}
                </List>
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
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  TextField,
  MenuItem,
  Button,
  Stack,
  Chip,
  Autocomplete,
  CircularProgress,
} from '@mui/material';
import ForumIcon from '@mui/icons-material/Forum';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../hooks/useAuth';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from '../services/api';

const categories = [
  { id: 'general', name: 'Umum' },
  { id: 'tips', name: 'Tips & Trik' },
  { id: 'recycling', name: 'Daur Ulang' },
];

// Konfigurasi toolbar untuk Quill
const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{'list': 'ordered'}, {'list': 'bullet'}],
    ['link', 'blockquote'],
    [{ 'color': [] }, { 'background': [] }],
    ['clean']
  ],
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet',
  'link', 'blockquote',
  'color', 'background'
];

const FormNewTopic = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState([]);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Hanya cleanup saat unmount
  useEffect(() => {
    return () => {
      Swal.close();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Periksa autentikasi lebih lengkap
    const token = localStorage.getItem('userToken');
    
    if (!isAuthenticated || !token) {
      Swal.fire({
        title: '<span style="font-size: 24px; font-weight: 600;">Login Diperlukan</span>',
        html: '<div style="font-size: 16px; margin-top: 10px;">Anda harus login terlebih dahulu untuk membuat topik baru di forum Revalio</div>',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: '<i class="fas fa-sign-in-alt"></i> Login Sekarang',
        cancelButtonText: '<i class="fas fa-arrow-left"></i> Kembali ke Forum',
        reverseButtons: true,
        allowOutsideClick: false,
        customClass: {
          popup: 'swal-wide',
          title: 'swal-title',
          confirmButton: 'swal-confirm-button',
          cancelButton: 'swal-cancel-button'
        },
        buttonsStyling: true,
        background: '#ffffff',
        iconColor: '#4caf50',
        confirmButtonColor: '#4caf50',
        cancelButtonColor: '#1976d2',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login', { state: { from: '/forum/new-topic' } });
        } else {
          navigate('/forum');
        }
      });
      return;
    }

    if (!title.trim()) {
      Swal.fire('Error', 'Judul topik harus diisi.', 'error');
      return;
    }
    if (!category) {
      Swal.fire('Error', 'Kategori harus dipilih.', 'error');
      return;
    }
    if (!content.trim()) {
      Swal.fire('Error', 'Isi topik harus diisi.', 'error');
      return;
    }

    setSubmitting(true);

    try {
      // Format tags menjadi string untuk API
      const tagsString = tags.join(',');
      
      // Debug informasi user dan token
      console.log('User authenticated:', isAuthenticated);
      console.log('User info:', user);
      console.log('Token exists:', !!token);
      console.log('Token being used:', token ? token.substring(0, 10) + '...' : 'none');
      
      // Panggil API untuk membuat thread baru
      console.log('Sending request to create forum thread with data:', {
        judul: title,
        konten: content.substring(0, 50) + '...',
        tags: tagsString
      });
      
      const response = await api.post(
        '/forum-threads', 
        {
          judul: title,
          konten: content,
          tags: tagsString
        }
      );
      
      console.log('Forum thread created successfully:', response.data);
      
      // Simpan ID thread yang baru dibuat
      const newThreadId = response.data.thread?.id || response.data.id;
      console.log('New thread ID:', newThreadId);

      if (!newThreadId) {
        console.error('Missing thread ID in response:', response.data);
        Swal.fire('Peringatan', 'Thread berhasil dibuat tetapi ID tidak ditemukan. Anda akan diarahkan kembali ke forum.', 'warning')
          .then(() => {
            navigate('/forum');
          });
        return;
      }

      // Sukses dengan ID thread yang valid
      Swal.fire({
        title: 'Sukses!',
        text: 'Topik baru berhasil dibuat.',
        icon: 'success',
        confirmButtonText: 'Lihat Topik'
      }).then(() => {
        // Navigasi ke detail thread yang baru dibuat
        console.log('Navigating to detail forum with ID:', newThreadId);
        navigate(`/detail-forum/${newThreadId}`);
      });
      
    } catch (error) {
      console.error('Error creating new topic:', error);
      
      // Log detail error lebih lengkap untuk debugging
      if (error.response) {
        console.error('Error response:', error.response.status, error.response.data);
        console.error('Request headers:', error.config.headers);
      }
      
      let errorMessage = 'Gagal membuat topik baru. Silakan coba lagi.';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      
      // Jika error 401, mungkin token tidak valid lagi atau sudah expired
      if (error.response && error.response.status === 401) {
        // Hapus token yang mungkin sudah tidak valid
        localStorage.removeItem('userToken');
        
        Swal.fire({
          icon: 'error',
          title: 'Sesi Login Berakhir',
          text: 'Silakan login kembali untuk melanjutkan.',
          confirmButtonText: 'Login',
          showCancelButton: false
        }).then(() => {
          navigate('/login', { state: { from: '/forum/new-topic' } });
        });
      } else {
        Swal.fire('Error', errorMessage, 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ backgroundColor: '#f9f9f9', minHeight: '100vh', py: { xs: 4, sm: 6 } }}>
      <Container maxWidth="lg">
        <Paper 
          elevation={0} 
          sx={{ 
            p: { xs: 4, sm: 8 },
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            border: '1px solid',
            borderColor: 'grey.200'
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1} mb={3}>
            <ForumIcon color="primary" sx={{ fontSize: 36 }} />
            <Typography variant="h5" fontWeight={700}>
              Buat Topik Baru
            </Typography>
          </Stack>

          <form onSubmit={handleSubmit} noValidate>
            <TextField
              label="Judul Topik"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              required
              margin="normal"
              disabled={submitting}
            />

            <TextField
              select
              label="Kategori"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              fullWidth
              required
              margin="normal"
              disabled={submitting}
            >
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </TextField>

            <Autocomplete
              multiple
              freeSolo
              options={[]}
              value={tags}
              onChange={(event, newValue) => setTags(newValue)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                    key={option + index}
                    sx={{ borderRadius: '8px' }}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tags (pisahkan dengan koma)"
                  placeholder="Tambahkan tag"
                  margin="normal"
                  disabled={submitting}
                />
              )}
            />

            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, mb: 1 }}>
              Isi Topik *
            </Typography>
            <Box sx={{ 
              mb: 2,
              '& .quill': {
                borderRadius: '4px',
              },
              '& .ql-container': {
                borderBottomLeftRadius: '4px',
                borderBottomRightRadius: '4px',
                minHeight: '200px'
              },
              '& .ql-toolbar': {
                borderTopLeftRadius: '4px',
                borderTopRightRadius: '4px',
                background: '#f9f9f9'
              }
            }}>
              <ReactQuill 
                theme="snow" 
                value={content} 
                onChange={setContent}
                modules={modules}
                formats={formats}
                placeholder="Tulis isi topik di sini..."
                readOnly={submitting}
                style={{ height: '300px', marginBottom: '50px' }}
              />
            </Box>

            <Stack direction="row" spacing={2} justifyContent="flex-end" mt={8}>
              <Button
                variant="outlined"
                onClick={() => navigate('/forum')}
                disabled={submitting}
                sx={{ borderRadius: '8px' }}
              >
                Batal
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={submitting}
                sx={{ borderRadius: '8px' }}
              >
                {submitting ? (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                    Menyimpan...
                  </Box>
                ) : 'Buat Topik'}
              </Button>
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default FormNewTopic;

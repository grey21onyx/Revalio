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
} from '@mui/material';
import ForumIcon from '@mui/icons-material/Forum';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../hooks/useAuth';

const categories = [
  { id: 'general', name: 'Umum' },
  { id: 'tips', name: 'Tips & Trik' },
  { id: 'recycling', name: 'Daur Ulang' },
];

const FormNewTopic = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
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

    if (!isAuthenticated) {
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

    // TODO: Replace with actual API call to create thread
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      Swal.fire('Sukses', 'Topik baru berhasil dibuat.', 'success').then(() => {
        navigate('/forum');
      });
    } catch (error) {
      Swal.fire('Error', 'Gagal membuat topik baru. Silakan coba lagi.', 'error');
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

            <TextField
              label="Isi Topik"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              fullWidth
              required
              margin="normal"
              multiline
              rows={6}
              disabled={submitting}
            />

            <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
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
                {submitting ? 'Menyimpan...' : 'Buat Topik'}
              </Button>
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default FormNewTopic;

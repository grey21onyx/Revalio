import React, { useState } from 'react';
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

const categories = [
  { id: 'general', name: 'Umum' },
  { id: 'tips', name: 'Tips & Trik' },
  { id: 'recycling', name: 'Daur Ulang' },
];

const FormNewTopic = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState([]);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        <Paper sx={{ p: { xs: 4, sm: 8 } }}>
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
              >
                Batal
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={submitting}
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

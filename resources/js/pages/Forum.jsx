import React from 'react';
import { Container, Typography, Box, Paper, Grid } from '@mui/material';

const Forum = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Forum Diskusi
        </Typography>
        <Typography variant="body1" paragraph>
          Halaman ini akan menampilkan forum diskusi komunitas peduli lingkungan dan pengolahan sampah.
        </Typography>
      </Paper>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Segera Hadir
            </Typography>
            <Typography variant="body1">
              Forum diskusi sedang dalam pengembangan. Silakan kembali lagi nanti.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Fitur Mendatang
            </Typography>
            <Typography variant="body1">
              • Thread diskusi tematik<br />
              • Komunitas berdasarkan minat<br />
              • Berbagi tips dan trik<br />
              • Showcase project daur ulang
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Forum; 
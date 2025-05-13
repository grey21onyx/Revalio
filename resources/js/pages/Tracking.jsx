import React from 'react';
import { Container, Typography, Box, Paper, Grid } from '@mui/material';

const Tracking = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Tracking Sampah
        </Typography>
        <Typography variant="body1" paragraph>
          Halaman ini akan menampilkan sistem pelacakan dan monitoring sampah yang Anda daur ulang.
        </Typography>
      </Paper>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Segera Hadir
            </Typography>
            <Typography variant="body1">
              Sistem tracking sampah sedang dalam pengembangan. Silakan kembali lagi nanti.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Fitur Mendatang
            </Typography>
            <Typography variant="body1">
              • Pelacakan jumlah sampah yang telah didaur ulang<br />
              • Statistik dan grafik pengurangan sampah<br />
              • Penghargaan dan pencapaian<br />
              • Dampak lingkungan yang dihasilkan
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Tracking; 
import React from 'react';
import { Container, Typography, Box, Paper, Grid } from '@mui/material';

const DaurUlang = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Daur Ulang
        </Typography>
        <Typography variant="body1" paragraph>
          Halaman ini akan menampilkan informasi tentang daur ulang dan cara memanfaatkan sampah.
        </Typography>
      </Paper>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Segera Hadir
            </Typography>
            <Typography variant="body1">
              Informasi daur ulang sedang dalam pengembangan. Silakan kembali lagi nanti.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Fitur Mendatang
            </Typography>
            <Typography variant="body1">
              • Tutorial daur ulang kreatif<br />
              • Workshop dan event daur ulang<br />
              • Tips mengurangi sampah sehari-hari<br />
              • Komunitas daur ulang
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DaurUlang; 
import React, { useEffect, useRef } from 'react';
import { Typography, Container, Grid, Box, Paper, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import RecyclingIcon from '@mui/icons-material/Recycling';
import NatureIcon from '@mui/icons-material/Nature';
import { gsap } from '../config/gsap';

const About = () => {
  // Refs untuk animasi
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const missionRef = useRef(null);
  const valueRefs = useRef([]);
  
  // Reset valueRefs array
  valueRefs.current = [];
  
  // Fungsi untuk menambahkan elemen ke valueRefs
  const addToValueRefs = (el) => {
    if (el && !valueRefs.current.includes(el)) {
      valueRefs.current.push(el);
    }
  };

  // Animasi dengan GSAP
  useEffect(() => {
    // Title and content animation
    gsap.from(titleRef.current, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power3.out',
    });

    gsap.from(contentRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.8,
      delay: 0.2,
      ease: 'power3.out',
    });

    gsap.from(missionRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.8,
      delay: 0.4,
      ease: 'power3.out',
    });

    // Values stagger animation
    gsap.from(valueRefs.current, {
      opacity: 0,
      x: -30,
      duration: 0.6,
      stagger: 0.15,
      delay: 0.6,
      ease: 'power3.out',
    });
  }, []);

  const values = [
    {
      title: 'Keberlanjutan',
      description: 'Kami mendorong praktik pengelolaan sampah yang berkelanjutan untuk masa depan yang lebih baik.',
      icon: <NatureIcon fontSize="large" color="primary" />,
    },
    {
      title: 'Pemberdayaan',
      description: 'Kami percaya setiap orang bisa berkontribusi dalam mengelola sampah dengan pengetahuan yang tepat.',
      icon: <RecyclingIcon fontSize="large" color="primary" />,
    },
    {
      title: 'Inovasi',
      description: 'Kami terus mencari solusi inovatif untuk memberikan nilai tambah pada sampah yang umumnya dibuang.',
      icon: <CheckIcon fontSize="large" color="primary" />,
    },
  ];

  return (
    <Box py={6}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Typography 
          ref={titleRef}
          variant="h2" 
          component="h1" 
          align="center" 
          gutterBottom
          sx={{ fontWeight: 'bold', mb: 4 }}
        >
          Tentang Revalio
        </Typography>

        {/* Main Content */}
        <Grid container spacing={6}>
          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 2, bgcolor: 'background.paper' }}>
              <Typography 
                ref={contentRef}
                variant="body1" 
                paragraph
                sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}
              >
                Revalio adalah platform edukasi digital yang membantu masyarakat memahami cara mengelola sampah rumah tangga dan industri ringan agar bisa memiliki nilai ekonomis. Didirikan pada tahun 2023, Revalio hadir sebagai solusi untuk masalah sampah yang semakin mendesak di Indonesia.
              </Typography>
              <Typography 
                variant="body1" 
                paragraph
                sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}
              >
                Kami percaya bahwa dengan edukasi yang tepat, sampah bukan lagi masalah melainkan sumber daya yang bernilai. Melalui platform kami, pengguna dapat mempelajari jenis sampah yang bernilai ekonomis, cara mengklasifikasikan dan mengelolanya, serta bagaimana memonetisasi sampah tersebut.
              </Typography>
              <Typography 
                variant="body1" 
                paragraph
                sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}
              >
                Revalio bukan platform jual beli, tetapi kami menyediakan informasi komprehensif tentang ekosistem pengelolaan sampah, termasuk informasi tentang bank sampah, pengepul, dan industri daur ulang yang membeli sampah tertentu.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper 
              ref={missionRef}
              elevation={3} 
              sx={{ 
                p: 4, 
                borderRadius: 2, 
                bgcolor: 'primary.main', 
                color: 'white',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                Misi Kami
              </Typography>
              <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                Memberdayakan masyarakat untuk mengelola sampah secara efektif dan mengubahnya menjadi sumber penghasilan tambahan, sambil berkontribusi pada pelestarian lingkungan.
              </Typography>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                Visi Kami
              </Typography>
              <Typography variant="body1">
                Menjadi platform edukasi sampah terdepan di Indonesia yang membentuk masyarakat sadar sampah dan mampu memanfaatkannya sebagai sumber daya bernilai ekonomis.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Values Section */}
        <Box mt={8}>
          <Typography 
            variant="h3" 
            component="h2" 
            align="center" 
            gutterBottom
            sx={{ mb: 5 }}
          >
            Nilai-Nilai Kami
          </Typography>
          <Divider sx={{ mb: 5 }} />
          <List>
            {values.map((value, index) => (
              <React.Fragment key={index}>
                <ListItem 
                  ref={addToValueRefs}
                  alignItems="flex-start" 
                  sx={{ 
                    py: 3,
                    '&:hover': {
                      bgcolor: 'rgba(76, 175, 80, 0.08)',
                      borderRadius: 2,
                    },
                  }}
                >
                  <ListItemIcon sx={{ mt: 1 }}>
                    {value.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="h5" gutterBottom>
                        {value.title}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body1" color="text.secondary">
                        {value.description}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < values.length - 1 && (
                  <Divider component="li" />
                )}
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Container>
    </Box>
  );
};

export default About;

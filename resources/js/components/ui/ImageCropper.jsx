import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Slider,
  Box,
  IconButton
} from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import CropIcon from '@mui/icons-material/Crop';
import CloseIcon from '@mui/icons-material/Close';

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.src = url;
  });

/**
 * Komponen untuk memotong gambar
 * @param {Object} props - Props komponen
 * @param {string} props.imageSrc - URL atau data URL gambar yang akan dipotong
 * @param {boolean} props.open - State untuk menampilkan dialog
 * @param {function} props.onClose - Fungsi yang dipanggil saat dialog ditutup
 * @param {function} props.onCrop - Fungsi yang dipanggil saat gambar dipotong dengan hasil potongan
 * @param {number} props.aspect - Aspek rasio pemotongan (default: 1 / 1 untuk bentuk persegi)
 */
const ImageCropper = ({ imageSrc, open, onClose, onCrop, aspect = 1 }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = useCallback(async () => {
    try {
      if (!croppedAreaPixels || !imageSrc) return;
      
      const image = await createImage(imageSrc);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Menyetel dimensi canvas sesuai dengan area yang dipotong
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;
      
      // Menggambar area yang dipotong ke canvas
      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );
      
      // Mengonversi canvas ke data URL
      const dataUrl = canvas.toDataURL('image/jpeg');
      onCrop(dataUrl);
      onClose();
    } catch (e) {
      console.error('Error saat memotong gambar: ', e);
    }
  }, [croppedAreaPixels, imageSrc, onCrop, onClose]);

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box display="flex" alignItems="center">
          <CropIcon sx={{ mr: 1 }} />
          Sesuaikan Foto Profil
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent>
        <Box 
          sx={{ 
            position: 'relative', 
            height: 400, 
            width: '100%', 
            backgroundColor: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 2
          }}
        >
          {imageSrc ? (
            <img
              src={imageSrc}
              alt="Preview gambar yang akan dipotong"
              style={{
                maxHeight: '100%',
                maxWidth: '100%',
                objectFit: 'contain'
              }}
            />
          ) : (
            <Box>Tidak ada gambar yang dipilih</Box>
          )}
          
          {/* 
            Di sini Anda perlu mengimpor dan menerapkan library cropping.
            Contoh ini akan menggunakan interface saja, untuk implementasi sebenarnya
            Anda dapat menggunakan react-easy-crop atau library serupa.
          */}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <ZoomOutIcon />
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="zoom-slider"
            onChange={(e, newZoom) => setZoom(newZoom)}
            sx={{ mx: 2, flexGrow: 1 }}
          />
          <ZoomInIcon />
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Batal
        </Button>
        <Button 
          onClick={handleCrop} 
          color="primary" 
          variant="contained"
          startIcon={<CropIcon />}
        >
          Potong & Simpan
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageCropper; 
import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  Typography,
  Slider
} from '@mui/material';
import CropIcon from '@mui/icons-material/Crop';
import CloseIcon from '@mui/icons-material/Close';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';

/**
 * Fungsi untuk membuat objek Image dari URL
 */
const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.src = url;
  });

/**
 * Komponen SimpleImageCrop untuk memotong gambar tanpa library eksternal
 */
const SimpleImageCrop = ({ open, onClose, imageUrl, onSave, aspectRatio = 1 }) => {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 200, height: 200 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  // Load image
  useEffect(() => {
    if (!imageUrl) return;

    const loadImage = async () => {
      try {
        const img = await createImage(imageUrl);
        setImage(img);
        
        // Set initial crop area to center of image
        const cropSize = Math.min(img.width, img.height) / 2;
        setCrop({
          x: (img.width - cropSize) / 2,
          y: (img.height - cropSize) / 2,
          width: cropSize,
          height: cropSize * (1 / aspectRatio)
        });
      } catch (error) {
        console.error('Error loading image:', error);
      }
    };

    loadImage();
  }, [imageUrl, aspectRatio]);

  // Draw canvas when image or crop changes
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (!canvas || !ctx || !image) return;
    
    // Set canvas size
    const containerWidth = canvas.parentElement.clientWidth;
    const containerHeight = 400;
    
    // Calculate scale to fit image in container
    const containerAspect = containerWidth / containerHeight;
    const imageAspect = image.width / image.height;
    
    let drawWidth, drawHeight;
    if (containerAspect > imageAspect) {
      drawHeight = containerHeight;
      drawWidth = drawHeight * imageAspect;
    } else {
      drawWidth = containerWidth;
      drawHeight = drawWidth / imageAspect;
    }
    
    canvas.width = containerWidth;
    canvas.height = containerHeight;
    
    // Calculate offset to center image
    const offsetX = (containerWidth - drawWidth) / 2;
    const offsetY = (containerHeight - drawHeight) / 2;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw image
    ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
    
    // Calculate crop rectangle in canvas coordinates
    const scaleX = drawWidth / image.width;
    const scaleY = drawHeight / image.height;
    const cropX = crop.x * scaleX + offsetX;
    const cropY = crop.y * scaleY + offsetY;
    const cropW = crop.width * scaleX;
    const cropH = crop.height * scaleY;
    
    // Draw dark overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Clear crop area
    ctx.clearRect(cropX, cropY, cropW, cropH);
    
    // Draw crop border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(cropX, cropY, cropW, cropH);
    
    // Store reference to the image drawing parameters
    imageRef.current = {
      x: offsetX,
      y: offsetY,
      width: drawWidth,
      height: drawHeight,
      imageWidth: image.width,
      imageHeight: image.height
    };
    
  }, [image, crop, scale]);

  // Handle mouse events for dragging
  const handleMouseDown = (e) => {
    if (!imageRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if click is within crop area
    const img = imageRef.current;
    const cropX = crop.x * (img.width / img.imageWidth) + img.x;
    const cropY = crop.y * (img.height / img.imageHeight) + img.y;
    const cropW = crop.width * (img.width / img.imageWidth);
    const cropH = crop.height * (img.height / img.imageHeight);
    
    if (x >= cropX && x <= cropX + cropW && y >= cropY && y <= cropY + cropH) {
      setIsDragging(true);
      setDragStart({ x, y });
    }
  };
  
  const handleMouseMove = (e) => {
    if (!isDragging || !imageRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const deltaX = x - dragStart.x;
    const deltaY = y - dragStart.y;
    
    const img = imageRef.current;
    const scaleFactorX = img.imageWidth / img.width;
    const scaleFactorY = img.imageHeight / img.height;
    
    // Update crop position but keep it within image bounds
    let newX = crop.x + deltaX * scaleFactorX;
    let newY = crop.y + deltaY * scaleFactorY;
    
    // Constrain to image boundaries
    newX = Math.max(0, Math.min(img.imageWidth - crop.width, newX));
    newY = Math.max(0, Math.min(img.imageHeight - crop.height, newY));
    
    setCrop(prev => ({
      ...prev,
      x: newX,
      y: newY
    }));
    
    setDragStart({ x, y });
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle zoom
  const handleZoom = (e, newValue) => {
    setScale(newValue);
    
    if (!image || !imageRef.current) return;
    
    const img = imageRef.current;
    
    // Calculate new crop size based on scale
    const baseSize = Math.min(img.imageWidth, img.imageHeight) / 2;
    const newWidth = baseSize * newValue;
    const newHeight = newWidth / aspectRatio;
    
    // Keep crop centered at same position
    const deltaW = (newWidth - crop.width) / 2;
    const deltaH = (newHeight - crop.height) / 2;
    
    let newX = crop.x - deltaW;
    let newY = crop.y - deltaH;
    
    // Ensure crop stays within image boundaries
    newX = Math.max(0, Math.min(img.imageWidth - newWidth, newX));
    newY = Math.max(0, Math.min(img.imageHeight - newHeight, newY));
    
    setCrop({
      x: newX,
      y: newY,
      width: newWidth,
      height: newHeight
    });
  };
  
  // Handle save/crop
  const handleCrop = async () => {
    if (!image || !crop) return;
    
    // Create a new canvas for the cropped image
    const canvas = document.createElement('canvas');
    canvas.width = crop.width;
    canvas.height = crop.height;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(
      image,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      crop.width,
      crop.height
    );
    
    // Convert to data URL and pass to onSave
    const dataUrl = canvas.toDataURL('image/jpeg');
    onSave(dataUrl);
    
    // Close dialog
    onClose();
  };

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
          <Typography variant="h6">Sesuaikan Foto Profil</Typography>
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
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            overflow: 'hidden',
            backgroundColor: '#1e1e1e',
            borderRadius: 1
          }}
        >
          <canvas
            ref={canvasRef}
            style={{ 
              cursor: isDragging ? 'grabbing' : 'grab',
              width: '100%',
              height: '100%'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
          
          {!image && (
            <Box 
              sx={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center' 
              }}
            >
              <Typography variant="body1" color="white">
                Memuat gambar...
              </Typography>
            </Box>
          )}
        </Box>
        
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
          <ZoomOutIcon sx={{ color: 'text.secondary' }} />
          <Slider
            value={scale}
            onChange={handleZoom}
            min={0.5}
            max={3}
            step={0.1}
            sx={{ mx: 2 }}
          />
          <ZoomInIcon sx={{ color: 'text.secondary' }} />
        </Box>
        
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
          Geser untuk memposisikan dan gunakan slider untuk memperbesar atau memperkecil
        </Typography>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Batal
        </Button>
        <Button
          onClick={handleCrop}
          variant="contained"
          color="primary"
          startIcon={<CropIcon />}
          disabled={!image}
        >
          Potong & Terapkan
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SimpleImageCrop; 
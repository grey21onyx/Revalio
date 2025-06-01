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
  Slider,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Grid,
  Tooltip
} from '@mui/material';
import CropIcon from '@mui/icons-material/Crop';
import CloseIcon from '@mui/icons-material/Close';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import HelpIcon from '@mui/icons-material/Help';

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const containerRef = useRef(null);
  
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 200, height: 200 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(true);
  const [helpOpen, setHelpOpen] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [showBackground, setShowBackground] = useState(true);

  // Load image
  useEffect(() => {
    if (!imageUrl) return;

    const loadImage = async () => {
      setLoading(true);
      try {
        const img = await createImage(imageUrl);
        setImage(img);
        
        // Set initial crop area to center of image with proper aspect ratio
        const cropSize = Math.min(img.width, img.height) / 2;
        setCrop({
          x: (img.width - cropSize) / 2,
          y: (img.height - cropSize * (1 / aspectRatio)) / 2,
          width: cropSize,
          height: cropSize * (1 / aspectRatio)
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading image:', error);
        setLoading(false);
      }
    };

    loadImage();
    
    // Reset states when dialog opens
    setRotation(0);
    setScale(1);
    setHelpOpen(false);
    setShowGrid(true);
    setShowBackground(true);
  }, [imageUrl, aspectRatio]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && image) {
        drawCanvas();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [image, crop, scale, rotation]);

  // Draw canvas when image or crop changes
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (!canvas || !ctx || !image) return;
    
    // Set canvas size based on container
    const containerWidth = containerRef.current?.clientWidth || canvas.parentElement.clientWidth;
    const containerHeight = isMobile ? 300 : 400;
    
    canvas.width = containerWidth;
    canvas.height = containerHeight;
    
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
    
    // Calculate offset to center image
    const offsetX = (containerWidth - drawWidth) / 2;
    const offsetY = (containerHeight - drawHeight) / 2;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Save context for rotation
    ctx.save();
    
    // Move to center for rotation
    ctx.translate(containerWidth / 2, containerHeight / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    
    // Draw image centered and rotated
    ctx.drawImage(
      image, 
      -drawWidth / 2, 
      -drawHeight / 2, 
      drawWidth, 
      drawHeight
    );
    
    // Restore context
    ctx.restore();
    
    // Calculate crop rectangle in canvas coordinates with rotation adjustment
    const radians = (rotation * Math.PI) / 180;
    const cosTheta = Math.cos(radians);
    const sinTheta = Math.sin(radians);
    
    const scaleX = drawWidth / image.width;
    const scaleY = drawHeight / image.height;
    
    // Transform crop coordinates
    const cropCenterX = crop.x + crop.width / 2;
    const cropCenterY = crop.y + crop.height / 2;
    
    // Calculate transformed center
    const transformedCenterX = containerWidth / 2 + ((cropCenterX * scaleX) - (image.width * scaleX / 2)) * cosTheta - 
                               ((cropCenterY * scaleY) - (image.height * scaleY / 2)) * sinTheta;
    const transformedCenterY = containerHeight / 2 + ((cropCenterX * scaleX) - (image.width * scaleX / 2)) * sinTheta + 
                               ((cropCenterY * scaleY) - (image.height * scaleY / 2)) * cosTheta;
    
    // Calculate transformed crop rectangle
    const cropX = transformedCenterX - (crop.width * scaleX) / 2;
    const cropY = transformedCenterY - (crop.height * scaleY) / 2;
    const cropW = crop.width * scaleX;
    const cropH = crop.height * scaleY;
    
    // Draw dark overlay with reduced opacity for better image visibility
    if (showBackground) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)'; // Reduced opacity from 0.65 to 0.35
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Clear crop area completely (makes it fully transparent)
      ctx.clearRect(cropX, cropY, cropW, cropH);
    }
    
    // Draw crop border
    ctx.strokeStyle = theme.palette.primary.main;
    ctx.lineWidth = 2;
    ctx.strokeRect(cropX, cropY, cropW, cropH);
    
    // Draw grid lines (rule of thirds) with more transparency
    if (showGrid) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'; // More transparent grid lines
      ctx.lineWidth = 0.5; // Thinner lines
      
      // Vertical grid lines
      ctx.beginPath();
      ctx.moveTo(cropX + cropW / 3, cropY);
      ctx.lineTo(cropX + cropW / 3, cropY + cropH);
      ctx.moveTo(cropX + (cropW * 2) / 3, cropY);
      ctx.lineTo(cropX + (cropW * 2) / 3, cropY + cropH);
      
      // Horizontal grid lines
      ctx.moveTo(cropX, cropY + cropH / 3);
      ctx.lineTo(cropX + cropW, cropY + cropH / 3);
      ctx.moveTo(cropX, cropY + (cropH * 2) / 3);
      ctx.lineTo(cropX + cropW, cropY + (cropH * 2) / 3);
      
      ctx.stroke();
      
      // Draw corner indicators
      const cornerSize = 8; // Smaller corner indicators
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)'; // Semi-transparent white corners
      ctx.lineWidth = 1.5;
      
      // Top left
      ctx.beginPath();
      ctx.moveTo(cropX, cropY + cornerSize);
      ctx.lineTo(cropX, cropY);
      ctx.lineTo(cropX + cornerSize, cropY);
      ctx.stroke();
      
      // Top right
      ctx.beginPath();
      ctx.moveTo(cropX + cropW - cornerSize, cropY);
      ctx.lineTo(cropX + cropW, cropY);
      ctx.lineTo(cropX + cropW, cropY + cornerSize);
      ctx.stroke();
      
      // Bottom left
      ctx.beginPath();
      ctx.moveTo(cropX, cropY + cropH - cornerSize);
      ctx.lineTo(cropX, cropY + cropH);
      ctx.lineTo(cropX + cornerSize, cropY + cropH);
      ctx.stroke();
      
      // Bottom right
      ctx.beginPath();
      ctx.moveTo(cropX + cropW - cornerSize, cropY + cropH);
      ctx.lineTo(cropX + cropW, cropY + cropH);
      ctx.lineTo(cropX + cropW, cropY + cropH - cornerSize);
      ctx.stroke();
    }
    
    // Store reference to the image drawing parameters
    imageRef.current = {
      x: offsetX,
      y: offsetY,
      width: drawWidth,
      height: drawHeight,
      imageWidth: image.width,
      imageHeight: image.height,
      rotation: rotation,
      containerWidth: containerWidth,
      containerHeight: containerHeight
    };
  };
  
  // Effect to draw canvas when dependencies change
  useEffect(() => {
    if (image) {
      drawCanvas();
    }
  }, [image, crop, scale, rotation, isMobile, showGrid, showBackground]);

  // Handle mouse/touch events for dragging
  const handlePointerDown = (e) => {
    if (!imageRef.current) return;
    
    e.preventDefault(); // Prevent selection behavior
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    
    // Get current crop coordinates
    const img = imageRef.current;
    const radians = (img.rotation * Math.PI) / 180;
    const cosTheta = Math.cos(radians);
    const sinTheta = Math.sin(radians);
    
    const scaleX = img.width / img.imageWidth;
    const scaleY = img.height / img.imageHeight;
    
    // Calculate crop center
    const cropCenterX = crop.x + crop.width / 2;
    const cropCenterY = crop.y + crop.height / 2;
    
    // Transform to screen coordinates
    const transformedCenterX = img.containerWidth / 2 + ((cropCenterX * scaleX) - (img.imageWidth * scaleX / 2)) * cosTheta - 
                               ((cropCenterY * scaleY) - (img.imageHeight * scaleY / 2)) * sinTheta;
    const transformedCenterY = img.containerHeight / 2 + ((cropCenterX * scaleX) - (img.imageWidth * scaleX / 2)) * sinTheta + 
                               ((cropCenterY * scaleY) - (img.imageHeight * scaleY / 2)) * cosTheta;
    
    // Calculate crop rectangle corners
    const cropX = transformedCenterX - (crop.width * scaleX) / 2;
    const cropY = transformedCenterY - (crop.height * scaleY) / 2;
    const cropW = crop.width * scaleX;
    const cropH = crop.height * scaleY;
    
    // Check if click is within crop area
    if (x >= cropX && x <= cropX + cropW && y >= cropY && y <= cropY + cropH) {
      setIsDragging(true);
      setDragStart({ x, y });
    }
  };
  
  const handlePointerMove = (e) => {
    if (!isDragging || !imageRef.current) return;
    
    e.preventDefault();
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
    
    const deltaX = x - dragStart.x;
    const deltaY = y - dragStart.y;
    
    const img = imageRef.current;
    const scaleFactorX = img.imageWidth / img.width;
    const scaleFactorY = img.imageHeight / img.height;
    
    // Handle rotation in drag calculation
    const radians = (rotation * Math.PI) / 180;
    const rotatedDeltaX = deltaX * Math.cos(-radians) - deltaY * Math.sin(-radians);
    const rotatedDeltaY = deltaX * Math.sin(-radians) + deltaY * Math.cos(-radians);
    
    // Update crop position with rotation adjustment
    let newX = crop.x + rotatedDeltaX * scaleFactorX;
    let newY = crop.y + rotatedDeltaY * scaleFactorY;
    
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
  
  const handlePointerUp = (e) => {
    e.preventDefault();
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
  
  // Handle rotation
  const handleRotate = (direction) => {
    const newRotation = (rotation + direction * 90) % 360;
    setRotation(newRotation);
  };
  
  // Handle help toggle
  const toggleHelp = () => {
    setHelpOpen(!helpOpen);
  };
  
  // Handle save/crop
  const handleCrop = async () => {
    if (!image || !crop) return;
    
    try {
      // Create a new canvas for the cropped image
      const canvas = document.createElement('canvas');
      
      // For correct rotation, set canvas size based on rotation
      const isRotated90or270 = Math.abs(rotation % 180) === 90;
      canvas.width = isRotated90or270 ? crop.height : crop.width;
      canvas.height = isRotated90or270 ? crop.width : crop.height;
      
      const ctx = canvas.getContext('2d');
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Apply rotation transformation
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      
      // Draw the cropped portion
      ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        -crop.width / 2,
        -crop.height / 2,
        crop.width,
        crop.height
      );
      
      // Restore context
      ctx.restore();
      
      // Convert to data URL and pass to onSave
      const dataUrl = canvas.toDataURL('image/jpeg');
      onSave(dataUrl);
      
      // Close dialog
      onClose();
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          bgcolor: theme.palette.primary.main,
          color: 'white'
        }}
      >
        <Box display="flex" alignItems="center">
          <CropIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Sesuaikan Foto Profil</Typography>
        </Box>
        <Box>
          <Tooltip title="Bantuan">
            <IconButton onClick={toggleHelp} size="small" sx={{ color: 'white', mr: 1 }}>
              <HelpIcon />
            </IconButton>
          </Tooltip>
          <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0 }}>
        {/* Help overlay */}
        {helpOpen && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 10,
              bgcolor: 'rgba(0,0,0,0.85)',
              color: 'white',
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center'
            }}
            onClick={toggleHelp}
          >
            <Typography variant="h6" gutterBottom>Bantuan Pemotongan Gambar</Typography>
            <Grid container spacing={2} sx={{ maxWidth: 500 }}>
              <Grid item xs={6}>
                <Box sx={{ mb: 2 }}>
                  <ZoomInIcon sx={{ mr: 1 }} />
                  <Typography variant="body2">Gunakan slider zoom untuk memperbesar atau memperkecil gambar</Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ mb: 2 }}>
                  <RotateRightIcon sx={{ mr: 1 }} />
                  <Typography variant="body2">Gunakan tombol rotasi untuk memutar gambar</Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <Box sx={{ border: '1px dashed white', width: 50, height: 50, display: 'flex', justifyContent: 'center', alignItems: 'center', mr: 1 }}>
                    <span style={{ fontSize: 20 }}>↔</span>
                  </Box>
                  <Typography variant="body2">Klik dan seret area pemotongan untuk menyesuaikan posisi</Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2">
                  Tombol "Tampilkan Grid" membantu Anda menyesuaikan posisi objek menggunakan aturan sepertiga
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2">
                  Tombol "Tampilkan Latar" mengatur visibilitas area di luar seleksi untuk fokus pada bidang pemotongan
                </Typography>
              </Grid>
            </Grid>
            <Typography variant="body2" sx={{ mt: 3, opacity: 0.7 }}>
              Klik di mana saja untuk menutup bantuan
            </Typography>
          </Box>
        )}
        
        {/* Main canvas area */}
        <Box 
          ref={containerRef}
          sx={{ 
            position: 'relative',
            height: isMobile ? 300 : 400,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            overflow: 'hidden',
            backgroundColor: '#1e1e1e',
            touchAction: 'none' // Prevent browser handling of touch events
          }}
        >
          <canvas
            ref={canvasRef}
            style={{ 
              cursor: isDragging ? 'grabbing' : 'grab',
              width: '100%',
              height: '100%',
              touchAction: 'none'
            }}
            onMouseDown={handlePointerDown}
            onMouseMove={handlePointerMove}
            onMouseUp={handlePointerUp}
            onMouseLeave={handlePointerUp}
            onTouchStart={handlePointerDown}
            onTouchMove={handlePointerMove}
            onTouchEnd={handlePointerUp}
          />
          
          {loading && (
            <Box 
              sx={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.5)'
              }}
            >
              <CircularProgress color="primary" />
            </Box>
          )}
        </Box>
        
        {/* Controls */}
        <Box sx={{ p: 3, bgcolor: '#f5f5f5' }}>
          {/* Zoom controls */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight="medium" gutterBottom>
              Zoom
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Tooltip title="Perkecil">
                <IconButton size="small" onClick={() => setScale(Math.max(0.5, scale - 0.1))}>
                  <ZoomOutIcon />
                </IconButton>
              </Tooltip>
              <Slider
                value={scale}
                onChange={handleZoom}
                min={0.5}
                max={3}
                step={0.1}
                sx={{ mx: 2, flexGrow: 1 }}
                aria-label="Zoom"
              />
              <Tooltip title="Perbesar">
                <IconButton size="small" onClick={() => setScale(Math.min(3, scale + 0.1))}>
                  <ZoomInIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          
          {/* Rotation controls */}
          <Box>
            <Typography variant="body2" fontWeight="medium" gutterBottom>
              Rotasi
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Tooltip title="Putar ke kiri">
                <IconButton onClick={() => handleRotate(-1)} color="primary" sx={{ border: `1px solid ${theme.palette.primary.main}` }}>
                  <RotateLeftIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Putar ke kanan">
                <IconButton onClick={() => handleRotate(1)} color="primary" sx={{ border: `1px solid ${theme.palette.primary.main}` }}>
                  <RotateRightIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          
          {/* Grid toggle */}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button 
              size="small"
              onClick={() => setShowGrid(!showGrid)}
              variant={showGrid ? "contained" : "outlined"}
              color="secondary"
              sx={{ px: 2, py: 0.5 }}
            >
              {showGrid ? 'Sembunyikan Grid' : 'Tampilkan Grid'}
            </Button>
            
            <Button 
              size="small"
              onClick={() => setShowBackground(!showBackground)}
              variant={showBackground ? "contained" : "outlined"}
              color="info"
              sx={{ px: 2, py: 0.5 }}
            >
              {showBackground ? 'Sembunyikan Latar' : 'Tampilkan Latar'}
            </Button>
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Button 
          onClick={onClose} 
          color="inherit"
          variant="outlined"
        >
          Batal
        </Button>
        <Button
          onClick={handleCrop}
          variant="contained"
          color="primary"
          startIcon={<CropIcon />}
          disabled={!image || loading}
        >
          Terapkan
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SimpleImageCrop; 
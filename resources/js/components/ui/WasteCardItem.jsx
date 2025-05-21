import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Chip, IconButton, Tooltip, Grid, Typography, useTheme } from '@mui/material';
import { 
  BookmarkBorder as BookmarkIcon, 
  Bookmark as BookmarkedIcon,
  PriceChange as PriceIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import PropTypes from 'prop-types';
import Card from '../common/Card';

const WasteCardItem = ({
  id,
  name,
  description,
  imageUrl,
  category,
  categoryId,
  priceRange,
  unit = 'kg',
  isRecyclable = true,
  isReusable = false,
  isFavorite = false,
  onToggleFavorite,
  sx = {}
}) => {
  const navigate = useNavigate();
  const theme = useTheme();

  // Format range harga
  const formatPrice = (min, max) => {
    if (min === max) {
      return `Rp ${min.toLocaleString('id-ID')}/${unit}`;
    }
    return `Rp ${min.toLocaleString('id-ID')} - ${max.toLocaleString('id-ID')}/${unit}`;
  };

  // Actions untuk card
  const cardActions = (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* PriceIcon removed as per user request */}
          <Typography variant="overline" fontWeight={600} color="success.main">
            {formatPrice(priceRange.min, priceRange.max)}
          </Typography>
        </Box>
      </Grid>
      <Grid item>
        <Tooltip title={isFavorite ? 'Hapus dari Favorit' : 'Simpan ke Favorit'}>
          <IconButton 
            size="small" 
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite && onToggleFavorite(id);
            }}
          >
            {isFavorite ? <BookmarkedIcon color="primary" /> : <BookmarkIcon />}
          </IconButton>
        </Tooltip>
      </Grid>
    </Grid>
  );

  return (
    <Card
      title={name}
      description={description}
      image={imageUrl}
      imageAlt={`Sampah ${name}`}
      imageHeight={180}
      actions={cardActions}
      onClick={() => navigate(`/katalog/${id}`)}
      sx={sx}
    >
      <Box sx={{ mt: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <CategoryIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
          <Typography variant="body2" color="text.secondary">
            Kategori: {category}
          </Typography>
        </Box>
        
        <Grid container spacing={1}>
          {isRecyclable && (
            <Grid item>
              <Chip
                size="small"
                label="Dapat didaur ulang"
                color="primary"
                variant="outlined"
              />
            </Grid>
          )}
          {isReusable && (
            <Grid item>
              <Chip
                size="small"
                label="Dapat digunakan kembali"
                color="secondary"
                variant="outlined"
              />
            </Grid>
          )}
        </Grid>
      </Box>
    </Card>
  );
};

WasteCardItem.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  categoryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  priceRange: PropTypes.shape({
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired
  }).isRequired,
  unit: PropTypes.string,
  isRecyclable: PropTypes.bool,
  isReusable: PropTypes.bool,
  isFavorite: PropTypes.bool,
  onToggleFavorite: PropTypes.func,
  sx: PropTypes.object
};

export default WasteCardItem;

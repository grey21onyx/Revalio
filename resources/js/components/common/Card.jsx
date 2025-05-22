import React from 'react';
import {
  Card as MuiCard,
  CardContent,
  CardActions,
  CardMedia,
  Typography,
  Box,
  useTheme,
} from '@mui/material';
import PropTypes from 'prop-types';

const Card = ({
  title,
  subtitle,
  description,
  image,
  imageAlt,
  imageHeight = 140,
  children,
  actions,
  elevation = 1,
  sx = {},
  descriptionSx = {},
  onClick,
  hoverEffect = true,
  headerContent,
  ...props
}) => {
  const theme = useTheme();

  // Custom styling dengan hover effect yang lebih halus
  const customSx = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    borderRadius: '12px',
    overflow: 'hidden',
    cursor: onClick ? 'pointer' : 'default',
    boxShadow: elevation === 0 
      ? 'none' 
      : '0 2px 8px rgba(0,0,0,0.06)',
    border: '1px solid',
    borderColor: 'grey.100',
    ...(hoverEffect && {
      '&:hover': {
        transform: 'translateY(-6px)',
        boxShadow: '0 8px 16px rgba(0,0,0,0.08)',
      },
    }),
    ...sx,
  };

  return (
    <MuiCard 
      elevation={0} // Menggunakan custom shadow dari sx
      sx={customSx} 
      onClick={onClick}
      {...props}
    >
      {/* Image Section */}
      {image && (
        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
          <CardMedia
            component="img"
            height={imageHeight}
            image={image}
            alt={imageAlt || title}
            sx={{ 
              transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: hoverEffect ? 'scale(1.05)' : 'none',
              }
            }}
          />
        </Box>
      )}

      {/* Header Content (optional) */}
      {headerContent && (
        <Box sx={{ p: 2, bgcolor: theme.palette.primary.main, color: 'white' }}>
          {headerContent}
        </Box>
      )}

      {/* Main Content */}
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        {title && (
          <Typography 
            variant="h6" 
            component="div" 
            gutterBottom 
            sx={{ 
              fontWeight: 600,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {title}
          </Typography>
        )}
        
        {subtitle && (
          <Typography 
            variant="subtitle2" 
            color="text.secondary" 
            gutterBottom
            sx={{ mb: 1 }}
          >
            {subtitle}
          </Typography>
        )}
        
        {description && (
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              ...descriptionSx,
            }}
          >
            {description}
          </Typography>
        )}
        
        {children}
      </CardContent>

      {/* Actions Section (optional) */}
      {actions && (
        <CardActions sx={{ p: 3, pt: 0 }}>
          {actions}
        </CardActions>
      )}
    </MuiCard>
  );
};

Card.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  imageAlt: PropTypes.string,
  imageHeight: PropTypes.number,
  children: PropTypes.node,
  actions: PropTypes.node,
  elevation: PropTypes.number,
  sx: PropTypes.object,
  descriptionSx: PropTypes.object,
  onClick: PropTypes.func,
  hoverEffect: PropTypes.bool,
  headerContent: PropTypes.node,
};

export default Card;

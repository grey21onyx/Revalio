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
  elevation = 2,
  sx = {},
  onClick,
  hoverEffect = true,
  headerContent,
  ...props
}) => {
  const theme = useTheme();

  // Custom styling dengan hover effect
  const customSx = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s, box-shadow 0.2s',
    borderRadius: '8px',
    overflow: 'hidden',
    cursor: onClick ? 'pointer' : 'default',
    ...(hoverEffect && {
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows[elevation + 2],
      },
    }),
    ...sx,
  };

  return (
    <MuiCard 
      elevation={elevation} 
      sx={customSx} 
      onClick={onClick}
      {...props}
    >
      {/* Image Section */}
      {image && (
        <CardMedia
          component="img"
          height={imageHeight}
          image={image}
          alt={imageAlt || title}
        />
      )}

      {/* Header Content (optional) */}
      {headerContent && (
        <Box sx={{ p: 2, bgcolor: theme.palette.primary.main, color: 'white' }}>
          {headerContent}
        </Box>
      )}

      {/* Main Content */}
      <CardContent sx={{ flexGrow: 1 }}>
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
            }}
          >
            {description}
          </Typography>
        )}
        
        {children}
      </CardContent>

      {/* Actions Section (optional) */}
      {actions && (
        <CardActions sx={{ p: 2, pt: 0 }}>
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
  onClick: PropTypes.func,
  hoverEffect: PropTypes.bool,
  headerContent: PropTypes.node,
};

export default Card;

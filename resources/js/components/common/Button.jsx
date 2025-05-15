import React from 'react';
import { Button as MuiButton, CircularProgress, useTheme } from '@mui/material';
import PropTypes from 'prop-types';

const Button = ({
  children,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  fullWidth = false,
  startIcon,
  endIcon,
  loading = false,
  disabled = false,
  onClick,
  sx = {},
  type = 'button',
  ...props
}) => {
  const theme = useTheme();

  // Styling tambahan berdasarkan variant
  const getCustomStyling = () => {
    const baseStyle = {
      borderRadius: '8px',
      fontWeight: 500,
      textTransform: 'none',
      boxShadow: variant === 'contained' ? theme.shadows[2] : 'none',
      position: 'relative',
    };

    if (variant === 'contained') {
      return {
        ...baseStyle,
        '&:hover': {
          boxShadow: theme.shadows[4],
        },
      };
    }

    if (variant === 'outlined') {
      return {
        ...baseStyle,
        borderWidth: '2px',
        '&:hover': {
          borderWidth: '2px',
        },
      };
    }

    return baseStyle;
  };

  return (
    <MuiButton
      variant={variant}
      color={color}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      onClick={onClick}
      startIcon={loading ? null : startIcon}
      endIcon={loading ? null : endIcon}
      type={type}
      sx={{
        ...getCustomStyling(),
        ...sx,
      }}
      {...props}
    >
      {loading && (
        <CircularProgress
          size={24}
          sx={{
            position: 'absolute',
            left: '50%',
            marginLeft: '-12px',
          }}
        />
      )}
      <span style={{ visibility: loading ? 'hidden' : 'visible' }}>
        {children}
      </span>
    </MuiButton>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['contained', 'outlined', 'text']),
  color: PropTypes.oneOf([
    'primary',
    'secondary',
    'success',
    'error',
    'info',
    'warning',
  ]),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  fullWidth: PropTypes.bool,
  startIcon: PropTypes.node,
  endIcon: PropTypes.node,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  sx: PropTypes.object,
  type: PropTypes.string,
};

export default Button;

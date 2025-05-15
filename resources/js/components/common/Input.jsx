import React, { forwardRef } from 'react';
import {
  TextField,
  InputAdornment,
  FormControl,
  FormHelperText,
  useTheme,
} from '@mui/material';
import PropTypes from 'prop-types';

const Input = forwardRef(({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  type = 'text',
  multiline = false,
  rows = 4,
  fullWidth = true,
  required = false,
  disabled = false,
  placeholder,
  startIcon,
  endIcon,
  sx = {},
  variant = 'outlined',
  size = 'medium',
  ...props
}, ref) => {
  const theme = useTheme();

  const customSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      '&.Mui-focused': {
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.primary.main,
          borderWidth: '2px',
        },
      },
    },
    '& .MuiInputLabel-root': {
      '&.Mui-focused': {
        color: theme.palette.primary.main,
      },
    },
    ...sx,
  };

  return (
    <FormControl fullWidth={fullWidth} error={!!error} sx={{ mb: 2 }}>
      <TextField
        id={id}
        name={name}
        label={label}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        error={!!error}
        type={type}
        multiline={multiline}
        rows={multiline ? rows : undefined}
        fullWidth={fullWidth}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        variant={variant}
        size={size}
        inputRef={ref}
        InputProps={{
          startAdornment: startIcon ? (
            <InputAdornment position="start">{startIcon}</InputAdornment>
          ) : null,
          endAdornment: endIcon ? (
            <InputAdornment position="end">{endIcon}</InputAdornment>
          ) : null,
        }}
        sx={customSx}
        {...props}
      />
      {helperText && (
        <FormHelperText>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  helperText: PropTypes.string,
  type: PropTypes.string,
  multiline: PropTypes.bool,
  rows: PropTypes.number,
  fullWidth: PropTypes.bool,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  startIcon: PropTypes.node,
  endIcon: PropTypes.node,
  sx: PropTypes.object,
  variant: PropTypes.oneOf(['outlined', 'filled', 'standard']),
  size: PropTypes.oneOf(['small', 'medium']),
};

export default Input;

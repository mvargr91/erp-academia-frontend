import React from 'react';
import TextField from '@mui/material/TextField';
import { useField } from 'formik';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

// Definir un estilo personalizado para el input usando styled
const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-input': {
    border: 'none',
    borderRadius: 0,
    '&:focus': {
    },
  },
  '& .MuiInput-root': {
    '&:before': {
      borderBottom: '1px solid #ccc',
    },
    '&:after': {
      borderBottom: '1px solid #ccc', 
    },
    '&.Mui-disabled:before': {
      borderBottom: '1px solid #ddd !important', 
    },
  },
  '& .MuiInputBase-input.Mui-disabled': {
    WebkitTextFillColor: theme.palette.text.disabled,
  },
}));


const MyTextField = (props) => {
  const [field, meta] = useField(props);
  const { onBlur } = props;
  const errorText = meta.error && meta.touched ? meta.error : '';

  return (
    <StyledTextField
      variant='standard'
      {...props}
      {...field}
      helperText={errorText}
      error={!!errorText}
      onBlur={onBlur}
    />
  );
};

MyTextField.propTypes = {
  onBlur: PropTypes.func, 
  value: PropTypes.string, 
  labelText: PropTypes.string,
};

export default MyTextField;

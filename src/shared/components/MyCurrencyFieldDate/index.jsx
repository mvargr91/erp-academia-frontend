import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import { useField, useFormikContext } from 'formik';
import { styled } from '@mui/material/styles';

// Estilos personalizados para el TextField
const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-input': {
    border: 'none',
    borderBottom: '1px solid #000',
    borderRadius: 0,
    '&:focus': {
      borderBottom: '1px solid #000',
    },
  },
  '& .MuiInput-root': {
    '&:before': {
      borderBottom: '1px solid #ccc',
    },
    '&:after': {
      borderBottom: '1px solid #000',
    },
    '&.Mui-disabled:before': {
      borderBottom: '1px solid #ddd !important',
    },
  },
  '& .MuiInputBase-input.Mui-disabled': {
    WebkitTextFillColor: theme.palette.text.disabled,
  },
}));

const MyCurrencyFieldDate = ({ name, ...props }) => {
  if (!name || typeof name !== 'string') {
    console.warn('MyCurrencyFieldDate: "name" prop is missing or invalid');
    return null;
  }

  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext();
  const [localValue, setLocalValue] = useState(field.value || '');

  useEffect(() => {
    setLocalValue(field.value || '');
  }, [field.value]);

  const errorText = meta.error && meta.touched ? meta.error : '';

  const handleChange = (e) => {
    let value = e.target.value;

    if (/^\d{0,2}$/.test(value)) {
      if (value.length === 1) {
        value = value.padStart(2, '0');
      }

      if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 12)) {
        setLocalValue(value);
        setFieldValue(name, value);
      }
    }
  };

  return (
    <StyledTextField
      {...props}
      value={localValue}
      onChange={handleChange}
      helperText={errorText}
      error={!!errorText}
      variant="standard"
      inputProps={{ maxLength: 2 }}
    />
  );
};

export default MyCurrencyFieldDate;

import React from 'react';
import TextField from '@mui/material/TextField';
import { useField } from 'formik';
import { NumericFormat } from 'react-number-format';
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


// Componente personalizado para el formato numérico
const NumberFormatCustom = React.forwardRef(function NumberFormatCustom(props, ref) {
  const { onChange, maxDigits, ...other } = props;

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        if (values.value.length <= maxDigits) {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }
      }}
      isAllowed={(values) => values.value.length <= maxDigits}
      allowNegative={false} 
      decimalScale={0} 
      isNumericString
    />
  );
});

// Componente para el campo de moneda personalizado
const MyCurrencyField = ({ maxDigits = 10, ...props }) => {
  const [field, meta] = useField(props);
  const errorText = meta.error && meta.touched ? meta.error : '';

  return (
    <StyledTextField
      {...props}
      {...field}
      InputProps={{
        inputComponent: NumberFormatCustom,
        inputProps: { maxDigits },
      }}
      helperText={errorText}
      error={!!errorText}
      variant="standard"
    />
  );
};

export default MyCurrencyField;

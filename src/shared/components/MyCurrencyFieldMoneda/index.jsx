import React from 'react';
import TextField from '@mui/material/TextField';
import { useField, useFormikContext } from 'formik';
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
  const { onChange, ...other } = props;

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator='.'
      decimalScale={2}
      decimalSeparator=","
      fixedDecimalScale
      isNumericString
      prefix={'$ '}
      suffix={''}
    />
  );
});

// Componente para el campo de moneda personalizado
const MyCurrencyFieldMoneda = (props) => {
  const [field, meta] = useField(props);
  const { setFieldValue } = useFormikContext();
  const errorText = meta.error && meta.touched ? meta.error : '';

  const handleChange = (event) => {
    setFieldValue(props.name, event.target.value);
    if (props.onChange) {
      props.onChange(event);
    }
  };

  return (
    <StyledTextField
      {...props}
      {...field}
      onChange={handleChange}
      // InputLabelProps={{
      //   shrink: true,
      // }}
      InputProps={{
        inputComponent: NumberFormatCustom,
      }}
      helperText={errorText}
      error={!!errorText}
      variant="standard"
    />
  );
};

export default MyCurrencyFieldMoneda;

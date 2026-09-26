// shared/components/MyCurrencyFieldPotencia.jsx
import React from 'react';
import TextField from '@mui/material/TextField';
import { useField } from 'formik';
import { NumericFormat } from 'react-number-format';
import { styled } from '@mui/material/styles';

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-input': {
    border: 'none',
    borderBottom: '1px solid #000',
    borderRadius: 0,
    '&:focus': { borderBottom: '1px solid #000' },
  },
  '& .MuiInput-root': {
    '&:before': { borderBottom: '1px solid #ccc' },
    '&:after': { borderBottom: '1px solid #000' },
    '&.Mui-disabled:before': { borderBottom: '1px solid #ddd !important' },
  },
  '& .MuiInputBase-input.Mui-disabled': {
    WebkitTextFillColor: theme.palette.text.disabled,
  },
}));

const MyCurrencyFieldPotenciaConcepto = ({ name, onBlur, ...props }) => {
  const [field, meta, helpers] = useField(name);
  const { value } = field;
  const { setValue, setTouched } = helpers;

  const errorText = meta.touched && meta.error ? meta.error : '';

  return (
    <NumericFormat
      customInput={StyledTextField}
      name={name}
      value={value ?? ''}
      thousandSeparator='.'
      decimalSeparator=','
      decimalScale={2}
      fixedDecimalScale={true}  
      allowNegative={false}
      isNumericString
      allowLeadingZeros={false}
      onValueChange={(values) => {
        const raw = values.value;
        setValue(raw === '' ? '' : raw);
      }}

      onBlur={(e) => {
        setTouched(true);
        if (onBlur) onBlur(e);
      }}

      InputLabelProps={{ shrink: true }}
      helperText={errorText}
      error={!!errorText}

      variant={props.variant ?? 'standard'}
      fullWidth={props.fullWidth ?? true}
      margin={props.margin ?? 'none'}
      {...props}
    />
  );
};

export default MyCurrencyFieldPotenciaConcepto;

// shared/components/MyCurrencyFieldConceptos.jsx
import React from 'react';
import TextField from '@mui/material/TextField';
import { useField } from 'formik';
import { NumericFormat } from 'react-number-format';

const MyCurrencyFieldConcepto = ({ name, onBlur, ...props }) => {
  const [field, meta, helpers] = useField(name);
  const { value } = field;
  const { setValue, setTouched } = helpers;

  return (
    <NumericFormat
      customInput={TextField}
      value={value ?? ''}
      thousandSeparator='.'
      decimalSeparator=','
      prefix='$ '
      allowNegative={true}
      decimalScale={2}
      fixedDecimalScale={true}  
      onValueChange={(values) => {
        const { value } = values;
        setValue(value === '' ? '' : Number(value));
      }}
      onBlur={(e) => {
        setTouched(true);
        if (onBlur) onBlur(e); 
      }}
      variant={props.variant ?? 'standard'}
      fullWidth={props.fullWidth ?? true}
      margin={props.margin ?? 'none'}
      {...props}
      name={name}
      error={Boolean(meta.touched && meta.error)}
      helperText={meta.touched && meta.error ? meta.error : ''}
      InputProps={{
        ...props.InputProps,
      }}
      inputProps={{
        ...props.inputProps,
        style: {
          textAlign: 'right',
          ...(props.inputProps?.style || {}),
        },
      }}
    />
  );
};

export default MyCurrencyFieldConcepto;

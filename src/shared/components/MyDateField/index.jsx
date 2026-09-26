import React from 'react';
import { useField, useFormikContext } from 'formik';
import TextField from '@mui/material/TextField';

const MyDateField = ({ label, name, ...props }) => {
  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext();

  return (
    <TextField
      {...field}
      {...props}
      type="date"
      label={label}
      name={name}
      fullWidth
      value={field.value || ''}
      onChange={(e) => setFieldValue(name, e.target.value)}
      error={meta.touched && Boolean(meta.error)}
      helperText={meta.touched && meta.error}
      InputLabelProps={{ shrink: true }}
    />
  );
};

export default MyDateField;

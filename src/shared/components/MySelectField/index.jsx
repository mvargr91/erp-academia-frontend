import React from 'react';
import { useField } from 'formik';
import { TextField, MenuItem } from '@mui/material'

const MySelectField = (props) => {
  const [field, meta] = useField(props);
  const errorText = meta.error && meta.touched ? meta.error : '';
  return (
    <TextField
      {...props}
      {...field}
      helperText={errorText}
      error={!!errorText}
      select
    >
      {props.ninguno && 
        <MenuItem value=''>
          <em>Ninguno(a)</em>
        </MenuItem>
      }
      {props.options.map((option, index) => {
        return (
          <MenuItem key={index} value={option.id}>
            {option.nombre}
          </MenuItem>
        )
      })}
    </TextField>
  );
}

export default MySelectField;
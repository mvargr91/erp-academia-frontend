import React from 'react';
import {useField} from 'formik';
import {Checkbox, FormControl, FormControlLabel, FormHelperText} from '@mui/material';

const MyCheckField = (props) => {
  const {
    label,
    checked,
    name,
    handleCheck
  } = props;
  const [meta] = useField(props);
  const errorText = meta.error && meta.touched ? meta.error : '';
  return (
    <FormControl component='fieldset'>
      <FormControlLabel
        control={<Checkbox color='primary' checked={checked} name={name} onChange={(e) => handleCheck(e)}/>}
        label={label}
        labelPlacement='end'
        disabled={props.disabled}
      />
      <FormHelperText>{errorText}</FormHelperText>
    </FormControl>
  );
};

export default MyCheckField;
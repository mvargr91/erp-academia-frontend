import React from 'react';
import { useField } from 'formik';
import {
  FormControl,
  FormControlLabel,
  Checkbox,
  FormHelperText,
  FormLabel,
} from '@mui/material';
import PropTypes from 'prop-types';

const MyCheckboxField = (props) => {
  const [field, meta, helpers] = useField(props);
  const errorText = meta.error && meta.touched ? meta.error : '';

  const handleChange = (event) => {
    const { value, checked } = event.target;
    const newValue = checked
      ? [...(field.value || []), value]
      : (field.value || []).filter((item) => item !== value);
    helpers.setValue(newValue);
  };

  return (
    <FormControl component="fieldset" error={!!errorText}>
      <FormLabel>{props.label}</FormLabel>
      <div>
        {props.options.map((option) => (
          <FormControlLabel
            key={option.value}
            control={
              <Checkbox
                color="primary"
                checked={(field.value || []).includes(option.value)}
                onChange={handleChange}
                value={option.value}
                disabled={props.disabled}
              />
            }
            label={option.label}
          />
        ))}
      </div>
      <FormHelperText>{errorText}</FormHelperText>
    </FormControl>
  );
};

MyCheckboxField.propTypes = {
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  disabled: PropTypes.bool,
};

export default MyCheckboxField;

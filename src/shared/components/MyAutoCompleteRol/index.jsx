import { useField } from 'formik';
import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const MyAutocomplete = (props) => {
  const [field, meta, form] = useField(props);
  const [inputValue, setInputValue] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const errorText = meta.error && meta.touched ? meta.error : '';

  useEffect(() => {
    if (field.value !== '') {
      const option = props.options?.find(option => option.id === field.value);
      if (option) {
        setInputValue(option.nombre);
        setSelectedOption(option);
      }
    }
  }, [field.value, props.options]);

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
  };

  const handleChange = (event, newValue) => {
    setSelectedOption(newValue);
    form.setValue(newValue ? newValue.id : '');
    if (typeof props.onChange === 'function') {
      props.onChange(newValue);
    }
  };

  return (
    <Autocomplete
      selectOnFocus={false}
      openOnFocus
      {...props}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      value={selectedOption}
      getOptionLabel={(option) => option?.nombre || ''}
      options={(props.options || []).filter(option => 
        option.nombre.toLowerCase().includes(inputValue.toLowerCase())
      )}
      renderInput={(params) => (
        <TextField
          variant="standard"
          {...params}
          {...field}
          name={props.name}
          className={props.className}
          style={{
            ...props.style,
            color: props.textColor || 'inherit', // Aplica el color de texto si se proporciona, o usa el color por defecto
          }}
          label={props.label}
          required={props.required}
          helperText={errorText}
          error={!!errorText}
        />
      )}
    />
  );
};

export default MyAutocomplete;

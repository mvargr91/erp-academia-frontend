import { useField } from 'formik';
import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { styled, useTheme } from '@mui/material/styles';

// Estiliza el Autocomplete para cambiar el color del icono de selección según el estado `disabled`
const getStyledAutocomplete = (disabled, theme) =>
  styled(Autocomplete)(() => ({
    '& .MuiAutocomplete-popupIndicator': {
      color: disabled ? 'rgba(0, 0, 0, 0)' : theme.palette.primary.main,
    },
    '& .MuiAutocomplete-clearIndicator': {
      color: disabled ? theme.palette.text.disabled : theme.palette.primary.main,
    },
    '& .MuiInput-root:before': {
      borderBottom: `1px solid ${disabled ? theme.palette.text.disabled : theme.palette.primary.main}`,
    },
    '& .MuiInput-root:after': {
      borderBottom: `2px solid ${disabled ? theme.palette.text.disabled : theme.palette.primary.main}`,
    },
    '& input.Mui-disabled': {
      WebkitTextFillColor: theme.palette.text.disabled,
    },
  }));


const MyAutoCompleteProyecto = (props) => {
  const [field, meta, form] = useField(props);
  const [inputValue, setInputValue] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const errorText = meta.error && meta.touched ? meta.error : '';
  const theme = useTheme();
  const StyledAutocomplete = getStyledAutocomplete(props.disabled, theme);

  useEffect(() => {
    if (field.value !== '') {
      const option = props.options?.find((option) => option.id === field.value);
      if (option) {
        setInputValue(option.codigo_proyecto);
        setSelectedOption(option);
      }
    } else {
      setInputValue('');
      setSelectedOption(null);
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
    <StyledAutocomplete
      selectOnFocus={false}
      openOnFocus
      {...props}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      value={selectedOption}
      getOptionLabel={(option) => option?.codigo_proyecto || ''}
      options={(props.options || []).filter((option) =>
        option.codigo_proyecto.toLowerCase().includes(inputValue.toLowerCase())
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          {...field}
          name={props.name}
          className={props.className}
          style={{
            ...props.style,
            color: props.textColor || 'inherit',
          }}
          label={props.label}
          required={props.required}
          helperText={errorText}
          error={!!errorText}
          variant="standard"
        />
      )}
    />
  );
};

export default MyAutoCompleteProyecto;

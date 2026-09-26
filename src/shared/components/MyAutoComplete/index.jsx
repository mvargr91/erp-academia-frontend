import { useField } from 'formik';
import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { styled, useTheme } from '@mui/material/styles';

const getStyledAutocomplete = (disabled, theme) =>
  styled(Autocomplete)(() => ({
    '& .MuiInput-underline:before': {
      borderBottomColor: theme.palette.text.primary,
    },
    '& .MuiAutocomplete-popupIndicator': {
      color: disabled ? 'rgba(0, 0, 0, 0)' : theme.palette.text.primary,
    },
    '& .MuiAutocomplete-clearIndicator': {
      color: disabled ? theme.palette.text.disabled : theme.palette.text.primary,
    },
    '& .MuiInput-root:before': {
      borderBottom: `1px solid ${disabled ? theme.palette.text.disabled : '#ccc'}`,
    },
    '& .MuiInput-root:after': {
      borderBottom: `2px solid ${disabled ? theme.palette.text.disabled : theme.palette.text.primary}`,
    },
    '& input.Mui-disabled': {
      WebkitTextFillColor: theme.palette.text.disabled,
    },
  }));

const MyAutocomplete = (props) => {
  const [field, meta, helpers] = useField(props.name);
  const [inputValue, setInputValue] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const theme = useTheme();
  const errorText = meta.touched && meta.error ? meta.error : '';
  const StyledAutocomplete = getStyledAutocomplete(props.disabled, theme);

  // Actualiza input y opción seleccionada cuando cambia el valor
  useEffect(() => {
    const matched = props.options?.find((opt) => String(opt.id) === String(field.value));

    if (matched) {
      setSelectedOption(matched);
      setInputValue(matched.nombre);
    } else if (typeof field.value === 'string') {
      setSelectedOption(null);
      setInputValue(field.value);
    } else {
      setSelectedOption(null);
      setInputValue('');
    }
  }, [field.value, props.options]);

  const handleChange = (_, newValue) => {
    if (typeof newValue === 'string') {
      setSelectedOption(null);
      setInputValue(newValue);
      helpers.setValue(newValue);
      if (props.onChange) props.onChange(newValue);
    } else if (newValue && typeof newValue === 'object') {
      setSelectedOption(newValue);
      setInputValue(newValue.nombre);
      helpers.setValue(newValue.id);
      if (props.onChange) props.onChange(newValue);
    } else {
      // Limpieza (click en X)
      setSelectedOption(null);
      setInputValue('');
      helpers.setValue('');
      if (props.onChange) props.onChange(null);
    }
  };

  const handleInputChange = (_, newInputValue, reason) => {
    if (reason === 'input') {
      setInputValue(newInputValue);
    } else if (reason === 'clear') {
      setInputValue('');
    }
    // No hacer nada en 'reset'
  };

  return (
    <StyledAutocomplete
      {...props}
      freeSolo
      disableClearable={false}
      autoHighlight
      openOnFocus
      value={selectedOption}
      inputValue={inputValue}
      onChange={handleChange}
      onInputChange={handleInputChange}
      options={props.options || []}
      getOptionLabel={(option) =>
        typeof option === 'string' ? option : option?.nombre || ''
      }
      isOptionEqualToValue={(option, value) =>
        String(option?.id) === String(value?.id)
      }
      renderInput={(params) => (
        <TextField
          {...params}
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

export default MyAutocomplete;

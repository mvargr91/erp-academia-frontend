// MUIAutocomplete.jsx
import React, { useState, forwardRef } from 'react';
import { Autocomplete, TextField, useTheme } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

const MUIAutocomplete = forwardRef(function MUIAutocomplete(
  { label = '', clearColor, textFieldProps = {}, ...autocompleteProps },
  ref,
) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');

  const hasSelection =
    autocompleteProps.value !== null &&
    autocompleteProps.value !== undefined &&
    autocompleteProps.value !== '';

  return (
    <Autocomplete
      {...autocompleteProps}
      ref={ref}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      inputValue={input}
      onInputChange={(_, v) => setInput(v)}
      clearIcon={
        <ClearIcon sx={{ color: clearColor || theme.palette.text.primary, fontSize: 16,  }} />
      }
      popupIcon={open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
      slotProps={{
        popupIndicator: {
          sx: {
            display: hasSelection ? 'none' : 'flex',
            p: 0.5,          
            mr: 0,
            opacity: 1,       
            color: theme.palette.text.primary , 
          },
        },
        clearIndicator: {
          sx: { p: 0.75, mr: 0 },
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          variant="standard"
           sx={{
            '& .MuiInput-underline:before': {
              borderBottomColor: autocompleteProps.disabled
                ? theme.palette.text.disabled
                : '#ccc',
            },
            '& .MuiInput-underline:hover:before': {
              borderBottomColor: autocompleteProps.primary
                ? theme.palette.text.primary
                : theme.palette.text.primary,
            },
            '& .MuiInput-underline:after': {
              borderBottomColor: autocompleteProps.disabled
                ? theme.palette.text.disabled
                : theme.palette.text.primary,
            },
            '& input.Mui-disabled': {
              WebkitTextFillColor: theme.palette.text.disabled,
            },
          }}
          {...textFieldProps}
        />
      )}
    />
  );
});

export default MUIAutocomplete;

import React from 'react';
import { useField } from 'formik';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ESTADOS_GUIAS_TRANSPORTE } from '../../constants/ListaValores';

const useStyles = makeStyles({
  select: {
    '& .MuiSelect-select': {
      color: (props) => `${props.textColor || 'inherit'} !important`, // Forzar el color del texto
    },
    '& .MuiSelect-icon': {
      color: (props) => `${props.textColor || 'inherit'} !important`, // Forzar el color del ícono (flecha)
    },
    '& .Mui-disabled': {
      color: (props) => `${props.textColor || 'inherit'} !important`, // Forzar el color cuando está deshabilitado
      '-webkit-text-fill-color': (props) => `${props.textColor || 'inherit'} !important`, // Asegurar compatibilidad
    },
  },
  formControl: {
    width: '100%',
  },
});

const MyCustomSelect = (props) => {
  const [field, meta] = useField(props);
  const errorText = meta.error && meta.touched ? meta.error : '';

  // Obtener el color basado en el valor seleccionado
  const selectedOption = ESTADOS_GUIAS_TRANSPORTE.find(option => option.id === field.value);
  const selectedColor = selectedOption ? selectedOption.color : 'inherit';

  const classes = useStyles({ textColor: selectedColor });

  return (
    <FormControl
      variant="standard"
      className={props.className}
      fullWidth
      error={!!errorText}
    >
      <InputLabel>{props.label}</InputLabel>
      <Select
        {...field}
        label={props.label}
        disabled={props.disabled}
        className={classes.select}
        inputProps={{
          style: {
            color: selectedColor,
          },
        }}
      >
        {ESTADOS_GUIAS_TRANSPORTE.map((option) => (
          <MenuItem key={option.id} value={option.id}>
            {option.nombre}
          </MenuItem>
        ))}
      </Select>
      {errorText && <FormHelperText>{errorText}</FormHelperText>}
    </FormControl>
  );
};

export default MyCustomSelect;

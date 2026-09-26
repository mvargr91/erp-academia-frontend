import * as React from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { parseISO, format } from 'date-fns';
import { useTheme } from '@mui/material/styles';

const adjustUTCDateToLocal = (date) => {
  if (!date) return null;

  if (typeof date === 'string') {
    const [year, month, day] = date.split('-'); // Extraer partes de la fecha
    return new Date(year, month - 1, day); // Crear fecha sin afectar la zona horaria
  }

  return date instanceof Date && !isNaN(date) ? date : null;
};

const BasicDatePicker = ({ label, value, onChange, variant, disabled}) => {
  const adjustedValue = adjustUTCDateToLocal(value);
  const theme = useTheme(); // Obtener el tema global

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        sx={{
          width: '100%',
          marginBottom: 1,
          height: '60px',
          paddingRight: '20px',
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: theme.palette.primary.main }, // Color del borde
            '&:hover fieldset': { borderColor: theme.palette.secondary.main }, // Borde al hacer hover
            '&.Mui-focused fieldset': { borderColor: theme.palette.primary.dark }, // Borde cuando está enfocado
          },
          '& .MuiInputLabel-root': {
            color: theme.palette.text.primary, // Color del label
            '&.Mui-focused': { color: theme.palette.primary.main }, // Color del label cuando está enfocado
          },
        }}
        label={label || 'Fecha'}
        value={adjustedValue}
        onChange={(newValue) => {
          if (newValue) {
            const formattedDate = format(newValue, 'yyyy-MM-dd'); // Convertir a string
            onChange(formattedDate); // Guardar en el estado
          } else {
            onChange(null);
          }
        }}     
        format="dd/MM/yyyy"          
        slotProps={{
          textField: {
            variant: 'standard',
            disabled: disabled,
            sx: {
              width: '100%',
              marginBottom: 1,
              color: theme.palette.text.primary, // Color del texto
              '& .MuiInput-underline:before': { borderBottomColor: theme.palette.primary.light }, // Color del underline antes del focus
              '& .MuiInput-underline:hover:before': { borderBottomColor: theme.palette.secondary.main }, // Hover en underline
              '& .MuiInput-underline:after': { borderBottomColor: theme.palette.primary.dark }, // Underline después del focus
            },
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default BasicDatePicker;
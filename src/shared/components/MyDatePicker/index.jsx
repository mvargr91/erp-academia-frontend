import React from 'react';
import { useField, useFormikContext } from 'formik';
import TextField from '@mui/material/TextField';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import { useTheme } from '@mui/material/styles';

const adjustUTCDateToLocal = (date) => {
  if (!date) return null;

  if (typeof date === 'string') {
    const [year, month, day] = date.split('-');
    return new Date(year, month - 1, day);
  }

  return date instanceof Date && !isNaN(date) ? date : null;
};

const MyDatePicker = ({ label, name, disabled, className }) => {
  const theme = useTheme();
  const [field, meta] = useField(name);
  const { setFieldValue, setTouched } = useFormikContext();

  const value = adjustUTCDateToLocal(field.value);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label={label}
        value={value}
        onChange={(newValue) => {
          if (newValue) {
            const formatted = format(newValue, 'yyyy-MM-dd');
            setFieldValue(name, formatted);
          } else {
            setFieldValue(name, null);
          }
          setTouched({ [name]: true });
        }}
        // format="yyyy-MM-dd"
        format="dd/MM/yyyy"
        slotProps={{
          textField: {
            name,
            className,
            variant: 'standard',
            disabled,
            error: Boolean(meta.touched && meta.error),
            helperText: meta.touched && meta.error,
            sx: {
              width: '100%',
              marginBottom: 1,
              '& .MuiInput-underline:before': {
                borderBottomColor: theme.palette.primary.light,
              },
              '& .MuiInput-underline:hover:before': {
                borderBottomColor: theme.palette.secondary.main,
              },
              '& .MuiInput-underline:after': {
                borderBottomColor: theme.palette.primary.dark,
              },
              '& .MuiSvgIcon-root': {
                color: '#ccccc', // tu color fijo aquí
              },
            },
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default MyDatePicker;

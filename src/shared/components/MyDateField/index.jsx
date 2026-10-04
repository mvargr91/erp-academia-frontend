// Campo de fecha ligado a Formik con el calendario de MUI (no el nativo del navegador), con el
// mismo estilo "standard" que MyTextField para que quede alineado con los demás campos.
// El valor en Formik y hacia el backend sigue siendo texto 'YYYY-MM-DD' (o '' si está vacío).
import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { useField, useFormikContext } from 'formik';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { StyledTextField } from '../MyTextField';

const FORMATO_VALOR = 'YYYY-MM-DD';

const MyDateField = ({ label, name, disabled, required, helperText, className, minDate, maxDate }) => {
  const [field, meta] = useField(name);
  const { setFieldValue, setFieldTouched } = useFormikContext();
  // 'YYYY-MM-DD' es ISO: dayjs lo interpreta como fecha local sin plugins.
  const valor = field.value ? dayjs(field.value) : null;
  const error = meta.touched && meta.error ? meta.error : '';

  return (
    <DatePicker
      className={className}
      label={label}
      value={valor && valor.isValid() ? valor : null}
      disabled={disabled}
      format='DD/MM/YYYY'
      minDate={minDate ? dayjs(minDate) : undefined}
      maxDate={maxDate ? dayjs(maxDate) : undefined}
      onChange={(fecha) => {
        // Mientras se escribe la fecha puede ser inválida: solo se guarda cuando está completa.
        setFieldValue(name, fecha && fecha.isValid() ? fecha.format(FORMATO_VALOR) : '');
      }}
      onClose={() => setFieldTouched(name, true, false)}
      slots={{ textField: StyledTextField }}
      slotProps={{
        textField: {
          name,
          variant: 'standard',
          fullWidth: true,
          required,
          error: Boolean(error),
          helperText: error || helperText,
          onBlur: () => setFieldTouched(name, true),
          InputLabelProps: { shrink: true },
        },
        openPickerButton: { size: 'small' },
        actionBar: { actions: ['clear', 'today'] },
      }}
    />
  );
};

MyDateField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  helperText: PropTypes.string,
  className: PropTypes.string,
  minDate: PropTypes.string,
  maxDate: PropTypes.string,
};

export default MyDateField;

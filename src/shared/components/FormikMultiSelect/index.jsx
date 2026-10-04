// Selección múltiple ligada a Formik: guarda un arreglo de ids. Opciones: [{ id, nombre }].
import React from 'react';
import PropTypes from 'prop-types';
import { Autocomplete, TextField } from '@mui/material';
import { useField, useFormikContext } from 'formik';

const FormikMultiSelect = ({ name, label, options, disabled, helperText, placeholder, className }) => {
  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext();
  const seleccionados = options.filter((o) => (field.value ?? []).map(String).includes(String(o.id)));
  const error = meta.touched && Boolean(meta.error);

  return (
    <Autocomplete
      multiple
      className={className}
      options={options}
      value={seleccionados}
      disabled={disabled}
      getOptionLabel={(o) => o?.nombre ?? ''}
      isOptionEqualToValue={(o, v) => String(o.id) === String(v.id)}
      onChange={(_, nuevos) => setFieldValue(name, nuevos.map((n) => n.id))}
      renderInput={(params) => (
        <TextField
          {...params}
          variant='standard'
          label={label}
          placeholder={placeholder}
          error={error}
          helperText={error ? meta.error : helperText}
        />
      )}
    />
  );
};

FormikMultiSelect.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  disabled: PropTypes.bool,
  helperText: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

FormikMultiSelect.defaultProps = {
  className: 'campo-completo',
  placeholder: 'Buscar...',
};

export default FormikMultiSelect;

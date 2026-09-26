// FormikAutocomplete.jsx
import React from 'react';
import { useField, useFormikContext } from 'formik';
import MUIAutocomplete from '../MUIAutocomplete';

const FormikAutocomplete = ({ name, options = [], getOptionLabel, ...props }) => {
  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext();

  // Busca el valor actual como objeto en la lista de opciones
  const selectedOption =
    options.find((opt) => String(opt.id) === String(field.value)) || null;

  return (
    <MUIAutocomplete
      {...props}
      name={name}
      options={options}
      value={selectedOption}
      onChange={(_, newValue) => {
        if (typeof newValue === 'string') {
          setFieldValue(name, newValue);
        } else if (newValue?.id) {
          setFieldValue(name, newValue.id);
        } else {
          setFieldValue(name, '');
        }
      }}
      getOptionLabel={(option) =>
        typeof option === 'string' ? option : getOptionLabel?.(option) || option?.nombre || ''
      }
      textFieldProps={{
        error: meta.touched && Boolean(meta.error),
        helperText: meta.touched ? meta.error : '',
        ...props.textFieldProps,
      }}
    />
  );
};

export default FormikAutocomplete;

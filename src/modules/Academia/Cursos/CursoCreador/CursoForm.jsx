import React from 'react';
import PropTypes from 'prop-types';
import { Autocomplete, TextField } from '@mui/material';
import { useField, useFormikContext } from 'formik';
import AppCrudForm, { SeccionForm } from '../../../../shared/components/AppCrudForm';
import MyTextField from '../../../../shared/components/MyTextField';
import MySelectField from '../../../../shared/components/MySelectField';
import MyDateField from '../../../../shared/components/MyDateField';
import MyRadioField from '../../../../shared/components/MyRadioField';
import FormikAutocomplete from '../../../../shared/components/FormikAutocomplete';
import { DIAS_SEMANA, OPCIONES_ESTADO, OPCIONES_SI_NO } from '../../../../shared/constants/Academia';

// Multiselect de alumnos matriculados, ligado a Formik (guarda un arreglo de ids).
const AlumnosMultiSelect = ({ options, disabled }) => {
  const [field, meta] = useField('alumnos');
  const { setFieldValue } = useFormikContext();
  const seleccionados = options.filter((o) =>
    (field.value ?? []).map(String).includes(String(o.id)),
  );

  return (
    <Autocomplete
      multiple
      className='campo-completo'
      options={options}
      value={seleccionados}
      disabled={disabled}
      getOptionLabel={(o) => o?.nombre ?? ''}
      isOptionEqualToValue={(o, v) => String(o.id) === String(v.id)}
      onChange={(_, nuevos) => setFieldValue('alumnos', nuevos.map((n) => n.id))}
      renderInput={(params) => (
        <TextField
          {...params}
          variant='standard'
          label='Alumnos matriculados'
          placeholder='Buscar alumno...'
          error={meta.touched && Boolean(meta.error)}
          helperText='A los alumnos nuevos se les asigna como saldo el valor del plan del curso.'
        />
      )}
    />
  );
};

AlumnosMultiSelect.propTypes = {
  options: PropTypes.array.isRequired,
  disabled: PropTypes.bool,
};

const CursoForm = (props) => {
  const { accion, titulo, handleOnClose, saving, ritmos, profesores, planes, alumnos } = props;
  const disabled = accion === 'ver';

  return (
    <AppCrudForm titulo={titulo} accion={accion} handleOnClose={handleOnClose} saving={saving}>
      <SeccionForm titulo='Datos del curso' />
      <FormikAutocomplete name='ritmo_id' label='Ritmo' options={ritmos} disabled={disabled} textFieldProps={{ variant: 'standard' }} />
      <FormikAutocomplete name='profesor_id' label='Profesor' options={profesores} disabled={disabled} textFieldProps={{ variant: 'standard' }} />
      <FormikAutocomplete name='plan_id' label='Plan / Precio' options={planes} disabled={disabled} textFieldProps={{ variant: 'standard' }} />
      <MyTextField fullWidth label='Nombre (opcional)' name='nombre' disabled={disabled} />

      <SeccionForm titulo='Horario' />
      <MySelectField name='dia' label='Día' options={DIAS_SEMANA} disabled={disabled} fullWidth variant='standard' />
      <MyTextField fullWidth type='time' label='Hora' name='hora' disabled={disabled} required InputLabelProps={{ shrink: true }} />
      <MyDateField label='Fecha de inicio' name='fecha_inicio' disabled={disabled} />
      <MyTextField fullWidth type='number' label='Cupo máximo' name='cupo_max' disabled={disabled} />

      <SeccionForm titulo='Matrícula y estado' />
      <AlumnosMultiSelect options={alumnos} disabled={disabled} />
      <MyRadioField label='Activo' name='activo' disabled={disabled} required options={OPCIONES_SI_NO} />
      <MyRadioField label='Estado' name='estado' disabled={disabled} required options={OPCIONES_ESTADO} />
    </AppCrudForm>
  );
};

CursoForm.propTypes = {
  accion: PropTypes.string.isRequired,
  titulo: PropTypes.string,
  handleOnClose: PropTypes.func.isRequired,
  saving: PropTypes.bool,
  ritmos: PropTypes.array.isRequired,
  profesores: PropTypes.array.isRequired,
  planes: PropTypes.array.isRequired,
  alumnos: PropTypes.array.isRequired,
};

export default CursoForm;

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useFormikContext } from 'formik';
import AppCrudForm, { SeccionForm } from '../../../../shared/components/AppCrudForm';
import MyTextField from '../../../../shared/components/MyTextField';
import MySelectField from '../../../../shared/components/MySelectField';
import MyDateField from '../../../../shared/components/MyDateField';
import MyRadioField from '../../../../shared/components/MyRadioField';
import FormikAutocomplete from '../../../../shared/components/FormikAutocomplete';
import FormikMultiSelect from '../../../../shared/components/FormikMultiSelect';
import { CampoSede } from '../../../../shared/sedes';
import { onGetColeccionLigera as onGetPlanes } from '../../../../@crema/redux/features/planes/planesSlice';
import { DIAS_SEMANA, OPCIONES_ESTADO, OPCIONES_SI_NO } from '../../../../shared/constants/Academia';

const CursoForm = (props) => {
  const { accion, titulo, handleOnClose, saving, ritmos, profesores, planes, alumnos } = props;
  const disabled = accion === 'ver';
  const dispatch = useDispatch();
  const { values } = useFormikContext();

  // Los planes disponibles son los generales y los de la sede del curso.
  useEffect(() => {
    if (values.sede_id) {
      dispatch(onGetPlanes({ sede_id: values.sede_id }));
    }
  }, [dispatch, values.sede_id]);

  return (
    <AppCrudForm titulo={titulo} accion={accion} handleOnClose={handleOnClose} saving={saving}>
      <SeccionForm titulo='Datos del curso' />
      <CampoSede disabled={disabled} />
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
      <FormikMultiSelect
        name='alumnos'
        label='Alumnos matriculados'
        placeholder='Buscar alumno...'
        options={alumnos}
        disabled={disabled}
        helperText='Si el alumno tiene un paquete vigente, asiste con su paquete; si no, se le cobra el primer ciclo de clases.'
      />
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

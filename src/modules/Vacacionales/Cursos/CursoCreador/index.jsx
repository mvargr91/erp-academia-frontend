import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import AppCrudDialog from '../../../../shared/components/AppCrudDialog';
import AppCrudForm, { SeccionForm } from '../../../../shared/components/AppCrudForm';
import MyTextField from '../../../../shared/components/MyTextField';
import MyRadioField from '../../../../shared/components/MyRadioField';
import FormikAutocomplete from '../../../../shared/components/FormikAutocomplete';
import SelectorFechas from '../../../../shared/components/SelectorFechas';
import { CampoSede, useSedes } from '../../../../shared/sedes';
import {
  onShow,
  onCreate,
  onUpdate,
  resetActual,
} from '../../../../@crema/redux/features/vacacionales/vacacionalCursosSlice';
import { onGetColeccionLigera as onGetRitmos } from '../../../../@crema/redux/features/ritmos/ritmosSlice';
import { onGetColeccionLigera as onGetProfesores } from '../../../../@crema/redux/features/profesores/profesoresSlice';
import { aRadio, OPCIONES_ESTADO } from '../../../../shared/constants/Academia';

const validationSchema = yup.object({
  nombre: yup.string().required('Requerido').max(150, 'Máximo 150 caracteres'),
  clases_por_alumno: yup
    .number()
    .typeError('Debe ser un número')
    .required('Requerido')
    .min(1, 'Mínimo 1')
    .test('dias', 'No puede ser mayor que los días marcados en el calendario', function (v) {
      return !this.parent.fechas?.length || !v || v <= this.parent.fechas.length;
    }),
  valor: yup.number().typeError('Debe ser un número').required('Requerido').min(0, 'No puede ser negativo'),
  cupo_max: yup
    .number()
    .transform((valor, original) => (original === '' ? null : valor))
    .typeError('Debe ser un número')
    .nullable()
    .min(1, 'Mínimo 1'),
  fechas: yup.array().min(1, 'Marca en el calendario al menos un día de clase'),
});

const initialValues = (registro, sedePorDefecto) => ({
  id: registro?.id ?? '',
  nombre: registro?.nombre ?? '',
  sede_id: registro?.sede_id ?? sedePorDefecto,
  ritmo_id: registro?.ritmo_id ?? '',
  profesor_id: registro?.profesor_id ?? '',
  hora_inicio: registro?.hora_inicio ?? '',
  hora_fin: registro?.hora_fin ?? '',
  clases_por_alumno: registro?.clases_por_alumno ?? 4,
  valor: registro?.valor ?? '',
  cupo_max: registro?.cupo_max ?? '',
  descripcion: registro?.descripcion ?? '',
  fechas: registro?.fechas ?? [],
  estado: aRadio(registro?.estado),
});

const VacacionalCursoCreador = ({ curso, accion, handleOnClose, updateColeccion, titulo }) => {
  const dispatch = useDispatch();
  const { coleccionLigera: ritmos } = useSelector((s) => s.ritmos);
  const { coleccionLigera: profesores } = useSelector((s) => s.profesores);
  const { sedePorDefecto } = useSedes();
  const disabled = accion === 'ver';

  useEffect(() => {
    dispatch(onGetRitmos());
    dispatch(onGetProfesores());
  }, [dispatch]);

  return (
    <AppCrudDialog
      stateKey='vacacionalCursos'
      registroId={curso}
      accion={accion}
      handleOnClose={handleOnClose}
      updateColeccion={updateColeccion}
      onShow={onShow}
      onCreate={onCreate}
      onUpdate={onUpdate}
      resetActual={resetActual}
      initialValues={(registro) => initialValues(registro, sedePorDefecto)}
      validationSchema={validationSchema}
      maxWidth='md'
    >
      {({ saving, values, errors, submitCount, setFieldValue }) => (
        <AppCrudForm titulo={titulo} accion={accion} handleOnClose={handleOnClose} saving={saving}>
          <SeccionForm titulo='Datos del curso vacacional' />
          <MyTextField autoFocus fullWidth label='Nombre' name='nombre' disabled={disabled} required helperText='Ej.: Vacacional de salsa – diciembre' />
          <CampoSede disabled={disabled} />
          <FormikAutocomplete name='ritmo_id' label='Género' options={ritmos} disabled={disabled} textFieldProps={{ variant: 'standard' }} />
          <FormikAutocomplete name='profesor_id' label='Profesor' options={profesores} disabled={disabled} textFieldProps={{ variant: 'standard' }} />
          <MyTextField fullWidth type='time' label='Hora de inicio' name='hora_inicio' disabled={disabled} InputLabelProps={{ shrink: true }} />
          <MyTextField fullWidth type='time' label='Hora de fin' name='hora_fin' disabled={disabled} InputLabelProps={{ shrink: true }} />

          <SeccionForm titulo='Días de clase' />
          <SelectorFechas
            className='campo-completo'
            label='Marca en el calendario cada día de clase (pueden ser días salteados)'
            value={values.fechas}
            onChange={(fechas) => setFieldValue('fechas', fechas)}
            disabled={disabled}
            error={submitCount > 0 && typeof errors.fechas === 'string' ? errors.fechas : ''}
          />
          <MyTextField
            fullWidth
            type='number'
            label='Clases que toma cada alumno'
            name='clases_por_alumno'
            disabled={disabled}
            required
            helperText='Si marcas más días que este número, al inscribir se escogen las clases de cada alumno.'
          />
          <MyTextField fullWidth type='number' label='Cupo máximo por clase' name='cupo_max' disabled={disabled} />

          <SeccionForm titulo='Precio y estado' />
          <MyTextField fullWidth type='number' label='Valor del curso' name='valor' disabled={disabled} required />
          <MyRadioField label='Estado' name='estado' disabled={disabled} required options={OPCIONES_ESTADO} />
          <MyTextField
            className='campo-completo'
            fullWidth
            multiline
            label='Descripción (se usa al anunciarlo por correo)'
            name='descripcion'
            disabled={disabled}
          />
        </AppCrudForm>
      )}
    </AppCrudDialog>
  );
};

VacacionalCursoCreador.propTypes = {
  curso: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  accion: PropTypes.string.isRequired,
  handleOnClose: PropTypes.func.isRequired,
  updateColeccion: PropTypes.func.isRequired,
  titulo: PropTypes.string,
};

export default VacacionalCursoCreador;

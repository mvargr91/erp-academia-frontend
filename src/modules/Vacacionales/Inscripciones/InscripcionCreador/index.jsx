// Inscripción de un alumno (de la academia) a un curso vacacional: se eligen en el calendario las clases
// que tomará (entre los días del curso). Si el curso tiene justo las clases de cada alumno, quedan todas
// marcadas. El valor lo propone la tarifa de vacacionales (cuántos toma en la temporada y si paga en pareja).
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useFormikContext } from 'formik';
import jwtAxios from '../../../../@crema/services/auth/jwt-auth';
import AppCrudDialog from '../../../../shared/components/AppCrudDialog';
import AppCrudForm, { SeccionForm } from '../../../../shared/components/AppCrudForm';
import MyTextField from '../../../../shared/components/MyTextField';
import MyDateField from '../../../../shared/components/MyDateField';
import MyRadioField from '../../../../shared/components/MyRadioField';
import FormikAutocomplete from '../../../../shared/components/FormikAutocomplete';
import SelectorFechas from '../../../../shared/components/SelectorFechas';
import {
  onShow,
  onCreate,
  onUpdate,
  resetActual,
} from '../../../../@crema/redux/features/vacacionales/vacacionalInscripcionesSlice';
import { onGetColeccionLigera as onGetAlumnos } from '../../../../@crema/redux/features/vacacionales/vacacionalAlumnosSlice';
import { onGetColeccionLigera as onGetCursos } from '../../../../@crema/redux/features/vacacionales/vacacionalCursosSlice';
import { aRadio } from '../../../../shared/constants/Academia';

const OPCIONES_INSCRIPCION = [
  { value: '1', label: 'Activa' },
  { value: '0', label: 'Anulada' },
];

const hoy = () => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);

const validationSchema = yup.object({
  alumno_id: yup.mixed().required('Elige el alumno'),
  curso_id: yup.mixed().required('Elige el curso'),
  // Vacío al editar = se recalcula con la tarifa (p. ej. al cambiar la pareja).
  valor: yup
    .number()
    .transform((v, original) => (original === '' ? null : v))
    .typeError('Debe ser un número')
    .nullable()
    .min(0, 'No puede ser negativo'),
  fechas: yup.array().min(1, 'Marca en el calendario las clases que tomará el alumno'),
});

const initialValues = (registro, inicial) => ({
  id: registro?.id ?? '',
  alumno_id: registro?.alumno_id ?? inicial.alumno_id,
  curso_id: registro?.curso_id ?? inicial.curso_id,
  pareja_alumno_id: registro?.pareja_alumno_id ?? '',
  fecha_inscripcion: registro?.fecha_inscripcion ?? hoy(),
  valor: registro?.valor ?? '',
  observacion: registro?.observacion ?? '',
  fechas: registro?.fechas ?? [],
  estado: aRadio(registro?.estado),
});

const Campos = ({ accion, titulo, handleOnClose, saving, alumnos, cursos, registro }) => {
  const { values, errors, submitCount, setFieldValue } = useFormikContext();
  const disabled = accion === 'ver';
  const creando = accion === 'crear';
  const curso = cursos.find((c) => String(c.id) === String(values.curso_id));
  const diasCurso = curso?.fechas ?? registro?.fechas_curso ?? [];
  const clases = curso?.clases_por_alumno ?? registro?.clases_por_alumno ?? 0;
  const [regla, setRegla] = useState('');
  const parejas = alumnos.filter((a) => String(a.id) !== String(values.alumno_id));

  // Al elegir el curso, si no hay nada que escoger, van todas sus clases.
  useEffect(() => {
    if (creando && curso) {
      setFieldValue('fechas', curso.fechas.length <= curso.clases_por_alumno ? curso.fechas : []);
    }
  }, [creando, curso?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // El valor lo propone la tarifa: cuántos vacacionales toma el alumno en la temporada y si paga en pareja.
  useEffect(() => {
    if (!creando || !curso) return;
    jwtAxios
      .post('vacacionales-matriculas/cotizar', {
        alumno_id: values.alumno_id || null,
        cursos: [{ curso_id: curso.id, pareja_alumno_id: values.pareja_alumno_id || null }],
      })
      .then(({ data }) => {
        setFieldValue('valor', data[0]?.valor ?? curso.valor);
        setRegla(data[0]?.regla ?? '');
      })
      .catch(() => setFieldValue('valor', curso.valor));
  }, [creando, curso?.id, values.alumno_id, values.pareja_alumno_id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Al cambiar la pareja de una inscripción ya hecha, el valor se recalcula al guardar.
  useEffect(() => {
    if (accion === 'editar' && registro && String(values.pareja_alumno_id ?? '') !== String(registro.pareja_alumno_id ?? '')) {
      setFieldValue('valor', '');
    }
  }, [values.pareja_alumno_id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AppCrudForm titulo={titulo} accion={accion} handleOnClose={handleOnClose} saving={saving}>
      <SeccionForm titulo='Inscripción' />
      <FormikAutocomplete
        name='alumno_id'
        label='Alumno'
        options={alumnos}
        disabled={!creando}
        textFieldProps={{ variant: 'standard' }}
      />
      <FormikAutocomplete name='curso_id' label='Curso vacacional' options={cursos} disabled={!creando} textFieldProps={{ variant: 'standard' }} />
      <MyDateField label='Fecha de inscripción' name='fecha_inscripcion' disabled={disabled} />
      <FormikAutocomplete
        name='pareja_alumno_id'
        label='Paga en pareja con (opcional)'
        options={parejas}
        disabled={disabled}
        textFieldProps={{
          variant: 'standard',
          helperText: 'Los dos pagan en pareja este curso: cada uno la mitad de la tarifa de pareja.',
        }}
      />
      <MyTextField
        fullWidth
        type='number'
        label='Valor'
        name='valor'
        disabled={disabled}
        helperText={
          values.valor === '' && !creando ? 'Se recalcula con la tarifa al guardar' : creando && regla ? `Según la tarifa: ${regla}` : ''
        }
      />

      {(curso || registro) && (
        <>
          <SeccionForm titulo='Clases que toma' />
          <SelectorFechas
            className='campo-completo'
            label={`Elige las clases del alumno entre los ${diasCurso.length} días del curso`}
            value={values.fechas}
            onChange={(fechas) => setFieldValue('fechas', fechas)}
            disponibles={diasCurso}
            max={clases || undefined}
            disabled={disabled}
            error={submitCount > 0 && typeof errors.fechas === 'string' ? errors.fechas : ''}
          />
        </>
      )}

      <SeccionForm titulo='Otros datos' />
      <MyTextField fullWidth label='Observación' name='observacion' disabled={disabled} />
      {!creando && <MyRadioField label='Estado' name='estado' disabled={disabled} required options={OPCIONES_INSCRIPCION} />}
    </AppCrudForm>
  );
};

Campos.propTypes = {
  accion: PropTypes.string.isRequired,
  titulo: PropTypes.string,
  handleOnClose: PropTypes.func.isRequired,
  saving: PropTypes.bool,
  alumnos: PropTypes.array.isRequired,
  cursos: PropTypes.array.isRequired,
  registro: PropTypes.object,
};

const VacacionalInscripcionCreador = ({ inscripcion, inicial, accion, handleOnClose, updateColeccion, titulo }) => {
  const dispatch = useDispatch();
  const { coleccionLigera: alumnos } = useSelector((s) => s.vacacionalAlumnos);
  const { coleccionLigera: cursos } = useSelector((s) => s.vacacionalCursos);

  useEffect(() => {
    dispatch(onGetAlumnos());
    dispatch(onGetCursos());
  }, [dispatch]);

  return (
    <AppCrudDialog
      stateKey='vacacionalInscripciones'
      registroId={inscripcion}
      accion={accion}
      handleOnClose={handleOnClose}
      updateColeccion={updateColeccion}
      onShow={onShow}
      onCreate={onCreate}
      onUpdate={onUpdate}
      resetActual={resetActual}
      initialValues={(registro) => initialValues(registro, inicial)}
      validationSchema={validationSchema}
      maxWidth='md'
    >
      {({ registro, saving }) => (
        <Campos
          accion={accion}
          titulo={titulo}
          handleOnClose={handleOnClose}
          saving={saving}
          alumnos={alumnos}
          cursos={cursos}
          registro={registro}
        />
      )}
    </AppCrudDialog>
  );
};

VacacionalInscripcionCreador.propTypes = {
  inscripcion: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  inicial: PropTypes.shape({ alumno_id: PropTypes.any, curso_id: PropTypes.any }),
  accion: PropTypes.string.isRequired,
  handleOnClose: PropTypes.func.isRequired,
  updateColeccion: PropTypes.func.isRequired,
  titulo: PropTypes.string,
};

VacacionalInscripcionCreador.defaultProps = {
  inicial: { alumno_id: '', curso_id: '' },
};

export default VacacionalInscripcionCreador;

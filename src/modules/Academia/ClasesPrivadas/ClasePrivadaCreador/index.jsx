import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import * as yup from 'yup';
import { useFormikContext } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Chip, Box } from '@mui/material';
import AppCrudDialog from '../../../../shared/components/AppCrudDialog';
import AppCrudForm, { SeccionForm } from '../../../../shared/components/AppCrudForm';
import MyTextField from '../../../../shared/components/MyTextField';
import MyDateField from '../../../../shared/components/MyDateField';
import FormikAutocomplete from '../../../../shared/components/FormikAutocomplete';
import FormikMultiSelect from '../../../../shared/components/FormikMultiSelect';
import { useSedes, CampoSede } from '../../../../shared/sedes';
import {
  onShow,
  onCreate,
  onUpdate,
  resetActual,
} from '../../../../@crema/redux/features/clasesPrivadas/clasesPrivadasSlice';
import { onGetColeccionLigera as onGetAlumnos } from '../../../../@crema/redux/features/alumnos/alumnosSlice';
import { onGetColeccionLigera as onGetProfesores } from '../../../../@crema/redux/features/profesores/profesoresSlice';
import CamposCobro, { cobroDe } from '../CamposCobro';
import usePermisosOpcion from '../../../../shared/hooks/usePermisosOpcion';

const validationSchema = yup.object({
  fecha: yup.string().required('Requerido'),
  hora: yup.string().required('Requerido'),
  duracion_min: yup.number().typeError('Debe ser un número').required('Requerido').min(15, 'Mínimo 15').max(300, 'Máximo 300'),
  // Clase suelta: basta el nombre de la persona, sin crearla como alumno.
  alumnos: yup.array().when('externo_nombre', {
    is: (nombre) => !String(nombre ?? '').trim(),
    then: (s) => s.min(1, 'Elige un alumno o escribe abajo el nombre de la persona'),
  }),
  externo_nombre: yup.string().max(150, 'Máximo 150 caracteres'),
  valor: yup
    .number()
    .transform((v, original) => (original === '' ? null : v))
    .nullable()
    .typeError('Debe ser un número')
    .min(0, 'No puede ser negativo')
    .when('pagada', { is: true, then: (s) => s.required('Indica el valor').moreThan(0, 'Debe ser mayor que 0') }),
  fecha_pago: yup.string().when('pagada', { is: true, then: (s) => s.required('Requerido') }),
});

const initialValues = (registro, sedePorDefecto) => ({
  id: registro?.id ?? '',
  sede_id: registro?.sede_id ?? sedePorDefecto,
  fecha: registro?.fecha ?? '',
  hora: registro?.hora ?? '',
  duracion_min: registro?.duracion_min ?? 60,
  profesor_id: registro?.profesor_id ?? '',
  alumnos: registro?.alumnos ?? [],
  externo_nombre: registro?.externo_nombre ?? '',
  externo_telefono: registro?.externo_telefono ?? '',
  ...cobroDe(registro),
  observacion: registro?.observacion ?? '',
});

// Campos de cobro enlazados al formulario (los errores se muestran al intentar guardar).
const CobroFormik = ({ disabled }) => {
  const { values, errors, submitCount, setFieldValue } = useFormikContext();
  // Cobrar exige el permiso «Pagar» de esta opción: sin él aquí solo se fija el valor.
  const { permisos: permisosClases } = usePermisosOpcion('/clases-privadas');
  return (
    <CamposCobro
      soloValor={permisosClases.indexOf('Pagar') < 0 && !values.pagada}
      className='campo-tercio'
      valores={values}
      errores={submitCount > 0 ? errors : undefined}
      onCambio={setFieldValue}
      disabled={disabled}
    />
  );
};

CobroFormik.propTypes = { disabled: PropTypes.bool };

const ClasePrivadaCreador = ({ clase, accion, handleOnClose, updateColeccion, titulo }) => {
  const dispatch = useDispatch();
  const { coleccionLigera: alumnos } = useSelector((s) => s.alumnos);
  const { coleccionLigera: profesores } = useSelector((s) => s.profesores);
  const ver = accion === 'ver';
  const { sedePorDefecto } = useSedes();

  useEffect(() => {
    dispatch(onGetAlumnos());
    dispatch(onGetProfesores());
  }, [dispatch]);

  return (
    <AppCrudDialog
      stateKey='clasesPrivadas'
      registroId={clase}
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
      {({ registro, saving }) => (
        <AppCrudForm titulo={titulo} accion={accion} handleOnClose={handleOnClose} saving={saving}>
          {registro && registro.estado !== 'programada' && !ver && (
            <Alert severity='warning' className='campo-completo'>
              Esta clase ya fue {registro.estado_nombre.toLowerCase()}: no se puede modificar.
            </Alert>
          )}
          <SeccionForm titulo='Clase' />
          <CampoSede disabled={ver} />
          <MyDateField label='Fecha' name='fecha' disabled={ver} />
          <MyTextField fullWidth type='time' label='Hora' name='hora' disabled={ver} required InputLabelProps={{ shrink: true }} />
          <MyTextField fullWidth type='number' label='Duración (minutos)' name='duracion_min' disabled={ver} required />
          <FormikAutocomplete name='profesor_id' label='Profesor' options={profesores ?? []} disabled={ver} textFieldProps={{ variant: 'standard' }} />
          <FormikMultiSelect
            name='alumnos'
            label='Alumno(s)'
            placeholder='Uno para clase privada, dos para pareja...'
            options={alumnos ?? []}
            disabled={ver}
          />

          <SeccionForm titulo='Clase suelta (persona no registrada)' />
          <Alert severity='info' className='campo-completo'>
            Si la persona solo viene a una clase no hace falta crearla como alumno: escribe su nombre aquí y deja vacío el campo
            Alumno(s).
          </Alert>
          <MyTextField fullWidth label='Nombre de la persona' name='externo_nombre' disabled={ver} />
          <MyTextField fullWidth label='Teléfono' name='externo_telefono' disabled={ver} />

          <SeccionForm titulo='Cobro de la clase' />
          <Alert severity='info' className='campo-completo'>
            Solo si la clase se cobra aparte (clase suelta o alumno sin paquete). Las clases de un paquete se pagan en el paquete y
            aquí se dejan sin valor. Marcarla como «Pagada» requiere el permiso «Pagar»; también se puede cobrar después con
            «Registrar pago» en la lista.
          </Alert>
          <CobroFormik disabled={ver} />

          <MyTextField className='campo-completo' fullWidth multiline minRows={2} label='Observación' name='observacion' disabled={ver} />

          {ver && (registro?.detalle_alumnos?.length > 0 || registro?.externo_nombre) && (
            <>
              <SeccionForm titulo='Resultado' />
              <Box className='campo-completo' sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {registro.detalle_alumnos.map((a) => (
                  <Chip
                    key={a.alumno_id}
                    color={a.descontada ? 'primary' : 'default'}
                    label={`${a.nombre}: ${a.resultado_nombre}${a.descontada ? ' · descontó 1 clase' : ''} · le quedan ${a.paquete?.restantes ?? 0}`}
                  />
                ))}
                {registro.externo_nombre && <Chip label={`${registro.externo_nombre}: ${registro.externo_resultado_nombre}`} />}
              </Box>
            </>
          )}
        </AppCrudForm>
      )}
    </AppCrudDialog>
  );
};

ClasePrivadaCreador.propTypes = {
  clase: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  accion: PropTypes.string.isRequired,
  handleOnClose: PropTypes.func.isRequired,
  updateColeccion: PropTypes.func,
  titulo: PropTypes.string,
};

export default ClasePrivadaCreador;

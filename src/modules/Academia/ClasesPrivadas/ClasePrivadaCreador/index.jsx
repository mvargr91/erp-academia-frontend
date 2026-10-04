import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import * as yup from 'yup';
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

const validationSchema = yup.object({
  fecha: yup.string().required('Requerido'),
  hora: yup.string().required('Requerido'),
  duracion_min: yup.number().typeError('Debe ser un número').required('Requerido').min(15, 'Mínimo 15').max(300, 'Máximo 300'),
  alumnos: yup.array().min(1, 'Elige al menos un alumno'),
});

const initialValues = (registro, sedePorDefecto) => ({
  id: registro?.id ?? '',
  sede_id: registro?.sede_id ?? sedePorDefecto,
  fecha: registro?.fecha ?? '',
  hora: registro?.hora ?? '',
  duracion_min: registro?.duracion_min ?? 60,
  profesor_id: registro?.profesor_id ?? '',
  alumnos: registro?.alumnos ?? [],
  observacion: registro?.observacion ?? '',
});

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
            helperText='Cada alumno descuenta 1 clase de su propio paquete.'
          />
          <MyTextField className='campo-completo' fullWidth multiline minRows={2} label='Observación' name='observacion' disabled={ver} />

          {ver && registro?.detalle_alumnos?.length > 0 && (
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

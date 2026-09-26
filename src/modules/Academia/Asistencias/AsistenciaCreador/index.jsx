import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import AppCrudDialog from '../../../../shared/components/AppCrudDialog';
import {
  onShow,
  onCreate,
  onUpdate,
  resetActual,
} from '../../../../@crema/redux/features/asistencias/asistenciasSlice';
import { onGetColeccionLigera as onGetCursos } from '../../../../@crema/redux/features/cursos/cursosSlice';
import { esActivo } from '../../../../shared/constants/Academia';
import AsistenciaForm from './AsistenciaForm';

const hoy = () => new Date().toISOString().slice(0, 10);

const validationSchema = yup.object({
  curso_id: yup.number().typeError('Requerido').required('Requerido'),
  fecha_sesion: yup.string().required('Requerido'),
});

const initialValues = (registro) => ({
  id: registro?.id ?? '',
  curso_id: registro?.curso_id ?? '',
  fecha_sesion: registro?.fecha_sesion ?? hoy(),
  observacion: registro?.observacion ?? '',
  asistentes: (registro?.asistentes ?? []).map((a) => ({
    alumno_id: a.alumno_id,
    nombre: a.nombre,
    presente: esActivo(a.presente),
  })),
});

const AsistenciaCreador = ({ asistencia, accion, handleOnClose, updateColeccion, titulo }) => {
  const dispatch = useDispatch();
  const { coleccionLigera: cursos } = useSelector((s) => s.cursos);

  useEffect(() => {
    dispatch(onGetCursos());
  }, [dispatch]);

  return (
    <AppCrudDialog
      stateKey='asistencias'
      registroId={asistencia}
      accion={accion}
      handleOnClose={handleOnClose}
      updateColeccion={updateColeccion}
      onShow={onShow}
      onCreate={onCreate}
      onUpdate={onUpdate}
      resetActual={resetActual}
      initialValues={initialValues}
      validationSchema={validationSchema}
      maxWidth='md'
    >
      {({ registro, saving }) => (
        <AsistenciaForm
          registro={registro}
          accion={accion}
          titulo={titulo}
          handleOnClose={handleOnClose}
          saving={saving}
          cursos={cursos}
        />
      )}
    </AppCrudDialog>
  );
};

AsistenciaCreador.propTypes = {
  asistencia: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  accion: PropTypes.string.isRequired,
  handleOnClose: PropTypes.func.isRequired,
  updateColeccion: PropTypes.func.isRequired,
  titulo: PropTypes.string,
};

export default AsistenciaCreador;

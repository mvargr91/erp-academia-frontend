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
} from '../../../../@crema/redux/features/cursos/cursosSlice';
import { onGetColeccionLigera as onGetRitmos } from '../../../../@crema/redux/features/ritmos/ritmosSlice';
import { onGetColeccionLigera as onGetProfesores } from '../../../../@crema/redux/features/profesores/profesoresSlice';
import { onGetColeccionLigera as onGetAlumnos } from '../../../../@crema/redux/features/alumnos/alumnosSlice';
import { onGetColeccionLigera as onGetModalidades } from '../../../../@crema/redux/features/modalidades/modalidadesSlice';
import { aRadio } from '../../../../shared/constants/Academia';
import { useSedes } from '../../../../shared/sedes';
import CursoForm from './CursoForm';

const validationSchema = yup.object({
  ritmo_id: yup.number().typeError('Requerido').required('Requerido'),
  profesor_id: yup.number().nullable(),
  modalidad_id: yup.number().typeError('Elige la modalidad').required('Elige la modalidad'),
  dia: yup.number().typeError('Requerido').required('Requerido'),
  hora: yup.string().required('Requerido'),
  duracion_minutos: yup
    .number()
    .transform((v, original) => (original === '' ? null : v))
    .typeError('Debe ser un número')
    .nullable()
    .integer('Sin decimales')
    .min(15, 'Mínimo 15')
    .max(600, 'Máximo 600'),
  cupo_max: yup.number().typeError('Debe ser un número').nullable().min(1, 'Mínimo 1'),
});

const initialValues = (registro, sedePorDefecto, modalidadPorDefecto) => ({
  id: registro?.id ?? '',
  sede_id: registro?.sede_id ?? sedePorDefecto,
  nombre: registro?.nombre ?? '',
  ritmo_id: registro?.ritmo_id ?? '',
  profesor_id: registro?.profesor_id ?? '',
  modalidad_id: registro?.modalidad_id ?? modalidadPorDefecto,
  dia: registro?.dia ?? '',
  hora: registro?.hora ?? '',
  duracion_minutos: registro?.duracion_minutos ?? '',
  fecha_inicio: registro?.fecha_inicio ?? '',
  cupo_max: registro?.cupo_max ?? '',
  activo: aRadio(registro?.activo),
  alumnos: registro?.alumnos ?? [],
  estado: aRadio(registro?.estado),
});

const CursoCreador = ({ curso, accion, handleOnClose, updateColeccion, titulo }) => {
  const dispatch = useDispatch();
  const { coleccionLigera: ritmos } = useSelector((s) => s.ritmos);
  const { coleccionLigera: profesores } = useSelector((s) => s.profesores);
  const { coleccionLigera: alumnos } = useSelector((s) => s.alumnos);
  const { coleccionLigera: modalidades } = useSelector((s) => s.modalidades);
  const { sedePorDefecto } = useSedes();
  // Curso nuevo: si la academia tiene una sola modalidad activa, se propone esa.
  const activas = (modalidades ?? []).filter((m) => m.estado);
  const modalidadPorDefecto = activas.length === 1 ? activas[0].id : '';

  useEffect(() => {
    dispatch(onGetRitmos());
    dispatch(onGetProfesores());
    dispatch(onGetAlumnos());
    dispatch(onGetModalidades());
  }, [dispatch]);

  return (
    <AppCrudDialog
      stateKey='cursos'
      registroId={curso}
      accion={accion}
      handleOnClose={handleOnClose}
      updateColeccion={updateColeccion}
      onShow={onShow}
      onCreate={onCreate}
      onUpdate={onUpdate}
      resetActual={resetActual}
      initialValues={(registro) => initialValues(registro, sedePorDefecto, modalidadPorDefecto)}
      validationSchema={validationSchema}
      maxWidth='md'
    >
      {({ registro, saving }) => (
        <CursoForm
          registro={registro}
          accion={accion}
          titulo={titulo}
          handleOnClose={handleOnClose}
          saving={saving}
          ritmos={ritmos}
          profesores={profesores}
          alumnos={alumnos}
          modalidades={modalidades ?? []}
        />
      )}
    </AppCrudDialog>
  );
};

CursoCreador.propTypes = {
  curso: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  accion: PropTypes.string.isRequired,
  handleOnClose: PropTypes.func.isRequired,
  updateColeccion: PropTypes.func.isRequired,
  titulo: PropTypes.string,
};

export default CursoCreador;

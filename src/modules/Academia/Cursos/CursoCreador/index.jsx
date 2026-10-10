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
import { aRadio } from '../../../../shared/constants/Academia';
import { useSedes } from '../../../../shared/sedes';
import CursoForm from './CursoForm';

const validationSchema = yup.object({
  ritmo_id: yup.number().typeError('Requerido').required('Requerido'),
  profesor_id: yup.number().nullable(),
  dia: yup.number().typeError('Requerido').required('Requerido'),
  hora: yup.string().required('Requerido'),
  cupo_max: yup.number().typeError('Debe ser un número').nullable().min(1, 'Mínimo 1'),
});

const initialValues = (registro, sedePorDefecto) => ({
  id: registro?.id ?? '',
  sede_id: registro?.sede_id ?? sedePorDefecto,
  nombre: registro?.nombre ?? '',
  ritmo_id: registro?.ritmo_id ?? '',
  profesor_id: registro?.profesor_id ?? '',
  dia: registro?.dia ?? '',
  hora: registro?.hora ?? '',
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
  const { sedePorDefecto } = useSedes();

  useEffect(() => {
    dispatch(onGetRitmos());
    dispatch(onGetProfesores());
    dispatch(onGetAlumnos());
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
      initialValues={(registro) => initialValues(registro, sedePorDefecto)}
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

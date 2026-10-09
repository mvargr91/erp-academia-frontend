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
} from '../../../../@crema/redux/features/paquetes/paquetesSlice';
import { onGetColeccionLigera as onGetAlumnos } from '../../../../@crema/redux/features/alumnos/alumnosSlice';
import { onGetColeccionLigera as onGetPlanes } from '../../../../@crema/redux/features/planes/planesSlice';
import { onGetColeccionLigera as onGetProfesores } from '../../../../@crema/redux/features/profesores/profesoresSlice';
import { useSedes } from '../../../../shared/sedes';
import PaqueteForm from './PaqueteForm';

const hoy = () => new Date().toISOString().slice(0, 10);

const esquemaCrear = yup.object({
  alumno_id: yup.number().typeError('Requerido').required('Requerido'),
  clases_total: yup.number().typeError('Debe ser un número').required('Requerido').integer().min(1, 'Mínimo 1'),
  fecha_compra: yup.string().required('Requerido'),
  valor: yup.number().typeError('Debe ser un número').required('Requerido').min(0, 'No puede ser negativo'),
});
const esquemaEditar = yup.object({
  estado: yup.string().required('Requerido'),
});

const initialValues = (registro, sedePorDefecto) => ({
  id: registro?.id ?? '',
  sede_id: registro?.sede_id ?? sedePorDefecto,
  alumno_id: registro?.alumno_id ?? '',
  plan_id: registro?.plan_id ?? '',
  clases_total: registro?.clases_total ?? '',
  fecha_compra: registro?.fecha_compra ?? hoy(),
  fecha_vencimiento: registro?.fecha_vencimiento ?? '',
  valor: registro?.valor ?? '',
  estado: registro?.estado ?? 'activo',
  observacion: registro?.observacion ?? '',
});

const PaqueteCreador = ({ paquete, accion, handleOnClose, updateColeccion, titulo }) => {
  const dispatch = useDispatch();
  const { coleccionLigera: alumnos } = useSelector((s) => s.alumnos);
  const { coleccionLigera: planes } = useSelector((s) => s.planes);
  const { coleccionLigera: profesores } = useSelector((s) => s.profesores);
  const { sedePorDefecto } = useSedes();

  useEffect(() => {
    dispatch(onGetAlumnos());
    dispatch(onGetPlanes());
    dispatch(onGetProfesores());
  }, [dispatch]);

  return (
    <AppCrudDialog
      stateKey='paquetes'
      registroId={paquete}
      accion={accion}
      handleOnClose={handleOnClose}
      updateColeccion={updateColeccion}
      onShow={onShow}
      onCreate={onCreate}
      onUpdate={onUpdate}
      resetActual={resetActual}
      initialValues={(registro) => initialValues(registro, sedePorDefecto)}
      validationSchema={accion === 'crear' ? esquemaCrear : esquemaEditar}
      maxWidth='lg'
    >
      {({ registro, saving }) => (
        <PaqueteForm
          registro={registro}
          accion={accion}
          titulo={titulo}
          handleOnClose={handleOnClose}
          saving={saving}
          alumnos={alumnos ?? []}
          planes={(planes ?? []).filter((p) => p.periodicidad === 'paquete')}
          profesores={profesores ?? []}
        />
      )}
    </AppCrudDialog>
  );
};

PaqueteCreador.propTypes = {
  paquete: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  accion: PropTypes.string.isRequired,
  handleOnClose: PropTypes.func.isRequired,
  updateColeccion: PropTypes.func,
  titulo: PropTypes.string,
};

export default PaqueteCreador;

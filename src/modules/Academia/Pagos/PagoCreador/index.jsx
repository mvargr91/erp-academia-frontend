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
} from '../../../../@crema/redux/features/pagos/pagosSlice';
import { onGetColeccionLigera as onGetAlumnos } from '../../../../@crema/redux/features/alumnos/alumnosSlice';
import { onGetColeccionLigera as onGetCursos } from '../../../../@crema/redux/features/cursos/cursosSlice';
import { onGetColeccionLigera as onGetPlanes } from '../../../../@crema/redux/features/planes/planesSlice';
import PagoForm from './PagoForm';

const hoy = () => new Date().toISOString().slice(0, 10);

const validationSchema = yup.object({
  alumno_id: yup.number().typeError('Requerido').required('Requerido'),
  curso_id: yup.number().nullable(),
  plan_id: yup.number().nullable(),
  monto: yup.number().typeError('Debe ser un número').required('Requerido').min(0, 'No puede ser negativo'),
  fecha_pago: yup.string().required('Requerido'),
  metodo_pago: yup.string().required('Requerido'),
});

const initialValues = (registro) => ({
  id: registro?.id ?? '',
  alumno_id: registro?.alumno_id ?? '',
  curso_id: registro?.curso_id ?? '',
  plan_id: registro?.plan_id ?? '',
  monto: registro?.monto ?? '',
  fecha_pago: registro?.fecha_pago ?? hoy(),
  metodo_pago: registro?.metodo_pago ?? 'efectivo',
  referencia: registro?.referencia ?? '',
  observacion: registro?.observacion ?? '',
});

const PagoCreador = ({ pago, accion, handleOnClose, updateColeccion, titulo }) => {
  const dispatch = useDispatch();
  const { coleccionLigera: alumnos } = useSelector((s) => s.alumnos);
  const { coleccionLigera: cursos } = useSelector((s) => s.cursos);
  const { coleccionLigera: planes } = useSelector((s) => s.planes);

  useEffect(() => {
    dispatch(onGetAlumnos());
    dispatch(onGetCursos());
    dispatch(onGetPlanes());
  }, [dispatch]);

  return (
    <AppCrudDialog
      stateKey='pagos'
      registroId={pago}
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
        <PagoForm
          registro={registro}
          accion={accion}
          titulo={titulo}
          handleOnClose={handleOnClose}
          saving={saving}
          alumnos={alumnos}
          cursos={cursos}
          planes={planes}
        />
      )}
    </AppCrudDialog>
  );
};

PagoCreador.propTypes = {
  pago: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  accion: PropTypes.string.isRequired,
  handleOnClose: PropTypes.func.isRequired,
  updateColeccion: PropTypes.func.isRequired,
  titulo: PropTypes.string,
};

export default PagoCreador;

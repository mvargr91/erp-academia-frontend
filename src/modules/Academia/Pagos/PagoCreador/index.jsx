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
import { useSedes } from '../../../../shared/sedes';
import PagoForm from './PagoForm';

const hoy = () => new Date().toISOString().slice(0, 10);

const validationSchema = yup.object({
  alumno_id: yup.number().typeError('Requerido').required('Requerido'),
  curso_id: yup.number().nullable(),
  monto: yup.number().typeError('Debe ser un número').required('Requerido').min(0, 'No puede ser negativo'),
  fecha_pago: yup.string().required('Requerido'),
  metodo_pago: yup.string().required('Requerido'),
});

const initialValues = (registro, sedePorDefecto, inicial = {}) => ({
  id: registro?.id ?? '',
  sede_id: registro?.sede_id ?? sedePorDefecto,
  alumno_id: registro?.alumno_id ?? inicial.alumno_id ?? '',
  curso_id: registro?.curso_id ?? inicial.curso_id ?? '',
  plan_id: registro?.plan_id ?? '',
  paquete_id: registro?.paquete_id ?? inicial.paquete_id ?? '',
  monto: registro?.monto ?? inicial.monto ?? '',
  fecha_pago: registro?.fecha_pago ?? hoy(),
  metodo_pago: registro?.metodo_pago ?? 'efectivo',
  referencia: registro?.referencia ?? '',
  observacion: registro?.observacion ?? '',
});

const PagoCreador = ({ pago, accion, handleOnClose, updateColeccion, titulo, inicial }) => {
  const dispatch = useDispatch();
  const { coleccionLigera: alumnos } = useSelector((s) => s.alumnos);
  const { coleccionLigera: cursos } = useSelector((s) => s.cursos);
  const { sedePorDefecto } = useSedes();

  useEffect(() => {
    dispatch(onGetAlumnos());
    dispatch(onGetCursos());
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
      initialValues={(registro) => initialValues(registro, sedePorDefecto, inicial)}
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
  // Valores propuestos al crear (vienen de la URL): alumno_id, curso_id, paquete_id, monto.
  inicial: PropTypes.object,
};

export default PagoCreador;

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import AppCrudDialog from '../../../../shared/components/AppCrudDialog';
import {
  onShow,
  onCreate,
  resetActual,
} from '../../../../@crema/redux/features/pagosAcademias/pagosAcademiasSlice';
import { onGetColeccionLigera as onGetFacturas } from '../../../../@crema/redux/features/facturasAcademias/facturasAcademiasSlice';
import { validarArchivo } from '../../../../shared/components/MyFileField';
import PagoAcademiaForm from './PagoAcademiaForm';

const hoy = () => new Date().toISOString().slice(0, 10);

const validationSchema = yup.object({
  factura_id: yup.number().typeError('Requerido').required('Requerido'),
  valor: yup.number().typeError('Debe ser un número').required('Requerido').min(1, 'Debe ser mayor a 0'),
  fecha_pago: yup.string().required('Requerido'),
  metodo: yup.string().required('Requerido'),
  referencia: yup.string().nullable().max(100, 'Máximo 100 caracteres'),
  soporte: validarArchivo('documento'),
});

/**
 * Registro de un pago de una academia. "factura" permite abrirlo ya aplicado a una
 * cuenta de cobro (desde la lista de cuentas de cobro).
 */
const PagoAcademiaCreador = ({ pago, accion, handleOnClose, updateColeccion, titulo, factura }) => {
  const dispatch = useDispatch();
  const { coleccionLigera: facturas } = useSelector((s) => s.facturasAcademias);

  useEffect(() => {
    if (accion === 'crear') {
      dispatch(onGetFacturas());
    }
  }, [accion, dispatch]);

  const initialValues = (registro) => ({
    id: registro?.id ?? '',
    factura_id: registro?.factura_id ?? factura?.id ?? '',
    valor: registro?.valor ?? factura?.saldo ?? '',
    fecha_pago: registro?.fecha_pago ?? hoy(),
    metodo: registro?.metodo ?? 'transferencia',
    referencia: registro?.referencia ?? '',
    observacion: registro?.observacion ?? '',
    soporte: null,
  });

  return (
    <AppCrudDialog
      stateKey='pagosAcademias'
      registroId={pago}
      accion={accion}
      handleOnClose={handleOnClose}
      updateColeccion={updateColeccion}
      onShow={onShow}
      onCreate={onCreate}
      onUpdate={onCreate}
      resetActual={resetActual}
      initialValues={initialValues}
      validationSchema={validationSchema}
      maxWidth='sm'
    >
      {({ registro, saving }) => (
        <PagoAcademiaForm
          registro={registro}
          accion={accion}
          titulo={titulo}
          handleOnClose={handleOnClose}
          saving={saving}
          facturas={facturas ?? []}
        />
      )}
    </AppCrudDialog>
  );
};

PagoAcademiaCreador.propTypes = {
  pago: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  accion: PropTypes.string.isRequired,
  handleOnClose: PropTypes.func.isRequired,
  updateColeccion: PropTypes.func.isRequired,
  titulo: PropTypes.string,
  factura: PropTypes.object,
};

export default PagoAcademiaCreador;

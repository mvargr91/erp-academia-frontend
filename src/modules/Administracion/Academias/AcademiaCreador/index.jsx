import React from 'react';
import PropTypes from 'prop-types';
import * as yup from 'yup';
import AppCrudDialog from '../../../../shared/components/AppCrudDialog';
import {
  onShow,
  onCreate,
  onUpdate,
  resetActual,
} from '../../../../@crema/redux/features/academias/academiasSlice';
import { aRadio } from '../../../../shared/constants/Academia';
import AcademiaForm from './AcademiaForm';

// Tarifa sugerida al crear (VITE__ERP_TARIFA_MENSUAL); el backend usa ERP_TARIFA_MENSUAL si no llega.
const TARIFA_BASE = Number(import.meta.env.VITE__ERP_TARIFA_MENSUAL ?? 0);

const comunes = {
  nombre: yup.string().required('Requerido').max(150, 'Máximo 150 caracteres'),
  correo: yup.string().nullable().email('Correo inválido'),
  telefono: yup.string().nullable().max(30, 'Máximo 30 caracteres'),
  tarifa_mensual: yup.number().typeError('Debe ser un número').required('Requerido').min(0, 'No puede ser negativa'),
  dia_corte: yup
    .number()
    .typeError('Debe ser un número')
    .required('Requerido')
    .integer('Debe ser un número entero')
    .min(1, 'Entre 1 y 28')
    .max(28, 'Entre 1 y 28'),
  fecha_inicio_cobro: yup.string().nullable(),
};

const esquemaCrear = yup.object({
  ...comunes,
  codigo: yup
    .string()
    .required('Requerido')
    .matches(/^[a-z0-9][a-z0-9-]{1,38}$/, 'Solo minúsculas, números y guiones (2 a 39 caracteres)'),
  usuario_admin: yup.string().required('Requerido').max(50, 'Máximo 50 caracteres'),
  clave_admin: yup.string().required('Requerido').min(8, 'Mínimo 8 caracteres'),
});

const esquemaEditar = yup.object(comunes);

const initialValues = (registro) => ({
  id: registro?.id ?? '',
  codigo: registro?.codigo ?? '',
  nombre: registro?.nombre ?? '',
  correo: registro?.correo ?? '',
  telefono: registro?.telefono ?? '',
  tarifa_mensual: registro?.tarifa_mensual ?? TARIFA_BASE,
  dia_corte: registro?.dia_corte ?? Math.min(new Date().getDate(), 28),
  fecha_inicio_cobro: registro?.fecha_inicio_cobro ?? new Date().toISOString().slice(0, 10),
  activa: aRadio(registro?.activa),
  usuario_admin: '',
  clave_admin: '',
});

const AcademiaCreador = ({ academia, accion, handleOnClose, updateColeccion, titulo }) => (
  <AppCrudDialog
    stateKey='academias'
    registroId={academia}
    accion={accion}
    handleOnClose={handleOnClose}
    updateColeccion={updateColeccion}
    onShow={onShow}
    onCreate={onCreate}
    onUpdate={onUpdate}
    resetActual={resetActual}
    initialValues={initialValues}
    validationSchema={accion === 'crear' ? esquemaCrear : esquemaEditar}
    maxWidth='sm'
  >
    {({ registro, saving }) => (
      <AcademiaForm registro={registro} accion={accion} titulo={titulo} handleOnClose={handleOnClose} saving={saving} />
    )}
  </AppCrudDialog>
);

AcademiaCreador.propTypes = {
  academia: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  accion: PropTypes.string.isRequired,
  handleOnClose: PropTypes.func.isRequired,
  updateColeccion: PropTypes.func.isRequired,
  titulo: PropTypes.string,
};

export default AcademiaCreador;

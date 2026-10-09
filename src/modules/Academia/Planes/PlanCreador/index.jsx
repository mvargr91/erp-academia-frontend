import React from 'react';
import PropTypes from 'prop-types';
import * as yup from 'yup';
import AppCrudDialog from '../../../../shared/components/AppCrudDialog';
import {
  onShow,
  onCreate,
  onUpdate,
  resetActual,
} from '../../../../@crema/redux/features/planes/planesSlice';
import { aRadio } from '../../../../shared/constants/Academia';
import PlanForm from './PlanForm';

const validationSchema = yup.object({
  nombre: yup.string().required('Requerido').max(100, 'Máximo 100 caracteres'),
  descripcion: yup.string().nullable(),
  valor: yup.number().typeError('Debe ser un número').required('Requerido').min(0),
  periodicidad: yup.string().required('Requerido'),
});

const initialValues = (registro) => ({
  id: registro?.id ?? '',
  nombre: registro?.nombre ?? '',
  sede_id: registro?.sede_id ?? '',
  descripcion: registro?.descripcion ?? '',
  valor: registro?.valor ?? '',
  valor_alumno: registro?.valor_alumno ?? '',
  periodicidad: registro?.periodicidad ?? 'mensual',
  num_clases: registro?.num_clases ?? '',
  vigencia_dias: registro?.vigencia_dias ?? '',
  estado: aRadio(registro?.estado),
});

const PlanCreador = ({ plan, accion, handleOnClose, updateColeccion, titulo }) => (
  <AppCrudDialog
    stateKey='planes'
    registroId={plan}
    accion={accion}
    handleOnClose={handleOnClose}
    updateColeccion={updateColeccion}
    onShow={onShow}
    onCreate={onCreate}
    onUpdate={onUpdate}
    resetActual={resetActual}
    initialValues={initialValues}
    validationSchema={validationSchema}
    maxWidth='sm'
  >
    {({ registro, saving }) => (
      <PlanForm registro={registro} accion={accion} titulo={titulo} handleOnClose={handleOnClose} saving={saving} />
    )}
  </AppCrudDialog>
);

PlanCreador.propTypes = {
  plan: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  accion: PropTypes.string.isRequired,
  handleOnClose: PropTypes.func.isRequired,
  updateColeccion: PropTypes.func.isRequired,
  titulo: PropTypes.string,
};

export default PlanCreador;

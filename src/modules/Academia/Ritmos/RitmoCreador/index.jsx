import React from 'react';
import PropTypes from 'prop-types';
import * as yup from 'yup';
import AppCrudDialog from '../../../../shared/components/AppCrudDialog';
import {
  onShow,
  onCreate,
  onUpdate,
  resetActual,
} from '../../../../@crema/redux/features/ritmos/ritmosSlice';
import { aRadio } from '../../../../shared/constants/Academia';
import RitmoForm from './RitmoForm';

const validationSchema = yup.object({
  nombre: yup.string().required('Requerido').max(100, 'Máximo 100 caracteres'),
  descripcion: yup.string().nullable(),
});

const initialValues = (registro) => ({
  id: registro?.id ?? '',
  nombre: registro?.nombre ?? '',
  descripcion: registro?.descripcion ?? '',
  estado: aRadio(registro?.estado),
});

const RitmoCreador = ({ ritmo, accion, handleOnClose, updateColeccion, titulo }) => (
  <AppCrudDialog
    stateKey='ritmos'
    registroId={ritmo}
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
      <RitmoForm registro={registro} accion={accion} titulo={titulo} handleOnClose={handleOnClose} saving={saving} />
    )}
  </AppCrudDialog>
);

RitmoCreador.propTypes = {
  ritmo: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  accion: PropTypes.string.isRequired,
  handleOnClose: PropTypes.func.isRequired,
  updateColeccion: PropTypes.func.isRequired,
  titulo: PropTypes.string,
};

export default RitmoCreador;

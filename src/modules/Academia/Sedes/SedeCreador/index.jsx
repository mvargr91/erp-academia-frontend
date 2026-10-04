import React from 'react';
import PropTypes from 'prop-types';
import * as yup from 'yup';
import AppCrudDialog from '../../../../shared/components/AppCrudDialog';
import {
  onShow,
  onCreate,
  onUpdate,
  resetActual,
} from '../../../../@crema/redux/features/sedes/sedesSlice';
import { aRadio } from '../../../../shared/constants/Academia';
import SedeForm from './SedeForm';

const validationSchema = yup.object({
  nombre: yup.string().required('Requerido').max(100, 'Máximo 100 caracteres'),
  direccion: yup.string().nullable().max(255, 'Máximo 255 caracteres'),
  ciudad: yup.string().nullable().max(100, 'Máximo 100 caracteres'),
  telefono: yup.string().nullable().max(30, 'Máximo 30 caracteres'),
});

const initialValues = (registro) => ({
  id: registro?.id ?? '',
  nombre: registro?.nombre ?? '',
  direccion: registro?.direccion ?? '',
  ciudad: registro?.ciudad ?? '',
  telefono: registro?.telefono ?? '',
  estado: aRadio(registro?.estado),
});

const SedeCreador = ({ sede, accion, handleOnClose, updateColeccion, titulo }) => (
  <AppCrudDialog
    stateKey='sedes'
    registroId={sede}
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
      <SedeForm registro={registro} accion={accion} titulo={titulo} handleOnClose={handleOnClose} saving={saving} />
    )}
  </AppCrudDialog>
);

SedeCreador.propTypes = {
  sede: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  accion: PropTypes.string.isRequired,
  handleOnClose: PropTypes.func.isRequired,
  updateColeccion: PropTypes.func.isRequired,
  titulo: PropTypes.string,
};

export default SedeCreador;

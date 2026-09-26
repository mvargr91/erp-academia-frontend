import React from 'react';
import PropTypes from 'prop-types';
import * as yup from 'yup';
import AppCrudDialog from '../../../../shared/components/AppCrudDialog';
import {
  onShow,
  onCreate,
  onUpdate,
  resetActual,
} from '../../../../@crema/redux/features/profesores/profesoresSlice';
import { aRadio } from '../../../../shared/constants/Academia';
import ProfesorForm from './ProfesorForm';

const validationSchema = yup.object({
  nombres: yup.string().required('Requerido').max(100, 'Máximo 100 caracteres'),
  apellidos: yup.string().required('Requerido').max(100, 'Máximo 100 caracteres'),
  correo: yup.string().email('Correo inválido').nullable(),
  documento: yup.string().nullable(),
  telefono: yup.string().nullable(),
  especialidad: yup.string().nullable(),
});

const initialValues = (registro) => ({
  id: registro?.id ?? '',
  nombres: registro?.nombres ?? '',
  apellidos: registro?.apellidos ?? '',
  documento: registro?.documento ?? '',
  telefono: registro?.telefono ?? '',
  correo: registro?.correo ?? '',
  especialidad: registro?.especialidad ?? '',
  estado: aRadio(registro?.estado),
});

const ProfesorCreador = ({ profesor, accion, handleOnClose, updateColeccion, titulo }) => (
  <AppCrudDialog
    stateKey='profesores'
    registroId={profesor}
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
      <ProfesorForm registro={registro} accion={accion} titulo={titulo} handleOnClose={handleOnClose} saving={saving} />
    )}
  </AppCrudDialog>
);

ProfesorCreador.propTypes = {
  profesor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  accion: PropTypes.string.isRequired,
  handleOnClose: PropTypes.func.isRequired,
  updateColeccion: PropTypes.func.isRequired,
  titulo: PropTypes.string,
};

export default ProfesorCreador;

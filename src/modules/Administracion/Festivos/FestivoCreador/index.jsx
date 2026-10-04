import React from 'react';
import PropTypes from 'prop-types';
import * as yup from 'yup';
import AppCrudDialog from '../../../../shared/components/AppCrudDialog';
import AppCrudForm from '../../../../shared/components/AppCrudForm';
import MyTextField from '../../../../shared/components/MyTextField';
import MyDateField from '../../../../shared/components/MyDateField';
import {
  onShow,
  onCreate,
  resetActual,
} from '../../../../@crema/redux/features/festivos/festivosSlice';

const validationSchema = yup.object({
  fecha: yup.string().required('Requerido'),
  nombre: yup.string().required('Requerido').max(120, 'Máximo 120 caracteres'),
});

const initialValues = (registro) => ({
  id: registro?.id ?? '',
  fecha: registro?.fecha ?? '',
  nombre: registro?.nombre ?? '',
});

const FestivoCreador = ({ festivo, accion, handleOnClose, updateColeccion, titulo }) => (
  <AppCrudDialog
    stateKey='festivos'
    registroId={festivo}
    accion={accion}
    handleOnClose={handleOnClose}
    updateColeccion={updateColeccion}
    onShow={onShow}
    onCreate={onCreate}
    onUpdate={onCreate}
    resetActual={resetActual}
    initialValues={initialValues}
    validationSchema={validationSchema}
  >
    {({ saving }) => (
      <AppCrudForm titulo={titulo} accion={accion} handleOnClose={handleOnClose} saving={saving}>
        <MyDateField label='Fecha' name='fecha' disabled={accion === 'ver'} />
        <MyTextField fullWidth label='Nombre del festivo' name='nombre' disabled={accion === 'ver'} required />
      </AppCrudForm>
    )}
  </AppCrudDialog>
);

FestivoCreador.propTypes = {
  festivo: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  accion: PropTypes.string.isRequired,
  handleOnClose: PropTypes.func.isRequired,
  updateColeccion: PropTypes.func,
  titulo: PropTypes.string,
};

export default FestivoCreador;

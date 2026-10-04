import React from 'react';
import PropTypes from 'prop-types';
import * as yup from 'yup';
import { Alert } from '@mui/material';
import AppCrudDialog from '../../../../shared/components/AppCrudDialog';
import AppCrudForm from '../../../../shared/components/AppCrudForm';
import MyTextField from '../../../../shared/components/MyTextField';
import MyDateField from '../../../../shared/components/MyDateField';
import { CampoSede } from '../../../../shared/sedes';
import {
  onShow,
  onCreate,
  onUpdate,
  resetActual,
} from '../../../../@crema/redux/features/cierres/cierresSlice';

const validationSchema = yup.object({
  fecha_desde: yup.string().required('Requerido'),
  fecha_hasta: yup
    .string()
    .required('Requerido')
    .test('orden', 'No puede ser anterior a la fecha inicial', function (hasta) {
      return !hasta || !this.parent.fecha_desde || hasta >= this.parent.fecha_desde;
    }),
  motivo: yup.string().required('Requerido').max(150, 'Máximo 150 caracteres'),
});

const initialValues = (registro) => ({
  id: registro?.id ?? '',
  fecha_desde: registro?.fecha_desde ?? '',
  fecha_hasta: registro?.fecha_hasta ?? '',
  motivo: registro?.motivo ?? '',
  sede_id: registro?.sede_id ?? '',
});

const CierreCreador = ({ cierre, accion, handleOnClose, updateColeccion, titulo }) => (
  <AppCrudDialog
    stateKey='cierres'
    registroId={cierre}
    accion={accion}
    handleOnClose={handleOnClose}
    updateColeccion={updateColeccion}
    onShow={onShow}
    onCreate={onCreate}
    onUpdate={onUpdate}
    resetActual={resetActual}
    initialValues={initialValues}
    validationSchema={validationSchema}
  >
    {({ saving }) => (
      <AppCrudForm titulo={titulo} accion={accion} handleOnClose={handleOnClose} saving={saving}>
        <MyDateField label='Desde' name='fecha_desde' disabled={accion === 'ver'} />
        <MyDateField label='Hasta' name='fecha_hasta' disabled={accion === 'ver'} />
        <MyTextField
          className='campo-completo'
          fullWidth
          label='Motivo'
          name='motivo'
          placeholder='Ej.: Vacaciones de fin de año'
          disabled={accion === 'ver'}
          required
        />
        <CampoSede
          className='campo-completo'
          opcional
          disabled={accion === 'ver'}
          helperText='Elige una sede si solo cierra esa.'
        />
        <Alert severity='info' className='campo-completo'>
          Las clases que caigan en estas fechas no se cuentan: los ciclos de 4 clases de los alumnos se corren a la
          semana siguiente y su próximo pago también.
        </Alert>
      </AppCrudForm>
    )}
  </AppCrudDialog>
);

CierreCreador.propTypes = {
  cierre: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  accion: PropTypes.string.isRequired,
  handleOnClose: PropTypes.func.isRequired,
  updateColeccion: PropTypes.func,
  titulo: PropTypes.string,
};

export default CierreCreador;

import React from 'react';
import PropTypes from 'prop-types';
import * as yup from 'yup';
import { InputAdornment, TextField } from '@mui/material';
import AppCrudDialog from '../../../../shared/components/AppCrudDialog';
import AppCrudForm from '../../../../shared/components/AppCrudForm';
import MyTextField from '../../../../shared/components/MyTextField';
import { onShow, onUpdate, resetActual } from '../../../../@crema/redux/features/parametros/parametrosSlice';

const validationSchema = yup.object({
  valor: yup.string().when('tipo', {
    is: (tipo) => tipo === 'numero' || tipo === 'porcentaje',
    then: (s) =>
      s
        .required('Requerido')
        .test('numero', 'Debe ser un número', (v) => v !== undefined && !Number.isNaN(Number(v)))
        .test('rango', 'El porcentaje debe estar entre 0 y 100', function (v) {
          return this.parent.tipo !== 'porcentaje' || (Number(v) >= 0 && Number(v) <= 100);
        }),
    otherwise: (s) => s.nullable(),
  }),
});

const initialValues = (registro) => ({
  id: registro?.id ?? '',
  tipo: registro?.tipo ?? 'texto',
  valor: registro?.valor ?? '',
});

const ParametroCreador = ({ parametro, accion, handleOnClose, updateColeccion, titulo }) => (
  <AppCrudDialog
    stateKey='parametros'
    registroId={parametro}
    accion={accion}
    handleOnClose={handleOnClose}
    updateColeccion={updateColeccion}
    onShow={onShow}
    onCreate={onUpdate}
    onUpdate={onUpdate}
    resetActual={resetActual}
    initialValues={initialValues}
    validationSchema={validationSchema}
  >
    {({ registro, saving }) => (
      <AppCrudForm titulo={titulo} accion={accion} handleOnClose={handleOnClose} saving={saving}>
        <TextField className='campo-completo' variant='standard' label='Parámetro' value={registro?.descripcion ?? ''} disabled />
        <TextField variant='standard' label='Grupo' value={registro?.grupo ?? ''} disabled />
        <TextField variant='standard' label='Código (lo usa el sistema)' value={registro?.codigo ?? ''} disabled />
        {registro?.tipo === 'texto' ? (
          <MyTextField className='campo-completo' fullWidth multiline minRows={3} label='Valor' name='valor' disabled={accion === 'ver'} />
        ) : (
          <MyTextField
            fullWidth
            type='number'
            label='Valor'
            name='valor'
            disabled={accion === 'ver'}
            required
            InputProps={registro?.tipo === 'porcentaje' ? { endAdornment: <InputAdornment position='end'>%</InputAdornment> } : undefined}
          />
        )}
      </AppCrudForm>
    )}
  </AppCrudDialog>
);

ParametroCreador.propTypes = {
  parametro: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  accion: PropTypes.string.isRequired,
  handleOnClose: PropTypes.func.isRequired,
  updateColeccion: PropTypes.func,
  titulo: PropTypes.string,
};

export default ParametroCreador;

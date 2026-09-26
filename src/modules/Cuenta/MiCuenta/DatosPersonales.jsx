import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import { Box, Button, CircularProgress, Grid, TextField } from '@mui/material';
import { onUpdateCuenta } from '@crema/redux/features/cuenta/cuentaSlice';
import MyTextField from '../../../shared/components/MyTextField';
import Seccion, { valoresIniciales } from './Seccion';

const esquema = yup.object({
  nombre: yup.string().required('Requerido').max(128, 'Máximo 128 caracteres'),
  correo_electronico: yup.string().required('Requerido').email('Correo inválido').max(128),
});

const DatosPersonales = ({ cuenta }) => {
  const dispatch = useDispatch();
  const saving = useSelector((state) => state.cuenta.saving);

  return (
    <Formik
      enableReinitialize
      initialValues={valoresIniciales(cuenta, ['nombre', 'correo_electronico'])}
      validationSchema={esquema}
      onSubmit={(params) => dispatch(onUpdateCuenta({ params }))}
    >
      {() => (
        <Form noValidate>
          <Seccion titulo='Datos personales' descripcion='Tu nombre y el correo donde recibirás las notificaciones.'>
            <Grid item xs={12} md={6}>
              <MyTextField name='nombre' label='Nombre completo' fullWidth required variant='outlined' />
            </Grid>
            <Grid item xs={12} md={6}>
              <MyTextField name='correo_electronico' label='Correo electrónico' type='email' fullWidth required variant='outlined' />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label='Número de identificación'
                value={cuenta.identificacion_usuario ?? ''}
                helperText='Es tu usuario para ingresar; no se puede cambiar.'
                fullWidth
                disabled
              />
            </Grid>
          </Seccion>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type='submit'
              variant='contained'
              disabled={saving}
              startIcon={saving ? <CircularProgress size={16} color='inherit' /> : null}
            >
              Guardar cambios
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

DatosPersonales.propTypes = {
  cuenta: PropTypes.object.isRequired,
};

export default DatosPersonales;

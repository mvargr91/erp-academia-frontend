import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import { Box, Button, CircularProgress, Grid } from '@mui/material';
import { onCambiarClave } from '@crema/redux/features/cuenta/cuentaSlice';
import MyTextField from '../../../shared/components/MyTextField';
import Seccion from './Seccion';

const VACIO = { clave_actual: '', clave: '', clave_confirmation: '' };

const esquema = yup.object({
  clave_actual: yup.string().required('Requerido'),
  clave: yup
    .string()
    .required('Requerido')
    .min(8, 'Mínimo 8 caracteres')
    .max(32, 'Máximo 32 caracteres')
    .notOneOf([yup.ref('clave_actual')], 'Debe ser distinta de la actual'),
  clave_confirmation: yup
    .string()
    .required('Requerido')
    .oneOf([yup.ref('clave')], 'Las contraseñas no coinciden'),
});

const Seguridad = () => {
  const dispatch = useDispatch();
  const saving = useSelector((state) => state.cuenta.saving);

  return (
    <Formik
      initialValues={VACIO}
      validationSchema={esquema}
      onSubmit={(params, { resetForm }) =>
        dispatch(onCambiarClave({ params, onSuccess: () => resetForm({ values: VACIO }) }))
      }
    >
      <Form noValidate>
        <Seccion titulo='Cambiar contraseña' descripcion='Por seguridad te pedimos tu contraseña actual.'>
          <Grid item xs={12} md={6}>
            <MyTextField name='clave_actual' label='Contraseña actual' type='password' fullWidth required variant='outlined' autoComplete='current-password' />
          </Grid>
          <Grid item md={6} sx={{ display: { xs: 'none', md: 'block' } }} />
          <Grid item xs={12} md={6}>
            <MyTextField name='clave' label='Nueva contraseña' type='password' fullWidth required variant='outlined' autoComplete='new-password' />
          </Grid>
          <Grid item xs={12} md={6}>
            <MyTextField name='clave_confirmation' label='Repite la nueva contraseña' type='password' fullWidth required variant='outlined' autoComplete='new-password' />
          </Grid>
        </Seccion>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type='submit'
            variant='contained'
            disabled={saving}
            startIcon={saving ? <CircularProgress size={16} color='inherit' /> : null}
          >
            Actualizar contraseña
          </Button>
        </Box>
      </Form>
    </Formik>
  );
};

export default Seguridad;

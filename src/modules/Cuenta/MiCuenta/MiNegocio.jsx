// Datos del negocio del proveedor, agrupados como el formulario "Únete como proveedor".
// Solo campos que existen en proveedores_turisticos; la verificación la decide el administrador.
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import { Box, Button, CircularProgress, Grid, MenuItem, TextField } from '@mui/material';
import { onUpdateNegocio } from '@crema/redux/features/cuenta/cuentaSlice';
import { onGetColeccion as onGetDestinos } from '@crema/redux/features/portalDestinos/portalDestinosSlice';
import MyTextField from '../../../shared/components/MyTextField';
import Seccion, { valoresIniciales } from './Seccion';

const CAMPOS = [
  'nombre_comercial', 'razon_social', 'nit', 'destino_id', 'direccion', 'rnt',
  'telefono', 'correo', 'sitio_web', 'instagram', 'facebook', 'descripcion',
];

const esquema = yup.object({
  nombre_comercial: yup.string().required('Requerido').max(150, 'Máximo 150 caracteres'),
  razon_social: yup.string().max(150, 'Máximo 150 caracteres'),
  nit: yup.string().max(50),
  rnt: yup.string().max(50),
  direccion: yup.string().max(255),
  telefono: yup.string().max(30).matches(/^[+]?[0-9\s-]*$/, 'Teléfono inválido'),
  correo: yup.string().email('Correo inválido').max(128),
  sitio_web: yup.string().url('Debe ser una URL válida (https://...)').max(255),
  instagram: yup.string().max(255),
  facebook: yup.string().max(255),
});

// '' -> null para que el backend guarde vacío en los opcionales (destino_id es entero).
const aParams = (valores) =>
  Object.fromEntries(Object.entries(valores).map(([campo, valor]) => [campo, valor === '' ? null : valor]));

const MiNegocio = ({ proveedor }) => {
  const dispatch = useDispatch();
  const saving = useSelector((state) => state.cuenta.saving);
  const destinos = useSelector((state) => state.portalDestinos.rows);

  useEffect(() => {
    if (!destinos.length) dispatch(onGetDestinos());
  }, [dispatch, destinos.length]);

  const campo = (name, label, { md = 6, ...props } = {}) => (
    <Grid item xs={12} md={md}>
      <MyTextField name={name} label={label} fullWidth variant='outlined' {...props} />
    </Grid>
  );

  return (
    <Formik
      enableReinitialize
      initialValues={valoresIniciales(proveedor, CAMPOS)}
      validationSchema={esquema}
      onSubmit={(valores) => dispatch(onUpdateNegocio({ params: aParams(valores) }))}
    >
      {({ values, handleChange }) => (
        <Form noValidate>
          <Seccion titulo='Información del negocio'>
            {campo('nombre_comercial', 'Nombre comercial', { required: true })}
            {campo('razon_social', 'Razón social')}
            {campo('nit', 'NIT')}
            <Grid item xs={12} md={6}>
              <TextField select name='destino_id' label='Destino principal' fullWidth value={values.destino_id} onChange={handleChange}>
                <MenuItem value=''>Sin definir</MenuItem>
                {destinos.map((destino) => (
                  <MenuItem key={destino.id} value={destino.id}>
                    {destino.nombre}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {campo('direccion', 'Dirección', { md: 12 })}
          </Seccion>

          <Seccion titulo='Documentación legal' descripcion='Necesaria para verificar tu negocio.'>
            {campo('rnt', 'Registro Nacional de Turismo (RNT)')}
          </Seccion>

          <Seccion titulo='Contacto' descripcion='Datos que verán los viajeros.'>
            {campo('telefono', 'Teléfono / WhatsApp')}
            {campo('correo', 'Correo de contacto', { type: 'email' })}
          </Seccion>

          <Seccion titulo='Presencia en línea'>
            {campo('sitio_web', 'Sitio web', { placeholder: 'https://', md: 4 })}
            {campo('instagram', 'Instagram', { placeholder: '@tu_negocio', md: 4 })}
            {campo('facebook', 'Facebook', { md: 4 })}
          </Seccion>

          <Seccion titulo='Descripción' descripcion='Cuéntale a los viajeros qué hace especial a tu negocio.'>
            {campo('descripcion', 'Descripción', { multiline: true, minRows: 4, md: 12 })}
          </Seccion>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type='submit'
              variant='contained'
              disabled={saving}
              startIcon={saving ? <CircularProgress size={16} color='inherit' /> : null}
            >
              Guardar datos del negocio
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

MiNegocio.propTypes = {
  proveedor: PropTypes.object.isRequired,
};

export default MiNegocio;

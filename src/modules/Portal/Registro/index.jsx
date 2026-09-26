// Registro público: viajero (rol Cliente) o proveedor (rol Proveedor, verificación pendiente).
// Tras crear la cuenta inicia sesión con el mismo login del proyecto y redirige.
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  Divider,
  FormControlLabel,
  FormHelperText,
  Grid,
  Link,
  MenuItem,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import LuggageIcon from '@mui/icons-material/Luggage';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { onCreate } from '@crema/redux/features/portalRegistro/portalRegistroSlice';
import { onGetColeccion as onGetDestinos } from '@crema/redux/features/portalDestinos/portalDestinosSlice';
import { login } from '@crema/redux/features/auth/authSlice';
import { useAuthMethod } from '@crema/hooks/AuthHooks';
import MyTextField from '../../../shared/components/MyTextField';
import { urlPanelDe } from '../../../shared/components/Portal/PortalHeader';
import { MARCA } from '../../../shared/constants/Marca';

const esquemaBase = {
  nombre: yup.string().required('Requerido').max(128, 'Máximo 128 caracteres'),
  identificacion_usuario: yup
    .string()
    .required('Requerido')
    .max(128, 'Máximo 128 caracteres')
    .matches(/^[A-Za-z0-9.-]+$/, 'Solo letras, números, puntos o guiones'),
  correo_electronico: yup.string().required('Requerido').email('Correo inválido'),
  clave: yup.string().required('Requerido').min(8, 'Mínimo 8 caracteres'),
  clave_confirmation: yup
    .string()
    .required('Requerido')
    .oneOf([yup.ref('clave')], 'Las contraseñas no coinciden'),
  acepta_terminos: yup.boolean().oneOf([true], 'Debe aceptar para continuar'),
};

const esquemas = {
  cliente: yup.object(esquemaBase),
  proveedor: yup.object({
    ...esquemaBase,
    nombre_comercial: yup.string().required('Requerido').max(150, 'Máximo 150 caracteres'),
    telefono: yup.string().max(30).matches(/^[+]?[0-9\s-]*$/, 'Teléfono inválido').nullable(),
  }),
};

const valoresIniciales = {
  nombre: '',
  identificacion_usuario: '',
  correo_electronico: '',
  clave: '',
  clave_confirmation: '',
  acepta_terminos: false,
  nombre_comercial: '',
  nit: '',
  telefono: '',
  destino_id: '',
};

const Registro = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tipo = searchParams.get('tipo') === 'proveedor' ? 'proveedor' : 'cliente';
  const redirect = searchParams.get('redirect');
  const { saving } = useSelector((state) => state.portalRegistro);
  const destinos = useSelector((state) => state.portalDestinos.rows);
  const [ingresando, setIngresando] = useState(false);
  const { signInUser } = useAuthMethod();

  useEffect(() => {
    if (destinos.length === 0) dispatch(onGetDestinos());
  }, [dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  const cambiarTipo = (nuevo) => {
    const params = new URLSearchParams(searchParams);
    params.set('tipo', nuevo);
    setSearchParams(params, { replace: true });
  };

  // Mismo par de llamadas que SigninJwtAuth: signInUser deja el token en jwtAxios
  // (si no, las peticiones siguientes salen sin Authorization) y login actualiza Redux.
  const ingresar = async ({ identificacion_usuario: username, clave: password }) => {
    setIngresando(true);
    await signInUser({ username, password });
    dispatch(login({ username, password }))
      .unwrap()
      .then(({ user }) => navigate(redirect || urlPanelDe(user), { replace: true }))
      .catch(() => navigate('/signin', { replace: true }))
      .finally(() => setIngresando(false));
  };

  const enviar = (valores) => {
    const params = { ...valores, tipo };
    if (tipo === 'cliente') {
      ['nombre_comercial', 'nit', 'telefono', 'destino_id'].forEach((campo) => delete params[campo]);
    }
    dispatch(onCreate({ params, handleOnClose: () => ingresar(valores) }));
  };

  const ocupado = saving || ingresando;

  return (
    <Container maxWidth='md' sx={{ py: 6 }}>
      <Paper sx={{ p: { xs: 3, md: 5 } }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box component='img' src={MARCA.logos.principal} alt={MARCA.nombre} sx={{ height: 80 }} />
          <Typography variant='h2' sx={{ mt: 1 }}>Crea tu cuenta</Typography>
          <Typography color='text.secondary'>
            ¿Ya tienes una? <Link component={RouterLink} to={redirect ? `/signin?redirect=${redirect}` : '/signin'}>Ingresa</Link>
          </Typography>
        </Box>

        <Tabs value={tipo} onChange={(e, v) => cambiarTipo(v)} variant='fullWidth' sx={{ mb: 3 }}>
          <Tab value='cliente' icon={<LuggageIcon />} iconPosition='start' label='Quiero viajar' />
          <Tab value='proveedor' icon={<StorefrontIcon />} iconPosition='start' label='Tengo un negocio turístico' />
        </Tabs>

        {tipo === 'proveedor' && (
          <Alert severity='info' sx={{ mb: 3 }}>
            Tu negocio quedará <strong>pendiente de verificación</strong>. Mientras tanto puedes crear tus experiencias
            en borrador; nuestro equipo las revisa antes de publicarlas.
          </Alert>
        )}

        <Formik
          key={tipo}
          initialValues={valoresIniciales}
          validationSchema={esquemas[tipo]}
          validateOnBlur={false}
          onSubmit={enviar}
        >
          {({ values, errors, touched, setFieldValue, handleChange }) => (
            <Form noValidate>
              <Grid container spacing={2.5}>
                {tipo === 'proveedor' && (
                  <>
                    <Grid item xs={12}>
                      <Divider textAlign='left'>Tu negocio</Divider>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <MyTextField name='nombre_comercial' label='Nombre comercial' fullWidth required variant='outlined' />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <MyTextField name='nit' label='NIT (opcional)' fullWidth variant='outlined' />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <MyTextField name='telefono' label='Teléfono / WhatsApp' fullWidth variant='outlined' />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField select name='destino_id' label='Destino principal' fullWidth value={values.destino_id} onChange={handleChange}>
                        <MenuItem value=''>Sin definir</MenuItem>
                        {destinos.map((d) => <MenuItem key={d.id} value={d.id}>{d.nombre}</MenuItem>)}
                      </TextField>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider textAlign='left'>Tus datos de acceso</Divider>
                    </Grid>
                  </>
                )}
                <Grid item xs={12} sm={6}>
                  <MyTextField name='nombre' label='Nombre completo' fullWidth required variant='outlined' />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MyTextField name='correo_electronico' label='Correo electrónico' type='email' fullWidth required variant='outlined' />
                </Grid>
                <Grid item xs={12}>
                  <MyTextField
                    name='identificacion_usuario'
                    label='Número de documento (será tu usuario para ingresar)'
                    fullWidth
                    required
                    variant='outlined'
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MyTextField name='clave' label='Contraseña' type='password' fullWidth required variant='outlined' />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MyTextField name='clave_confirmation' label='Repite la contraseña' type='password' fullWidth required variant='outlined' />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={values.acepta_terminos}
                        onChange={(e) => setFieldValue('acepta_terminos', e.target.checked)}
                      />
                    }
                    label='Acepto los términos de uso y la política de tratamiento de datos personales.'
                  />
                  {touched.acepta_terminos && errors.acepta_terminos && (
                    <FormHelperText error>{errors.acepta_terminos}</FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type='submit'
                    variant='contained'
                    size='large'
                    fullWidth
                    disabled={ocupado}
                    startIcon={ocupado ? <CircularProgress size={18} color='inherit' /> : null}
                  >
                    {ingresando ? 'Ingresando...' : tipo === 'proveedor' ? 'Registrar mi negocio' : 'Crear cuenta'}
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
};

export default Registro;

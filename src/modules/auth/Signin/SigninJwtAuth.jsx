import React from 'react';
import Button from '@mui/material/Button';
import { Checkbox } from '@mui/material';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import AppInfoView from '@crema/components/AppInfoView';
import { Link, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import IntlMessages from '@crema/helpers/IntlMessages';
import { useIntl } from 'react-intl';
import AppTextField from '@crema/components/AppFormComponents/AppTextField';
import { useAuthMethod } from '@crema/hooks/AuthHooks';
import { Fonts } from '@crema/constants/AppEnums';
import AuthWrapper from '../AuthWrapper';
import { useDispatch, useSelector } from 'react-redux';
import {login} from '../../../@crema/redux/features/auth/authSlice';
import { styled, useTheme } from '@mui/material/styles';
import { PORTAL_HABILITADO } from '../../../shared/constants/RutasPortal';


const validationSchema = yup.object({
  username: yup
    .string()
    .required(<IntlMessages id='validation.emailRequired' />),
  password: yup
    .string()
    .required(<IntlMessages id='validation.passwordRequired' />),
});

const SigninJwtAuth = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { signInUser } = useAuthMethod();
  const onGoToForgetPassword = () => {
    navigate('/forget-password', { tab: 'jwtAuth' });
  };
  const isSigninRoute = location.pathname === '/signin';
  const { messages } = useIntl();
  const dispatch = useDispatch(); // Inicializar dispatch
  const { loading, error } = useSelector((state) => state.auth);

  return (
    <AuthWrapper>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', mb: 5 }}>
          <Formik
            validateOnChange={true}
            initialValues={{
              username: '',
              password: '',
            }}
            validationSchema={validationSchema}
            onSubmit={(data, { setSubmitting }) => {
              setSubmitting(true);
              signInUser({
                username: data.username,
                password: data.password,
              });
              dispatch(login({ username: data.username, password: data.password }))
              .unwrap() // Para manejar las promesas correctamente
              .then(() => {
                // navigate('/inversiones'); // Redirigir al home si el login fue exitoso
              })
              .catch((err) => {
                console.error('Error de login:', err); // Manejar el error si es necesario
              })
              .finally(() => {
                setSubmitting(false); // Detener el estado de submitting
              });
              setSubmitting(false);
            }}
          >
            {({ isSubmitting }) => (
              <Form style={{ textAlign: 'left' }} noValidate autoComplete='off'>
                <Box sx={{ mb: { xs: 5, xl: 8 } }}>
                  <AppTextField
                    placeholder={messages['usuario']}
                    name='username'
                    label={<IntlMessages id='Usuario' />}
                    variant='outlined'
                    sx={{
                      width: '100%',
                      '& .MuiInputBase-input': {
                        fontSize: 14,
                      },
                    }}
                  />
                </Box>

                <Box sx={{ mb: { xs: 3, xl: 4 } }}>
                  <AppTextField
                    type='password'
                    placeholder={messages['common.password']}
                    label={<IntlMessages id='common.password' />}
                    name='password'
                    variant='outlined'
                    sx={{
                      width: '100%',
                      '& .MuiInputBase-input': {
                        fontSize: 14,
                      },
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    mb: { xs: 3, xl: 4 },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {/* <Checkbox color='primary' sx={{ ml: -3 }} /> */}
                    {/* <Box
                      component='span'
                      sx={{
                        color: 'grey.700',
                      }}
                    >
                      <IntlMessages id='common.rememberMe' />
                    </Box> */}
                  </Box>
                  <Box
                    component='span'
                    sx={{
                      color: (theme) => theme.palette.primary.main,
                      fontWeight: Fonts.MEDIUM,
                      cursor: 'pointer',
                      display: 'block',
                      textAlign: 'right',
                    }}
                    onClick={onGoToForgetPassword}
                  >
                    <IntlMessages id='common.forgetPassword' />
                  </Box>
                </Box>

                <div style={{
                  display: 'flex',
                  alignContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  flexDirection: 'column'
                }}>
                  <Button
                    variant='contained'
                    color='primary'
                    type='submit'
                    disabled={isSubmitting || loading}
                    sx={{
                      minWidth: 160,
                      fontWeight: Fonts.REGULAR,
                      fontSize: 16,
                      textTransform: 'capitalize',
                      padding: '4px 16px 8px',
                      display: 'flex',
                      alignContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <IntlMessages id='common.login' />
                  </Button>
                  {PORTAL_HABILITADO && (
                    <Box sx={{ mt: 2, fontSize: 13, display: 'flex', gap: 2 }}>
                      <Box component='span' sx={{ color: 'primary.main', cursor: 'pointer' }} onClick={() => navigate('/registro')}>
                        Crear cuenta
                      </Box>
                      <Box component='span' sx={{ color: 'text.secondary', cursor: 'pointer' }} onClick={() => navigate('/')}>
                        Volver al portal
                      </Box>
                    </Box>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </Box>

        <AppInfoView />
      </Box>
    </AuthWrapper>
  );
};

export default SigninJwtAuth;

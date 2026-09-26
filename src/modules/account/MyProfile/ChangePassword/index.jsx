import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import IntlMessages from '@crema/helpers/IntlMessages';
import { Fonts } from '@crema/constants/AppEnums';
import ChangePasswordForm from './ChangePasswordForm';
import { Formik } from 'formik';
import * as yup from 'yup';
import { onChangePassword }  from '../../../../@crema/redux/features/usuarios/usuariosSlice';
import { useDispatch, useSelector } from 'react-redux';
import {
  UPDATE_TYPE,
  CREATE_TYPE,
} from '../../../../shared/constants/Constantes';
import AppMessageView from '@crema/components/AppMessageView';


let validationSchema = yup.object({
  id: yup.number().required('Requerido'),
  password: yup.string().required('Requerido').min(4, 'Debe ser de al menos 4 caracteres'),
  confirm_password: yup
    .string()
    .required('Requerido')
    .oneOf([yup.ref('password')], 'Las contraseñas no coinciden'),
});

const ChangePassword = (props) => {
  const { usuario } = props;
  const dispatch = useDispatch();
  const {message, error, messageType} = useSelector(({common}) => common);
  return (
    <Box
      sx={{
        position: 'relative',
        maxWidth: 550,
      }}
    >
      <Typography
        component='h3'
        sx={{
          fontSize: 16,
          fontWeight: Fonts.BOLD,
          mb: { xs: 3, lg: 5 },
        }}
      >
        <IntlMessages id='common.changePassword' />
      </Typography>
      <Formik
        validateOnChange={false}
        validateOnBlur={true}
        initialValues={{
          id: usuario?.usuario.id,
          password: '',
          confirm_password: null,
        }}
        validationSchema={validationSchema}
        onSubmit={(data, { setSubmitting }) => {
          setSubmitting(true);
          dispatch(onChangePassword({params: data}));
          setSubmitting(false);
        }}
      >
        {() => <ChangePasswordForm />}
      </Formik>
      <AppMessageView
          variant={
            messageType === UPDATE_TYPE || messageType === CREATE_TYPE
              ? 'success'
              : 'error'
          }
          message={
            messageType === UPDATE_TYPE || messageType === CREATE_TYPE
              ? message
              : ''
          }
        />
    </Box>
  );
};

export default ChangePassword;

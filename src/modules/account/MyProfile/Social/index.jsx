import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import { Fonts } from '@crema/constants/AppEnums';
import IntlMessages from '@crema/helpers/IntlMessages';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import SocialForm from './SocialForm';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import {
  UPDATE_TYPE,
  CREATE_TYPE,
} from '../../../../shared/constants/Constantes';
import AppMessageView from '@crema/components/AppMessageView';
import { countries } from '@crema/mockapi';
import { onShow, onUpdate } from '../../../../@crema/redux/features/usuarios/usuariosSlice';


const validationSchema = yup.object({
  red_social1: yup.string().label('Ingresa una red social'),
  red_social2: yup.string().label('Ingresa un red social'),
});

const Social = ({ social }) => {
  const { user } = useSelector(({ auth }) => auth);
  const dispatch = useDispatch();
  const { message, error, messageType } = useSelector(({ common }) => common);
  const selectedRow = useSelector((state) => state.usuarios.usuarioActual);

  useEffect(() => {
    if (user?.usuario?.id) {
      dispatch(onShow(user.usuario.id)); // Cargar datos del usuario autenticado
    }
  }, [dispatch, user]);

  if (!selectedRow) {
    return <p>Cargando información del usuario...</p>;
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <Typography
        component='h3'
        sx={{
          fontSize: 16,
          fontWeight: Fonts.BOLD,
          mb: { xs: 3, lg: 5 },
        }}
      >
        <IntlMessages id='common.socialLinks' />
      </Typography>
      <Formik
        validateOnChange={false}
        validateOnBlur={true}
        initialValues={{
          id: selectedRow.id,
          nombre: selectedRow.nombre,
          identificacion_usuario: selectedRow.identificacion_usuario,
          rol_id: selectedRow.rol_id,
          red_social1: selectedRow.red_social1,
          red_social2: selectedRow.red_social2,
        }}
        validationSchema={validationSchema}
        onSubmit={(data, { setSubmitting }) => {
          setSubmitting(true);
          dispatch(onUpdate({ params: data }));
          setSubmitting(false);
        }}
      >
        <SocialForm social={social} />
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

export default Social;

Social.propTypes = {
  social: PropTypes.array,
};

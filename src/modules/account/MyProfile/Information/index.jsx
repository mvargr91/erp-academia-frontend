import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import * as yup from 'yup';
import { Fonts } from '@crema/constants/AppEnums';
import IntlMessages from '@crema/helpers/IntlMessages';
import InfoForm from './InfoForm';
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import {
  UPDATE_TYPE,
  CREATE_TYPE,
} from '../../../../shared/constants/Constantes';
import AppMessageView from '@crema/components/AppMessageView';
import { countries } from '@crema/mockapi';
import { onShow, onUpdate } from '../../../../@crema/redux/features/usuarios/usuariosSlice';

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const validationSchema = yup.object({
  phone: yup.string().matches(phoneRegExp, 'Phone number is not valid'),
});

const Information = () => {
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
    <Box
      sx={{
        position: 'relative',
        maxWidth: 550,
      }}
    >
      <Typography
        component="h3"
        sx={{
          fontSize: 16,
          fontWeight: Fonts.BOLD,
          mb: { xs: 3, lg: 5 },
        }}
      >
        <IntlMessages id="common.information" />
      </Typography>
      <Formik
        validateOnChange={false}
        validateOnBlur={true}
        enableReinitialize={true} // Permite reinicializar el formulario cuando cambien los valores iniciales
        initialValues={{
          id: selectedRow.id,
          nombre: selectedRow.nombre,
          identificacion_usuario: selectedRow.identificacion_usuario,
          rol_id: selectedRow.rol_id,
          country: countries.find((c) => c.label === selectedRow.pais) || null,
          web: selectedRow.web,
          telefono: selectedRow.telefono,
          fecha_nacimiento: selectedRow.fecha_nacimiento
            ? new Date(selectedRow.fecha_nacimiento)
            : null,
        }}
        validationSchema={validationSchema}
        onSubmit={(data, { setSubmitting }) => {
          setSubmitting(true);
          // Llama a la acción de actualización
          dispatch(onUpdate({ params: data }));
          setSubmitting(false);
        }}
      >
        {({ values, setFieldValue }) => (
          <InfoForm
            values={values}
            setFieldValue={setFieldValue}
            selectedRow={selectedRow}
          />
        )}
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

export default Information;

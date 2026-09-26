import React, { useEffect, useState } from 'react';
import { useAuthUser } from '@crema/hooks/AuthHooks';
import { Formik } from 'formik';
import * as yup from 'yup';
import PersonalInfoForm from './PersonalInfoForm';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { onShow, onUpdate  } from '../../../../@crema/redux/features/usuarios/usuariosSlice';
import { onGetColeccionLigera as onGetRoles } from '../../../../@crema/redux/features/rol/rolesSlice';
import {
  UPDATE_TYPE,
  CREATE_TYPE,
} from '../../../../shared/constants/Constantes';
import AppMessageView from '@crema/components/AppMessageView';


const validationSchema = yup.object({
  nombre: yup.string().required('Requerido'),
  identificacion_usuario: yup.string().required('Requerido'),
  rol_id: yup.number().required('Requerido'),
  correo_electronico: yup
    .string()
    .email('Formato de Email No Válido')
    .required('Requerido'),
});
const PersonalInfo = (props) => {
  const { user } = props;
  const [usuario, setUsuario] = useState('');
  const dispatch = useDispatch();
  const selectedRow = useSelector((state) => state.usuarios.usuarioActual);
  const { coleccionLigera: roles } = useSelector((state) => state.roles);
  const { message, error, messageType } = useSelector(({ common }) => common);
  
  useEffect(() => {
    if (user) {
      dispatch(onShow(usuario?.usuario?.id)); // Cargar datos del usuario autenticado
    }
  }, [dispatch, user]);

   // Sincroniza el estado del usuario con el obtenido de `useAuthUser`
   useEffect(() => {
    if (user) {
      setUsuario(user);
    }
  }, [dispatch, user, usuario]);

  useEffect(() => {
    dispatch(onGetRoles());
  }, [dispatch]);

  if (!usuario) {
    return <p>Cargando información del usuario...</p>; 
  }

  return (
    <Box
      sx={{
        position: 'relative',
        maxWidth: 550,
      }}
    >
      <Formik
        validateOnBlur={true}
        initialValues={{
          id: selectedRow ? selectedRow?.id : usuario?.usuario.id,
          identificacion_usuario: selectedRow ? selectedRow?.identificacion_usuario : usuario?.usuario.identificacion_usuario,
          nombre: selectedRow ? selectedRow?.nombre : usuario?.usuario.nombre,
          rol_id: selectedRow ? selectedRow?.rol_id : usuario?.usuario.rol.id,
          correo_electronico: selectedRow ? selectedRow.correo_electronico : usuario?.usuario.correo_electronico,
          estado: selectedRow ? selectedRow.estado : usuario?.usuario.estado,
        }}
        validationSchema={validationSchema}
        onSubmit={(data, { setSubmitting }) => {
          setSubmitting(true);
          dispatch(
            onUpdate({
              params: data,
              handleOnClose: () => dispatch(onShow(user?.usuario?.id)), // Refrescar datos después de actualizar
            })
          );
          setSubmitting(false);
        }}
      >
        {({ values, initialValues }) => {
          return (
            <PersonalInfoForm 
              values={values} 
              initialValues={initialValues}
              roles={roles}
              usuario={usuario}
            />
          );
        }}
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

export default PersonalInfo;

PersonalInfo.propTypes = {
  setFieldValue: PropTypes.func,
  values: PropTypes.string,
};

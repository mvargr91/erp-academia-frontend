import React, { useEffect, useRef, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import AppScrollbar from '../../../../@crema/components/AppScrollbar';
import { onShow, onCreate, onUpdate, resetUsuarioActual  } from '../../../../@crema/redux/features/usuarios/usuariosSlice';
import { onGetColeccionLigera as onGetRoles } from '../../../../@crema/redux/features/rol/rolesSlice';
import Slide from '@mui/material/Slide';
import UsuarioForm from './UsuarioForm';
import { Fonts } from '../../../../shared/constants/AppEnums';
import { styled } from '@mui/material/styles';
import AppLoader from '@crema/components/AppLoader';
import { countries } from '@crema/mockapi';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

let validationSchema = yup.object({
  nombre: yup.string().required('Requerido'),
  identificacion_usuario: yup.string().required('Requerido'),
  rol_id: yup.number().required('Requerido'),
  cliente_id: yup.number().required('Requerido'),
  correo_electronico: yup
    .string()
    .email('Formato de Email No Válido')
    .required('Requerido'),
});

// Usando styled para definir los estilos del Dialog
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paperWidthSm': {
    maxWidth: 600,
    width: '100%',
  },
  '& .MuiTypography-h6': {
    fontWeight: Fonts.LIGHT,
  },
}));

const UsuarioCreador = (props) => {
  const { usuario, handleOnClose, accion, updateColeccion, titulo } = props;
  const dispatch = useDispatch();
  // Definimos el esquema de validación dependiendo de la acción
  if (accion === 'crear') {
    validationSchema = yup.object({
      nombre: yup.string().required('Requerido'),
      identificacion_usuario: yup.string().required('Requerido'),
      rol_id: yup.number().required('Requerido'),
      correo_electronico: yup
        .string()
        .email('Formato de Email No Válido')
        .required('Requerido'),
      clave: yup.string().required('Requerido'),
    });
  } else {
    validationSchema = yup.object({
      nombre: yup.string().required('Requerido'),
      identificacion_usuario: yup.string().required('Requerido'),
      rol_id: yup.number().required('Requerido'),
      correo_electronico: yup
        .string()
        .email('Formato de Email No Válido')
        .required('Requerido'),
    });
  }

  const [showForm, setShowForm] = useState(false);
  const selectedRow = useSelector((state) => state.usuarios.usuarioActual);
  const loading = useSelector((state) => state.usuarios.loading);
  const { coleccionLigera: roles } = useSelector((state) => state.roles);
  const initializeSelectedRow = () => {
    dispatch(resetUsuarioActual()); 
  };

  useEffect(() => {
    initializeSelectedRow();
  }, []); // eslint-disable-line

  useEffect(() => {
    if (selectedRow) {
      setShowForm(true);
    } else if (accion === 'crear') {
      setShowForm(true);
    } else {
      setShowForm(false);
    }
  }, [selectedRow, accion]);

  useEffect(() => {
    if (accion === 'editar' || accion === 'ver') {
      dispatch(onShow(usuario));
    }
  }, [accion, dispatch, usuario]);

  const handleUpdateSuccess = (message) => {
    dispatch(onGetColeccion()); // Refresca la colección de usuarios
  };

  useEffect(() => {
    dispatch(onGetRoles());
  }, [dispatch]);

  if (loading) {
    return <AppLoader/>;
  }

  return (
    <>
      {showForm && (
        <StyledDialog
          open={showForm}
          onClose={handleOnClose}
          aria-labelledby="simple-modal-title"
          TransitionComponent={Transition}
          aria-describedby="simple-modal-description"
          maxWidth="sm"
          fullWidth
        >
          <AppScrollbar>
            <Formik
              initialStatus={false}
              enableReinitialize={true}
              validateOnBlur={false}
              initialValues={{
                id: selectedRow ? selectedRow?.id : '',
                identificacion_usuario: selectedRow ? selectedRow?.identificacion_usuario : '',
                nombre: selectedRow ? selectedRow?.nombre : '',
                rol_id: selectedRow ? selectedRow?.rol_id : '1',
                correo_electronico: selectedRow ? selectedRow?.correo_electronico : '',
                estado: selectedRow ? (selectedRow?.estado === 1 ? '1' : '0') : '1',
                clave: '',
              }}
              validationSchema={validationSchema}
              onSubmit={(data, { setSubmitting }) => {
                setSubmitting(true);
                if (accion === 'crear') {
                  dispatch(onCreate({ params: data, handleOnClose, updateColeccion, showMessage: handleUpdateSuccess }));
                } else if (accion === 'editar' && selectedRow) {
                  dispatch(onUpdate({ params: data, handleOnClose, updateColeccion, showMessage: handleUpdateSuccess }));
                }
                setSubmitting(false);
              }}
            >
              {({ values, initialValues, setFieldValue }) => (
                <UsuarioForm
                  values={values}
                  setFieldValue={setFieldValue}
                  handleOnClose={handleOnClose}
                  titulo={titulo}
                  accion={accion}
                  initialValues={initialValues}
                  roles={roles}
                  selectedRow={selectedRow}
                />
              )}
            </Formik>
          </AppScrollbar>
        </StyledDialog>
      )}
    </>
  );
};

export default UsuarioCreador;

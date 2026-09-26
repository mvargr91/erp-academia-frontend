import React, { useEffect, useRef, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import AppScrollbar from '../../../../@crema/components/AppScrollbar';
import { onShow, resetUsuarioActual, onChangePassword }  from '../../../../@crema/redux/features/usuarios/usuariosSlice';
import Slide from '@mui/material/Slide';
import CambioContraseñaForm from './CambioContraseñaForm';
import { Fonts } from '../../../../shared/constants/AppEnums';
import { styled } from '@mui/material/styles';
import AppLoader from '@crema/components/AppLoader';

// Styled components usando styled
const DialogBox = styled(Dialog)(({ theme }) => ({
  position: 'absolute',
  '& .MuiDialog-paperWidthSm': {
    maxWidth: 600,
    width: '100%',
  },
  '& .MuiTypography-h6': {
    fontWeight: Fonts.LIGHT,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='down' ref={ref} {...props} />;
});

let validationSchema = yup.object({
  id: yup.number().required('Requerido'),
  password: yup.string().required('Requerido').min(4, 'Debe ser de al menos 4 caracteres'),
  confirm_password: yup
    .string()
    .required('Requerido')
    .oneOf([yup.ref('password')], 'Las contraseñas no coinciden'),
});

const CambioContraseña = (props) => {
  const { usuario, handleOnClose, accion, titulo } = props;
  const [showForm, setShowForm] = useState(false);
  const selectedRow = useSelector((state) => state.usuarios.usuarioActual);
  const dispatch = useDispatch();
  
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
    if ((accion === 'editar') | (accion === 'ver')) {
      dispatch(onShow(usuario));
    }
  }, [accion, dispatch, usuario]);

  useEffect(() => {
    initializeSelectedRow();
  }, []);

  const initializeSelectedRow = () => {
    dispatch(resetUsuarioActual()); 
  };

  if (accion === 'crear') {
    initializeSelectedRow();
  }

  

  return (
    showForm && (
      <DialogBox
        open={showForm}
        onClose={handleOnClose}
        aria-labelledby='simple-modal-title'
        TransitionComponent={Transition}
        aria-describedby='simple-modal-description'
        maxWidth={'sm'}
        fullWidth
      >
        <AppScrollbar>
          <Formik
            initialStatus={false}
            enableReinitialize={true}
            validateOnBlur={false}
            initialValues={{
              id: usuario,
              password: '',
              confirm_password: '',
            }}
            validationSchema={validationSchema}
            onSubmit={(data, { setSubmitting, resetForm }) => {
              setSubmitting(true);
              dispatch(onChangePassword({params: data, handleOnClose}));
              setSubmitting(false);
            }}
          >
            {({ values, initialValues, setFieldValue }) => (
              <CambioContraseñaForm
                values={values}
                setFieldValue={setFieldValue}
                handleOnClose={handleOnClose}
                titulo={titulo}
                initialValues={initialValues}
              />
            )}
          </Formik>
        </AppScrollbar>
      </DialogBox>
    )
  );
};

export default CambioContraseña;

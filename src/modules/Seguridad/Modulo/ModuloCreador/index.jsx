import React, { useEffect, useRef, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import {Formik} from 'formik';
import * as yup from 'yup';
import {useDispatch, useSelector} from 'react-redux';
import AppScrollbar from '../../../../@crema/components/AppScrollbar';
import {
  onShow,
  onUpdate,
  onCreate,
  resetModuloActual,
} from '../../../../@crema/redux/features/modulo/moduloSlice';
import Slide from '@mui/material/Slide';
import ModuloForm from './ModuloForm';
import { Fonts } from '../../../../shared/constants/AppEnums';
import { makeStyles } from '@mui/styles';
import mensajeValidacion from '../../../../shared/functions/MensajeValidacion';
import AppLoader from '@crema/components/AppLoader';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='down' ref={ref} {...props} />;
});

const validationSchema = yup.object({
  nombre: yup.string().required('Requerido'),
  icnono_menu: yup.string().nullable(),
  posicion: yup
    .number()
    .typeError(mensajeValidacion('numero'))
    .required('Requerido'),
  aplicacion_id: yup.string().required('Requerido'),
});

const ModuloCreador = (props) => {
  const {modulo, handleOnClose, accion, updateColeccion, aplicaciones, titulo} =
    props;

  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const useStyles = makeStyles((theme) => ({
    dialogBox: {
      position: 'relative',
      '& .MuiDialog-paperWidthSm': {
        maxWidth: 600,
        width: '100%',
      },
      '& .MuiTypography-h6': {
        fontWeight: Fonts.LIGHT,
      },
    },
  }));

  const selectedRow = useSelector((state) =>  state.modulos.moduloActual);  
  const loading = useSelector((state) =>  state.modulos.loading);

  const initializeSelectedRow = () => {
    dispatch(resetModuloActual()); 
  };

  useEffect(() => {
    initializeSelectedRow();
  }, []);

  if (accion === 'crear') {
    initializeSelectedRow();
  }

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
      dispatch(onShow(modulo));
    }
  }, [accion, dispatch, modulo]);

  if (loading) {
    return <AppLoader/>;
  }

  return (
    showForm && (
      <Dialog
        open={showForm}
        onClose={handleOnClose}
        aria-labelledby='simple-modal-title'
        TransitionComponent={Transition}
        aria-describedby='simple-modal-description'
        className={useStyles.dialogBox}
        maxWidth={'sm'}
        fullWidth
      >
        <AppScrollbar>
          <Formik
            initialStatus={true}
            enableReinitialize={true}
            validateOnBlur={false}
            initialValues={{
              id: selectedRow ? selectedRow.id : '',
              nombre: selectedRow ? selectedRow.nombre : '',
              icono_menu: selectedRow ? selectedRow.icono_menu : '',
              posicion: selectedRow ? selectedRow.posicion : '',
              aplicacion_id: selectedRow ? selectedRow.aplicacion_id : '',
              estado: selectedRow
                ? selectedRow.estado === 1
                  ? '1'
                  : '0'
                : '1',
            }}
            validationSchema={validationSchema}
            onSubmit={(data, {setSubmitting, resetForm}) => {
              setSubmitting(true);
              if (accion === 'crear') {
                dispatch(onCreate({params: data, handleOnClose, updateColeccion}));
              } else if (accion === 'editar') {
                if (selectedRow) {
                  dispatch(onUpdate({params: data, handleOnClose, updateColeccion}));
                }
              }
              setSubmitting(false);
            }}>
            {({values, initialValues, setFieldValue}) => (
              <ModuloForm
                values={values}
                setFieldValue={setFieldValue}
                handleOnClose={handleOnClose}
                titulo={titulo}
                accion={accion}
                initialValues={initialValues}
                aplicaciones={aplicaciones}
              />
            )}
          </Formik>
        </AppScrollbar>
      </Dialog>
    )
  );
};

export default ModuloCreador;

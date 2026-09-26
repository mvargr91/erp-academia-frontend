import React, {useEffect, useRef, useState} from 'react';
import Dialog from '@mui/material/Dialog';
import {Formik} from 'formik';
import * as yup from 'yup';
import {useDispatch, useSelector} from 'react-redux';
import AppScrollbar from '../../../../@crema/components/AppScrollbar';
import {
  onShow,
  onUpdate,
  onCreate, resetOpcionSistemaActual, } from '../../../../@crema/redux/features/opcionSistema/opcionSistemaSlice';
import Slide from '@mui/material/Slide';
import OpcionSistemaForm from './OpcionSistemaForm';
import { Fonts } from '../../../../shared/constants/AppEnums';
import { makeStyles } from '@mui/styles';
import mensajeValidacion from '../../../../shared/functions/MensajeValidacion';
import AppLoader from '@crema/components/AppLoader';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='down' ref={ref} {...props} />;
});

const validationSchema = yup.object({
  nombre: yup.string().required('Requerido'),
  modulo_id: yup.string().required('Requerido'),
  posicion: yup
    .number()
    .typeError(mensajeValidacion('numero'))
    .required('Requerido'),
  icono_menu: yup.string().nullable(),
  url: yup.string().required('Requerido'),
  url_ayuda: yup.string().nullable(),
});

const OpcionSistemaCreador = (props) => {
  const {
    opcionSistema,
    handleOnClose,
    accion,
    updateColeccion,
    modulos,
    titulo,
  } = props;


  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const useStyles = makeStyles((theme) => ({
    dialogBox: {
      position: 'relative',
      '& .MuiDialog-paperWidthSm': {
        maxWidth: 600,
        width: '100%',
        // maxHeight:'fit-content'
      },
      '& .MuiTypography-h6': {
        fontWeight: Fonts.LIGHT,
      },
    },
  }));

  const classes = useStyles(props);

  const selectedRow = useSelector((state) => state.opcionSistema.OpcionSistemaActual);
  const loading = useSelector((state) => state.opcionSistema.loading);
  const initializeSelectedRow = () => {
    dispatch(resetOpcionSistemaActual()); 
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
      dispatch(onShow(opcionSistema));
    }
  }, [accion, dispatch, opcionSistema]);

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
              modulo_id: selectedRow ? selectedRow.modulo_id : '',
              posicion: selectedRow ? selectedRow.posicion : '',
              icono_menu: selectedRow ? selectedRow.icono_menu : '',
              url: selectedRow ? selectedRow.url : '',
              url_ayuda: selectedRow ? selectedRow.url_ayuda : '',
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
                dispatch(onCreate({params:data, handleOnClose, updateColeccion}));
              } else if (accion === 'editar') {
                console.log(data)
                if (selectedRow) {                  
                  dispatch(onUpdate({params:data, handleOnClose, updateColeccion}));
                }
              }
              setSubmitting(false);
            }}>
            {({values, initialValues, setFieldValue}) => (
              <OpcionSistemaForm
                values={values}
                setFieldValue={setFieldValue}
                handleOnClose={handleOnClose}
                titulo={titulo}
                accion={accion}
                initialValues={initialValues}
                modulos={modulos}
              />
            )}
          </Formik>
        </AppScrollbar>
      </Dialog>
    )
  );
};

export default OpcionSistemaCreador;

import React, { useEffect, useRef, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import AppScrollbar from '../../../../@crema/components/AppScrollbar';
import {
  onShow,
  onUpdate,
  onCreate,
  resetpermisoActual,
}  from '../../../../@crema/redux/features/permiso/permisoSlice';
import Slide from '@mui/material/Slide';
import PermisoForm from './PermisoForm';
import {Fonts} from '../../../../shared/constants/AppEnums';
import { makeStyles } from '@mui/styles';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='down' ref={ref} {...props} />;
});

const validationSchema = yup.object({
  name: yup.string().required('Requerido'),
  title: yup.string().required('Requerido'),
  option_id: yup.string().required('Requerido'),
});

const PermisoCreador = (props) => {
  const {
    permiso,
    handleOnClose,
    accion,
    updateColeccion,
    opcionesSistema,
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

  const selectedRow = useSelector((state) => state.permisos.permisoActual);
  const loading = useSelector((state) => state.permisos.loading);

  const initializeSelectedRow = () => {
    dispatch(resetpermisoActual()); 
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
      dispatch(onShow(permiso));
    }
  }, [accion, dispatch, permiso]);

  return (
    showForm && (
      <Dialog
        open={showForm}
        onClose={handleOnClose}
        aria-labelledby='simple-modal-title'
        TransitionComponent={Transition}
        aria-describedby='simple-modal-description'
        // className={classes.dialogBox}
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
              name: selectedRow ? selectedRow.name : '',
              option_id: selectedRow ? selectedRow.option_id : '',
              title: selectedRow ? selectedRow.title : '',
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
              <PermisoForm
                values={values}
                setFieldValue={setFieldValue}
                handleOnClose={handleOnClose}
                titulo={titulo}
                accion={accion}
                initialValues={initialValues}
                opcionesSistema={opcionesSistema}
              />
            )}
          </Formik>
        </AppScrollbar>
      </Dialog>
    )
  );
};

export default PermisoCreador;

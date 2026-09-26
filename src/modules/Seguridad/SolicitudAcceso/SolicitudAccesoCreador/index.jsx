import React, {useEffect, useRef, useState} from 'react';
import {Dialog, Slide, makeStyles} from '@material-ui/core';
import {Formik} from 'formik';
import * as yup from 'yup';
import {useDispatch, useSelector} from 'react-redux';
import {Scrollbar} from '@crema';
import {
  onShow,
  onUpdate,
} from 'redux/actions/SolicitudAccesoAction';
import SolicitudAccesoForm from './SolicitudAccesoForm';
import {Fonts} from 'shared/constants/AppEnums';
import { fetchError } from 'redux/actions';
import moment from 'moment';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='down' ref={ref} {...props} />;
});

const validationSchema = yup.object({
  fecha_solicitud: yup
    .date()
    .required('Requerido'),
  fecha_expiracion: yup
    .date()
    .nullable()
    .min(yup.ref('fecha_solicitud'), 'Debe ser mayor que fecha solicitud'),
});

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

const SolicitudAccesoCreador = (props) => {
  const {
    solicitudAcceso,
    handleOnClose,
    accion,
    updateColeccion,
    titulo,
    user,
    clientes
  } = props;

  const dispatch = useDispatch();

  const classes = useStyles(props);

  const [showForm, setShowForm] = useState(false);
  let selectedRow = useRef();
  selectedRow = useSelector(
    ({solicitudAccesoReducer}) => solicitudAccesoReducer.selectedRow,
  );

  const initializeSelectedRow = () => {
    selectedRow = null;
  };
  useEffect(() => {
    initializeSelectedRow();
  }, []); // eslint-disable-line

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
      dispatch(onShow(solicitudAcceso));
    }
  }, [accion, dispatch, solicitudAcceso]);

  return (
    showForm && (
      <Dialog
        open={showForm}
        onClose={handleOnClose}
        aria-labelledby='simple-modal-title'
        TransitionComponent={Transition}
        aria-describedby='simple-modal-description'
        className={classes.dialogBox}
        maxWidth={'sm'}>
        <Scrollbar>
          <Formik
            initialStatus={true}
            enableReinitialize={true}
            validateOnBlur={false}
            initialValues={{
              id: selectedRow?.id??'',
              usuario_id: selectedRow?.usuario?.id??'',
              usuario_nombre: selectedRow?.usuario?.nombre??'',
              cliente_id: selectedRow?.cliente?.id ?? '',
              fecha_solicitud: selectedRow?.fecha_solicitud??'',
              fecha_expiracion: selectedRow?.fecha_expiracion??'',
              observaciones: selectedRow?.observaciones??'',
              estado_acceso: selectedRow?.estado_acceso??'',
            }}
            validationSchema={validationSchema}
            onSubmit={(data, {setSubmitting}) => {
              setSubmitting(true);
              if(!data.fecha_expiracion){
                dispatch(fetchError('Debe proporcionar una fecha de expiracion'));
                return;
              }
              data.fecha_expiracion = moment(data.fecha_expiracion).format('YYYY-MM-DD HH:mm');
              if (accion === 'editar') {
                data.estado_acceso = 'APRB';
                if (selectedRow) {
                  dispatch(onUpdate(data, handleOnClose, updateColeccion));
                }
              }
              setSubmitting(false);
            }}>
            {({initialValues, setFieldValue, values}) => (
              <SolicitudAccesoForm
                setFieldValue={setFieldValue}
                handleOnClose={handleOnClose}
                titulo={titulo}
                accion={accion}
                initialValues={initialValues}
                clientes={clientes}
                user={user}
                values={values}
                dispatch={dispatch}
                onUpdate={onUpdate}
                updateColeccion={updateColeccion}
              />
            )}
          </Formik>
        </Scrollbar>
      </Dialog>
    )
  );
};

export default SolicitudAccesoCreador;

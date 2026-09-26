// Diálogo para acciones de cambio de estado (PUT /recurso/{id}/estado, /verificar...).
import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import * as yup from 'yup';
import Dialog from '@mui/material/Dialog';
import AppCrudForm from '../AppCrudForm';
import MySelectField from '../MySelectField';
import MyTextField from '../MyTextField';

const AppEstadoDialog = (props) => {
  const {
    stateKey,
    titulo,
    registro,
    campo,
    etiqueta,
    opciones,
    campoObservaciones,
    etiquetaObservaciones,
    thunk,
    handleOnClose,
    updateColeccion,
  } = props;

  const dispatch = useDispatch();
  const { saving } = useSelector((state) => state[stateKey]);

  const validationSchema = yup.object({
    [campo]: yup.string().required('Requerido'),
  });

  const initialValues = {
    id: registro.id,
    [campo]: registro[campo] ?? '',
    ...(campoObservaciones ? { [campoObservaciones]: registro[campoObservaciones] ?? '' } : {}),
  };

  return (
    <Dialog open onClose={handleOnClose} maxWidth='sm' fullWidth>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(params) => {
          dispatch(thunk({ params, handleOnClose, updateColeccion }));
        }}
      >
        <AppCrudForm titulo={titulo} accion='editar' handleOnClose={handleOnClose} saving={saving}>
          <MySelectField
            className='campo-completo'
            fullWidth
            variant='standard'
            label={etiqueta}
            name={campo}
            options={opciones}
            required
          />
          {campoObservaciones && (
            <MyTextField
              className='campo-completo'
              fullWidth
              multiline
              minRows={3}
              label={etiquetaObservaciones}
              name={campoObservaciones}
            />
          )}
        </AppCrudForm>
      </Formik>
    </Dialog>
  );
};

AppEstadoDialog.propTypes = {
  stateKey: PropTypes.string.isRequired,
  titulo: PropTypes.string.isRequired,
  registro: PropTypes.object.isRequired,
  campo: PropTypes.string,
  etiqueta: PropTypes.string,
  opciones: PropTypes.array.isRequired,
  campoObservaciones: PropTypes.string,
  etiquetaObservaciones: PropTypes.string,
  thunk: PropTypes.func.isRequired,
  handleOnClose: PropTypes.func.isRequired,
  updateColeccion: PropTypes.func,
};

AppEstadoDialog.defaultProps = {
  campo: 'estado',
  etiqueta: 'Estado',
  etiquetaObservaciones: 'Observaciones',
};

export default AppEstadoDialog;

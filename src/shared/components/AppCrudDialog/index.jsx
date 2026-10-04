// Diálogo Formik reutilizable para los "Creador" de cada módulo.
// Encapsula lo que repetían todos los creadores: carga del registro (onShow) en
// ver/editar, reset al crear, loader, Dialog con transición y despacho de onCreate/onUpdate.
// Con `enPagina` el mismo formulario se muestra como vista de una ruta propia (formularios
// grandes) en lugar de un modal.
import React, { createContext, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { Box, Paper } from '@mui/material';
import AppLoader from '@crema/components/AppLoader';
import { useEnPaginaCrud } from '../PaginaCrud';

// Indica a AppCrudForm si se muestra dentro de un modal o como página.
const AppCrudContext = createContext({ enPagina: false });
export const useAppCrudContext = () => useContext(AppCrudContext);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='down' ref={ref} {...props} />;
});

const AppCrudDialog = (props) => {
  const {
    stateKey,
    registroId,
    registroInicial,
    accion,
    handleOnClose,
    updateColeccion,
    onShow,
    onCreate,
    onUpdate,
    resetActual,
    initialValues,
    validationSchema,
    transformarAntesDeEnviar,
    maxWidth,
    enPagina: enPaginaProp,
    children,
  } = props;

  // Dentro de una ruta de formulario (PaginaCrud) siempre se pinta como página.
  const enPaginaRuta = useEnPaginaCrud();
  const enPagina = enPaginaProp || enPaginaRuta;

  const dispatch = useDispatch();
  const { actual, loadingActual, saving } = useSelector((state) => state[stateKey]);
  const requiereRegistro = accion === 'editar' || accion === 'ver';
  // Recursos sin GET /{id} (tablas pivote) reciben la fila de la tabla directamente.
  const usaRegistroInicial = Boolean(registroInicial);

  useEffect(() => {
    dispatch(resetActual());
    if (requiereRegistro && registroId && !usaRegistroInicial) {
      dispatch(onShow(registroId))
        .unwrap()
        // En página el id viene de la URL: si no existe se vuelve a la lista en vez de quedar cargando.
        .catch(() => enPagina && handleOnClose());
    }
    return () => {
      dispatch(resetActual());
    };
  }, [dispatch, registroId, accion]); // eslint-disable-line react-hooks/exhaustive-deps

  if (requiereRegistro && !usaRegistroInicial && (loadingActual || !actual)) {
    return <AppLoader />;
  }

  const registro = !requiereRegistro ? null : usaRegistroInicial ? registroInicial : actual;

  const formulario = (
    <AppCrudContext.Provider value={{ enPagina }}>
      <Formik
        enableReinitialize
        validateOnBlur={false}
        initialValues={initialValues(registro)}
        validationSchema={validationSchema}
        onSubmit={(data, { setSubmitting }) => {
          const params = transformarAntesDeEnviar ? transformarAntesDeEnviar(data) : data;
          if (accion === 'crear') {
            dispatch(onCreate({ params, handleOnClose, updateColeccion }));
          } else if (accion === 'editar') {
            dispatch(onUpdate({ params, handleOnClose, updateColeccion }));
          }
          setSubmitting(false);
        }}
      >
        {(formik) => children({ ...formik, registro, saving })}
      </Formik>
    </AppCrudContext.Provider>
  );

  if (enPagina) {
    return (
      <Box sx={{ width: '100%', pt: '20px', px: '20px', pb: '20px' }}>
        <Paper
          sx={{
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0px 0px 5px 5px rgb(0 0 0 / 10%)',
            borderRadius: '4px',
          }}
        >
          {formulario}
        </Paper>
      </Box>
    );
  }

  return (
    <Dialog
      open
      onClose={handleOnClose}
      TransitionComponent={Transition}
      maxWidth={maxWidth}
      fullWidth
      // El scroll lo maneja el cuerpo de AppCrudForm: título y botones quedan fijos.
      PaperProps={{ sx: { overflow: 'hidden' } }}
    >
      {formulario}
    </Dialog>
  );
};

AppCrudDialog.propTypes = {
  stateKey: PropTypes.string.isRequired,
  registroId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  registroInicial: PropTypes.object,
  accion: PropTypes.oneOf(['crear', 'editar', 'ver']).isRequired,
  handleOnClose: PropTypes.func.isRequired,
  updateColeccion: PropTypes.func,
  onShow: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  resetActual: PropTypes.func.isRequired,
  // (registro | null) => valores iniciales de Formik
  initialValues: PropTypes.func.isRequired,
  validationSchema: PropTypes.object,
  // (valores Formik) => payload para el backend
  transformarAntesDeEnviar: PropTypes.func,
  maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  // Muestra el formulario como página (ruta propia) en vez de modal.
  enPagina: PropTypes.bool,
  // Render prop: ({ values, setFieldValue, registro, saving, ... }) => <Form />
  children: PropTypes.func.isRequired,
};

AppCrudDialog.defaultProps = {
  maxWidth: 'sm',
  enPagina: false,
};

export default AppCrudDialog;

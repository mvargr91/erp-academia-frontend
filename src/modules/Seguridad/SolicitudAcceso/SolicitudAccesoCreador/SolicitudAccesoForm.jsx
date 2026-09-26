import React, {useEffect, useState} from 'react';
import {Box, Button, makeStyles} from '@material-ui/core';
import {Form} from 'formik';
import Scrollbar from '@crema/core/Scrollbar';
import IntlMessages from '@crema/utility/IntlMessages';
import {Fonts} from 'shared/constants/AppEnums';
import MyTextField from 'shared/components/MyTextField';
import MyAutocomplete from 'shared/components/MyAutoComplete';
import FormikAutocomplete from '../../../../shared/components/FormikAutocomplete';
import MySelectField from 'shared/components/MySelectField';
import { ESTADOS_SOLICITUD_ACCESO } from 'shared/constants/ListaValores';
import { Check, Clear } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  bottomsGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingBottom: '20px',
    gap: '10px',
    backgroundColor: 'white',
    paddingRight: '20px',
    position: 'sticky',
    left: 0,
    bottom: 0,
  },
  myTextField: {
    width: '100%',
    marginBottom: 5,
    [theme.breakpoints.up('xl')]: {
      marginBottom: 5,
    },
    height: '50px',
  },
  MySelectField: {
    width: 'auto',
    marginBottom: 16,
    [theme.breakpoints.up('xl')]: {
      marginBottom: 24,
    },
    color: theme.palette.primary.main,
    '&:target': {
      color: theme.palette.primary.main,
    },
  },
  btnRoot: {
    paddingLeft: 15,
    paddingRight: 15,
    color: 'white',
    '&:hover': {
      backgroundColor: theme.palette.colorHover,
      cursor: 'pointer',
    },
  },
  btnAccept: {
    backgroundColor: '#48ac33',
  },
  btnReject: {
    backgroundColor: theme.palette.redBottoms,
  },
  btnSecundary: {
    backgroundColor: theme.palette.grayBottoms,
    color: 'white !important',
  },
  widthFull: {
    width: '100%',
  },
  pointer: {
    cursor: 'pointer',
  },
  input_2: {
    display: 'grid',
    gap: 15,
    gridTemplateColumns: 'repeat(2,1fr)'
  }
}));

const disabledStates = ['VENC', 'RECH'];

const SolicitudAccesoForm = (props) => {
  const {
    handleOnClose, 
    accion, 
    initialValues, 
    titulo,
    clientes,
    values,
    dispatch,
    onUpdate,
    updateColeccion
  } = props;

  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (accion === 'ver' || disabledStates.includes(initialValues.estado_acceso)) {
      setDisabled(true);
    }
  }, [initialValues.estado_acceso, accion]);

  const classes = useStyles(props);

  const onReject = () => {
    values.estado_acceso = 'RECH';
    values.fecha_expiracion = '';
    dispatch(onUpdate(values, handleOnClose, updateColeccion))
  }

  return (
    <Form className='' noValidate autoComplete='off'>
      <Scrollbar style={{maxHeight: 600}}>
        <Box py={5} px={{xs: 5, lg: 8, xl: 10}}>
          <Box
            component='h6'
            mb={{xs: 4, xl: 6}}
            fontSize={20}
            fontWeight={Fonts.MEDIUM}>
            {titulo}
          </Box>

          <Box px={{md: 5, lg: 8, xl: 10}}>
            <Box className={classes.input_2}>
              <FormikAutocomplete
                className={classes.myTextField}
                label='Cliente'
                name='cliente_id'
                required
                disabled
                options={clientes}
              />
              <MyTextField
                className={classes.myTextField}
                label='Usuario'
                name='usuario_nombre'
                required
                disabled
              />
              <MyTextField
                className={classes.myTextField}
                label='Fecha Solicitud'
                name='fecha_solicitud'
                type='datetime-local'
                InputLabelProps={{
                  shrink: true
                }}
                required
                disabled
              />
              <MyTextField
                className={classes.myTextField}
                label='Fecha Expiración'
                name='fecha_expiracion'
                type='datetime-local'
                InputLabelProps={{
                  shrink: true
                }}
                disabled={disabled}
              />
              <MySelectField
                label='Estado Acceso'
                name='estado_acceso'
                required
                disabled
                options={ESTADOS_SOLICITUD_ACCESO}
              />
            </Box>
            <MyTextField
              style={{marginTop: 10}}
              className={classes.myTextField}
              label='Observaciones'
              name='observaciones'
              disabled={disabled}
            />
          </Box>
        </Box>
      </Scrollbar>
      <Box className={classes.bottomsGroup}>
        {values.estado_acceso === 'PDTE' && (
          <Button
            className={`${classes.btnRoot} ${classes.btnReject}`}
            variant='contained'
            onClick={onReject}>
             <Clear/> Rechazar
          </Button>
        )}
        {!disabledStates.includes(values.estado_acceso) && (
          <Button
            className={`${classes.btnRoot} ${classes.btnAccept}`}
            variant='contained'
            type='submit'>
           <Check/> Aprobar
          </Button>
        )}
        <Button
          className={`${classes.btnRoot} ${classes.btnSecundary}`}
          onClick={handleOnClose}>
          <IntlMessages id='boton.cancel' />
        </Button>
      </Box>
    </Form>
  );
};

export default SolicitudAccesoForm;

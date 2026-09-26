import React, { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import { Input } from '@mui/material';
import { Form } from 'formik';
import AppScrollbar from '../../../../@crema/components/AppScrollbar';
import IntlMessages from '@crema/helpers/IntlMessages';
import MyAutocomplete from '../../../../shared/components/MyAutoComplete';
import MyTextField from '../../../../shared/components/MyTextField';
import MyRadioField from '../../../../shared/components/MyRadioField';
import { makeStyles } from '@mui/styles';
import { styled, useTheme } from '@mui/material/styles';

const options = [
  { value: '1', label: 'Activo' },
  { value: '0', label: 'Inactivo' },
];

const useStyles = makeStyles((theme) => ({
  bottomsGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingBottom: '20px',
    gap: '10px',
    paddingRight: '20px',
    position: 'sticky',
    left: 0,
    bottom: 0,
  },
  myTextField: {
    width: '100%',
    marginBottom: 5,   
    height: '60px',
  },
  btnRoot: {
    paddingLeft: 15,
    paddingRight: 15,
    color: 'white',
    '&:hover': {
      backgroundColor: '#1d83f3',
      cursor: 'pointer',
    },
  },
  btnPrymary: {
    backgroundColor: '#1d83f3',
  },
  btnSecundary: {
    backgroundColor: 'gray',
  },
  widthFull: {
    width: '100%',
  },
  pointer: {
    cursor: 'pointer',
  },
  inputs_2: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: 'repeat(2,1fr)',
  },
  inputs_3: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: 'repeat(3,1fr)',
  },
}));

const UsuarioForm = (props) => {
  const { handleOnClose, setFieldValue, accion, values, initialValues, titulo, roles, selectedRow} = props;
  const theme = useTheme();
  const [disabled, setDisabled] = useState(false);
  useEffect(() => {
    if (accion === 'ver' || initialValues.estado === '0') {
      setDisabled(true);
    }
  }, [initialValues.estado, accion]);

  const classes = useStyles(props);

  return (
    <Form className="" noValidate autoComplete="off">
      <AppScrollbar style={{ maxHeight: 600 }}>
        <Box py={5} px={{ xs: 5, lg: 8, xl: 10 }}>
          <Box component="h6" mb={{ xs: 4, xl: 6 }} fontSize={20} fontWeight="bold">
            {titulo}
          </Box>
          <Box px={{ md: 5, lg: 8, xl: 10 }}>
            <Box
              sx={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'repeat(1,1fr)',
              }}    
            >
              <MyTextField
                sx={{ width: '100%', marginBottom: 1, height: '60px', paddingRight: '20px' }}
                label="Nombre"
                name="nombre"
                disabled={disabled}
                required
                variant="standard"
                fullWidth
                autoFocus
              />
              <MyTextField
                sx={{ width: '100%', marginBottom: 2, height: '60px' }}
                label="Identificación"
                name="identificacion_usuario"
                disabled={disabled}
                required
                variant="standard"
                fullWidth
              />
            </Box>
            <Box
              sx={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'repeat(1,1fr)',
              }} 
            >
              <MyTextField
                sx={{ width: '100%', marginBottom: 2, height: '60px', paddingRight: '20px'  }}
                label="E-mail"
                name="correo_electronico"
                disabled={disabled}
                required
                variant="standard"
                fullWidth
              />              
            </Box>
            <Box
              sx={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'repeat(1,1fr)',
              }} 
            >
              <MyAutocomplete
                sx={{paddingRight: '20px' }}
                options={roles}
                name='rol_id'
                inputValue={initialValues.rol_id}
                label='Rol'
                disabled={disabled}            
                className={classes.myTextField}
                variant='standard'
                fullWidth
              />  
            </Box>
            {accion === 'crear' && (
              <MyTextField
                sx={{ width: '100%', marginBottom: 2, height: '60px' }}
                label="Clave"
                name="clave"
                required
                variant="standard"
                fullWidth
              />
            )}

            <MyRadioField
              label="Estado"
              name="estado"
              required
              disabled={accion === 'ver'}
              options={options}
            />
          </Box>
        </Box>
      </AppScrollbar>
      <Box className={classes.bottomsGroup}>
        {accion !== 'ver' ? (
          <Button
            color="primary"
            variant='contained'
            type='submit'
            sx={{
              paddingLeft: 15,
              paddingRight: 15,
              color: 'white',
              '&:hover': {
                backgroundColor: theme.palette.colorHovers,
                cursor: 'pointer',
              },
              backgroundColor: theme.palette.primary.main,
            }}
          >
            <IntlMessages id='boton.submit' />
          </Button>
        ) : (
          ''
        )}
        <Button
          sx={{paddingLeft: 15,
            paddingRight: 15,
            color: 'white !important',
            '&:hover': {
              backgroundColor: theme.palette.colorHovers,
              cursor: 'pointer',
            },
            backgroundColor: theme.palette.secondary.light,
          }}
          onClick={handleOnClose}>
          <IntlMessages id='boton.cancel' />
        </Button>
      </Box>
    </Form>
  );
};

export default UsuarioForm;

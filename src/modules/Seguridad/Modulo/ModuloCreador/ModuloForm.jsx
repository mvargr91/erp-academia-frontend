import React, {useEffect, useState} from 'react';
import {Box, Button} from '@mui/material';
import {Form} from 'formik';
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';
import AppScrollbar from '@crema/components/AppScrollbar';
import IntlMessages from '@crema/helpers/IntlMessages';
import MyAutocomplete from '../../../../shared/components/MyAutoComplete';
import MyTextField from '../../../../shared/components/MyTextField';
import MyRadioField from '../../../../shared/components/MyRadioField';

const options = [
  {value: '1', label: 'Activo'},
  {value: '0', label: 'Inactivo'},
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
  widthFull: {
    width: '100%',
  },
  pointer: {
    cursor: 'pointer',
  },
}));

const ModuloForm = (props) => {
  const theme = useTheme();
  const {handleOnClose, accion, initialValues, aplicaciones, titulo} = props;
  const [disabled, setDisabled] = useState(false);
  useEffect(() => {
    if (accion === 'ver' || initialValues.estado === '0') {
      setDisabled(true);
    }
  }, [initialValues.estado, accion]);

  const classes = useStyles(props);

  return (
    <Form className='' noValidate autoComplete='off'>
      <AppScrollbar style={{maxHeight: 600}}>
        <Box py={5} px={{xs: 5, lg: 8, xl: 10}}>
          <Box
            component='h6'
            mb={{xs: 4, xl: 6}}
            fontSize={20}
            fontWeight='bold'>
            {titulo}
          </Box>

          <Box px={{md: 5, lg: 8, xl: 10}}>
            <MyTextField
            sx={{[theme.breakpoints.up('xl')]: {
              marginBottom: 5,
            },}}
              className={classes.myTextField}
              label='Nombre'
              name='nombre'
              disabled={disabled}
              required
              variant='standard'
              fullWidth
              autoFocus
            />

            <MyAutocomplete
              options={aplicaciones}
              name='aplicacion_id'
              inputValue={initialValues.aplicacion_id}
              label='Aplicación'
              
              required
              disabled={disabled}
            />
            <MyTextField
              className={classes.myTextField}
              label='Icono'
              name='icono_menu'
              disabled={disabled}
              variant='standard'
              fullWidth
            />
            <MyTextField
              className={classes.myTextField}
              label='Posición'
              name='posicion'
              disabled={disabled}
              required
              variant='standard'
              fullWidth
            />
            <MyRadioField
              label='Estado'
              name='estado'
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
          sx={{paddingLeft: 15,
            paddingRight: 15,
            color: 'white',
            '&:hover': {
              backgroundColor: theme.palette.colorHovers,
              cursor: 'pointer',
            },
            backgroundColor: theme.palette,}}
            
            variant='contained'
            type='submit'>
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

export default ModuloForm;

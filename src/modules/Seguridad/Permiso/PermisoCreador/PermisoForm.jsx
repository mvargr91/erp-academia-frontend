import React, {useEffect, useState} from 'react';
import { Box, Button } from '@mui/material';
import { Input } from '@mui/material';
import {Form} from 'formik';
import { makeStyles } from '@mui/styles';
import AppScrollbar from '@crema/components/AppScrollbar';
import IntlMessages from '@crema/helpers/IntlMessages';
import MyAutocomplete from '../../../../shared/components/MyAutoComplete';
import FormikAutocomplete from '../../../../shared/components/FormikAutocomplete';
import MyTextField from '../../../../shared/components/MyTextField';
import { useTheme } from '@mui/material/styles';

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
  widthFull: {
    width: '100%',
  },
  pointer: {
    cursor: 'pointer',
  },
}));

const PermisoForm = (props) => {
  const theme = useTheme();
  const {handleOnClose, accion, initialValues, opcionesSistema, titulo} = props;

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
              sx={{
                width: '100%',
                marginBottom: 5,
                [theme.breakpoints.up('xl')]: {
                  marginBottom: 5,
                },
                height: '60px',
              }}
              label='Nombre'
              name='name'
              disabled={disabled}
              required
              variant='standard'
              autoFocus
            />

            <FormikAutocomplete
              options={opcionesSistema}
              name='option_id'
              inputValue={initialValues.option_id}
              label='Opción del Sistema'
              
              sx={{
                width: '100%',
                marginBottom: 5,
                [theme.breakpoints.up('xl')]: {
                  marginBottom: 5,
                },
                height: '60px',
              }}
              required
              disabled={disabled}
            />

            <MyTextField
              sx={{
                width: '100%',
                marginBottom: 5,
                [theme.breakpoints.up('xl')]: {
                  marginBottom: 5,
                },
                height: '60px',
              }}
              label='Título'
              name='title'
              disabled={disabled}
              required
              variant='standard'
            />
          </Box>
        </Box>
      </AppScrollbar>
      <Box className={classes.bottomsGroup}>
        {accion !== 'ver' ? (
          <Button
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

export default PermisoForm;

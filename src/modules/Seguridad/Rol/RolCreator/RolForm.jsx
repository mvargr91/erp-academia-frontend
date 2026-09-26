import React, { useEffect, useState } from 'react';
import { Box, Button, MenuItem } from '@mui/material';
import { Form } from 'formik';
import { makeStyles } from '@mui/styles';
import AppScrollbar from '@crema/components/AppScrollbar';
import IntlMessages from '@crema/helpers/IntlMessages';
import { TIPOS_ROLES } from '../../../../shared/constants/ListaValores';
import MyTextField from '../../../../shared/components/MyTextField';
import MyRadioField from '../../../../shared/components/MyRadioField';
import { styled, useTheme } from '@mui/material/styles';

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
}));

const RolForm = (props) => {
  const {handleOnClose, accion, initialValues, titulo} = props;
  const theme = useTheme();
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
              className={classes.myTextField}
              label='Nombre*'
              name='nombre'
              disabled={disabled}
              variant='standard'
              fullWidth
              autoFocus
            />

            <MyTextField
              className={classes.myTextField}
              label='Tipo'
              name='tipo'
              select={true}
              required
              variant='standard'
              disabled={disabled}
              fullWidth
            >
              {TIPOS_ROLES.map((tipoRol) => {
                return (
                  <MenuItem
                    value={tipoRol.id}
                    key={tipoRol.id}
                    className={classes.pointer}>
                    {tipoRol.nombre}
                  </MenuItem>
                );
              })}
            </MyTextField>

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
            color="primary"
            variant='contained'
            type='submit'
            sx={{
              paddingLeft: 15,
              paddingRight: 15,
              color: 'white !important',
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
            color: 'white',
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

export default RolForm;

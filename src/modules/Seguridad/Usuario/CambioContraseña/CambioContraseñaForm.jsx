import React, { useState } from 'react';
import { Box, Button, InputAdornment } from '@mui/material';
import { Form } from 'formik';
import { styled } from '@mui/material/styles';
import AppScrollbar from '../../../../@crema/components/AppScrollbar';
import IntlMessages from '@crema/helpers/IntlMessages';
import MyTextField from '../../../../shared/components/MyTextField';
import { Visibility, VisibilityOff } from '@mui/icons-material';

// Styled components utilizando styled
const BottomsGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  paddingBottom: '20px',
  gap: '10px',
  paddingRight: '20px',
  position: 'sticky',
  left: 0,
  bottom: 0,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  paddingLeft: 15,
  paddingRight: 15,
  color: 'white',
  '&:hover': {
    backgroundColor: theme.palette.colorHovers,
    cursor: 'pointer',
  },
}));

const CambioContraseñaForm = (props) => {
  const { handleOnClose, titulo } = props;

  const [showPass, setShowPass] = useState({
    password: false,
    confirm_password: false,
  });

  const toogleSeePass = (key) => {
    setShowPass({
      ...showPass,
      [key]: !showPass[key],
    });
  };

  return (
    <Form className='' noValidate autoComplete='off'>
      <AppScrollbar style={{ maxHeight: 600 }}>
        <Box py={5} px={{ xs: 5, lg: 8, xl: 10 }}>
          <Box component='h6' mb={{ xs: 4, xl: 6 }} fontSize={20} fontWeight='bold'>
            {titulo}
          </Box>

          <Box px={{ md: 5, lg: 8, xl: 10 }}>
            <MyTextField
              sx={{ width: '100%', marginBottom: 2, height: '60px' }}
              label='Nueva Clave'
              name='password'
              type={showPass.password ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment
                    position='end'
                    sx={{ cursor: 'pointer' }}
                    onClick={() => toogleSeePass('password')}
                  >
                    {showPass.password ? (
                      <VisibilityOff sx={{ color: 'gray' }} />
                    ) : (
                      <Visibility sx={{ color: 'gray' }} />
                    )}
                  </InputAdornment>
                ),
              }}
              required
              variant='standard'
              fullWidth
              autoFocus
            />
            <MyTextField
              sx={{ width: '100%', marginBottom: 2, height: '60px' }}
              label='Confirmar Nueva Clave'
              name='confirm_password'
              type={showPass.confirm_password ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment
                    position='end'
                    sx={{ cursor: 'pointer' }}
                    onClick={() => toogleSeePass('confirm_password')}
                  >
                    {showPass.confirm_password ? (
                      <VisibilityOff sx={{ color: 'gray' }} />
                    ) : (
                      <Visibility sx={{ color: 'gray' }} />
                    )}
                  </InputAdornment>
                ),
              }}
              required
              variant='standard'
              fullWidth
            />
          </Box>
        </Box>
      </AppScrollbar>
      <BottomsGroup>
        <StyledButton
          variant='contained'
          color='primary'
          type='submit'
        >
          <IntlMessages id='boton.submit' />
        </StyledButton>
        <StyledButton
          variant='contained'
          color='secondary'
          onClick={handleOnClose}
          sx={{ backgroundColor: 'gray' ,color: 'white !important', }}
        >
          <IntlMessages id='boton.cancel' />
        </StyledButton>
      </BottomsGroup>
    </Form>
  );
};

export default CambioContraseñaForm;

import React from 'react';
import AppFooter from '../AppLayout/components/AppFooter';
import AppErrorBoundary from '../AppErrorBoundary';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import AppContentViewWrapper from './AppContentViewWrapper';
import AppSuspense from '../AppSuspense';
import { useLocation } from 'react-router-dom';
import fondo from "../../../assets/fondo/fondo.jpg";
import { useTheme } from '@mui/styles';

const AppContentView = ({ sxStyle, routes }) => {
  const location = useLocation(); // Obtiene la ubicación actual
  const theme = useTheme();
  // Determina si está en la ruta "/signin"
  const isSigninRoute = location.pathname === '/signin';
  const isPassRoute = location.pathname === '/forget-password';
  const isHomeRoute = location.pathname === '/home';
  
  return (
    <AppContentViewWrapper>
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          p: isSigninRoute || isPassRoute  ? 0 : { xs: 5, md: 7.5, xl: 12.5 }, // TODO::// Sin padding en "/signin"
          // backgroundImage: isHomeRoute ? `url(${fondo})` : '', // TODO:: fondo de la pagina de inicio
          backgroundSize:  'cover',
          // backgroundRepeat: isHomeRoute ? 'no-repeat' : 'no-repeat', 
          // backgroundPosition: isHomeRoute ? 'center top' : '',
          // backgroundColor: isHomeRoute ? '#00274d' : '',
          ...sxStyle,
        }}
        className='app-content'
      >
        <AppSuspense>
          <AppErrorBoundary>{routes}</AppErrorBoundary>
        </AppSuspense>
      </Box>
      <AppFooter />
    </AppContentViewWrapper>
  );
};

export default AppContentView;

AppContentView.propTypes = {
  sxStyle: PropTypes.object,
  children: PropTypes.node,
  routes: PropTypes.object.isRequired,
};

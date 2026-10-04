import React from 'react';
import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useApariencia } from '../../../../../shared/apariencia';

// Logo de la academia (Configuración → Apariencia); en modo oscuro usa la variante para fondos oscuros.
const AppLogo = () => {
  const location = useLocation();
  const { apariencia, logo } = useApariencia();
  const isSigninRoute = location.pathname === '/signin';
  return (
    <Box
      sx={{
        height: { xs: 56, sm: 70 },
        padding: 2.5,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        '& img': {
          height: isSigninRoute ? { xs: 110, sm: 125 } : { xs: 50, sm: 65 },
          maxWidth: isSigninRoute ? 280 : { xs: 160, sm: 240 },
          objectFit: 'contain',
        },
      }}
      className='app-logo'
    >
      <img src={logo} alt={apariencia.nombre || 'Logo'} />
    </Box>
  );
};

export default AppLogo;

import React from 'react';
import { Box } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { initialUrl } from '@crema/constants/AppConst';
import { urlDeInicio } from '@crema/helpers/RouteHelper';
import { useApariencia } from '../../../../../shared/apariencia';

// Logo de la academia (Configuración → Apariencia); en modo oscuro usa la variante para fondos oscuros.
const AppLogo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { apariencia, logo } = useApariencia();
  const isSigninRoute = location.pathname === '/signin';
  // Con sesión iniciada, el logo lleva a la pantalla de inicio (en el login no hace nada).
  const irAlInicio = isAuthenticated ? () => navigate(urlDeInicio(user?.usuario?.permisos, initialUrl)) : undefined;
  return (
    <Box
      onClick={irAlInicio}
      sx={{
        cursor: irAlInicio ? 'pointer' : 'default',
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

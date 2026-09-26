import React from 'react';
import { Box } from '@mui/material';
import { useThemeContext } from '@crema/context/AppContextProvider/ThemeContextProvider';
import { alpha } from '@mui/material/styles';
import { MARCA } from '../../../../../shared/constants/Marca';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const AppLogo = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Obtiene la ubicación actual
  const { theme } = useThemeContext();
  const isSigninRoute = location.pathname === '/signin';
  // Tema oscuro (panel) usa la variante con el "+" en blanco.
  const Logo = theme?.palette?.mode === 'dark' ? MARCA.logos.oscuro : MARCA.logos.principal;
  return (
    <Box
      sx={{
        height: { xs: 56, sm: 70 },
        padding: 2.5,
        display: 'flex',
        flexDirection: 'row',
        cursor: 'pointer',
        alignItems: 'center',
        justifyContent: 'center',
        '& img': {
          height: isSigninRoute ? { xs: 110, sm: 125} : { xs: 50, sm: 65}, 
        },
      }}
      className='app-logo'
    >
      <img 
        src={Logo} 
        alt={MARCA.nombre} 
        onClick={() => {
          if(!isSigninRoute){
            // navigate('/inversiones');
          }
        }}
      />
      <Box
        sx={{
          mt: 1,
          display: { xs: 'none', md: 'block' },
          '& img': {
            height: { xs: 25, sm: 30 },
          },
        }}
      >
      </Box>
    </Box>
  );
};

export default AppLogo;

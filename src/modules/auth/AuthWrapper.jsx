import React from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';
import { Fonts } from '@crema/constants/AppEnums';
import AppLogo from '@crema/components/AppLayout/components/AppLogo';
import fondoDefecto from '../../assets/fondo/247.jpg';
import { useApariencia } from '../../shared/apariencia';
import BotonModo from '../../shared/apariencia/BotonModo';

const ALINEACION = { izquierda: 'flex-start', centro: 'center', derecha: 'flex-end' };

// Pantallas de ingreso. Fondo, logo, textos y posición de la tarjeta salen de
// Configuración → Apariencia de la academia.
const AuthWrapper = ({ children }) => {
  const { apariencia } = useApariencia();
  const fondo = apariencia.login_fondo_url || fondoDefecto;

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: { xs: 'center', sm: ALINEACION[apariencia.login_posicion] ?? ALINEACION.izquierda },
        justifyContent: 'center',
        position: 'relative',
        backgroundImage: `url(${fondo})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100%',
        minHeight: '100vh',
        px: { xs: 4, sm: 10, lg: 20 },
        py: 4,
      }}
    >
      <BotonModo
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          color: 'text.primary',
          backgroundColor: 'background.paper',
          boxShadow: 2,
          '&:hover': { backgroundColor: 'background.paper' },
        }}
      />
      <Card
        sx={{
          maxWidth: 400,
          minHeight: { xs: 320, sm: 450 },
          width: '100%',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
        }}
      >
        <Box
          sx={{
            width: { xs: '100%' },
            padding: { xs: 5, lg: 10 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ width: '100%' }}>
            <Box sx={{ mb: { xs: 10, xl: 8 } }}>
              <Box
                sx={{
                  m: 9,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AppLogo />
              </Box>
              {(apariencia.login_titulo || apariencia.login_subtitulo) && (
                <Box sx={{ textAlign: 'center' }}>
                  {apariencia.login_titulo && (
                    <Typography component='h1' sx={{ fontSize: 20, fontWeight: Fonts.BOLD, color: 'text.primary' }}>
                      {apariencia.login_titulo}
                    </Typography>
                  )}
                  {apariencia.login_subtitulo && (
                    <Typography sx={{ mt: 1, fontSize: 14, color: 'text.secondary' }}>
                      {apariencia.login_subtitulo}
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
            {children}
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default AuthWrapper;

AuthWrapper.propTypes = {
  children: PropTypes.node,
};

import React from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';
import { Fonts } from '@crema/constants/AppEnums';
import AppLogo from '@crema/components/AppLayout/components/AppLogo';
// TODO:: IMAGEN DE FONDO LOGIN
import fondo from "../../assets/fondo/247.jpg";
import { width } from '@mui/system';

const AuthWrapper = ({ children }) => {
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start', // Alinea a la izquierda
        justifyContent: 'center',
        backgroundImage: `url(${fondo})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100%',
        minHeight: '100vh', // Asegura que cubra toda la pantalla
        pl: { xs: 2, sm: 5, lg: 10 }, // Agrega espacio a la izquierda
      }}
    >
      <Card
        sx={{
          maxWidth: 400,
          minHeight: { xs: 320, sm: 450 },
          width: '100%',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          ml: { xs: -1, sm: 5, lg: 10 },
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
            <Box sx={{ mb: { xs:10, xl: 8 } }}>
              <Box
                sx={{
                  m: 9,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AppLogo/>
              </Box>
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

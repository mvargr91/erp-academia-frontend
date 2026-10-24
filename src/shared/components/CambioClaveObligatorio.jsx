// Primer ingreso con la contraseña inicial que dio el administrador (p. ej. la cuenta de un profesor):
// antes de usar el ERP debe cambiarla. El backend tampoco responde nada más hasta entonces (ClaveVigente).
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { actualizarUsuarioSesion, logoutUser } from '../../@crema/redux/features/auth/authSlice';
import Seguridad from '../../modules/Cuenta/MiCuenta/Seguridad';

const CambioClaveObligatorio = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const nombre = useSelector((state) => state.auth.user?.usuario?.nombre);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2, bgcolor: 'background.default' }}>
      <Card sx={{ maxWidth: 720, width: '100%' }}>
        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
          <Typography variant='h2' sx={{ fontWeight: 'bold', mb: 1 }}>
            {nombre ? `Hola, ${nombre}` : 'Bienvenido'}
          </Typography>
          <Typography color='text.secondary' sx={{ mb: 3 }}>
            Entraste con una contraseña inicial. Por seguridad, cámbiala por una que solo tú conozcas para continuar.
          </Typography>
          <Seguridad
            descripcion='En «Contraseña actual» escribe la que te entregaron.'
            onCambiada={() => dispatch(actualizarUsuarioSesion({ debe_cambiar_clave: false }))}
          />
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button color='inherit' onClick={() => dispatch(logoutUser(navigate))}>
              Salir
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CambioClaveObligatorio;

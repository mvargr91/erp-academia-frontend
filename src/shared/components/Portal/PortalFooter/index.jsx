import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, Grid, Link, Stack, Typography } from '@mui/material';
import { COLORES_MARCA, MARCA, gradienteArcoiris } from '../../../constants/Marca';
import { ENLACES_PORTAL } from '../PortalHeader';
import { RUTAS_PORTAL } from '../../../constants/RutasPortal';

const Columna = ({ titulo, children }) => (
  <Grid item xs={6} md={3}>
    <Typography variant='subtitle2' sx={{ color: '#fff', mb: 1.5, fontWeight: 700 }}>
      {titulo}
    </Typography>
    <Stack spacing={1}>{children}</Stack>
  </Grid>
);

const enlaceSx = { color: 'rgba(255,255,255,0.75)', '&:hover': { color: '#fff' } };

const PortalFooter = () => (
  <Box component='footer' sx={{ bgcolor: COLORES_MARCA.texto, color: 'rgba(255,255,255,0.75)', mt: 8 }}>
    <Box sx={{ height: 4, background: gradienteArcoiris }} />
    <Container maxWidth='lg' sx={{ py: 6 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={3}>
          {/* Fondo oscuro: variante con el "+" en blanco */}
          <Box component='img' src={MARCA.logos.oscuro} alt={MARCA.nombre} sx={{ height: 64, mb: 1.5 }} />
          <Typography variant='body2'>{MARCA.eslogan}. Experiencias verificadas y seguras para toda la comunidad.</Typography>
        </Grid>
        <Columna titulo='Explorar'>
          {ENLACES_PORTAL.filter((e) => e.to !== '/').map((e) => (
            <Link key={e.to} component={RouterLink} to={e.to} underline='none' sx={enlaceSx}>
              {e.label}
            </Link>
          ))}
        </Columna>
        <Columna titulo='Proveedores'>
          <Link component={RouterLink} to={`${RUTAS_PORTAL.registro}?tipo=proveedor`} underline='none' sx={enlaceSx}>
            Registra tu negocio
          </Link>
          <Link component={RouterLink} to='/signin' underline='none' sx={enlaceSx}>
            Portal de proveedores
          </Link>
          <Typography variant='body2'>Verificamos cada negocio antes de publicar sus experiencias.</Typography>
        </Columna>
        <Columna titulo='Tu cuenta'>
          <Link component={RouterLink} to={RUTAS_PORTAL.registro} underline='none' sx={enlaceSx}>
            Crear cuenta
          </Link>
          <Link component={RouterLink} to='/signin' underline='none' sx={enlaceSx}>
            Ingresar
          </Link>
          <Link component={RouterLink} to='/mis-reservas' underline='none' sx={enlaceSx}>
            Mis reservas
          </Link>
          <Link component={RouterLink} to='/mis-favoritos' underline='none' sx={enlaceSx}>
            Mis favoritos
          </Link>
        </Columna>
      </Grid>
      <Typography variant='caption' component='p' sx={{ mt: 5, textAlign: 'center' }}>
        © {new Date().getFullYear()} {MARCA.nombre}. Todos los derechos reservados.
      </Typography>
    </Container>
  </Box>
);

export default PortalFooter;

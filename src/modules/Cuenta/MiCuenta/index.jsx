// "Mi cuenta": perfil del usuario autenticado (cualquier rol).
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Avatar, Box, Card, Chip, CircularProgress, Tab, Tabs, Typography } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { onGetCuenta } from '@crema/redux/features/cuenta/cuentaSlice';
import AppMessageView from '@crema/components/AppMessageView';
import { ERROR_TYPE } from '../../../shared/constants/Constantes';
import DatosPersonales from './DatosPersonales';
import Seguridad from './Seguridad';

const iniciales = (nombre = '') =>
  nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0].toUpperCase())
    .join('');

const fechaLarga = (fecha) =>
  fecha ? new Date(fecha.replace(' ', 'T')).toLocaleDateString('es-CO', { month: 'long', year: 'numeric' }) : '';

const MiCuenta = () => {
  const dispatch = useDispatch();
  const { datos: cuenta, loading, error } = useSelector((state) => state.cuenta);
  const { message, messageType } = useSelector(({ common }) => common);
  // Pestaña inicial desde la URL (/mi-cuenta?tab=seguridad). Se lee de window.location porque el guard de
  // rutas de la plantilla redirige sin el query y luego lo restaura por fuera de react-router.
  const [tab, setTab] = useState(() => new URLSearchParams(window.location.search).get('tab'));

  useEffect(() => {
    dispatch(onGetCuenta());
  }, [dispatch]);

  const pestanas = [
    { id: 'datos', label: 'Datos personales', icon: <PersonOutlineIcon /> },
    { id: 'seguridad', label: 'Seguridad', icon: <LockOutlinedIcon /> },
  ];
  const pestana = pestanas.some((p) => p.id === tab) ? tab : 'datos';
  const cambiarPestana = (_, valor) => setTab(valor);

  if (loading && !cuenta) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 20 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (error && !cuenta) {
    return <Alert severity='error'>{error}</Alert>;
  }
  if (!cuenta) return null;

  return (
    <Box sx={{ maxWidth: 960, mx: 'auto' }}>
      <Card sx={{ mb: 6, overflow: 'hidden' }}>
        {/* Franja con el color primario de la academia (Configuración → Apariencia). */}
        <Box sx={{ height: 6, backgroundColor: 'primary.main' }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, p: { xs: 4, md: 6 }, flexWrap: 'wrap' }}>
          <Avatar sx={{ width: 72, height: 72, fontSize: 26, fontWeight: 600, bgcolor: 'primary.main' }}>
            {iniciales(cuenta.nombre)}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Typography component='h1' sx={{ fontSize: 22, fontWeight: 600 }}>
              {cuenta.nombre}
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              {cuenta.correo_electronico}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              {cuenta.rol && <Chip size='small' label={cuenta.rol} color='primary' variant='outlined' />}
              {cuenta.miembro_desde && (
                <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                  Miembro desde {fechaLarga(cuenta.miembro_desde)}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Card>

      <Card>
        <Tabs
          value={pestana}
          onChange={cambiarPestana}
          variant='scrollable'
          allowScrollButtonsMobile
          sx={{ px: { xs: 2, md: 4 }, borderBottom: 1, borderColor: 'divider' }}
        >
          {pestanas.map((p) => (
            <Tab key={p.id} value={p.id} label={p.label} icon={p.icon} iconPosition='start' sx={{ minHeight: 60, textTransform: 'none', fontWeight: 600 }} />
          ))}
        </Tabs>
        <Box sx={{ p: { xs: 4, md: 6 } }}>
          {pestana === 'datos' && <DatosPersonales cuenta={cuenta} />}
          {pestana === 'seguridad' && <Seguridad />}
        </Box>
      </Card>

      <AppMessageView variant={messageType === ERROR_TYPE ? 'error' : 'success'} message={message || ''} />
    </Box>
  );
};

export default MiCuenta;

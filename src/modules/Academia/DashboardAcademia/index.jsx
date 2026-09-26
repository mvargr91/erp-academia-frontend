import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Card, CardContent, Grid, Typography, LinearProgress, useTheme } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import EventIcon from '@mui/icons-material/Event';
import PaymentsIcon from '@mui/icons-material/Payments';
import PersonIcon from '@mui/icons-material/Person';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import jwtAxios from '../../../@crema/services/auth/jwt-auth';
import usePermisosOpcion from '../../../shared/hooks/usePermisosOpcion';
import { formatoMoneda } from '../../../shared/constants/Academia';

const Tarjeta = ({ titulo, valor, icono: Icono, color }) => (
  <Card sx={{ height: '100%', boxShadow: '0px 0px 5px 2px rgb(0 0 0 / 8%)' }}>
    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box
        sx={{
          width: 52,
          height: 52,
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: color,
          color: 'white',
          flexShrink: 0,
        }}
      >
        <Icono />
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant='h4' sx={{ fontWeight: 'bold' }} noWrap>
          {valor}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          {titulo}
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

Tarjeta.propTypes = {
  titulo: PropTypes.string.isRequired,
  valor: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icono: PropTypes.elementType.isRequired,
  color: PropTypes.string.isRequired,
};

const BarraLista = ({ titulo, items, etiqueta, valor, formato }) => {
  const theme = useTheme();
  const max = Math.max(1, ...items.map((it) => Number(valor(it)) || 0));
  return (
    <Card sx={{ height: '100%', boxShadow: '0px 0px 5px 2px rgb(0 0 0 / 8%)' }}>
      <CardContent>
        <Typography variant='h5' sx={{ fontWeight: 'bold', mb: 2 }}>
          {titulo}
        </Typography>
        {items.length === 0 ? (
          <Typography color='text.secondary'>Sin datos.</Typography>
        ) : (
          items.map((it, i) => (
            <Box key={i} sx={{ mb: 1.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant='body2'>{etiqueta(it)}</Typography>
                <Typography variant='body2' sx={{ fontWeight: 'bold' }}>
                  {formato ? formato(valor(it)) : valor(it)}
                </Typography>
              </Box>
              <LinearProgress
                variant='determinate'
                value={((Number(valor(it)) || 0) / max) * 100}
                sx={{ height: 8, borderRadius: 4, backgroundColor: theme.palette.action.hover }}
              />
            </Box>
          ))
        )}
      </CardContent>
    </Card>
  );
};

BarraLista.propTypes = {
  titulo: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  etiqueta: PropTypes.func.isRequired,
  valor: PropTypes.func.isRequired,
  formato: PropTypes.func,
};

const DashboardAcademia = ({ route }) => {
  const { titulo, permisos } = usePermisosOpcion(route.path);
  const [data, setData] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;
    jwtAxios
      .get('academia/dashboard')
      .then((res) => {
        if (activo) setData(res.data);
      })
      .catch(() => {})
      .finally(() => activo && setCargando(false));
    return () => {
      activo = false;
    };
  }, []);

  if (permisos && permisos.length === 0) {
    return <Box sx={{ p: 4, fontSize: 19 }}>No está autorizado para ver esta opción.</Box>;
  }

  if (cargando || !data) {
    return (
      <Box sx={{ p: 4 }}>
        <LinearProgress />
      </Box>
    );
  }

  const t = data.tarjetas ?? {};

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h2' sx={{ fontWeight: 'bold', mb: 3 }}>
        {titulo || 'Panel Academia'}
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Tarjeta titulo='Alumnos activos' valor={t.alumnos_activos ?? 0} icono={GroupsIcon} color='#2E75B6' />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Tarjeta titulo='Cursos activos' valor={t.cursos_activos ?? 0} icono={EventIcon} color='#7C4DFF' />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Tarjeta titulo='Ingresos del mes' valor={formatoMoneda(t.ingresos_mes ?? 0)} icono={PaymentsIcon} color='green' />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Tarjeta titulo='Matrículas activas' valor={t.matriculas_activas ?? 0} icono={HowToRegIcon} color='#00838F' />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Tarjeta titulo='Profesores activos' valor={t.profesores_activos ?? 0} icono={PersonIcon} color='#455A64' />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Tarjeta titulo='Alumnos morosos' valor={t.morosos ?? 0} icono={WarningAmberIcon} color='#FE8500' />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Tarjeta titulo='Saldo pendiente por cobrar' valor={formatoMoneda(t.saldo_pendiente ?? 0)} icono={AccountBalanceWalletIcon} color='#B80001' />
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mt: 0.5 }}>
        <Grid item xs={12} md={6}>
          <BarraLista
            titulo='Ingresos últimos 6 meses'
            items={data.ingresos_por_mes ?? []}
            etiqueta={(it) => it.mes}
            valor={(it) => it.total}
            formato={formatoMoneda}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <BarraLista
            titulo='Alumnos por ritmo'
            items={data.alumnos_por_ritmo ?? []}
            etiqueta={(it) => it.nombre}
            valor={(it) => it.total}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

DashboardAcademia.propTypes = {
  route: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
};

export default DashboardAcademia;

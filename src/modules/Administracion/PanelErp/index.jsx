// Panel del dueño del ERP: ingresos, cartera y estado de las academias clientes.
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import ApartmentIcon from '@mui/icons-material/Apartment';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import jwtAxios from '../../../@crema/services/auth/jwt-auth';
import usePermisosOpcion from '../../../shared/hooks/usePermisosOpcion';
import { formatoMoneda } from '../../../shared/constants/Academia';

const sombra = { boxShadow: '0px 0px 5px 2px rgb(0 0 0 / 8%)', height: '100%' };

const Tarjeta = ({ titulo, valor, detalle, icono: Icono, color }) => (
  <Card sx={sombra}>
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
        {detalle && (
          <Typography variant='caption' color='text.secondary'>
            {detalle}
          </Typography>
        )}
      </Box>
    </CardContent>
  </Card>
);

Tarjeta.propTypes = {
  titulo: PropTypes.string.isRequired,
  valor: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  detalle: PropTypes.string,
  icono: PropTypes.elementType.isRequired,
  color: PropTypes.string.isRequired,
};

const ESTADOS = [
  { id: 'al_dia', nombre: 'Al día', color: 'success' },
  { id: 'pendiente', nombre: 'Pago pendiente', color: 'warning' },
  { id: 'en_mora', nombre: 'En mora', color: 'error' },
  { id: 'suspendida', nombre: 'Suspendidas', color: 'default' },
];

const PanelErp = ({ route }) => {
  const { titulo } = usePermisosOpcion(route.path);
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    jwtAxios
      .get('panel-erp')
      .then(({ data }) => setDatos(data))
      .catch(() => setError('No se pudo cargar el panel.'));
  }, []);

  if (error) return <Typography color='error'>{error}</Typography>;
  if (!datos) return <LinearProgress />;

  const maxRecaudo = Math.max(1, ...datos.recaudo_mensual.map((m) => m.valor));

  return (
    <Box>
      <Typography variant='h2' sx={{ fontWeight: 'bold', mb: 4 }}>
        {titulo || 'Panel ERP'}
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <Tarjeta titulo='Ingreso mensual recurrente' valor={formatoMoneda(datos.mrr)} icono={AutorenewIcon} color='#1A73E8' />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Tarjeta
            titulo='Academias activas'
            valor={`${datos.academias_activas} / ${datos.academias_total}`}
            icono={ApartmentIcon}
            color='#7B1FA2'
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Tarjeta
            titulo='Cartera vencida'
            valor={formatoMoneda(datos.cartera_vencida)}
            detalle={`Por cobrar en total: ${formatoMoneda(datos.cartera)}`}
            icono={WarningAmberIcon}
            color='#C62828'
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Tarjeta titulo='Recaudado este mes' valor={formatoMoneda(datos.recaudo_mes)} icono={AccountBalanceIcon} color='#2E7D32' />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Card sx={sombra}>
            <CardContent>
              <Typography variant='h5' sx={{ fontWeight: 'bold', mb: 2 }}>
                Estado de las academias
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
                {ESTADOS.map((e) => (
                  <Chip key={e.id} color={e.color} label={`${e.nombre}: ${datos.estados[e.id] ?? 0}`} />
                ))}
              </Box>
              <Typography variant='h5' sx={{ fontWeight: 'bold', mb: 2 }}>
                Recaudo últimos 6 meses
              </Typography>
              {datos.recaudo_mensual.map((m) => (
                <Box key={m.mes} sx={{ mb: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant='body2'>{m.mes}</Typography>
                    <Typography variant='body2' sx={{ fontWeight: 'bold' }}>
                      {formatoMoneda(m.valor)}
                    </Typography>
                  </Box>
                  <LinearProgress variant='determinate' value={(m.valor / maxRecaudo) * 100} sx={{ height: 8, borderRadius: 4 }} />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={7}>
          <Card sx={sombra}>
            <CardContent>
              <Typography variant='h5' sx={{ fontWeight: 'bold', mb: 2 }}>
                Academias en mora o suspendidas
              </Typography>
              {datos.morosas.length === 0 ? (
                <Typography color='text.secondary'>Todas las academias están al día. 🎉</Typography>
              ) : (
                <Box sx={{ overflowX: 'auto' }}>
                  <Table size='small'>
                    <TableHead>
                      <TableRow>
                        <TableCell>Academia</TableCell>
                        <TableCell>Estado</TableCell>
                        <TableCell align='right'>Saldo</TableCell>
                        <TableCell>Se suspende</TableCell>
                        <TableCell>Contacto</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {datos.morosas.map((a) => (
                        <TableRow key={a.id}>
                          <TableCell>{a.nombre}</TableCell>
                          <TableCell>
                            <Chip
                              size='small'
                              color={a.estado === 'suspendida' ? 'default' : 'error'}
                              label={a.estado === 'suspendida' ? 'Suspendida' : 'En mora'}
                            />
                          </TableCell>
                          <TableCell align='right'>{formatoMoneda(a.saldo)}</TableCell>
                          <TableCell>{a.estado === 'suspendida' ? '—' : a.fecha_suspension}</TableCell>
                          <TableCell>
                            {a.correo}
                            {a.telefono ? ` · ${a.telefono}` : ''}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

PanelErp.propTypes = {
  route: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
};

export default PanelErp;

// Pago de una inscripción a un vacacional (completo o por abonos). Exige el permiso «Pagar» de
// Inscripciones. Estos pagos son propios de vacacionales: no entran en Pagos de la academia.
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  LinearProgress,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import jwtAxios from '../../../../@crema/services/auth/jwt-auth';
import usePermisosOpcion from '../../../../shared/hooks/usePermisosOpcion';
import { METODOS_PAGO, formatoMoneda, nombreDe } from '../../../../shared/constants/Academia';

const BASE = '/vacacionales-inscripciones';
const sombra = { mb: 2, boxShadow: '0px 0px 5px 2px rgb(0 0 0 / 8%)' };
const hoy = () => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
const fechaCorta = (iso) => (iso ? iso.split('-').reverse().join('/') : '');
const pagoNuevo = (saldo) => ({ monto: saldo > 0 ? saldo : '', fecha_pago: hoy(), metodo_pago: 'efectivo', referencia: '' });

const PagarInscripcion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [query] = useSearchParams();
  const { permisos, cargado } = usePermisosOpcion(BASE);
  const [inscripcion, setInscripcion] = useState(null);
  const [pago, setPago] = useState(pagoNuevo(0));
  const [errorCarga, setErrorCarga] = useState('');
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    jwtAxios
      .get(`vacacionales-inscripciones/${id}`)
      .then(({ data }) => {
        setInscripcion(data);
        setPago(pagoNuevo(data.saldo));
      })
      .catch(() => setErrorCarga('No se pudo cargar la inscripción.'));
  }, [id]);

  if (errorCarga) return <Alert severity='error'>{errorCarga}</Alert>;
  if (!inscripcion || !cargado) return <LinearProgress />;

  const destino = query.get('volver');
  const volver = () => navigate(destino && destino.startsWith('/') && !destino.startsWith('//') ? destino : BASE);
  const puedePagar = permisos.indexOf('Pagar') >= 0;
  const cambiar = (campo) => (e) => setPago((p) => ({ ...p, [campo]: e.target.value }));

  const enviar = (peticion) => {
    setError('');
    setExito('');
    setGuardando(true);
    peticion
      .then(({ data }) => {
        setInscripcion(data.datos);
        setPago(pagoNuevo(data.datos.saldo));
        setExito(data.mensajes[0]);
      })
      .catch((e) => setError(e?.response?.data?.mensajes?.[0] ?? 'No se pudo guardar el pago.'))
      .finally(() => setGuardando(false));
  };

  const registrar = () => {
    if (!(Number(pago.monto) > 0)) {
      setError('Indica el monto del pago.');
      return;
    }
    enviar(jwtAxios.post(`vacacionales-inscripciones/${id}/pagos`, { ...pago, monto: Number(pago.monto) }));
  };

  return (
    <Box sx={{ maxWidth: 900 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Tooltip title='Volver'>
          <IconButton onClick={volver}>
            <ArrowBackIosIcon />
          </IconButton>
        </Tooltip>
        <Box>
          <Typography variant='h2' sx={{ fontWeight: 'bold' }}>
            Pago del vacacional
          </Typography>
          <Typography color='text.secondary'>
            {inscripcion.alumno_nombre} · {inscripcion.curso_nombre} · clases: {inscripcion.fechas_texto}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
        <Chip label={`Valor ${formatoMoneda(inscripcion.valor)}`} />
        <Chip color='success' label={`Pagado ${formatoMoneda(inscripcion.pagado)}`} />
        <Chip
          color={inscripcion.saldo > 0 ? 'error' : 'default'}
          label={inscripcion.saldo > 0 ? `Por pagar ${formatoMoneda(inscripcion.saldo)}` : 'Pagado completo'}
        />
      </Box>

      {error && (
        <Alert severity='error' sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {exito && (
        <Alert severity='success' sx={{ mb: 2 }} onClose={() => setExito('')}>
          {exito}
        </Alert>
      )}
      {!puedePagar && (
        <Alert severity='warning' sx={{ mb: 2 }}>
          Tu perfil no tiene el permiso «Pagar» de Inscripciones de vacacionales: solo puedes consultar los pagos.
        </Alert>
      )}

      {puedePagar && inscripcion.saldo > 0 && Boolean(inscripcion.estado) && (
        <Card sx={sombra}>
          <CardContent>
            <Typography sx={{ fontWeight: 'bold', mb: 3 }}>Registrar pago</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(4, 1fr)' }, columnGap: 4, rowGap: 3, alignItems: 'end' }}>
              <TextField variant='standard' type='number' label='Monto' value={pago.monto} onChange={cambiar('monto')} required />
              <TextField variant='standard' type='date' label='Fecha de pago' value={pago.fecha_pago} onChange={cambiar('fecha_pago')} InputLabelProps={{ shrink: true }} />
              <TextField variant='standard' select label='Método de pago' value={pago.metodo_pago} onChange={cambiar('metodo_pago')}>
                {METODOS_PAGO.map((m) => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.nombre}
                  </MenuItem>
                ))}
              </TextField>
              <TextField variant='standard' label='Referencia' value={pago.referencia} onChange={cambiar('referencia')} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button variant='contained' onClick={registrar} disabled={guardando}>
                Registrar pago
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      <Card sx={sombra}>
        <CardContent>
          <Typography sx={{ fontWeight: 'bold', mb: 2 }}>Pagos registrados</Typography>
          {inscripcion.pagos?.length ? (
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Método</TableCell>
                  <TableCell>Referencia</TableCell>
                  <TableCell align='right'>Monto</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {inscripcion.pagos.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{fechaCorta(p.fecha_pago)}</TableCell>
                    <TableCell>{nombreDe(METODOS_PAGO, p.metodo_pago)}</TableCell>
                    <TableCell>{p.referencia}</TableCell>
                    <TableCell align='right'>{formatoMoneda(p.monto)}</TableCell>
                    <TableCell align='right'>
                      {puedePagar && (
                        <Tooltip title='Quitar este pago (vuelve a quedar por pagar)'>
                          <span>
                            <IconButton
                              size='small'
                              disabled={guardando}
                              onClick={() => enviar(jwtAxios.delete(`vacacionales-inscripciones/${id}/pagos/${p.id}`))}
                            >
                              <DeleteOutlineIcon fontSize='small' />
                            </IconButton>
                          </span>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Typography color='text.secondary'>Sin pagos registrados.</Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default PagarInscripcion;

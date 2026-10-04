// Registrar qué pasó con cada alumno en una clase personalizada. La regla de descuento:
// asistió / no asistió → descuenta 1; canceló con >= 24 h → no descuenta; canceló tarde → descuenta.
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
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
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import jwtAxios from '../../../../@crema/services/auth/jwt-auth';
import { showMessage } from '../../../../@crema/redux/features/cammon/commonSlice';

const OPCIONES = [
  { id: 'asistio', nombre: 'Asistió' },
  { id: 'no_asistio', nombre: 'No asistió (descuenta)' },
  { id: 'cancelo', nombre: 'Canceló' },
];

// Hora local "YYYY-MM-DDTHH:mm" para el input datetime-local.
const ahoraLocal = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

const RegistrarClase = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [clase, setClase] = useState(null);
  const [resultados, setResultados] = useState({});
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    jwtAxios
      .get(`clases-privadas/${id}`)
      .then(({ data }) => {
        setClase(data);
        setResultados(
          Object.fromEntries(
            data.detalle_alumnos.map((a) => [
              a.alumno_id,
              {
                resultado: a.resultado === 'pendiente' ? 'asistio' : a.resultado,
                cancelado_en: a.cancelado_en ? a.cancelado_en.slice(0, 16).replace(' ', 'T') : ahoraLocal(),
              },
            ]),
          ),
        );
      })
      .catch(() => setError('No se pudo cargar la clase.'));
  }, [id]);

  if (error) return <Alert severity='error'>{error}</Alert>;
  if (!clase) return <LinearProgress />;

  const inicio = new Date(`${clase.fecha}T${clase.hora}`);
  const descuenta = (r) =>
    r.resultado !== 'cancelo' || (inicio - new Date(r.cancelado_en)) / 3600000 < clase.horas_cancelacion;

  const cambiar = (alumnoId, campo, valor) =>
    setResultados((prev) => ({ ...prev, [alumnoId]: { ...prev[alumnoId], [campo]: valor } }));

  const guardar = () => {
    setGuardando(true);
    jwtAxios
      .put(`clases-privadas/${id}/registrar`, {
        resultados: Object.entries(resultados).map(([alumnoId, r]) => ({
          alumno_id: Number(alumnoId),
          resultado: r.resultado,
          cancelado_en: r.resultado === 'cancelo' ? r.cancelado_en.replace('T', ' ') : null,
        })),
      })
      .then(({ data }) => {
        dispatch(showMessage(data.mensajes));
        navigate('/clases-privadas');
      })
      .catch((e) => setError(e?.response?.data?.mensajes?.[0] ?? 'No se pudo registrar.'))
      .finally(() => setGuardando(false));
  };

  return (
    <Box sx={{ maxWidth: 900 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Tooltip title='Volver'>
          <IconButton onClick={() => navigate('/clases-privadas')}>
            <ArrowBackIosIcon />
          </IconButton>
        </Tooltip>
        <Box>
          <Typography variant='h2' sx={{ fontWeight: 'bold' }}>
            Registrar clase personalizada
          </Typography>
          <Typography color='text.secondary'>
            {clase.fecha.split('-').reverse().join('/')} · {clase.hora} · {clase.duracion_min} min
            {clase.profesor_nombre ? ` · ${clase.profesor_nombre}` : ''}
          </Typography>
        </Box>
      </Box>

      <Alert severity='info' sx={{ mb: 3 }}>
        Asistió o no asistió: descuenta 1 clase. Canceló con al menos {clase.horas_cancelacion} horas de anticipación: no
        descuenta; si canceló más tarde, descuenta.
      </Alert>

      {clase.detalle_alumnos.map((a) => {
        const r = resultados[a.alumno_id];
        const desc = descuenta(r);
        return (
          <Card key={a.alumno_id} sx={{ mb: 2, boxShadow: '0px 0px 5px 2px rgb(0 0 0 / 8%)' }}>
            <CardContent sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
              <Box sx={{ flex: '1 1 220px' }}>
                <Typography sx={{ fontWeight: 'bold' }}>{a.nombre}</Typography>
                <Typography variant='body2' color={a.paquete.restantes > 0 ? 'text.secondary' : 'error'}>
                  {a.paquete.restantes > 0
                    ? `Le quedan ${a.paquete.restantes} clases${a.paquete.vence ? ` (vence ${a.paquete.vence})` : ''}`
                    : 'Sin paquete vigente con clases'}
                </Typography>
              </Box>
              <TextField
                select
                size='small'
                label='Resultado'
                value={r.resultado}
                onChange={(e) => cambiar(a.alumno_id, 'resultado', e.target.value)}
                sx={{ minWidth: 200 }}
              >
                {OPCIONES.map((o) => (
                  <MenuItem key={o.id} value={o.id}>
                    {o.nombre}
                  </MenuItem>
                ))}
              </TextField>
              {r.resultado === 'cancelo' && (
                <TextField
                  type='datetime-local'
                  size='small'
                  label='¿Cuándo avisó?'
                  value={r.cancelado_en}
                  onChange={(e) => cambiar(a.alumno_id, 'cancelado_en', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              )}
              <Chip color={desc ? 'warning' : 'success'} label={desc ? 'Descuenta 1 clase' : 'No descuenta'} />
            </CardContent>
          </Card>
        );
      })}

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
        <Button onClick={() => navigate('/clases-privadas')}>Cancelar</Button>
        <Button variant='contained' onClick={guardar} disabled={guardando}>
          Guardar resultado
        </Button>
      </Box>
    </Box>
  );
};

export default RegistrarClase;

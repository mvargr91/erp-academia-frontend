// Registrar qué pasó con cada persona en una clase personalizada. La regla de descuento del paquete:
// asistió / no asistió / canceló tarde → descuenta 1; canceló a tiempo → no descuenta.
// La persona no registrada (clase suelta) no tiene paquete: solo se anota su resultado.
// El cobro de la clase va aparte (CobrarClase): es de otro perfil.
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
import { formatoMoneda } from '../../../../shared/constants/Academia';

const OPCIONES = [
  { id: 'asistio', nombre: 'Asistió', descuenta: true },
  { id: 'no_asistio', nombre: 'No asistió', descuenta: true },
  { id: 'cancelo_a_tiempo', nombre: 'Canceló a tiempo', descuenta: false },
  { id: 'cancelo_tarde', nombre: 'Canceló tarde', descuenta: true },
];
// Lo guardado ('cancelo' + si descontó) como opción de la lista.
const opcionDe = (resultado, descuenta) =>
  resultado === 'cancelo' ? (descuenta ? 'cancelo_tarde' : 'cancelo_a_tiempo') : resultado === 'pendiente' ? 'asistio' : resultado;

const RegistrarClase = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [clase, setClase] = useState(null);
  const [resultados, setResultados] = useState({});
  const [externo, setExterno] = useState('asistio');
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);
  // Errores al guardar: se muestran sin ocultar la pantalla (el otro `error` es de carga).
  const [errorCobro, setErrorCobro] = useState('');

  useEffect(() => {
    jwtAxios
      .get(`clases-privadas/${id}`)
      .then(({ data }) => {
        setClase(data);
        setResultados(Object.fromEntries(data.detalle_alumnos.map((a) => [a.alumno_id, opcionDe(a.resultado, a.descuenta)])));
        setExterno(data.externo_resultado === 'pendiente' ? 'asistio' : data.externo_resultado);
      })
      .catch(() => setError('No se pudo cargar la clase.'));
  }, [id]);

  if (error) return <Alert severity='error'>{error}</Alert>;
  if (!clase) return <LinearProgress />;

  const cambiar = (alumnoId, valor) => setResultados((prev) => ({ ...prev, [alumnoId]: valor }));

  const guardar = () => {
    setErrorCobro('');
    setGuardando(true);
    jwtAxios
      .put(`clases-privadas/${id}/registrar`, {
        resultados: Object.entries(resultados).map(([alumnoId, r]) => ({
          alumno_id: Number(alumnoId),
          resultado: r.startsWith('cancelo') ? 'cancelo' : r,
          a_tiempo: r.startsWith('cancelo') ? r === 'cancelo_a_tiempo' : null,
        })),
        externo_resultado: clase.externo_nombre ? externo : null,
      })
      .then(({ data }) => {
        dispatch(showMessage(data.mensajes));
        navigate('/clases-privadas');
      })
      .catch((e) => setErrorCobro(e?.response?.data?.mensajes?.[0] ?? 'No se pudo registrar.'))
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
            Registrar asistencia de la clase
          </Typography>
          <Typography color='text.secondary'>
            {clase.fecha.split('-').reverse().join('/')} · {clase.hora} · {clase.duracion_min} min
            {clase.profesor_nombre ? ` · ${clase.profesor_nombre}` : ''}
          </Typography>
        </Box>
      </Box>

      <Alert severity='info' sx={{ mb: 3 }}>
        Asistió, no asistió o canceló tarde: descuenta 1 clase del paquete. Canceló a tiempo (al menos {clase.horas_cancelacion}{' '}
        horas antes): no descuenta.
      </Alert>

      {clase.detalle_alumnos.map((a) => {
        const r = resultados[a.alumno_id];
        const desc = OPCIONES.find((o) => o.id === r)?.descuenta;
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
                value={r}
                onChange={(e) => cambiar(a.alumno_id, e.target.value)}
                sx={{ minWidth: 200 }}
              >
                {OPCIONES.map((o) => (
                  <MenuItem key={o.id} value={o.id}>
                    {o.nombre}
                  </MenuItem>
                ))}
              </TextField>
              <Chip color={desc ? 'warning' : 'success'} label={desc ? 'Descuenta 1 clase' : 'No descuenta'} />
            </CardContent>
          </Card>
        );
      })}

      {clase.externo_nombre && (
        <Card sx={{ mb: 2, boxShadow: '0px 0px 5px 2px rgb(0 0 0 / 8%)' }}>
          <CardContent sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
            <Box sx={{ flex: '1 1 220px' }}>
              <Typography sx={{ fontWeight: 'bold' }}>{clase.externo_nombre}</Typography>
              <Typography variant='body2' color='text.secondary'>
                Clase suelta · persona no registrada
                {clase.externo_telefono ? ` · ${clase.externo_telefono}` : ''}
                {clase.valor !== null ? ` · ${formatoMoneda(clase.valor)}` : ''}
              </Typography>
            </Box>
            <TextField select size='small' label='Resultado' value={externo} onChange={(e) => setExterno(e.target.value)} sx={{ minWidth: 200 }}>
              {OPCIONES.map((o) => (
                <MenuItem key={o.id} value={o.id}>
                  {o.nombre}
                </MenuItem>
              ))}
            </TextField>
            <Chip label='Sin paquete' />
          </CardContent>
        </Card>
      )}

      {errorCobro && (
        <Alert severity='error' sx={{ mb: 2 }} onClose={() => setErrorCobro('')}>
          {errorCobro}
        </Alert>
      )}

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

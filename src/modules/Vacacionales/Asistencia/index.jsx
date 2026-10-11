// Toma de asistencia de vacacionales: se elige el curso y el día de clase, y se marca quién asistió
// entre los alumnos que tienen esa clase. Es aparte de la asistencia de los cursos de la academia.
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSearchParams } from 'react-router-dom';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import jwtAxios from '../../../@crema/services/auth/jwt-auth';
import usePermisosOpcion from '../../../shared/hooks/usePermisosOpcion';
import { fechaConDia } from '../../../shared/components/SelectorFechas';
import { formatoMoneda } from '../../../shared/constants/Academia';

const sombra = { mb: 3, boxShadow: '0px 0px 5px 2px rgb(0 0 0 / 8%)' };
const hoy = () => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
// Día que se propone al abrir un curso: hoy si hay clase; si no, la próxima; si ya terminó, la última.
const diaSugerido = (dias) => {
  const fechas = dias.map((d) => d.fecha);
  return fechas.find((f) => f >= hoy()) ?? fechas[fechas.length - 1] ?? '';
};

const VacacionalAsistencia = ({ route }) => {
  const { titulo, permisos, cargado } = usePermisosOpcion(route.path);
  const [query] = useSearchParams();
  const [cursos, setCursos] = useState([]);
  const [cursoId, setCursoId] = useState(Number(query.get('curso')) || null);
  const [dias, setDias] = useState([]);
  const [fecha, setFecha] = useState('');
  const [alumnos, setAlumnos] = useState([]);
  // inscripcion_id => true (asistió) | false (no asistió); sin marcar no está en el mapa
  const [marcas, setMarcas] = useState({});
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  const puedeGuardar = permisos.some((p) => p === 'Crear' || p === 'Modificar');
  const mensajeDe = (e, texto) => e?.response?.data?.mensajes?.[0] ?? texto;

  useEffect(() => {
    jwtAxios
      .get('vacacionales-cursos', { params: { ligera: 1 } })
      .then(({ data }) => setCursos(data))
      .catch(() => setError('No se pudieron cargar los cursos vacacionales.'));
  }, []);

  const cargar = (curso, dia) => {
    setCargando(true);
    return jwtAxios
      .get('vacacionales-asistencia', { params: { curso_id: curso, ...(dia ? { fecha: dia } : {}) } })
      .then(({ data }) => {
        setDias(data.dias);
        setAlumnos(data.alumnos);
        setMarcas(Object.fromEntries(data.alumnos.filter((a) => a.asistio !== null).map((a) => [a.inscripcion_id, a.asistio])));
        return data;
      })
      .catch((e) => setError(mensajeDe(e, 'No se pudo cargar la asistencia.')))
      .finally(() => setCargando(false));
  };

  // Al elegir el curso se cargan sus días y se abre el día sugerido.
  useEffect(() => {
    setDias([]);
    setAlumnos([]);
    setFecha('');
    setExito('');
    if (cursoId) {
      cargar(cursoId).then((data) => data && setFecha(diaSugerido(data.dias)));
    }
  }, [cursoId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (cursoId && fecha) {
      setExito('');
      cargar(cursoId, fecha);
    }
  }, [fecha]); // eslint-disable-line react-hooks/exhaustive-deps

  if (cargado && permisos.length === 0) {
    return <Alert severity='warning'>No tienes permiso para tomar la asistencia de vacacionales.</Alert>;
  }

  const sinMarcar = alumnos.filter((a) => marcas[a.inscripcion_id] === undefined).length;
  const presentes = alumnos.filter((a) => marcas[a.inscripcion_id] === true).length;

  const guardar = () => {
    setError('');
    setExito('');
    setGuardando(true);
    jwtAxios
      .put('vacacionales-asistencia', {
        curso_id: cursoId,
        fecha,
        asistencias: alumnos.map((a) => ({ inscripcion_id: a.inscripcion_id, asistio: marcas[a.inscripcion_id] === true })),
      })
      .then(({ data }) => {
        setExito(`${data.mensajes[0]} Asistieron ${presentes} de ${alumnos.length}.`);
        return cargar(cursoId, fecha);
      })
      .catch((e) => setError(mensajeDe(e, 'No se pudo guardar la asistencia.')))
      .finally(() => setGuardando(false));
  };

  return (
    <Box sx={{ maxWidth: 1000 }}>
      <Typography variant='h2' sx={{ fontWeight: 'bold', mb: 3 }}>
        {titulo || 'Tomar asistencia vacacional'}
      </Typography>
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

      <Card sx={sombra}>
        <CardContent>
          <Autocomplete
            options={cursos}
            value={cursos.find((c) => c.id === cursoId) ?? null}
            onChange={(_, curso) => setCursoId(curso?.id ?? null)}
            getOptionLabel={(c) => `${c.nombre}${c.ritmo_nombre ? ` · ${c.ritmo_nombre}` : ''}`}
            isOptionEqualToValue={(a, b) => a.id === b.id}
            renderInput={(params) => <TextField {...params} variant='standard' label='Curso vacacional' />}
          />
          {dias.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                Día de clase
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {dias.map((d) => (
                  <Chip
                    key={d.fecha}
                    clickable
                    color={d.fecha === fecha ? 'primary' : d.tomada ? 'success' : 'default'}
                    variant={d.fecha === fecha || d.tomada ? 'filled' : 'outlined'}
                    label={`${fechaConDia(d.fecha)} · ${d.tomada ? `${d.asistieron}/${d.programados}` : `${d.programados} alumno(s)`}`}
                    onClick={() => setFecha(d.fecha)}
                  />
                ))}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      {cargando && <LinearProgress sx={{ mb: 2 }} />}

      {cursoId && fecha && !cargando && (
        <Card sx={sombra}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 2 }}>
              <Typography sx={{ fontWeight: 'bold' }}>
                {fechaConDia(fecha)} · {presentes} de {alumnos.length} asistieron
              </Typography>
              {puedeGuardar && alumnos.length > 0 && (
                <Button size='small' onClick={() => setMarcas(Object.fromEntries(alumnos.map((a) => [a.inscripcion_id, true])))}>
                  Marcar todos como asistió
                </Button>
              )}
            </Box>
            {alumnos.length === 0 ? (
              <Typography color='text.secondary'>Ningún alumno inscrito tiene clase este día.</Typography>
            ) : (
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell>Alumno</TableCell>
                    <TableCell>Acudiente</TableCell>
                    <TableCell align='right'>Por pagar</TableCell>
                    <TableCell align='right'>Asistencia</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {alumnos.map((a) => (
                    <TableRow key={a.inscripcion_id}>
                      <TableCell>
                        {a.alumno_nombre}
                        {a.telefono && (
                          <Typography component='span' variant='caption' color='text.secondary' sx={{ display: 'block' }}>
                            {a.telefono}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {a.acudiente_nombre}
                        {a.acudiente_telefono && (
                          <Typography component='span' variant='caption' color='text.secondary' sx={{ display: 'block' }}>
                            {a.acudiente_telefono}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align='right' sx={{ color: a.saldo > 0 ? 'error.main' : 'text.secondary' }}>
                        {a.saldo > 0 ? formatoMoneda(a.saldo) : 'Al día'}
                      </TableCell>
                      <TableCell align='right'>
                        <ToggleButtonGroup
                          exclusive
                          size='small'
                          disabled={!puedeGuardar}
                          value={marcas[a.inscripcion_id] ?? null}
                          onChange={(_, valor) => valor !== null && setMarcas((m) => ({ ...m, [a.inscripcion_id]: valor }))}
                        >
                          <ToggleButton value color='success' aria-label={`${a.alumno_nombre} asistió`}>
                            <CheckIcon fontSize='small' sx={{ mr: 0.5 }} /> Asistió
                          </ToggleButton>
                          <ToggleButton value={false} color='error' aria-label={`${a.alumno_nombre} no asistió`}>
                            <CloseIcon fontSize='small' sx={{ mr: 0.5 }} /> No asistió
                          </ToggleButton>
                        </ToggleButtonGroup>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {puedeGuardar && alumnos.length > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2, mt: 3, flexWrap: 'wrap' }}>
                {sinMarcar > 0 && (
                  <Typography variant='body2' color='text.secondary'>
                    {sinMarcar} sin marcar: se guardan como «No asistió».
                  </Typography>
                )}
                <Button
                  variant='contained'
                  onClick={guardar}
                  disabled={guardando}
                  startIcon={guardando ? <CircularProgress size={16} color='inherit' /> : <SaveIcon />}
                >
                  Guardar asistencia
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

VacacionalAsistencia.propTypes = {
  route: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
};

export default VacacionalAsistencia;

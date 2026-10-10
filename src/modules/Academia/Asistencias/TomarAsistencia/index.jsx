// Tomar asistencia: se busca el curso, abajo aparecen sus alumnos matriculados y se marca a cada uno
// con un interruptor (o a todos de una vez); cada marca se guarda sola, sin botón de guardar.
// Si la lista de esa fecha ya se tomó, se carga para corregirla.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControlLabel,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import jwtAxios from '../../../../@crema/services/auth/jwt-auth';
import usePermisosOpcion from '../../../../shared/hooks/usePermisosOpcion';
import { useSedes } from '../../../../shared/sedes';
import { DIAS_SEMANA, aHoraCorta, esActivo, nombreDe } from '../../../../shared/constants/Academia';

const sombra = { mb: 3, boxShadow: '0px 0px 5px 2px rgb(0 0 0 / 8%)' };
const hoy = () => dayjs().format('YYYY-MM-DD');
const fechaCorta = (iso) => (iso ? iso.split('-').reverse().join('/') : '');
const nombreCurso = (c) => c.nombre || c.ritmo_nombre || `Curso #${c.id}`;
const horario = (c) => `${nombreDe(DIAS_SEMANA, c.dia)} ${aHoraCorta(c.hora)}`;
const textoCurso = (c) => `${c.nombre ?? ''} ${c.ritmo_nombre ?? ''} ${c.profesor_nombre ?? ''} ${c.sede_nombre ?? ''} ${horario(c)}`;
const mensajesDe = (e, porDefecto) => {
  const mensajes = e?.response?.data?.mensajes;
  return Array.isArray(mensajes) && mensajes.length ? mensajes.join(' ') : porDefecto;
};

const TomarAsistencia = ({ route }) => {
  const { titulo, permisos, cargado } = usePermisosOpcion(route.path);
  const { variasSedes } = useSedes();
  const [cursos, setCursos] = useState([]);
  const [curso, setCurso] = useState(null);
  const [fecha, setFecha] = useState(hoy());
  // Respuesta de asistencias/preparar: { valida, motivo, sugerida, asistencia, alumnos }
  const [calendario, setCalendario] = useState(null);
  const [asistenciaId, setAsistenciaId] = useState(null);
  const [asistentes, setAsistentes] = useState([]);
  const [observacion, setObservacion] = useState('');
  const [filtro, setFiltro] = useState('');
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  // Hora del último guardado automático.
  const [exito, setExito] = useState('');
  const [yaTomada, setYaTomada] = useState(false);
  const [recarga, setRecarga] = useState(0);
  const asistentesRef = useRef([]);
  const observacionGuardada = useRef('');
  // Curso y fecha en pantalla: una respuesta que llega tarde de otro curso no debe tocar esta lista.
  const claveRef = useRef('');
  const cola = useRef({ enviando: false, pendiente: null, ids: {} });

  // Lista completa (no la ligera): trae horario, profesor y matriculados para el buscador.
  // Primero los cursos que tienen clase hoy, que son los que normalmente se van a llamar.
  useEffect(() => {
    const diaHoy = dayjs().day();
    jwtAxios
      .get('cursos', { params: { limite: 500, ordenar_por: 'hora:asc' } })
      .then(({ data }) =>
        setCursos(
          data.datos
            .filter((c) => esActivo(c.estado))
            .map((c) => ({ ...c, grupo: Number(c.dia) === diaHoy ? 'Clases de hoy' : 'Otros días' }))
            .sort((a, b) => (a.grupo === b.grupo ? 0 : a.grupo === 'Clases de hoy' ? -1 : 1)),
        ),
      )
      .catch(() => setError('No se pudieron cargar los cursos.'));
  }, []);

  // Alumnos del curso y validación de la fecha contra su calendario (día de clase, festivos, cierres).
  useEffect(() => {
    setCalendario(null);
    setAsistentes([]);
    setAsistenciaId(null);
    setObservacion('');
    setFiltro('');
    setExito('');
    setYaTomada(false);
    asistentesRef.current = [];
    observacionGuardada.current = '';
    claveRef.current = curso && fecha ? `${curso.id}|${fecha}` : '';
    if (!curso || !fecha) return undefined;
    const clave = claveRef.current;
    let vigente = true;
    setCargando(true);
    jwtAxios
      .get('asistencias/preparar', { params: { curso_id: curso.id, fecha } })
      .then(({ data }) => {
        if (!vigente) return;
        const lista = data.alumnos.map((a) => ({ ...a, presente: Boolean(a.presente) }));
        if (data.asistencia) cola.current.ids[clave] = data.asistencia.id;
        asistentesRef.current = lista;
        observacionGuardada.current = data.asistencia?.observacion ?? '';
        setCalendario(data);
        setAsistenciaId(data.asistencia?.id ?? null);
        setYaTomada(Boolean(data.asistencia));
        setObservacion(data.asistencia?.observacion ?? '');
        setAsistentes(lista);
      })
      .catch((e) => vigente && setError(mensajesDe(e, 'No se pudieron cargar los alumnos del curso.')))
      .finally(() => vigente && setCargando(false));
    return () => {
      vigente = false;
    };
  }, [curso, fecha, recarga]);

  // Una lista ya tomada se puede corregir aunque después esa fecha haya quedado como festivo o cierre.
  const fechaInvalida = Boolean(calendario) && !calendario.valida && !asistenciaId;
  const puedeGuardar = permisos.indexOf(asistenciaId ? 'Modificar' : 'Crear') >= 0 && !fechaInvalida;
  const presentes = asistentes.filter((a) => a.presente).length;
  const todos = asistentes.length > 0 && presentes === asistentes.length;

  // Guardado automático: cada cambio envía la lista completa. Los envíos van de uno en uno (el primero
  // crea la asistencia y los siguientes la modifican); si hay cambios mientras uno viaja, al terminar
  // se envía solo el último estado.
  const enviar = (clave, datos) => {
    const c = cola.current;
    if (c.enviando) {
      c.pendiente = { clave, datos };
      return;
    }
    c.enviando = true;
    setGuardando(true);
    setError('');
    const id = c.ids[clave];
    (id ? jwtAxios.put(`asistencias/${id}`, datos) : jwtAxios.post('asistencias', datos))
      .then(({ data }) => {
        c.ids[clave] = data.datos.id;
        if (claveRef.current !== clave) return;
        setAsistenciaId(data.datos.id);
        setExito(dayjs().format('HH:mm:ss'));
      })
      .catch((e) => {
        setError(mensajesDe(e, 'No se pudo guardar la asistencia.'));
        // Lo que se ve ya no coincide con lo guardado: se vuelve a cargar la lista.
        c.pendiente = null;
        if (claveRef.current === clave) setRecarga((n) => n + 1);
      })
      .finally(() => {
        c.enviando = false;
        const siguiente = c.pendiente;
        c.pendiente = null;
        if (siguiente) enviar(siguiente.clave, siguiente.datos);
        else setGuardando(false);
      });
  };

  const guardar = (lista, nota) => {
    observacionGuardada.current = nota;
    enviar(claveRef.current, {
      curso_id: curso.id,
      fecha_sesion: fecha,
      observacion: nota || null,
      asistentes: lista.map((a) => ({ alumno_id: a.alumno_id, presente: a.presente })),
    });
  };

  const aplicar = (lista) => {
    asistentesRef.current = lista;
    setAsistentes(lista);
    guardar(lista, observacion);
  };
  const marcar = (alumnoId, presente) =>
    aplicar(asistentesRef.current.map((a) => (a.alumno_id === alumnoId ? { ...a, presente } : a)));
  const marcarTodos = (presente) => aplicar(asistentesRef.current.map((a) => ({ ...a, presente })));
  const guardarObservacion = () => {
    if (observacion !== observacionGuardada.current) guardar(asistentesRef.current, observacion);
  };

  const visibles = useMemo(() => {
    const texto = filtro.trim().toLowerCase();
    return asistentes.filter((a) => !texto || (a.nombre ?? '').toLowerCase().includes(texto));
  }, [asistentes, filtro]);

  if (cargado && permisos.indexOf('Listar') < 0 && permisos.indexOf('Crear') < 0) {
    return <Alert severity='warning'>No tienes permiso para tomar asistencia.</Alert>;
  }

  return (
    <Box sx={{ maxWidth: 1000 }}>
      <Typography variant='h2' sx={{ fontWeight: 'bold', mb: 3 }}>
        {titulo || 'Tomar asistencia'}
      </Typography>
      {error && (
        <Alert severity='error' sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Card sx={sombra}>
        <CardContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 200px' }, columnGap: 5, rowGap: 4, alignItems: 'end' }}>
            <Autocomplete
              options={cursos}
              value={curso}
              onChange={(_, valor) => setCurso(valor)}
              groupBy={(c) => c.grupo}
              getOptionLabel={(c) => `${nombreCurso(c)} · ${horario(c)}`}
              isOptionEqualToValue={(a, b) => a.id === b.id}
              filterOptions={(opciones, { inputValue }) => {
                const palabras = inputValue.trim().toLowerCase().split(/\s+/).filter(Boolean);
                return opciones.filter((c) => {
                  const texto = textoCurso(c).toLowerCase();
                  return palabras.every((p) => texto.includes(p));
                });
              }}
              noOptionsText='Ningún curso coincide con la búsqueda.'
              renderOption={(props, c) => (
                <li {...props} key={c.id}>
                  <Box>
                    <Typography>{nombreCurso(c)}</Typography>
                    <Typography variant='caption' color='text.secondary'>
                      {[horario(c), (c.profesor_nombre ?? '').trim(), variasSedes ? c.sede_nombre : '', `${c.matriculados} alumno(s)`]
                        .filter(Boolean)
                        .join(' · ')}
                    </Typography>
                  </Box>
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  autoFocus
                  variant='standard'
                  label='Curso'
                  placeholder='Buscar por curso, ritmo, profesor o día...'
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position='start'>
                        <SearchIcon fontSize='small' />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
            <TextField
              variant='standard'
              type='date'
              label='Fecha de la clase'
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
          {calendario && !calendario.valida && (
            <Alert
              severity='warning'
              sx={{ mt: 3 }}
              action={
                calendario.sugerida && calendario.sugerida !== fecha ? (
                  <Button color='inherit' size='small' onClick={() => setFecha(calendario.sugerida)}>
                    Usar {fechaCorta(calendario.sugerida)}
                  </Button>
                ) : null
              }
            >
              {calendario.motivo}
            </Alert>
          )}
        </CardContent>
      </Card>

      {curso && (
        <Card sx={sombra}>
          <CardContent>
            {cargando || !calendario ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>{cargando && <CircularProgress size={28} />}</Box>
            ) : asistentes.length === 0 ? (
              <Typography color='text.secondary'>Este curso no tiene alumnos matriculados.</Typography>
            ) : (
              <>
                {yaTomada && (
                  <Alert severity='info' sx={{ mb: 2 }}>
                    La asistencia del {fechaCorta(fecha)} ya fue tomada: aquí puedes corregirla.
                  </Alert>
                )}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
                      Alumnos
                    </Typography>
                    <Chip size='small' color='success' label={`Presentes ${presentes}`} />
                    <Chip size='small' variant='outlined' label={`Ausentes ${asistentes.length - presentes}`} />
                  </Box>
                  <FormControlLabel
                    labelPlacement='start'
                    label='Marcar todos'
                    control={<Switch color='success' checked={todos} disabled={!puedeGuardar} onChange={(e) => marcarTodos(e.target.checked)} />}
                  />
                </Box>
                {asistentes.length > 8 && (
                  <TextField
                    size='small'
                    fullWidth
                    placeholder='Buscar alumno...'
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                    sx={{ mb: 1 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <SearchIcon fontSize='small' />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
                <List dense disablePadding sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}>
                  {visibles.map((a, i) => (
                    <ListItemButton
                      key={a.alumno_id}
                      divider
                      disabled={!puedeGuardar}
                      onClick={() => marcar(a.alumno_id, !a.presente)}
                      sx={{
                        py: 0.5,
                        flexWrap: 'wrap',
                        bgcolor: (t) => (a.presente ? alpha(t.palette.success.main, 0.12) : 'transparent'),
                        '&:hover': { bgcolor: (t) => (a.presente ? alpha(t.palette.success.main, 0.2) : t.palette.action.hover) },
                      }}
                    >
                      <Typography sx={{ width: 32, color: 'text.secondary' }}>{i + 1}.</Typography>
                      <ListItemText primary={a.nombre} primaryTypographyProps={{ fontSize: 16, fontWeight: a.presente ? 'bold' : 'normal' }} />
                      {a.retirado && <Chip size='small' variant='outlined' sx={{ mr: 1 }} label='Ya no está matriculado' />}
                      {a.clase_numero && (
                        <Chip
                          size='small'
                          variant='outlined'
                          sx={{ mr: 1 }}
                          color={a.clase_numero === a.clases_ciclo ? 'warning' : 'default'}
                          label={`Clase ${a.clase_numero} de ${a.clases_ciclo}`}
                        />
                      )}
                      <Switch
                        edge='end'
                        color='success'
                        checked={a.presente}
                        disabled={!puedeGuardar}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => marcar(a.alumno_id, e.target.checked)}
                        inputProps={{ 'aria-label': `Asistencia de ${a.nombre}` }}
                      />
                    </ListItemButton>
                  ))}
                  {visibles.length === 0 && (
                    <Typography color='text.secondary' sx={{ p: 2 }}>
                      Sin coincidencias.
                    </Typography>
                  )}
                </List>
                <TextField
                  fullWidth
                  multiline
                  minRows={2}
                  variant='standard'
                  label='Observación'
                  value={observacion}
                  onChange={(e) => setObservacion(e.target.value)}
                  onBlur={guardarObservacion}
                  disabled={!puedeGuardar}
                  sx={{ mt: 3 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1, mt: 2, minHeight: 24 }}>
                  {guardando && <CircularProgress size={14} />}
                  <Typography variant='body2' color={guardando || !exito ? 'text.secondary' : 'success.main'}>
                    {guardando
                      ? 'Guardando...'
                      : exito
                        ? `Guardado automáticamente a las ${exito}`
                        : 'Los cambios se guardan automáticamente al marcar.'}
                  </Typography>
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

TomarAsistencia.propTypes = {
  route: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
};

export default TomarAsistencia;

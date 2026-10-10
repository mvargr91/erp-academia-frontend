// Matrícula rápida: crea el alumno (o elige uno existente), lo matricula en uno o varios cursos
// y registra el pago, todo en un solo guardado. El precio de cada curso lo calcula el backend
// según el orden en que se agregan (2.º curso, 3.er curso con descuento...).
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, useFormikContext } from 'formik';
import * as yup from 'yup';
import dayjs from 'dayjs';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  FormControlLabel,
  InputAdornment,
  MenuItem,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import SearchIcon from '@mui/icons-material/Search';
import jwtAxios from '../../../@crema/services/auth/jwt-auth';
import usePermisosOpcion from '../../../shared/hooks/usePermisosOpcion';
import MyTextField from '../../../shared/components/MyTextField';
import MySelectField from '../../../shared/components/MySelectField';
import MyDateField from '../../../shared/components/MyDateField';
import FormikAutocomplete from '../../../shared/components/FormikAutocomplete';
import { CampoSede, useSedes } from '../../../shared/sedes';
import { DIAS_SEMANA, METODOS_PAGO, aHoraCorta, esActivo, formatoMoneda, nombreDe } from '../../../shared/constants/Academia';

const sombra = { mb: 3, boxShadow: '0px 0px 5px 2px rgb(0 0 0 / 8%)' };
const dosColumnas = { display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, columnGap: 5, rowGap: 4, alignItems: 'end' };
const SIN_COTIZAR = { cursos: [], total: 0 };
// Alto de la lista de cursos: el encabezado y unas 6 filas; las demás se ven con scroll.
const ALTO_LISTA_CURSOS = 360;

const esquema = yup.object({
  nombres: yup.string().when('tipo', { is: 'nuevo', then: (s) => s.required('Requerido').max(100, 'Máximo 100 caracteres') }),
  apellidos: yup.string().when('tipo', { is: 'nuevo', then: (s) => s.required('Requerido').max(100, 'Máximo 100 caracteres') }),
  correo: yup.string().email('Correo inválido').nullable(),
  alumno_id: yup.mixed().when('tipo', { is: 'existente', then: (s) => s.test('alumno', 'Elige el alumno', (v) => Boolean(v)) }),
  cursos: yup.array().min(1, 'Agrega al menos un curso'),
  monto: yup.mixed().when('pagar', { is: true, then: (s) => s.test('monto', 'Debe ser mayor que 0', (v) => Number(v) > 0) }),
  fecha_pago: yup.string().when('pagar', { is: true, then: (s) => s.required('Requerido') }),
});

const valoresIniciales = (sedePorDefecto) => ({
  tipo: 'nuevo',
  alumno_id: '',
  sede_id: sedePorDefecto,
  nombres: '',
  apellidos: '',
  documento: '',
  telefono: '',
  correo: '',
  fecha_nacimiento: '',
  cursos: [],
  // curso_id => alumno (ya matriculado en ese curso) con quien lo paga en pareja
  parejas: {},
  ajustar_pareja: true,
  pagar: true,
  monto: '',
  fecha_pago: dayjs().format('YYYY-MM-DD'),
  metodo_pago: 'efectivo',
  pago_sede_id: '',
  referencia: '',
  observacion: '',
});

// Solo las parejas de los cursos que siguen elegidos.
const parejasDe = (v) => Object.fromEntries(v.cursos.filter((id) => v.parejas[id]).map((id) => [id, v.parejas[id]]));

const payload = (v) => ({
  ...(v.tipo === 'existente'
    ? { alumno_id: v.alumno_id }
    : {
        alumno: {
          sede_id: v.sede_id || null,
          nombres: v.nombres,
          apellidos: v.apellidos,
          documento: v.documento,
          telefono: v.telefono,
          correo: v.correo,
          fecha_nacimiento: v.fecha_nacimiento,
        },
      }),
  cursos: v.cursos,
  parejas: parejasDe(v),
  ajustar_pareja: v.ajustar_pareja,
  pago: v.pagar
    ? {
        monto: Number(v.monto),
        fecha_pago: v.fecha_pago,
        metodo_pago: v.metodo_pago,
        sede_id: v.pago_sede_id || null,
        referencia: v.referencia,
        observacion: v.observacion,
      }
    : null,
});

// Título de cada bloque; `ayuda` explica el bloque aquí arriba para no poner textos bajo los campos.
const Titulo = ({ children, ayuda }) => (
  <Box sx={{ mb: 3 }}>
    <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
      {children}
    </Typography>
    {ayuda && (
      <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
        {ayuda}
      </Typography>
    )}
  </Box>
);

Titulo.propTypes = { children: PropTypes.node, ayuda: PropTypes.string };

const Contenido = ({ catalogos, cotizacion, setCotizacion }) => {
  const { values, setFieldValue, errors, submitCount } = useFormikContext();
  const { variasSedes } = useSedes();
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState('');
  const [yaMatriculados, setYaMatriculados] = useState([]);
  const [matriculadosDe, setMatriculadosDe] = useState({});
  const ultimoMontoSugerido = useRef('');
  const alumnoId = values.tipo === 'existente' ? values.alumno_id : '';

  // Recalcula los precios al cambiar los cursos o el alumno (un alumno existente puede tener
  // ya otros cursos o estar matriculado en alguno de los elegidos).
  useEffect(() => {
    if (!values.cursos.length) {
      setCotizacion(SIN_COTIZAR);
      return undefined;
    }
    let vigente = true;
    jwtAxios
      .post('matriculas/cotizar', { alumno_id: alumnoId || null, cursos: values.cursos, parejas: parejasDe(values) })
      .then(({ data }) => vigente && setCotizacion(data))
      .catch(() => vigente && setCotizacion(SIN_COTIZAR));
    return () => {
      vigente = false;
    };
  }, [values.cursos, values.parejas, alumnoId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Alumnos ya matriculados en cada curso elegido: son los posibles compañeros de pareja.
  useEffect(() => {
    values.cursos
      .filter((id) => !matriculadosDe[id])
      .forEach((id) => {
        jwtAxios
          .get(`cursos/${id}`)
          .then(({ data }) => setMatriculadosDe((actual) => ({ ...actual, [id]: data.matriculados ?? [] })))
          .catch(() => {});
      });
  }, [values.cursos]); // eslint-disable-line react-hooks/exhaustive-deps

  // El monto sigue al total mientras no se haya escrito otro valor (un abono).
  useEffect(() => {
    if (values.monto === '' || Number(values.monto) === Number(ultimoMontoSugerido.current)) {
      const sugerido = cotizacion.total > 0 ? cotizacion.total : '';
      ultimoMontoSugerido.current = sugerido;
      setFieldValue('monto', sugerido);
    }
  }, [cotizacion.total]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cursos en los que el alumno existente ya está: se muestran marcados y no se pueden elegir.
  useEffect(() => {
    setYaMatriculados([]);
    if (!alumnoId) return undefined;
    let vigente = true;
    jwtAxios
      .get(`alumnos/${alumnoId}/estado-cuenta`)
      .then(({ data }) => {
        if (!vigente) return;
        const ids = data.cursos.map((c) => String(c.curso_id));
        setYaMatriculados(ids);
        if (values.cursos.some((id) => ids.includes(String(id)))) {
          setFieldValue(
            'cursos',
            values.cursos.filter((id) => !ids.includes(String(id))),
          );
        }
      })
      .catch(() => {});
    return () => {
      vigente = false;
    };
  }, [alumnoId]); // eslint-disable-line react-hooks/exhaustive-deps

  const elegidos = values.cursos.map(String);
  const alternar = (id) =>
    setFieldValue('cursos', elegidos.includes(String(id)) ? values.cursos.filter((c) => String(c) !== String(id)) : [...values.cursos, id]);
  const texto = busqueda.trim().toLowerCase();
  const cursosVisibles = catalogos.cursos.filter(
    (c) => !texto || `${c.nombre ?? ''} ${c.ritmo_nombre ?? ''} ${c.profesor_nombre ?? ''}`.toLowerCase().includes(texto),
  );
  const debe = cotizacion.total - (values.pagar ? Number(values.monto) || 0 : 0);

  return (
    <>
      <Card sx={sombra}>
        <CardContent>
          <Titulo ayuda='El resumen de la matrícula se envía al correo del alumno.'>1. Alumno</Titulo>
          <ToggleButtonGroup
            exclusive
            size='small'
            color='primary'
            value={values.tipo}
            onChange={(_, tipo) => tipo && setFieldValue('tipo', tipo)}
            sx={{ mb: 4 }}
          >
            <ToggleButton value='nuevo'>Alumno nuevo</ToggleButton>
            <ToggleButton value='existente'>Alumno existente</ToggleButton>
          </ToggleButtonGroup>
          {values.tipo === 'existente' ? (
            <FormikAutocomplete name='alumno_id' label='Alumno' options={catalogos.alumnos} textFieldProps={{ variant: 'standard' }} />
          ) : (
            <Box sx={dosColumnas}>
              <MyTextField autoFocus fullWidth label='Nombres' name='nombres' required />
              <MyTextField fullWidth label='Apellidos' name='apellidos' required />
              <MyTextField fullWidth label='Documento' name='documento' />
              <MyTextField fullWidth label='Teléfono' name='telefono' />
              <MyTextField fullWidth type='email' label='Correo' name='correo' />
              <MyDateField label='Fecha de nacimiento' name='fecha_nacimiento' />
              <CampoSede label='Sede principal' />
            </Box>
          )}
        </CardContent>
      </Card>

      <Card sx={sombra}>
        <CardContent>
          <Titulo>2. Cursos</Titulo>
          {catalogos.cargado && catalogos.cursos.length === 0 ? (
            <Alert
              severity='info'
              action={
                <Button color='inherit' size='small' onClick={() => navigate('/cursos')}>
                  Ir a Cursos
                </Button>
              }
            >
              Esta academia todavía no tiene cursos activos. Créalos primero en el módulo Cursos.
            </Alert>
          ) : (
            <>
              <Typography variant='body2' color={submitCount > 0 && errors.cursos ? 'error' : 'text.secondary'} sx={{ mb: 2 }}>
                {submitCount > 0 && errors.cursos
                  ? 'Marca al menos un curso.'
                  : 'Marca los cursos. El orden en que los marcas define cuál se cobra como 2.º o 3.er curso.'}
              </Typography>
              <TextField
                fullWidth
                variant='standard'
                placeholder='Buscar curso, ritmo o profesor...'
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <SearchIcon fontSize='small' />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
              <TableContainer sx={{ maxHeight: ALTO_LISTA_CURSOS }}>
                <Table size='small' stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell padding='checkbox' />
                      <TableCell>Curso</TableCell>
                      <TableCell>Horario</TableCell>
                      {variasSedes && <TableCell>Sede</TableCell>}
                      <TableCell>Profesor</TableCell>
                      <TableCell>Cupo</TableCell>
                      <TableCell>Precio aplicado</TableCell>
                      <TableCell align='right'>Valor</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cursosVisibles.map((c) => {
                      const orden = elegidos.indexOf(String(c.id)) + 1;
                      const yaEsta = yaMatriculados.includes(String(c.id));
                      const precio = orden ? cotizacion.cursos.find((f) => String(f.curso_id) === String(c.id)) : null;
                      const lleno = Boolean(c.cupo_max) && Number(c.matriculados) >= Number(c.cupo_max);
                      return (
                        <TableRow
                          key={c.id}
                          hover
                          selected={orden > 0}
                          onClick={() => !yaEsta && alternar(c.id)}
                          sx={{ cursor: yaEsta ? 'default' : 'pointer' }}
                        >
                          <TableCell padding='checkbox'>
                            <Checkbox checked={orden > 0} disabled={yaEsta} inputProps={{ 'aria-label': `Elegir ${c.nombre || c.ritmo_nombre}` }} />
                          </TableCell>
                          <TableCell>
                            {c.nombre || c.ritmo_nombre}
                            {orden > 0 && values.parejas[c.id] && <Chip size='small' color='secondary' label='En pareja' sx={{ ml: 1 }} />}
                            {c.nombre && c.ritmo_nombre && (
                              <Typography component='span' variant='caption' color='text.secondary' sx={{ display: 'block' }}>
                                {c.ritmo_nombre}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            {nombreDe(DIAS_SEMANA, c.dia)} {aHoraCorta(c.hora)}
                          </TableCell>
                          {variasSedes && <TableCell>{c.sede_nombre}</TableCell>}
                          <TableCell>{(c.profesor_nombre ?? '').trim()}</TableCell>
                          <TableCell>
                            {c.cupo_max ? `${c.matriculados}/${c.cupo_max}` : c.matriculados}
                            {lleno && <Chip size='small' color='warning' label='Sin cupo' sx={{ ml: 1 }} />}
                          </TableCell>
                          <TableCell>
                            {yaEsta && <Chip size='small' label='Ya está matriculado' />}
                            {orden > 0 && `${orden}.º · ${precio?.regla ?? '…'}`}
                          </TableCell>
                          <TableCell align='right'>{orden > 0 ? (precio ? formatoMoneda(precio.valor) : '…') : ''}</TableCell>
                        </TableRow>
                      );
                    })}
                    {cursosVisibles.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={variasSedes ? 8 : 7} sx={{ color: 'text.secondary' }}>
                          Ningún curso coincide con la búsqueda.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', px: 2, pt: 2, fontWeight: 'bold' }}>
                <span>
                  Total primer ciclo ({elegidos.length} curso{elegidos.length === 1 ? '' : 's'} de {catalogos.cursos.length})
                </span>
                <span>{formatoMoneda(cotizacion.total)}</span>
              </Box>
              {elegidos.length > 0 && (
                <Box sx={{ mt: 4 }}>
                  <Typography sx={{ fontWeight: 'bold' }}>¿Paga individual o en pareja?</Typography>
                  <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                    En cada curso el alumno paga individual, o en pareja con alguien que ya esté matriculado en ese curso (si llegan
                    dos personas juntas, matricula primero a una y luego a la otra eligiéndola aquí).
                  </Typography>
                  <Box sx={dosColumnas}>
                    {catalogos.cursos
                      .filter((c) => elegidos.includes(String(c.id)))
                      .map((c) => (
                        <TextField
                          key={c.id}
                          select
                          fullWidth
                          variant='standard'
                          label={`${c.nombre || c.ritmo_nombre} · ${nombreDe(DIAS_SEMANA, c.dia)} ${aHoraCorta(c.hora)}`}
                          value={values.parejas[c.id] ?? ''}
                          onChange={(e) => setFieldValue('parejas', { ...values.parejas, [c.id]: e.target.value })}
                        >
                          <MenuItem value=''>Individual</MenuItem>
                          {(matriculadosDe[c.id] ?? [])
                            .filter((m) => String(m.id) !== String(alumnoId))
                            .map((m) => (
                              <MenuItem key={m.id} value={m.id}>
                                En pareja con {m.nombre}
                                {m.pareja_alumno_id ? ` (hoy con ${m.pareja_nombre})` : ''}
                              </MenuItem>
                            ))}
                        </TextField>
                      ))}
                  </Box>
                  {Object.keys(parejasDe(values)).length > 0 && (
                    <FormControlLabel
                      sx={{ mt: 2 }}
                      control={<Checkbox checked={values.ajustar_pareja} onChange={(e) => setFieldValue('ajustar_pareja', e.target.checked)} />}
                      label='Aplicar el precio de pareja también al ciclo actual de la pareja (ajusta su saldo)'
                    />
                  )}
                </Box>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Card sx={sombra}>
        <CardContent>
          <Titulo ayuda='Puede ser un abono: se aplica a los cursos en el orden en que los marcaste.'>3. Pago</Titulo>
          <FormControlLabel
            control={<Switch checked={values.pagar} onChange={(e) => setFieldValue('pagar', e.target.checked)} />}
            label='Registrar el pago ahora'
            sx={{ mb: 2 }}
          />
          {values.pagar && (
            <Box sx={dosColumnas}>
              <MyTextField
                fullWidth
                type='number'
                label='Monto recibido'
                name='monto'
                required
              />
              <MyDateField label='Fecha de pago' name='fecha_pago' required />
              <MySelectField name='metodo_pago' label='Método de pago' options={METODOS_PAGO} fullWidth variant='standard' />
              <CampoSede name='pago_sede_id' label='Sede donde se recibe (vacío = la del curso)' />
              <MyTextField fullWidth label='Referencia' name='referencia' />
              <MyTextField fullWidth multiline label='Observación' name='observacion' />
            </Box>
          )}
          {cotizacion.total > 0 && (
            <Alert severity={debe > 0 ? 'warning' : debe < 0 ? 'error' : 'success'} sx={{ mt: 3 }}>
              {debe > 0 && `Queda debiendo ${formatoMoneda(debe)} de ${formatoMoneda(cotizacion.total)}.`}
              {debe === 0 && `Queda al día: paga los ${formatoMoneda(cotizacion.total)} completos.`}
              {debe < 0 && `El monto supera el total a pagar (${formatoMoneda(cotizacion.total)}).`}
            </Alert>
          )}
        </CardContent>
      </Card>
    </>
  );
};

Contenido.propTypes = {
  catalogos: PropTypes.object.isRequired,
  cotizacion: PropTypes.object.isRequired,
  setCotizacion: PropTypes.func.isRequired,
};

const Matriculas = ({ route }) => {
  const navigate = useNavigate();
  const { sedePorDefecto } = useSedes();
  const { titulo, permisos, cargado } = usePermisosOpcion(route.path);
  const [catalogos, setCatalogos] = useState({ alumnos: [], cursos: [], cargado: false });
  const [cotizacion, setCotizacion] = useState(SIN_COTIZAR);
  const [error, setError] = useState('');
  const [resultado, setResultado] = useState(null);

  // Se recargan tras cada matrícula: el alumno recién creado pasa a ser "existente".
  useEffect(() => {
    if (resultado) return;
    Promise.all([
      jwtAxios.get('alumnos', { params: { ligera: 1 } }),
      // Lista completa (no la ligera): trae horario, profesor y cupo de cada curso.
      jwtAxios.get('cursos', { params: { limite: 500, ordenar_por: 'ritmo_nombre:asc' } }),
    ])
      .then(([al, cu]) => setCatalogos({ alumnos: al.data, cursos: cu.data.datos.filter((c) => esActivo(c.estado)), cargado: true }))
      .catch(() => setError('No se pudieron cargar los alumnos y cursos.'));
  }, [resultado]);

  const guardar = (values, { setSubmitting }) => {
    if (cotizacion.cursos.some((c) => c.ya_matriculado)) {
      setError('El alumno ya está matriculado en uno de los cursos elegidos. Quítalo de la lista.');
      setSubmitting(false);
      return;
    }
    if (values.pagar && Number(values.monto) > cotizacion.total) {
      setError(`El monto supera el total a pagar (${formatoMoneda(cotizacion.total)}).`);
      setSubmitting(false);
      return;
    }
    setError('');
    jwtAxios
      .post('matriculas', payload(values))
      .then(({ data }) => {
        setCotizacion(SIN_COTIZAR);
        setResultado(data.datos);
      })
      .catch((e) => {
        const mensajes = e?.response?.data?.mensajes;
        setError(Array.isArray(mensajes) && mensajes.length ? mensajes.join(' ') : 'No se pudo registrar la matrícula.');
      })
      .finally(() => setSubmitting(false));
  };

  if (cargado && permisos.indexOf('Crear') < 0) {
    return <Alert severity='warning'>No tienes permiso para registrar matrículas.</Alert>;
  }

  return (
    <Box sx={{ maxWidth: 1000 }}>
      <Typography variant='h2' sx={{ fontWeight: 'bold', mb: 3 }}>
        {titulo || 'Matrícula rápida'}
      </Typography>
      {error && (
        <Alert severity='error' sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {resultado ? (
        <Card sx={sombra}>
          <CardContent>
            <Alert severity='success' sx={{ mb: 3 }}>
              {resultado.alumno.nombre} quedó matriculado(a) en {resultado.cursos} curso(s).
            </Alert>
            <Typography>
              Total: <strong>{formatoMoneda(resultado.total)}</strong> · Pagado: <strong>{formatoMoneda(resultado.pagado)}</strong> ·
              Saldo pendiente: <strong>{formatoMoneda(resultado.saldo)}</strong>
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 4, flexWrap: 'wrap' }}>
              <Button variant='contained' startIcon={<HowToRegIcon />} onClick={() => setResultado(null)}>
                Nueva matrícula
              </Button>
              <Button variant='outlined' onClick={() => navigate(`/alumnos/${resultado.alumno.id}/cuenta`)}>
                Ver estado de cuenta
              </Button>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Formik initialValues={valoresIniciales(sedePorDefecto)} validationSchema={esquema} onSubmit={guardar}>
          {({ isSubmitting }) => (
            <Form noValidate autoComplete='off'>
              <Contenido catalogos={catalogos} cotizacion={cotizacion} setCotizacion={setCotizacion} />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type='submit'
                  variant='contained'
                  disabled={isSubmitting}
                  startIcon={isSubmitting ? <CircularProgress size={16} color='inherit' /> : <HowToRegIcon />}
                >
                  Matricular
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      )}
    </Box>
  );
};

Matriculas.propTypes = {
  route: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
};

export default Matriculas;

// Matrícula rápida de vacacionales: crea el alumno (o elige uno existente), lo inscribe en uno o
// varios cursos vacacionales con las clases que toma en cada uno y registra el pago, todo en un
// solo guardado. Es aparte de la matrícula rápida de la academia.
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
import SelectorFechas from '../../../shared/components/SelectorFechas';
import { useSedes } from '../../../shared/sedes';
import { METODOS_PAGO, formatoMoneda } from '../../../shared/constants/Academia';

const sombra = { mb: 3, boxShadow: '0px 0px 5px 2px rgb(0 0 0 / 8%)' };
const dosColumnas = { display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, columnGap: 5, rowGap: 4, alignItems: 'end' };
// Alto de la lista de cursos: el encabezado y unas 6 filas; las demás se ven con scroll.
const ALTO_LISTA_CURSOS = 360;

// Si el curso tiene más días que clases por alumno, hay que escoger cuáles toma.
const seEscogen = (curso) => curso.total_fechas > curso.clases_por_alumno;
const fechasDe = (curso, values) => (seEscogen(curso) ? values.fechas[curso.id] ?? [] : curso.fechas);

const esquema = yup.object({
  nombres: yup.string().when('tipo', { is: 'nuevo', then: (s) => s.required('Requerido').max(100, 'Máximo 100 caracteres') }),
  apellidos: yup.string().when('tipo', { is: 'nuevo', then: (s) => s.required('Requerido').max(100, 'Máximo 100 caracteres') }),
  correo: yup.string().email('Correo inválido').nullable(),
  alumno_id: yup.mixed().when('tipo', { is: 'existente', then: (s) => s.test('alumno', 'Elige el alumno', (v) => Boolean(v)) }),
  cursos: yup.array().min(1, 'Marca al menos un curso'),
  monto: yup.mixed().when('pagar', { is: true, then: (s) => s.test('monto', 'Debe ser mayor que 0', (v) => Number(v) > 0) }),
  fecha_pago: yup.string().when('pagar', { is: true, then: (s) => s.required('Requerido') }),
});

const valoresIniciales = () => ({
  tipo: 'nuevo',
  alumno_id: '',
  nombres: '',
  apellidos: '',
  documento: '',
  fecha_nacimiento: '',
  telefono: '',
  correo: '',
  acudiente_nombre: '',
  acudiente_telefono: '',
  cursos: [],
  // curso_id => clases (fechas) que toma el alumno, en los cursos donde se escogen
  fechas: {},
  pagar: true,
  monto: '',
  fecha_pago: dayjs().format('YYYY-MM-DD'),
  metodo_pago: 'efectivo',
  referencia: '',
});

const payload = (v, elegidos) => ({
  ...(v.tipo === 'existente'
    ? { alumno_id: v.alumno_id }
    : {
        alumno: {
          nombres: v.nombres,
          apellidos: v.apellidos,
          documento: v.documento,
          fecha_nacimiento: v.fecha_nacimiento,
          telefono: v.telefono,
          correo: v.correo,
          acudiente_nombre: v.acudiente_nombre,
          acudiente_telefono: v.acudiente_telefono,
        },
      }),
  cursos: elegidos.map((c) => ({ curso_id: c.id, fechas: fechasDe(c, v) })),
  pago: v.pagar
    ? { monto: Number(v.monto), fecha_pago: v.fecha_pago, metodo_pago: v.metodo_pago, referencia: v.referencia }
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

// Cursos elegidos, en el orden en que se marcaron (así se aplica el abono).
const elegidosDe = (catalogos, values) =>
  values.cursos.map((id) => catalogos.cursos.find((c) => String(c.id) === String(id))).filter(Boolean);

const Contenido = ({ catalogos }) => {
  const { values, setFieldValue, errors, submitCount } = useFormikContext();
  const { variasSedes } = useSedes();
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState('');
  const [yaInscritos, setYaInscritos] = useState([]);
  const ultimoMontoSugerido = useRef('');
  const alumnoId = values.tipo === 'existente' ? values.alumno_id : '';

  const elegidos = elegidosDe(catalogos, values);
  const total = elegidos.reduce((suma, c) => suma + Number(c.valor), 0);

  // El monto sigue al total mientras no se haya escrito otro valor (un abono).
  useEffect(() => {
    if (values.monto === '' || Number(values.monto) === Number(ultimoMontoSugerido.current)) {
      const sugerido = total > 0 ? total : '';
      ultimoMontoSugerido.current = sugerido;
      setFieldValue('monto', sugerido);
    }
  }, [total]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cursos en los que el alumno existente ya está: se muestran marcados y no se pueden elegir.
  useEffect(() => {
    setYaInscritos([]);
    if (!alumnoId) return undefined;
    let vigente = true;
    jwtAxios
      .get('vacacionales-inscripciones', { params: { alumno_id: alumnoId, limite: 500 } })
      .then(({ data }) => {
        if (!vigente) return;
        const ids = data.datos.map((i) => String(i.curso_id));
        setYaInscritos(ids);
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

  const marcados = values.cursos.map(String);
  const alternar = (id) =>
    setFieldValue('cursos', marcados.includes(String(id)) ? values.cursos.filter((c) => String(c) !== String(id)) : [...values.cursos, id]);
  const texto = busqueda.trim().toLowerCase();
  const cursosVisibles = catalogos.cursos.filter(
    (c) => !texto || `${c.nombre ?? ''} ${c.ritmo_nombre ?? ''} ${c.profesor_nombre ?? ''}`.toLowerCase().includes(texto),
  );
  const porEscoger = elegidos.filter(seEscogen);
  const debe = total - (values.pagar ? Number(values.monto) || 0 : 0);

  return (
    <>
      <Card sx={sombra}>
        <CardContent>
          <Titulo ayuda='Queda en el listado de alumnos de vacacionales, aparte de los alumnos de la academia.'>1. Alumno</Titulo>
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
            <FormikAutocomplete name='alumno_id' label='Alumno de vacacionales' options={catalogos.alumnos} textFieldProps={{ variant: 'standard' }} />
          ) : (
            <Box sx={dosColumnas}>
              <MyTextField autoFocus fullWidth label='Nombres' name='nombres' required />
              <MyTextField fullWidth label='Apellidos' name='apellidos' required />
              <MyTextField fullWidth label='Documento' name='documento' />
              <MyDateField label='Fecha de nacimiento' name='fecha_nacimiento' />
              <MyTextField fullWidth label='Teléfono' name='telefono' />
              <MyTextField fullWidth type='email' label='Correo' name='correo' />
              <MyTextField fullWidth label='Acudiente' name='acudiente_nombre' />
              <MyTextField fullWidth label='Teléfono del acudiente' name='acudiente_telefono' />
            </Box>
          )}
        </CardContent>
      </Card>

      <Card sx={sombra}>
        <CardContent>
          <Titulo>2. Cursos vacacionales</Titulo>
          {catalogos.cargado && catalogos.cursos.length === 0 ? (
            <Alert
              severity='info'
              action={
                <Button color='inherit' size='small' onClick={() => navigate('/vacacionales-cursos')}>
                  Ir a Cursos vacacionales
                </Button>
              }
            >
              No hay cursos vacacionales próximos o en curso. Créalos primero en Cursos vacacionales.
            </Alert>
          ) : (
            <>
              <Typography variant='body2' color={submitCount > 0 && errors.cursos ? 'error' : 'text.secondary'} sx={{ mb: 2 }}>
                {submitCount > 0 && errors.cursos ? 'Marca al menos un curso.' : 'Marca los cursos vacacionales que toma el alumno.'}
              </Typography>
              <TextField
                fullWidth
                variant='standard'
                placeholder='Buscar curso, género o profesor...'
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
                      <TableCell>Días de clase</TableCell>
                      <TableCell>Horario</TableCell>
                      {variasSedes && <TableCell>Sede</TableCell>}
                      <TableCell>Profesor</TableCell>
                      <TableCell>Inscritos</TableCell>
                      <TableCell align='right'>Valor</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cursosVisibles.map((c) => {
                      const marcado = marcados.includes(String(c.id));
                      const yaEsta = yaInscritos.includes(String(c.id));
                      return (
                        <TableRow
                          key={c.id}
                          hover
                          selected={marcado}
                          onClick={() => !yaEsta && alternar(c.id)}
                          sx={{ cursor: yaEsta ? 'default' : 'pointer' }}
                        >
                          <TableCell padding='checkbox'>
                            <Checkbox checked={marcado} disabled={yaEsta} inputProps={{ 'aria-label': `Elegir ${c.nombre}` }} />
                          </TableCell>
                          <TableCell>
                            {c.nombre}
                            {yaEsta && <Chip size='small' label='Ya está inscrito' sx={{ ml: 1 }} />}
                            {c.ritmo_nombre && (
                              <Typography component='span' variant='caption' color='text.secondary' sx={{ display: 'block' }}>
                                {c.ritmo_nombre}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            {c.fechas_texto}
                            {seEscogen(c) && (
                              <Typography component='span' variant='caption' color='text.secondary' sx={{ display: 'block' }}>
                                Se escogen {c.clases_por_alumno} de {c.total_fechas}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>{c.hora_inicio ? `${c.hora_inicio}${c.hora_fin ? ` a ${c.hora_fin}` : ''}` : ''}</TableCell>
                          {variasSedes && <TableCell>{c.sede_nombre}</TableCell>}
                          <TableCell>{(c.profesor_nombre ?? '').trim()}</TableCell>
                          <TableCell>{c.cupo_max ? `${c.inscritos} (cupo ${c.cupo_max} por clase)` : c.inscritos}</TableCell>
                          <TableCell align='right'>{formatoMoneda(c.valor)}</TableCell>
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
                  Total ({elegidos.length} curso{elegidos.length === 1 ? '' : 's'} de {catalogos.cursos.length})
                </span>
                <span>{formatoMoneda(total)}</span>
              </Box>
              {porEscoger.length > 0 && (
                <Box sx={{ mt: 4 }}>
                  <Typography sx={{ fontWeight: 'bold' }}>¿Qué clases toma?</Typography>
                  <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                    Estos cursos tienen más días que clases por alumno: marca en el calendario las que toma. En los demás toma todas.
                  </Typography>
                  {porEscoger.map((c) => {
                    const fechas = values.fechas[c.id] ?? [];
                    return (
                      <Box key={c.id} sx={{ mb: 3 }}>
                        <SelectorFechas
                          label={c.nombre}
                          value={fechas}
                          onChange={(nuevas) => setFieldValue('fechas', { ...values.fechas, [c.id]: nuevas })}
                          disponibles={c.fechas}
                          max={c.clases_por_alumno}
                          error={submitCount > 0 && fechas.length === 0 ? 'Marca las clases que toma en este curso' : ''}
                        />
                      </Box>
                    );
                  })}
                </Box>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Card sx={sombra}>
        <CardContent>
          <Titulo ayuda='Puede ser un abono: se aplica a los cursos en el orden en que los marcaste. No entra en los pagos de la academia.'>
            3. Pago
          </Titulo>
          <FormControlLabel
            control={<Switch checked={values.pagar} onChange={(e) => setFieldValue('pagar', e.target.checked)} />}
            label='Registrar el pago ahora'
            sx={{ mb: 2 }}
          />
          {values.pagar && (
            <Box sx={dosColumnas}>
              <MyTextField fullWidth type='number' label='Monto recibido' name='monto' required />
              <MyDateField label='Fecha de pago' name='fecha_pago' required />
              <MySelectField name='metodo_pago' label='Método de pago' options={METODOS_PAGO} fullWidth variant='standard' />
              <MyTextField fullWidth label='Referencia' name='referencia' />
            </Box>
          )}
          {total > 0 && (
            <Alert severity={debe > 0 ? 'warning' : debe < 0 ? 'error' : 'success'} sx={{ mt: 3 }}>
              {debe > 0 && `Queda debiendo ${formatoMoneda(debe)} de ${formatoMoneda(total)}.`}
              {debe === 0 && `Queda al día: paga los ${formatoMoneda(total)} completos.`}
              {debe < 0 && `El monto supera el total a pagar (${formatoMoneda(total)}).`}
            </Alert>
          )}
        </CardContent>
      </Card>
    </>
  );
};

Contenido.propTypes = {
  catalogos: PropTypes.object.isRequired,
};

const VacacionalMatriculas = ({ route }) => {
  const navigate = useNavigate();
  const { titulo, permisos, cargado } = usePermisosOpcion(route.path);
  const [catalogos, setCatalogos] = useState({ alumnos: [], cursos: [], cargado: false });
  const [error, setError] = useState('');
  const [resultado, setResultado] = useState(null);

  // Se recargan tras cada matrícula: el alumno recién creado pasa a ser "existente" y cambian los inscritos.
  useEffect(() => {
    if (resultado) return;
    Promise.all([
      jwtAxios.get('vacacionales-alumnos', { params: { ligera: 1 } }),
      jwtAxios.get('vacacionales-cursos', { params: { ligera: 1 } }),
    ])
      .then(([al, cu]) =>
        // Solo se matricula en vacacionales que no han terminado.
        setCatalogos({ alumnos: al.data, cursos: cu.data.filter((c) => c.momento !== 'finalizado'), cargado: true }),
      )
      .catch(() => setError('No se pudieron cargar los alumnos y cursos vacacionales.'));
  }, [resultado]);

  const guardar = (values, { setSubmitting }) => {
    const elegidos = elegidosDe(catalogos, values);
    const total = elegidos.reduce((suma, c) => suma + Number(c.valor), 0);
    const sinClases = elegidos.find((c) => fechasDe(c, values).length === 0);
    const problema =
      (sinClases && `Marca en el calendario las clases que toma en «${sinClases.nombre}».`) ||
      (values.pagar && Number(values.monto) > total && `El monto supera el total a pagar (${formatoMoneda(total)}).`);
    if (problema) {
      setError(problema);
      setSubmitting(false);
      return;
    }
    setError('');
    jwtAxios
      .post('vacacionales-matriculas', payload(values, elegidos))
      .then(({ data }) => setResultado(data.datos))
      .catch((e) => {
        const mensajes = e?.response?.data?.mensajes;
        setError(Array.isArray(mensajes) && mensajes.length ? mensajes.join(' ') : 'No se pudo registrar la matrícula.');
      })
      .finally(() => setSubmitting(false));
  };

  if (cargado && permisos.indexOf('Crear') < 0) {
    return <Alert severity='warning'>No tienes permiso para registrar matrículas de vacacionales.</Alert>;
  }

  return (
    <Box sx={{ maxWidth: 1000 }}>
      <Typography variant='h2' sx={{ fontWeight: 'bold', mb: 3 }}>
        {titulo || 'Matrícula rápida vacacional'}
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
              {resultado.alumno.nombre} quedó inscrito(a) en {resultado.cursos.length} curso(s) vacacional(es).
            </Alert>
            {resultado.cursos.map((c) => (
              <Typography key={c.nombre} sx={{ mb: 1 }}>
                <strong>{c.nombre}</strong> · clases: {c.fechas_texto} · {formatoMoneda(c.valor)}
              </Typography>
            ))}
            <Typography sx={{ mt: 2 }}>
              Total: <strong>{formatoMoneda(resultado.total)}</strong> · Pagado: <strong>{formatoMoneda(resultado.pagado)}</strong> · Saldo
              pendiente: <strong>{formatoMoneda(resultado.saldo)}</strong>
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 4, flexWrap: 'wrap' }}>
              <Button variant='contained' startIcon={<HowToRegIcon />} onClick={() => setResultado(null)}>
                Nueva matrícula
              </Button>
              <Button variant='outlined' onClick={() => navigate('/vacacionales-inscripciones')}>
                Ver inscripciones
              </Button>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Formik initialValues={valoresIniciales()} validationSchema={esquema} onSubmit={guardar}>
          {({ isSubmitting }) => (
            <Form noValidate autoComplete='off'>
              <Contenido catalogos={catalogos} />
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

VacacionalMatriculas.propTypes = {
  route: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
};

export default VacacionalMatriculas;

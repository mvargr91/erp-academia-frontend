// Tarifas de la academia, la única pantalla de precios: por cada modalidad, lo que paga un alumno por
// ciclo según cuántos cursos de esa modalidad toma (individual y en pareja), y los precios de las clases
// personalizadas (clase suelta o paquete, con precio aparte para alumnos de cursos). Los cursos no
// tienen precio propio.
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SaveIcon from '@mui/icons-material/Save';
import jwtAxios from '../../../@crema/services/auth/jwt-auth';
import usePermisosOpcion from '../../../shared/hooks/usePermisosOpcion';
import { formatoMoneda } from '../../../shared/constants/Academia';

const sombra = { mb: 3, boxShadow: '0px 0px 5px 2px rgb(0 0 0 / 8%)' };
const MAX_ESCALONES = 20;

// tipo => [título, explicación, personas que pagan ese total]
const ESCALAS = {
  individual: [
    'Individual',
    'Total que paga un alumno por {periodo} según cuántos cursos de esta modalidad toma. El valor de 1 curso es el precio de un curso; si la academia no da descuento por tomar varios, basta con ese: cada curso adicional cobra lo mismo. Si se deja vacío, los cursos de esta modalidad no cobran.',
    1,
  ],
  pareja: [
    'En pareja',
    'Total que pagan las dos personas por {periodo} cuando dos alumnos de un curso pagan en pareja (se define por alumno, en el curso o al matricular). Si se deja vacío, cada uno paga la tarifa individual.',
    2,
  ],
};

const numero = (texto) => (texto === '' || texto === null || texto === undefined ? null : Number(texto));

// Primer escalón cuyo total está vacío o es menor que el anterior (ese curso saldría negativo).
const escalonInvalido = (totales) =>
  totales.findIndex((t, i) => numero(t) === null || numero(t) < 0 || (i > 0 && numero(t) < (numero(totales[i - 1]) ?? 0)));

const Escala = ({ tipo, totales, onChange, puedeEditar, periodo }) => {
  const [titulo, explicacion, personas] = ESCALAS[tipo];
  const invalido = escalonInvalido(totales);

  return (
    <Card sx={sombra}>
      <CardContent>
        <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
          {titulo}
        </Typography>
        <Typography variant='body2' color='text.secondary' sx={{ mt: 1, mb: 3 }}>
          {explicacion.replace('{periodo}', periodo)}
        </Typography>
        {totales.length > 0 && (
          <TableContainer>
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell>Cursos</TableCell>
                  <TableCell>Total por {periodo}</TableCell>
                  <TableCell align='right'>Lo que suma ese curso</TableCell>
                  {personas > 1 && <TableCell align='right'>Cada persona</TableCell>}
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {totales.map((total, i) => {
                  const suma = numero(total) === null ? null : numero(total) - (i > 0 ? numero(totales[i - 1]) ?? 0 : 0);
                  return (
                    <TableRow key={i}>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        {i + 1} curso{i === 0 ? '' : 's'}
                      </TableCell>
                      <TableCell>
                        <TextField
                          variant='standard'
                          type='number'
                          value={total}
                          onChange={(e) => onChange(totales.map((t, j) => (j === i ? e.target.value : t)))}
                          disabled={!puedeEditar}
                          error={invalido === i}
                          inputProps={{ min: 0, 'aria-label': `Total de ${i + 1} curso${i === 0 ? '' : 's'}` }}
                          sx={{ width: 150 }}
                        />
                      </TableCell>
                      <TableCell align='right' sx={{ color: suma !== null && suma < 0 ? 'error.main' : 'inherit' }}>
                        {suma === null ? '' : formatoMoneda(suma)}
                      </TableCell>
                      {personas > 1 && <TableCell align='right'>{suma === null ? '' : formatoMoneda(suma / personas)}</TableCell>}
                      <TableCell align='right'>
                        {puedeEditar && i === totales.length - 1 && (
                          <Tooltip title='Quitar el último escalón'>
                            <IconButton size='small' onClick={() => onChange(totales.slice(0, -1))}>
                              <DeleteOutlineIcon fontSize='small' />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {invalido >= 0 && (
          <Typography variant='body2' color='error' sx={{ mt: 2 }}>
            Revisa el total de {invalido + 1} curso{invalido === 0 ? '' : 's'}: no puede estar vacío ni ser menor que el anterior.
          </Typography>
        )}
        {puedeEditar && totales.length < MAX_ESCALONES && (
          <Button size='small' startIcon={<AddIcon />} onClick={() => onChange([...totales, ''])} sx={{ mt: 2 }}>
            Agregar {totales.length + 1} curso{totales.length === 0 ? '' : 's'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

Escala.propTypes = {
  tipo: PropTypes.oneOf(Object.keys(ESCALAS)).isRequired,
  totales: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  puedeEditar: PropTypes.bool,
  // 'ciclo' o 'mes', según cómo se cobra la modalidad.
  periodo: PropTypes.string.isRequired,
};

const paqueteInvalido = (p) => !String(p.nombre).trim() || !(Number(p.clases) >= 1) || numero(p.valor) === null || numero(p.valor) < 0;
const porClase = (valor, clases) => (numero(valor) !== null && Number(clases) >= 1 ? formatoMoneda(numero(valor) / Number(clases)) : '');

// Clases personalizadas: una fila por opción de venta (1 clase, paquete de 4, de 8...).
const Personalizadas = ({ paquetes, onChange, puedeEditar }) => {
  const cambiar = (i, campo, valor) => onChange(paquetes.map((p, j) => (j === i ? { ...p, [campo]: valor } : p)));
  const campo = (i, nombre, extra = {}) => (
    <TextField
      variant='standard'
      value={paquetes[i][nombre] ?? ''}
      onChange={(e) => cambiar(i, nombre, e.target.value)}
      disabled={!puedeEditar}
      {...extra}
    />
  );

  return (
    <Card sx={sombra}>
      <CardContent>
        <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
          Clases personalizadas
        </Typography>
        <Typography variant='body2' color='text.secondary' sx={{ mt: 1, mb: 3 }}>
          Precio de la clase suelta y de cada paquete. El precio para alumnos se propone al vender el paquete a quien ya toma un
          curso; si se deja vacío, pagan el precio normal. La vigencia son los días que tiene el alumno para usar las clases desde la
          compra.
        </Typography>
        {paquetes.length > 0 && (
          <TableContainer>
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Clases</TableCell>
                  <TableCell>Precio</TableCell>
                  <TableCell align='right'>Por clase</TableCell>
                  <TableCell>Precio alumnos</TableCell>
                  <TableCell align='right'>Por clase</TableCell>
                  <TableCell>Vigencia (días)</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {paquetes.map((p, i) => (
                  <TableRow key={p.id ?? `nuevo-${i}`}>
                    <TableCell>
                      {campo(i, 'nombre', { error: !String(p.nombre).trim(), sx: { minWidth: 200 }, inputProps: { maxLength: 100, 'aria-label': 'Nombre' } })}
                    </TableCell>
                    <TableCell>
                      {campo(i, 'clases', { type: 'number', error: !(Number(p.clases) >= 1), sx: { width: 70 }, inputProps: { min: 1, 'aria-label': 'Clases' } })}
                    </TableCell>
                    <TableCell>
                      {campo(i, 'valor', {
                        type: 'number',
                        error: numero(p.valor) === null || numero(p.valor) < 0,
                        sx: { width: 120 },
                        inputProps: { min: 0, 'aria-label': 'Precio' },
                      })}
                    </TableCell>
                    <TableCell align='right'>{porClase(p.valor, p.clases)}</TableCell>
                    <TableCell>
                      {campo(i, 'valor_alumno', { type: 'number', sx: { width: 120 }, inputProps: { min: 0, 'aria-label': 'Precio alumnos' } })}
                    </TableCell>
                    <TableCell align='right'>{porClase(p.valor_alumno, p.clases)}</TableCell>
                    <TableCell>
                      {campo(i, 'vigencia_dias', { type: 'number', placeholder: 'Sin límite', sx: { width: 100 }, inputProps: { min: 1, 'aria-label': 'Vigencia en días' } })}
                    </TableCell>
                    <TableCell align='right'>
                      {puedeEditar && (
                        <Tooltip title='Quitar (los paquetes ya vendidos no cambian)'>
                          <IconButton size='small' onClick={() => onChange(paquetes.filter((_, j) => j !== i))}>
                            <DeleteOutlineIcon fontSize='small' />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {paquetes.some(paqueteInvalido) && (
          <Typography variant='body2' color='error' sx={{ mt: 2 }}>
            Cada fila necesita nombre, número de clases y precio.
          </Typography>
        )}
        {puedeEditar && (
          <Button
            size='small'
            startIcon={<AddIcon />}
            onClick={() => onChange([...paquetes, { id: null, nombre: '', clases: '', valor: '', valor_alumno: '', vigencia_dias: '' }])}
            sx={{ mt: 2 }}
          >
            Agregar clase o paquete
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

Personalizadas.propTypes = {
  paquetes: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  puedeEditar: PropTypes.bool,
};

const modalidadInvalida = (m) => Object.keys(ESCALAS).some((tipo) => escalonInvalido(m[tipo]) >= 0);

// Precio de los cursos: una pestaña por modalidad, cada una con sus escalas individual y de pareja.
const PreciosCursos = ({ modalidades, onChange, puedeEditar }) => {
  const [actual, setActual] = useState(0);
  if (modalidades.length === 0) {
    return (
      <Alert severity='info' sx={{ mb: 3 }}>
        Para cobrar los cursos, primero crea una modalidad (ciclo de 4 clases, de 8…) en{' '}
        <RouterLink to='/modalidades'>Configuración → Modalidades</RouterLink>.
      </Alert>
    );
  }
  const i = Math.min(actual, modalidades.length - 1);
  const m = modalidades[i];
  const mensual = m.tipo_cobro === 'mensual';

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant='h4' sx={{ fontWeight: 'bold', mb: 1 }}>
        Cursos
      </Typography>
      {modalidades.length > 1 && (
        <Tabs value={i} onChange={(_, nueva) => setActual(nueva)} variant='scrollable' scrollButtons='auto' sx={{ mb: 2 }}>
          {modalidades.map((mod) => (
            <Tab
              key={mod.id}
              label={`${mod.nombre}${mod.estado ? '' : ' (inactiva)'}`}
              sx={modalidadInvalida(mod) ? { color: 'error.main' } : undefined}
            />
          ))}
        </Tabs>
      )}
      <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
        {modalidades.length > 1 ? '' : `${m.nombre}: `}
        {mensual
          ? `se cobra por mes, el mismo valor si el mes trae 4 o 5 clases (de ${m.duracion_minutos} minutos); quien entra a mitad de mes paga solo las clases que le quedan.`
          : `cada ciclo es de ${m.clases_por_ciclo} clases de ${m.duracion_minutos} minutos.`}
        Un alumno con cursos de varias modalidades paga cada curso con la tarifa de su modalidad; el descuento por varios cursos
        se cuenta dentro de cada una.
      </Typography>
      {Object.keys(ESCALAS).map((tipo) => (
        <Escala
          key={`${m.id}-${tipo}`}
          tipo={tipo}
          totales={m[tipo]}
          onChange={(totales) => onChange(modalidades.map((mod, j) => (j === i ? { ...mod, [tipo]: totales } : mod)))}
          puedeEditar={puedeEditar}
          periodo={mensual ? 'mes' : 'ciclo'}
        />
      ))}
    </Box>
  );
};

PreciosCursos.propTypes = {
  modalidades: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  puedeEditar: PropTypes.bool,
};

const Tarifas = ({ route }) => {
  const { titulo, permisos } = usePermisosOpcion(route.path);
  const puedeEditar = permisos.indexOf('Modificar') >= 0;
  const [escalas, setEscalas] = useState(null);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [guardando, setGuardando] = useState(false);

  const aTexto = (datos) => ({
    modalidades: (datos.modalidades ?? []).map((m) => ({
      ...m,
      ...Object.fromEntries(Object.keys(ESCALAS).map((tipo) => [tipo, (m[tipo] ?? []).map(String)])),
    })),
    personalizadas: (datos.personalizadas ?? []).map((p) => ({ ...p, valor_alumno: p.valor_alumno ?? '', vigencia_dias: p.vigencia_dias ?? '' })),
  });

  useEffect(() => {
    jwtAxios
      .get('tarifas')
      .then(({ data }) => setEscalas(aTexto(data)))
      .catch(() => setError('No se pudieron cargar las tarifas.'));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const guardar = () => {
    setError('');
    setExito('');
    setGuardando(true);
    jwtAxios
      .put('tarifas', {
        modalidades: escalas.modalidades.map((m) => ({
          id: m.id,
          ...Object.fromEntries(Object.keys(ESCALAS).map((tipo) => [tipo, m[tipo].map(Number)])),
        })),
        personalizadas: escalas.personalizadas.map((p) => ({
          id: p.id,
          nombre: String(p.nombre).trim(),
          clases: Number(p.clases),
          valor: Number(p.valor),
          valor_alumno: numero(p.valor_alumno),
          vigencia_dias: numero(p.vigencia_dias),
        })),
      })
      .then(({ data }) => {
        setEscalas(aTexto(data.datos));
        setExito(data.mensajes[0]);
      })
      .catch((e) => setError(e?.response?.data?.mensajes?.[0] ?? 'No se pudieron guardar las tarifas.'))
      .finally(() => setGuardando(false));
  };

  if (!escalas) {
    return error ? <Alert severity='error'>{error}</Alert> : <LinearProgress />;
  }
  const hayInvalidos = escalas.modalidades.some(modalidadInvalida) || escalas.personalizadas.some(paqueteInvalido);

  return (
    <Box sx={{ maxWidth: 1000 }}>
      <Typography variant='h2' sx={{ fontWeight: 'bold', mb: 1 }}>
        {titulo || 'Tarifas'}
      </Typography>
      <Typography color='text.secondary' sx={{ mb: 3 }}>
        Aquí se definen todos los precios de la academia: los cursos (por ciclo de clases o por mes, según su modalidad) y las clases
        personalizadas. Los cambios aplican desde el siguiente ciclo de cada alumno y a los paquetes que se vendan en adelante; lo
        ya cobrado no se modifica.
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
      <PreciosCursos
        modalidades={escalas.modalidades}
        onChange={(modalidades) => setEscalas({ ...escalas, modalidades })}
        puedeEditar={puedeEditar}
      />
      <Personalizadas
        paquetes={escalas.personalizadas}
        onChange={(personalizadas) => setEscalas({ ...escalas, personalizadas })}
        puedeEditar={puedeEditar}
      />
      {puedeEditar && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant='contained'
            disabled={guardando || hayInvalidos}
            startIcon={guardando ? <CircularProgress size={16} color='inherit' /> : <SaveIcon />}
            onClick={guardar}
          >
            Guardar tarifas
          </Button>
        </Box>
      )}
    </Box>
  );
};

Tarifas.propTypes = {
  route: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
};

export default Tarifas;

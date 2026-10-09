// Tarifas de la academia: escalas de cursos grupales (total por ciclo según cuántos cursos toma el
// alumno, individual y en pareja) y precios de las clases personalizadas (por clase o paquete, con
// precio aparte para alumnos de cursos). Todo es opcional: sin escala cada curso cobra su plan.
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
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
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
    'Total que paga un alumno por ciclo según cuántos cursos toma. Sin escalones, cada curso cobra el precio de su plan.',
    1,
  ],
  pareja: [
    'En pareja',
    'Total que pagan las dos personas por ciclo cuando dos alumnos de un curso pagan en pareja (se define por alumno, en el curso o al matricular). Sin escalones, pagan la escala individual.',
    2,
  ],
};

const numero = (texto) => (texto === '' || texto === null || texto === undefined ? null : Number(texto));

// Primer escalón cuyo total está vacío o es menor que el anterior (ese curso saldría negativo).
const escalonInvalido = (totales) =>
  totales.findIndex((t, i) => numero(t) === null || numero(t) < 0 || (i > 0 && numero(t) < (numero(totales[i - 1]) ?? 0)));

const Escala = ({ tipo, totales, onChange, puedeEditar }) => {
  const [titulo, explicacion, personas] = ESCALAS[tipo];
  const invalido = escalonInvalido(totales);

  return (
    <Card sx={sombra}>
      <CardContent>
        <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
          {titulo}
        </Typography>
        <Typography variant='body2' color='text.secondary' sx={{ mt: 1, mb: 3 }}>
          {explicacion}
        </Typography>
        {totales.length > 0 && (
          <TableContainer>
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell>Cursos</TableCell>
                  <TableCell>Total por ciclo</TableCell>
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
          Precio de la clase suelta y de cada paquete. El precio para alumnos se propone al vender el paquete a quien ya toma un curso
          grupal; si se deja vacío, pagan el precio normal.
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
            onClick={() => onChange([...paquetes, { id: null, nombre: '', clases: '', valor: '', valor_alumno: '' }])}
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

const Tarifas = ({ route }) => {
  const { titulo, permisos } = usePermisosOpcion(route.path);
  const puedeEditar = permisos.indexOf('Modificar') >= 0;
  const [escalas, setEscalas] = useState(null);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [guardando, setGuardando] = useState(false);

  const aTexto = (datos) => ({
    ...Object.fromEntries(Object.keys(ESCALAS).map((tipo) => [tipo, (datos[tipo] ?? []).map(String)])),
    personalizadas: (datos.personalizadas ?? []).map((p) => ({ ...p, valor_alumno: p.valor_alumno ?? '' })),
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
        ...Object.fromEntries(Object.keys(ESCALAS).map((tipo) => [tipo, escalas[tipo].map(Number)])),
        personalizadas: escalas.personalizadas.map((p) => ({
          id: p.id,
          nombre: String(p.nombre).trim(),
          clases: Number(p.clases),
          valor: Number(p.valor),
          valor_alumno: numero(p.valor_alumno),
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
  const hayInvalidos =
    Object.keys(ESCALAS).some((tipo) => escalonInvalido(escalas[tipo]) >= 0) || escalas.personalizadas.some(paqueteInvalido);

  return (
    <Box sx={{ maxWidth: 1000 }}>
      <Typography variant='h2' sx={{ fontWeight: 'bold', mb: 1 }}>
        {titulo || 'Tarifas'}
      </Typography>
      <Typography color='text.secondary' sx={{ mb: 3 }}>
        Precios de los cursos grupales por ciclo de clases y de las clases personalizadas. Los cambios aplican desde el siguiente
        ciclo de cada alumno y a los paquetes que se vendan en adelante; lo ya cobrado no se modifica.
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
      {Object.keys(ESCALAS).map((tipo) => (
        <Escala
          key={tipo}
          tipo={tipo}
          totales={escalas[tipo]}
          onChange={(totales) => setEscalas({ ...escalas, [tipo]: totales })}
          puedeEditar={puedeEditar}
        />
      ))}
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

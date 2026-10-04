// Calendario de un curso: semanas con clase, festivos y cierres (a dónde se corre la clase)
// y el ciclo de pago vigente de cada alumno matriculado.
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  MenuItem,
  TextField,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import jwtAxios from '../../../../@crema/services/auth/jwt-auth';
import { formatoMoneda } from '../../../../shared/constants/Academia';

const DIAS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
const fecha = (iso) => {
  if (!iso) return '';
  const d = new Date(`${iso}T00:00:00`);
  return `${DIAS[d.getDay()]} ${iso.split('-').reverse().join('/')}`;
};
const hoyIso = () => new Date().toISOString().slice(0, 10);

const ESTADOS = {
  clase: { label: 'Clase', color: 'success' },
  festivo: { label: 'Festivo', color: 'error' },
  cierre: { label: 'Cierre', color: 'warning' },
};

const sombra = { boxShadow: '0px 0px 5px 2px rgb(0 0 0 / 8%)', height: '100%' };

const CalendarioCurso = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState('');

  const [aviso, setAviso] = useState(null);

  const cargar = () =>
    jwtAxios
      .get(`cursos/${id}/calendario`, { params: { semanas: 20 } })
      .then(({ data }) => setDatos(data))
      .catch(() => setError('No se pudo cargar el calendario del curso.'));

  useEffect(() => {
    cargar();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Pareja en este curso (se guarda en ambos); el precio de pareja aplica desde el siguiente ciclo.
  const asignarPareja = (alumno, parejaId) =>
    jwtAxios
      .put(`cursos/${id}/alumnos/${alumno.alumno_id}/pareja`, { pareja_alumno_id: parejaId || null })
      .then(({ data }) => {
        setAviso({ tipo: 'success', texto: data.mensajes?.[0] });
        cargar();
      })
      .catch((e) => setAviso({ tipo: 'error', texto: e?.response?.data?.mensajes?.[0] ?? 'No se pudo asignar la pareja.' }));

  // Pasa al alumno de pagar por ciclos a usar su paquete de clases, o al revés.
  const cambiarModalidad = (alumno, modalidad) =>
    jwtAxios
      .put(`cursos/${id}/alumnos/${alumno.alumno_id}/modalidad`, { modalidad })
      .then(({ data }) => {
        setAviso({ tipo: 'success', texto: data.mensajes?.[0] });
        cargar();
      })
      .catch((e) => setAviso({ tipo: 'error', texto: e?.response?.data?.mensajes?.[0] ?? 'No se pudo cambiar.' }));

  if (error) return <Alert severity='error'>{error}</Alert>;
  if (!datos) return <LinearProgress />;

  const hoy = hoyIso();
  let numeroClase = 0;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Tooltip title='Volver'>
          <IconButton onClick={() => navigate('/cursos')}>
            <ArrowBackIosIcon />
          </IconButton>
        </Tooltip>
        <Box>
          <Typography variant='h2' sx={{ fontWeight: 'bold' }}>
            Calendario · {datos.curso.nombre}
          </Typography>
          <Typography color='text.secondary'>
            {datos.curso.horario} · {datos.curso.plan ?? 'Sin plan'} · ciclos de {datos.curso.clases_por_ciclo} clases
          </Typography>
        </Box>
      </Box>

      {aviso && (
        <Alert severity={aviso.tipo} sx={{ mb: 2 }} onClose={() => setAviso(null)}>
          {aviso.texto}
        </Alert>
      )}
      <Alert severity='info' sx={{ mb: 3 }}>
        Si una clase cae en festivo o en un cierre de la academia no se dicta: se corre a la semana siguiente y el ciclo de
        cada alumno (y su próximo pago) termina una semana después.
      </Alert>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={sombra}>
            <CardContent>
              <Typography variant='h5' sx={{ fontWeight: 'bold', mb: 2 }}>
                Próximas semanas
              </Typography>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Detalle</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {datos.semanas.map((s) => {
                    const esClase = s.estado === 'clase';
                    if (esClase) numeroClase += 1;
                    return (
                      <TableRow
                        key={s.fecha}
                        sx={{
                          opacity: s.fecha < hoy ? 0.55 : 1,
                          ...(s.fecha === hoy && { outline: '2px solid', outlineColor: 'primary.main' }),
                        }}
                      >
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fecha(s.fecha)}</TableCell>
                        <TableCell>
                          <Chip size='small' color={ESTADOS[s.estado].color} label={ESTADOS[s.estado].label} />
                        </TableCell>
                        <TableCell>
                          {esClase
                            ? s.fecha === hoy
                              ? 'Hoy'
                              : ''
                            : `${s.motivo} → se corre al ${fecha(s.se_corre_a)}`}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={sombra}>
            <CardContent>
              <Typography variant='h5' sx={{ fontWeight: 'bold', mb: 2 }}>
                Ciclo de cada alumno
              </Typography>
              {datos.alumnos.length === 0 ? (
                <Typography color='text.secondary'>El curso no tiene alumnos matriculados.</Typography>
              ) : (
                <Box sx={{ overflowX: 'auto' }}>
                  <Table size='small'>
                    <TableHead>
                      <TableRow>
                        <TableCell>Alumno</TableCell>
                        <TableCell>Paga por</TableCell>
                        <TableCell>Pareja</TableCell>
                        <TableCell align='right'>Precio por ciclo</TableCell>
                        <TableCell>Ciclo actual / paquete</TableCell>
                        <TableCell>Próximo pago</TableCell>
                        <TableCell align='right'>Saldo</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {datos.alumnos.map((a) => (
                        <TableRow key={a.alumno_id}>
                          <TableCell>{a.nombre}</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>
                            <Chip size='small' label={a.modalidad === 'paquete' ? 'Paquete' : 'Ciclo'} sx={{ mr: 1 }} />
                            <Button
                              size='small'
                              onClick={() => cambiarModalidad(a, a.modalidad === 'paquete' ? 'ciclo' : 'paquete')}
                            >
                              {a.modalidad === 'paquete' ? 'Pasar a ciclo' : 'Usar paquete'}
                            </Button>
                          </TableCell>
                          <TableCell>
                            <TextField
                              select
                              variant='standard'
                              size='small'
                              value={a.pareja_alumno_id ?? ''}
                              onChange={(e) => asignarPareja(a, e.target.value)}
                              sx={{ minWidth: 140 }}
                              SelectProps={{ displayEmpty: true }}
                            >
                              <MenuItem value=''>
                                <em>Sin pareja</em>
                              </MenuItem>
                              {datos.alumnos
                                .filter((o) => o.alumno_id !== a.alumno_id)
                                .map((o) => (
                                  <MenuItem key={o.alumno_id} value={o.alumno_id}>
                                    {o.nombre}
                                  </MenuItem>
                                ))}
                            </TextField>
                          </TableCell>
                          <TableCell align='right' sx={{ whiteSpace: 'nowrap' }}>
                            {a.modalidad === 'paquete' ? (
                              '—'
                            ) : (
                              <Tooltip title={a.precio_regla ?? ''}>
                                <span>
                                  {formatoMoneda(a.precio_ciclo)}
                                  <Typography component='span' variant='caption' color='text.secondary' sx={{ display: 'block' }}>
                                    {a.precio_regla}
                                  </Typography>
                                </span>
                              </Tooltip>
                            )}
                          </TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>
                            {a.modalidad === 'paquete'
                              ? `Quedan ${a.paquete?.restantes ?? 0} clases${a.paquete?.vence ? ` · vence ${fecha(a.paquete.vence)}` : ''}`
                              : `${fecha(a.ciclo_inicio)} – ${fecha(a.ciclo_fin)}`}
                          </TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>{a.modalidad === 'paquete' ? '—' : fecha(a.proximo_pago)}</TableCell>
                          <TableCell align='right' sx={{ color: a.saldo > 0 ? 'error.main' : 'inherit' }}>
                            {formatoMoneda(a.saldo)}
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

export default CalendarioCurso;

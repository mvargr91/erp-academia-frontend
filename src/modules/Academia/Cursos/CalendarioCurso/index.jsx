// Calendario de un curso: semanas con clase, festivos y cierres (a dónde se corre la clase).
// Un festivo se puede habilitar para que el curso sí tenga clase ese día.
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
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
import usePermisosOpcion from '../../../../shared/hooks/usePermisosOpcion';

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
  const [enviando, setEnviando] = useState(false);
  const { permisos } = usePermisosOpcion('/cursos');
  const puedeModificar = permisos.indexOf('Modificar') >= 0;

  const cargar = () =>
    jwtAxios
      .get(`cursos/${id}/calendario`, { params: { semanas: 20 } })
      .then(({ data }) => setDatos(data))
      .catch(() => setError('No se pudo cargar el calendario del curso.'));

  useEffect(() => {
    cargar();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const enviar = (peticion) => {
    setEnviando(true);
    setAviso(null);
    peticion
      .then(({ data }) => {
        setAviso({ tipo: 'success', texto: data.mensajes[0] });
        return cargar();
      })
      .catch((e) => setAviso({ tipo: 'error', texto: e?.response?.data?.mensajes?.[0] ?? 'No se pudo completar la operación.' }))
      .finally(() => setEnviando(false));
  };
  const habilitar = (s) => {
    const efecto = datos.curso.mensual
      ? 'Esa clase cuenta en la mensualidad de los alumnos (el valor del mes no cambia).'
      : 'Esa clase cuenta en el ciclo de los alumnos, así que su próximo pago llega una semana antes.';
    if (window.confirm(`¿El curso tendrá clase el ${fecha(s.fecha)} (${s.motivo})? ${efecto}`)) {
      enviar(jwtAxios.post(`cursos/${id}/festivos-habilitados`, { fecha: s.fecha }));
    }
  };
  const deshabilitar = (s) => {
    const efecto = datos.curso.mensual ? 'Ese día no habrá clase.' : 'La clase vuelve a correrse a la semana siguiente.';
    if (window.confirm(`¿Quitar la clase del ${fecha(s.fecha)}? ${efecto}`)) {
      enviar(jwtAxios.delete(`cursos/${id}/festivos-habilitados/${s.fecha}`));
    }
  };

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
            {datos.curso.horario} · {datos.curso.mensual ? 'mensualidad' : `ciclos de ${datos.curso.clases_por_ciclo} clases`}
          </Typography>
        </Box>
      </Box>

      <Alert severity='info' sx={{ mb: 3 }}>
        {datos.curso.mensual
          ? `Se cobra por mes: el mismo valor si el mes trae 4 o 5 clases. ${
              datos.dicta_festivos ? 'La academia dicta clases los festivos; si' : 'Si'
            } una clase cae en ${datos.dicta_festivos ? 'un cierre de la academia' : 'festivo o en un cierre de la academia'} no se dicta ni se repone, y un mes sin ninguna clase no se cobra.${
              datos.dicta_festivos ? '' : ' Si el curso sí tiene clase en un festivo, usa "Dar clase" en esa fecha.'
            }`
          : datos.dicta_festivos
          ? 'La academia dicta clases los festivos. Solo los cierres de la academia corren la clase a la semana siguiente.'
          : 'Si una clase cae en festivo o en un cierre de la academia no se dicta: se corre a la semana siguiente y el ciclo de cada alumno (y su próximo pago) termina una semana después. Si el curso sí tiene clase en un festivo, usa "Dar clase" en esa fecha.'}
      </Alert>
      {aviso && (
        <Alert severity={aviso.tipo} sx={{ mb: 3 }} onClose={() => setAviso(null)}>
          {aviso.texto}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
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
                    {puedeModificar && <TableCell />}
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
                          {[
                            s.fecha === hoy ? 'Hoy' : '',
                            s.festivo_habilitado ? `Festivo con clase (${s.festivo_habilitado})` : '',
                            esClase ? '' : s.se_corre_a ? `${s.motivo} → se corre al ${fecha(s.se_corre_a)}` : `${s.motivo} → no se dicta`,
                          ]
                            .filter(Boolean)
                            .join(' · ')}
                        </TableCell>
                        {puedeModificar && (
                          <TableCell align='right' sx={{ whiteSpace: 'nowrap' }}>
                            {s.estado === 'festivo' && (
                              <Button size='small' disabled={enviando} onClick={() => habilitar(s)}>
                                Dar clase
                              </Button>
                            )}
                            {s.festivo_habilitado && (
                              <Button size='small' color='error' disabled={enviando} onClick={() => deshabilitar(s)}>
                                Quitar clase
                              </Button>
                            )}
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </Box>
  );
};

export default CalendarioCurso;

// Calendario de un curso: semanas con clase, festivos y cierres (a dónde se corre la clase)
// e indica si el curso es individual o en pareja.
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
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


  const cargar = () =>
    jwtAxios
      .get(`cursos/${id}/calendario`, { params: { semanas: 20 } })
      .then(({ data }) => setDatos(data))
      .catch(() => setError('No se pudo cargar el calendario del curso.'));

  useEffect(() => {
    cargar();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

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

      <Alert severity='info' sx={{ mb: 3 }}>
        Si una clase cae en festivo o en un cierre de la academia no se dicta: se corre a la semana siguiente y el ciclo de
        cada alumno (y su próximo pago) termina una semana después.
      </Alert>

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

      </Grid>
    </Box>
  );
};

export default CalendarioCurso;

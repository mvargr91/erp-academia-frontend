// Mis cursos: home del profesor. Una tarjeta por curso (primero los que tienen clase hoy) con accesos
// directos para tomar asistencia y ver el calendario. Un profesor solo ve los suyos; quien ve todos los
// cursos (administración) ve todos los activos.
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Button, Card, CardActions, CardContent, Chip, Grid, LinearProgress, Stack, Typography } from '@mui/material';
import ChecklistIcon from '@mui/icons-material/Checklist';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import jwtAxios from '../../../@crema/services/auth/jwt-auth';
import usePermisosOpcion from '../../../shared/hooks/usePermisosOpcion';
import { useSedes } from '../../../shared/sedes';
import { DIAS_SEMANA, nombreDe } from '../../../shared/constants/Academia';

const sombra = { boxShadow: '0px 0px 5px 2px rgb(0 0 0 / 8%)', height: '100%', display: 'flex', flexDirection: 'column' };
const fechaCorta = (iso) => (iso ? iso.split('-').reverse().slice(0, 2).join('/') : '');

const estadoDe = (c) => {
  if (c.clase_hoy) {
    return c.asistencia_hoy ? { label: 'Hoy · asistencia tomada', color: 'success' } : { label: 'Clase hoy', color: 'warning' };
  }
  return c.proxima_clase ? { label: `Próxima clase ${fechaCorta(c.proxima_clase)}`, color: 'default' } : null;
};

const Tarjeta = ({ curso, puedeTomar, onTomar, onCalendario }) => {
  const estado = estadoDe(curso);
  const detalle = [
    `${nombreDe(DIAS_SEMANA, curso.dia)} ${curso.hora}`,
    curso.duracion_minutos ? `${curso.duracion_minutos} min` : null,
    curso.sede,
  ].filter(Boolean);

  return (
    <Card sx={sombra}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack direction='row' justifyContent='space-between' alignItems='flex-start' spacing={1} sx={{ mb: 1 }}>
          <Typography variant='h4' sx={{ fontWeight: 'bold' }}>
            {curso.nombre}
          </Typography>
          {estado && <Chip size='small' color={estado.color} label={estado.label} />}
        </Stack>
        <Typography color='text.secondary'>{detalle.join(' · ')}</Typography>
        <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
          {curso.matriculados} alumno{curso.matriculados === 1 ? '' : 's'}
          {curso.modalidad ? ` · ${curso.modalidad}` : ''}
        </Typography>
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2, flexWrap: 'wrap', gap: 1 }}>
        {puedeTomar && (
          <Button variant={curso.clase_hoy ? 'contained' : 'outlined'} startIcon={<ChecklistIcon />} onClick={onTomar}>
            Tomar asistencia
          </Button>
        )}
        <Button startIcon={<CalendarMonthIcon />} onClick={onCalendario}>
          Calendario
        </Button>
      </CardActions>
    </Card>
  );
};

Tarjeta.propTypes = {
  curso: PropTypes.object.isRequired,
  puedeTomar: PropTypes.bool,
  onTomar: PropTypes.func.isRequired,
  onCalendario: PropTypes.func.isRequired,
};

const MisCursos = ({ route }) => {
  const navigate = useNavigate();
  const { titulo } = usePermisosOpcion(route.path);
  const puedeTomar = usePermisosOpcion('/tomar-asistencia').permisos.length > 0;
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState('');
  // Sigue al selector de sede del encabezado (cabecera X-Sede): al cambiarla se vuelve a pedir.
  const { sedeId, sedes } = useSedes();
  const nombreSede = sedes.find((s) => String(s.id) === String(sedeId))?.nombre;

  useEffect(() => {
    setError('');
    jwtAxios
      .get('mis-cursos')
      .then(({ data }) => setDatos(data))
      .catch(() => setError('No se pudieron cargar tus cursos.'));
  }, [sedeId]);

  if (error) return <Alert severity='error'>{error}</Alert>;
  if (!datos) return <LinearProgress />;

  // Con la fecha de hoy: si ese día no hay clase, Tomar asistencia lo dice y deja elegir otra fecha.
  const tomar = (c) => navigate(`/tomar-asistencia?curso=${c.id}`);

  return (
    <Box>
      <Typography variant='h2' sx={{ fontWeight: 'bold', mb: 1 }}>
        {titulo || 'Mis cursos'}
      </Typography>
      <Typography color='text.secondary' sx={{ mb: 3 }}>
        {datos.profesor ? 'Tus cursos activos' : 'Todos los cursos activos'}
        {nombreSede ? ` de la sede ${nombreSede}` : ''}, primero los que tienen clase hoy.
        {datos.profesor ? '' : ' Un profesor con acceso al ERP ve solo los suyos.'}
      </Typography>
      {datos.cursos.length === 0 ? (
        <Alert severity='info'>
          {nombreSede
            ? `No ${datos.profesor ? 'tienes' : 'hay'} cursos activos en la sede ${nombreSede}. Elige otra sede o «Todas» en el selector de arriba.`
            : datos.profesor
            ? 'Aún no tienes cursos asignados. Pídele al administrador que te asigne como profesor en tus cursos.'
            : 'No hay cursos activos.'}
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {datos.cursos.map((c) => (
            <Grid item xs={12} sm={6} lg={4} key={c.id}>
              <Tarjeta
                curso={c}
                puedeTomar={puedeTomar}
                onTomar={() => tomar(c)}
                onCalendario={() => navigate(`/cursos/${c.id}/calendario`, { state: { desde: route.path } })}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

MisCursos.propTypes = {
  route: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
};

export default MisCursos;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Rating,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PlaceIcon from '@mui/icons-material/Place';
import ScheduleIcon from '@mui/icons-material/Schedule';
import GroupsIcon from '@mui/icons-material/Groups';
import TranslateIcon from '@mui/icons-material/Translate';
import VerifiedIcon from '@mui/icons-material/Verified';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { onShow, resetActual } from '@crema/redux/features/portalExperiencias/portalExperienciasSlice';
import { onCreate as onCrearFavorito } from '@crema/redux/features/favoritos/favoritosSlice';
import { DIAS_SEMANA, TIPOS_PRECIO, aHoraCorta, formatoMoneda, nombreDe, textoCantidad } from '../../../shared/constants/Turismo';
import { ImagenExperiencia } from '../../../shared/components/Portal/ExperienceCard';
import ReservaWidget from './ReservaWidget';
import { urlArchivo } from '../../../shared/functions/Archivos';
import { RUTAS_PORTAL } from '../../../shared/constants/RutasPortal';

// Lista "incluye / no incluye": texto libre (una línea por ítem) + características marcadas.
const ListaIncluye = ({ titulo, lineas, incluida }) =>
  lineas.length > 0 && (
    <Box>
      <Typography variant='h4' sx={{ mb: 1 }}>{titulo}</Typography>
      <List dense disablePadding>
        {lineas.map((linea) => (
          <ListItem key={linea} disableGutters>
            <ListItemIcon sx={{ minWidth: 32 }}>
              {incluida ? <CheckCircleIcon color='success' fontSize='small' /> : <CancelIcon color='error' fontSize='small' />}
            </ListItemIcon>
            <ListItemText primary={linea} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

const lineasDe = (texto) => (texto ? texto.split(/\r?\n/).map((l) => l.trim()).filter(Boolean) : []);

const ExperienciaDetalle = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { slug } = useParams();
  const { actual: exp, loadingActual, error } = useSelector((state) => state.portalExperiencias);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [fotoActiva, setFotoActiva] = useState(0);

  useEffect(() => {
    dispatch(onShow(slug));
    setFotoActiva(0);
    return () => dispatch(resetActual());
  }, [dispatch, slug]);

  if (loadingActual || (!exp && !error)) {
    return (
      <Container maxWidth='lg' sx={{ py: 5 }}>
        <Skeleton variant='rounded' height={420} />
        <Skeleton sx={{ mt: 3 }} height={60} width='60%' />
      </Container>
    );
  }

  if (!exp) {
    return (
      <Container maxWidth='md' sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant='h2'>Experiencia no disponible</Typography>
        <Typography color='text.secondary' sx={{ my: 2 }}>Puede que ya no esté publicada.</Typography>
        <Button variant='contained' component={RouterLink} to={RUTAS_PORTAL.tours}>Ver experiencias</Button>
      </Container>
    );
  }

  const fotos = exp.multimedia.filter((m) => m.tipo === 'foto');
  const videos = exp.multimedia.filter((m) => m.tipo === 'video');
  const incluye = [...lineasDe(exp.incluye), ...exp.caracteristicas.filter((c) => c.incluida).map((c) => c.nombre)];
  const noIncluye = [...lineasDe(exp.no_incluye), ...exp.caracteristicas.filter((c) => !c.incluida).map((c) => c.nombre)];
  const verificada = exp.verificada || exp.proveedor_verificacion === 'aprobado';
  const urlMapa = exp.latitud && exp.longitud
    ? `https://www.google.com/maps/search/?api=1&query=${exp.latitud},${exp.longitud}`
    : exp.direccion ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(exp.direccion)}` : null;

  const guardarFavorito = () => {
    if (!isAuthenticated) {
      navigate(`/signin?redirect=${RUTAS_PORTAL.tour(slug)}`);
      return;
    }
    dispatch(onCrearFavorito({ params: { usuario_id: user?.usuario?.id, experiencia_id: exp.id } }));
  };

  return (
    <Container maxWidth='lg' sx={{ py: 4 }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link component={RouterLink} to='/' underline='hover' color='inherit'>Inicio</Link>
        <Link component={RouterLink} to={`${RUTAS_PORTAL.tours}?destino=${exp.destino_slug}`} underline='hover' color='inherit'>{exp.destino_nombre}</Link>
        <Typography color='text.primary'>{exp.nombre}</Typography>
      </Breadcrumbs>

      {/* Galería */}
      <Grid container spacing={1.5} sx={{ mb: 3 }}>
        <Grid item xs={12} md={fotos.length > 1 ? 8 : 12}>
          <Box sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <ImagenExperiencia src={fotos[fotoActiva]?.ruta_archivo} alt={fotos[fotoActiva]?.texto_alternativo || exp.nombre} altura={420} />
          </Box>
        </Grid>
        {fotos.length > 1 && (
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, maxHeight: 420, overflowY: 'auto' }}>
              {fotos.map((foto, i) => (
                <Box
                  key={foto.id}
                  component='img'
                  src={urlArchivo(foto.ruta_archivo)}
                  alt={foto.texto_alternativo || foto.titulo || ''}
                  onClick={() => setFotoActiva(i)}
                  sx={{ width: '100%', height: 132, objectFit: 'cover', borderRadius: 2, cursor: 'pointer', outline: i === fotoActiva ? '3px solid' : 'none', outlineColor: 'primary.main' }}
                />
              ))}
            </Box>
          </Grid>
        )}
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Stack direction='row' spacing={1} sx={{ mb: 1, flexWrap: 'wrap', gap: 1 }}>
            {exp.categorias.map((c) => (
              <Chip key={c.id} label={c.nombre} size='small' component={RouterLink} to={`${RUTAS_PORTAL.tours}?categoria=${c.slug}`} clickable />
            ))}
            {verificada && <Chip icon={<VerifiedIcon />} label='Verificada' color='primary' size='small' />}
          </Stack>
          <Typography variant='h1' sx={{ fontSize: { xs: '1.8rem', md: '2.3rem' } }}>{exp.nombre}</Typography>
          <Stack direction='row' spacing={2} alignItems='center' sx={{ mt: 1, mb: 3, flexWrap: 'wrap', color: 'text.secondary' }}>
            <Stack direction='row' spacing={0.5} alignItems='center'>
              <Rating value={Number(exp.calificacion_promedio) || 0} precision={0.5} readOnly size='small' />
              <Typography variant='body2'>{exp.calificacion_promedio ?? '—'} ({exp.total_resenas} reseñas)</Typography>
            </Stack>
            <Stack direction='row' spacing={0.5} alignItems='center'><PlaceIcon fontSize='small' /><Typography variant='body2'>{exp.destino_nombre}</Typography></Stack>
            <Button size='small' startIcon={<FavoriteBorderIcon />} onClick={guardarFavorito}>Guardar</Button>
          </Stack>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[
              { icono: ScheduleIcon, etiqueta: 'Duración', valor: exp.duracion },
              { icono: GroupsIcon, etiqueta: 'Capacidad', valor: exp.capacidad_maxima && `${exp.capacidad_maxima} personas` },
              { icono: TranslateIcon, etiqueta: 'Idioma', valor: exp.idioma },
            ].filter((d) => d.valor).map(({ icono: Icono, etiqueta, valor }) => (
              <Grid item xs={12} sm={4} key={etiqueta}>
                <Paper variant='outlined' sx={{ p: 1.5, display: 'flex', gap: 1.5, alignItems: 'center' }}>
                  <Icono color='primary' />
                  <Box>
                    <Typography variant='caption' color='text.secondary'>{etiqueta}</Typography>
                    <Typography fontWeight={600}>{valor}</Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {exp.descripcion && (
            <Typography sx={{ whiteSpace: 'pre-line', mb: 3 }}>{exp.descripcion}</Typography>
          )}

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}><ListaIncluye titulo='Incluye' lineas={incluye} incluida /></Grid>
            <Grid item xs={12} sm={6}><ListaIncluye titulo='No incluye' lineas={noIncluye} incluida={false} /></Grid>
          </Grid>

          {exp.precios.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant='h4' sx={{ mb: 1 }}>Tarifas</Typography>
              <Table size='small'>
                <TableBody>
                  {exp.precios.flatMap((p) =>
                    p.cantidades.map((c, i) => (
                      <TableRow key={`${p.id}-${c.cantidad}`}>
                        <TableCell>
                          {i === 0 && (
                            <>
                              {p.descripcion}{' '}
                              <Chip size='small' variant='outlined' label={nombreDe(TIPOS_PRECIO, p.tipo)} sx={{ ml: 1 }} />
                            </>
                          )}
                        </TableCell>
                        <TableCell>{textoCantidad(c.cantidad)}</TableCell>
                        <TableCell align='right'><strong>{formatoMoneda(c.valor)}</strong> <Typography component='span' variant='body2' color='text.secondary'>c/u</Typography></TableCell>
                      </TableRow>
                    )),
                  )}
                </TableBody>
              </Table>
            </Box>
          )}

          {exp.horarios.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant='h4' sx={{ mb: 1 }}>Horarios habituales</Typography>
              <Stack direction='row' sx={{ flexWrap: 'wrap', gap: 1 }}>
                {exp.horarios.map((h) => (
                  <Chip key={h.id} variant='outlined' label={`${nombreDe(DIAS_SEMANA, h.dia_semana)} ${aHoraCorta(h.hora_inicio)} - ${aHoraCorta(h.hora_fin)}`} />
                ))}
              </Stack>
            </Box>
          )}

          {(exp.punto_encuentro || exp.direccion) && (
            <Box sx={{ mb: 3 }}>
              <Typography variant='h4' sx={{ mb: 1 }}>Punto de encuentro</Typography>
              <Typography>{[exp.punto_encuentro, exp.direccion].filter(Boolean).join(' · ')}</Typography>
              {urlMapa && <Button size='small' startIcon={<PlaceIcon />} href={urlMapa} target='_blank' rel='noopener noreferrer'>Ver en el mapa</Button>}
            </Box>
          )}

          {videos.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant='h4' sx={{ mb: 1 }}>Videos</Typography>
              {videos.map((v) => (
                <Button key={v.id} startIcon={<PlayCircleIcon />} href={urlArchivo(v.ruta_archivo)} target='_blank' rel='noopener noreferrer'>{v.titulo || 'Ver video'}</Button>
              ))}
            </Box>
          )}

          <Divider sx={{ my: 3 }} />
          <Paper variant='outlined' sx={{ p: 2.5, mb: 3 }}>
            <Stack direction='row' spacing={1} alignItems='center'>
              <Typography variant='h4'>Ofrecido por {exp.proveedor_nombre}</Typography>
              {exp.proveedor_verificacion === 'aprobado' && <VerifiedIcon color='primary' />}
            </Stack>
            {exp.proveedor_descripcion && <Typography color='text.secondary' sx={{ mt: 1 }}>{exp.proveedor_descripcion}</Typography>}
          </Paper>

          <Typography variant='h3' sx={{ mb: 2 }}>Reseñas</Typography>
          {exp.resenas.length === 0 ? (
            <Alert severity='info'>Aún no hay reseñas. ¡Sé la primera persona en contar tu experiencia!</Alert>
          ) : (
            <Stack spacing={2}>
              {exp.resenas.map((r) => (
                <Paper key={r.id} variant='outlined' sx={{ p: 2 }}>
                  <Stack direction='row' justifyContent='space-between'>
                    <Typography fontWeight={600}>{r.usuario_nombre || 'Viajero'}</Typography>
                    <Typography variant='caption' color='text.secondary'>{String(r.fecha).substring(0, 10)}</Typography>
                  </Stack>
                  <Rating value={r.calificacion} readOnly size='small' />
                  {r.comentario && <Typography sx={{ mt: 0.5 }}>{r.comentario}</Typography>}
                </Paper>
              ))}
            </Stack>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <ReservaWidget experiencia={exp} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default ExperienciaDetalle;

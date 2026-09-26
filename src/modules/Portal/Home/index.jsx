import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ReviewsIcon from '@mui/icons-material/Reviews';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { onGetColeccion as onGetExperiencias } from '@crema/redux/features/portalExperiencias/portalExperienciasSlice';
import { onGetColeccion as onGetDestinos } from '@crema/redux/features/portalDestinos/portalDestinosSlice';
import { onGetColeccion as onGetPromociones } from '@crema/redux/features/portalPromociones/portalPromocionesSlice';
import CategoryBar from '../../../shared/components/Portal/CategoryBar';
import ExperienceCard, { ImagenExperiencia } from '../../../shared/components/Portal/ExperienceCard';
import { ARCOIRIS, COLORES_MARCA, MARCA } from '../../../shared/constants/Marca';
import { GrillaCargando, TituloSeccion } from '../../../shared/components/Portal/Secciones';
import { RUTAS_PORTAL } from '../../../shared/constants/RutasPortal';

const PROPUESTAS = [
  { icono: VerifiedUserIcon, titulo: 'Proveedores verificados', texto: 'Revisamos documentos y registro de turismo de cada proveedor antes de publicar.' },
  { icono: ReviewsIcon, titulo: 'Reseñas de la comunidad', texto: 'Opiniones reales de viajeros, moderadas por nuestro equipo.' },
  { icono: EventAvailableIcon, titulo: 'Reserva con confianza', texto: 'Cupos y horarios actualizados por el proveedor, confirmación en tu cuenta.' },
];

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const experiencias = useSelector((state) => state.portalExperiencias);
  const destinos = useSelector((state) => state.portalDestinos.rows);
  const promociones = useSelector((state) => state.portalPromociones.rows);
  const [busqueda, setBusqueda] = useState({ texto: '', destino: '' });

  useEffect(() => {
    dispatch(onGetExperiencias({ rowsPerPage: 8, filtros: { orden: 'relevancia' } }));
    dispatch(onGetDestinos());
    dispatch(onGetPromociones());
  }, [dispatch]);

  const buscar = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(Object.entries(busqueda).filter(([, v]) => v));
    navigate(`${RUTAS_PORTAL.tours}?${params.toString()}`);
  };

  return (
    <>
      {/* Hero */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          color: '#fff',
          background: `linear-gradient(120deg, ${COLORES_MARCA.azulOscuro} 0%, ${COLORES_MARCA.azul} 55%, ${ARCOIRIS[5]} 100%)`,
          py: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth='lg' sx={{ position: 'relative' }}>
          <Grid container spacing={4} alignItems='center'>
            <Grid item xs={12} md={7}>
              <Typography variant='h1' sx={{ fontSize: { xs: '2rem', md: '3rem' } }}>
                {MARCA.eslogan}
              </Typography>
              <Typography sx={{ mt: 2, mb: 4, fontSize: '1.1rem', opacity: 0.9, maxWidth: 560 }}>
                Tours, planes y experiencias verificadas por la comunidad LGTBIQ+ en los mejores destinos del país.
              </Typography>
              <Paper component='form' onSubmit={buscar} sx={{ p: 1.5, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5 }}>
                <TextField
                  fullWidth
                  size='small'
                  placeholder='¿Qué quieres vivir?'
                  value={busqueda.texto}
                  onChange={(e) => setBusqueda({ ...busqueda, texto: e.target.value })}
                />
                <TextField
                  select
                  size='small'
                  sx={{ minWidth: 180 }}
                  label='Destino'
                  value={busqueda.destino}
                  onChange={(e) => setBusqueda({ ...busqueda, destino: e.target.value })}
                >
                  <MenuItem value=''>Todos</MenuItem>
                  {destinos.map((d) => (
                    <MenuItem key={d.id} value={d.slug}>{d.nombre}</MenuItem>
                  ))}
                </TextField>
                <Button type='submit' variant='contained' startIcon={<SearchIcon />} sx={{ px: 4 }}>
                  Buscar
                </Button>
              </Paper>
            </Grid>
            <Grid item md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box sx={{ bgcolor: 'rgba(255,255,255,0.95)', borderRadius: 4, p: 3 }}>
                <Box component='img' src={MARCA.logos.principal} alt={MARCA.nombre} sx={{ width: '100%' }} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <CategoryBar />

      <Container maxWidth='lg' sx={{ py: 7 }}>
        <TituloSeccion
          titulo='Experiencias recomendadas'
          subtitulo='Seleccionadas y verificadas por nuestro equipo'
          accion={<Button component={RouterLink} to={RUTAS_PORTAL.tours}>Ver todas</Button>}
        />
        {experiencias.loading ? (
          <GrillaCargando />
        ) : experiencias.rows.length === 0 ? (
          <Typography color='text.secondary'>Pronto publicaremos nuevas experiencias.</Typography>
        ) : (
          <Grid container spacing={3}>
            {experiencias.rows.map((exp) => (
              <Grid item xs={12} sm={6} md={3} key={exp.id}>
                <ExperienceCard experiencia={exp} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {destinos.length > 0 && (
        <Box sx={{ bgcolor: 'background.paper', py: 7 }}>
          <Container maxWidth='lg'>
            <TituloSeccion titulo='Destinos' accion={<Button component={RouterLink} to={RUTAS_PORTAL.destinos}>Ver destinos</Button>} />
            <Grid container spacing={3}>
              {destinos.slice(0, 6).map((d) => (
                <Grid item xs={12} sm={6} md={4} key={d.id}>
                  <Card>
                    <CardActionArea component={RouterLink} to={`${RUTAS_PORTAL.tours}?destino=${d.slug}`}>
                      <ImagenExperiencia src={d.imagen} alt={d.nombre} altura={160} />
                      <CardContent>
                        <Typography variant='h4'>{d.nombre}</Typography>
                        <Typography variant='body2' color='text.secondary'>
                          {[d.ciudad, d.departamento].filter(Boolean).join(', ')} · {d.total_experiencias} experiencia(s)
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}

      <Container maxWidth='lg' sx={{ py: 7 }}>
        <Grid container spacing={3}>
          {PROPUESTAS.map(({ icono: Icono, titulo, texto }, i) => (
            <Grid item xs={12} md={4} key={titulo}>
              <Stack spacing={1.5} sx={{ p: 3, height: '100%', borderRadius: 3, bgcolor: 'background.paper', borderTop: `4px solid ${ARCOIRIS[i * 2]}` }}>
                <Icono color='primary' sx={{ fontSize: 36 }} />
                <Typography variant='h4'>{titulo}</Typography>
                <Typography color='text.secondary'>{texto}</Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>

      {promociones.length > 0 && (
        <Container maxWidth='lg'>
          <Paper sx={{ p: { xs: 3, md: 5 }, display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap', background: `linear-gradient(90deg, ${ARCOIRIS[5]}, ${COLORES_MARCA.azul})`, color: '#fff' }}>
            <LocalOfferIcon sx={{ fontSize: 48 }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant='h3'>{promociones[0].nombre}</Typography>
              <Typography sx={{ opacity: 0.9 }}>
                {promociones.length > 1 ? `y ${promociones.length - 1} promoción(es) más vigentes` : `Válida hasta ${promociones[0].fecha_fin}`}
              </Typography>
            </Box>
            <Button variant='contained' color='inherit' sx={{ color: COLORES_MARCA.texto }} component={RouterLink} to={RUTAS_PORTAL.promociones}>
              Ver promociones
            </Button>
          </Paper>
        </Container>
      )}
    </>
  );
};

export default Home;

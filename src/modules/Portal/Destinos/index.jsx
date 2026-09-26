import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { Card, CardActionArea, CardContent, Chip, Container, Grid, Typography } from '@mui/material';
import { onGetColeccion } from '@crema/redux/features/portalDestinos/portalDestinosSlice';
import { ImagenExperiencia } from '../../../shared/components/Portal/ExperienceCard';
import { GrillaCargando, TituloSeccion } from '../../../shared/components/Portal/Secciones';
import { RUTAS_PORTAL } from '../../../shared/constants/RutasPortal';

const Destinos = () => {
  const dispatch = useDispatch();
  const { rows: destinos, loading } = useSelector((state) => state.portalDestinos);

  useEffect(() => {
    dispatch(onGetColeccion());
  }, [dispatch]);

  return (
    <Container maxWidth='lg' sx={{ py: 5 }}>
      <TituloSeccion titulo='Destinos' subtitulo='Descubre a dónde viajar y qué vivir en cada lugar' />
      {loading ? (
        <GrillaCargando cantidad={6} columnas={{ xs: 12, sm: 6, md: 4 }} />
      ) : (
        <Grid container spacing={3}>
          {destinos.map((d) => (
            <Grid item xs={12} sm={6} md={4} key={d.id}>
              <Card sx={{ height: '100%' }}>
                <CardActionArea component={RouterLink} to={`${RUTAS_PORTAL.tours}?destino=${d.slug}`} sx={{ height: '100%' }}>
                  <ImagenExperiencia src={d.imagen} alt={d.nombre} altura={200} />
                  <CardContent>
                    <Typography variant='h3'>
                      {d.nombre} {d.destacado ? <Chip size='small' label='Destacado' color='primary' sx={{ ml: 1 }} /> : null}
                    </Typography>
                    <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                      {[d.ciudad, d.departamento].filter(Boolean).join(', ')}
                    </Typography>
                    {d.descripcion && (
                      <Typography variant='body2' sx={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {d.descripcion}
                      </Typography>
                    )}
                    <Typography variant='body2' color='primary.main' fontWeight={600} sx={{ mt: 1 }}>
                      {d.total_experiencias} experiencia(s)
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Destinos;

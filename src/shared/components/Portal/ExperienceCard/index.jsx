import React from 'react';
import PropTypes from 'prop-types';
import { urlArchivo } from '../../../functions/Archivos';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Card, CardActionArea, CardContent, Chip, Rating, Stack, Typography } from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import ScheduleIcon from '@mui/icons-material/Schedule';
import VerifiedIcon from '@mui/icons-material/Verified';
import { formatoMoneda } from '../../../constants/Turismo';
import { MARCA } from '../../../constants/Marca';
import { RUTAS_PORTAL } from '../../../constants/RutasPortal';

export const ImagenExperiencia = ({ src, alt, altura }) =>
  src ? (
    <Box component='img' src={urlArchivo(src)} alt={alt} loading='lazy' sx={{ width: '100%', height: altura, objectFit: 'cover', display: 'block' }} />
  ) : (
    // Sin foto: isotipo de la marca como marcador de posición
    <Box sx={{ height: altura, display: 'grid', placeItems: 'center', bgcolor: 'rgba(0,161,204,0.08)' }}>
      <Box component='img' src={MARCA.logos.isotipo} alt='' sx={{ height: altura * 0.55, opacity: 0.8 }} />
    </Box>
  );

ImagenExperiencia.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  altura: PropTypes.number,
};

const ExperienceCard = ({ experiencia }) => {
  const verificada = experiencia.verificada || experiencia.proveedor_verificacion === 'aprobado';
  const calificacion = Number(experiencia.calificacion_promedio) || 0;

  return (
    <Card sx={{ height: '100%', overflow: 'hidden' }}>
      <CardActionArea component={RouterLink} to={RUTAS_PORTAL.tour(experiencia.slug)} sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
        <Box sx={{ position: 'relative' }}>
          <ImagenExperiencia src={experiencia.imagen} alt={experiencia.nombre} altura={190} />
          <Stack direction='row' spacing={0.5} sx={{ position: 'absolute', top: 10, left: 10 }}>
            {experiencia.promocion_id && <Chip size='small' label='Promo' color='secondary' />}
            {experiencia.destacada ? <Chip size='small' label='Destacada' sx={{ bgcolor: '#FFED00', color: '#1F2933' }} /> : null}
          </Stack>
        </Box>
        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          <Stack direction='row' spacing={0.5} alignItems='center' sx={{ color: 'text.secondary' }}>
            <PlaceIcon sx={{ fontSize: 16 }} />
            <Typography variant='caption'>{experiencia.destino_nombre}</Typography>
            {verificada && (
              <Stack direction='row' spacing={0.25} alignItems='center' sx={{ ml: 'auto !important', color: 'primary.main' }}>
                <VerifiedIcon sx={{ fontSize: 16 }} />
                <Typography variant='caption' fontWeight={600}>Verificada</Typography>
              </Stack>
            )}
          </Stack>
          <Typography variant='h4' sx={{ lineHeight: 1.3 }}>{experiencia.nombre}</Typography>
          {experiencia.duracion && (
            <Stack direction='row' spacing={0.5} alignItems='center' sx={{ color: 'text.secondary' }}>
              <ScheduleIcon sx={{ fontSize: 16 }} />
              <Typography variant='caption'>{experiencia.duracion}</Typography>
            </Stack>
          )}
          <Box sx={{ mt: 'auto', pt: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <Stack direction='row' spacing={0.5} alignItems='center'>
              <Rating value={calificacion} precision={0.5} readOnly size='small' />
              <Typography variant='caption' color='text.secondary'>
                ({experiencia.total_resenas ?? 0})
              </Typography>
            </Stack>
            <Box textAlign='right'>
              <Typography variant='caption' color='text.secondary'>Desde</Typography>
              <Typography variant='h4' color='primary.main' lineHeight={1}>
                {formatoMoneda(experiencia.precio_desde)}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

ExperienceCard.propTypes = {
  experiencia: PropTypes.object.isRequired,
};

export default ExperienceCard;

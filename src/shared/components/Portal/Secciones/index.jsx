import React from 'react';
import PropTypes from 'prop-types';
import { Box, Grid, Skeleton, Typography } from '@mui/material';

export const TituloSeccion = ({ titulo, subtitulo, accion }) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', mb: 3, gap: 2 }}>
    <Box>
      <Typography variant='h2'>{titulo}</Typography>
      {subtitulo && <Typography color='text.secondary'>{subtitulo}</Typography>}
    </Box>
    {accion}
  </Box>
);

TituloSeccion.propTypes = {
  titulo: PropTypes.node.isRequired,
  subtitulo: PropTypes.node,
  accion: PropTypes.node,
};

export const GrillaCargando = ({ cantidad = 4, columnas = { xs: 12, sm: 6, md: 3 } }) => (
  <Grid container spacing={3}>
    {Array.from({ length: cantidad }).map((_, i) => (
      <Grid item {...columnas} key={i}>
        <Skeleton variant='rounded' height={330} />
      </Grid>
    ))}
  </Grid>
);

GrillaCargando.propTypes = {
  cantidad: PropTypes.number,
  columnas: PropTypes.object,
};

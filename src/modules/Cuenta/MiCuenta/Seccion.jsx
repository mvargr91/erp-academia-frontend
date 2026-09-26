// Bloque con título para agrupar campos (misma idea que las secciones de "Únete como proveedor").
import React from 'react';
import PropTypes from 'prop-types';
import { Box, Grid, Typography } from '@mui/material';

const Seccion = ({ titulo, descripcion, children }) => (
  <Box sx={{ mb: 6 }}>
    <Typography variant='h4' sx={{ fontWeight: 600, color: 'text.primary' }}>
      {titulo}
    </Typography>
    {descripcion && (
      <Typography variant='body2' sx={{ color: 'text.secondary', mt: 0.5 }}>
        {descripcion}
      </Typography>
    )}
    <Grid container spacing={4} sx={{ mt: 0.5 }}>
      {children}
    </Grid>
  </Box>
);

Seccion.propTypes = {
  titulo: PropTypes.string.isRequired,
  descripcion: PropTypes.string,
  children: PropTypes.node,
};

// Convierte null/undefined del backend en '' para los inputs controlados de Formik.
export const valoresIniciales = (origen, campos) =>
  Object.fromEntries(campos.map((campo) => [campo, origen?.[campo] ?? '']));

export default Seccion;

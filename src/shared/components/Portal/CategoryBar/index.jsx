// Barra horizontal de categorías (como en el sitio de referencia): lleva a /tours?categoria=slug.
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Chip, Container } from '@mui/material';
import { onGetColeccion } from '@crema/redux/features/portalCategorias/portalCategoriasSlice';
import { RUTAS_PORTAL } from '../../../constants/RutasPortal';

const CategoryBar = ({ activa }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { rows: categorias } = useSelector((state) => state.portalCategorias);

  useEffect(() => {
    if (categorias.length === 0) {
      dispatch(onGetColeccion());
    }
  }, [dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  // Solo categorías raíz en la barra.
  const principales = categorias.filter((c) => !c.categoria_padre_id);
  if (principales.length === 0) return null;

  return (
    <Box sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
      <Container maxWidth='lg'>
        <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', py: 1.5, '&::-webkit-scrollbar': { display: 'none' } }}>
          <Chip
            label='Todas'
            clickable
            color={!activa ? 'primary' : 'default'}
            variant={!activa ? 'filled' : 'outlined'}
            onClick={() => navigate(RUTAS_PORTAL.tours)}
          />
          {principales.map((categoria) => (
            <Chip
              key={categoria.id}
              label={categoria.nombre}
              clickable
              color={activa === categoria.slug ? 'primary' : 'default'}
              variant={activa === categoria.slug ? 'filled' : 'outlined'}
              onClick={() => navigate(`${RUTAS_PORTAL.tours}?categoria=${categoria.slug}`)}
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
};

CategoryBar.propTypes = {
  activa: PropTypes.string,
};

export default CategoryBar;

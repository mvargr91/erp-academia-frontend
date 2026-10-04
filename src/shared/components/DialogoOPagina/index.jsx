// Reemplazo de MUI Dialog para los formularios antiguos (Seguridad): misma API, pero dentro
// de una ruta de formulario (PaginaCrud) se pinta como vista de página en lugar de modal.
import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import { Box, Paper } from '@mui/material';
import { useEnPaginaCrud } from '../PaginaCrud';

const DialogoOPagina = React.forwardRef(function DialogoOPagina(props, ref) {
  const enPagina = useEnPaginaCrud();
  const { children, open, className } = props;

  if (!enPagina) {
    return <Dialog ref={ref} {...props} />;
  }
  if (!open) {
    return null;
  }
  return (
    <Box ref={ref} className={className} sx={{ width: '100%', p: '20px' }}>
      <Paper sx={{ boxShadow: '0px 0px 5px 5px rgb(0 0 0 / 10%)', borderRadius: '4px', overflow: 'hidden' }}>
        {children}
      </Paper>
    </Box>
  );
});

DialogoOPagina.propTypes = {
  children: PropTypes.node,
  open: PropTypes.bool,
  className: PropTypes.string,
};

export default DialogoOPagina;

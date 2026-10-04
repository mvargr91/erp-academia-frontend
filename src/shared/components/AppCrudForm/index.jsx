// Contenedor de formulario para los diálogos CRUD: título fijo arriba, cuerpo con
// scroll y botones Guardar/Cancelar fijos al pie. Dentro de una página (AppCrudDialog
// con `enPagina`) muestra Volver en lugar de cerrar y los botones quedan pegados abajo.
// Cuadrícula de 6 columnas: cada campo ocupa media fila; `campo-completo` la fila
// entera y `campo-tercio` un tercio (en móvil todo va a una columna).
import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, CircularProgress, IconButton, Tooltip, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Form } from 'formik';
import { useAppCrudContext } from '../AppCrudDialog';
import IntlMessages from '@crema/helpers/IntlMessages';
import { Fonts } from '../../constants/AppEnums';

// Título de un grupo de campos dentro del formulario.
export const SeccionForm = ({ titulo }) => (
  <Typography
    className='campo-completo'
    variant='subtitle2'
    sx={{
      mt: 2,
      pb: 1,
      color: 'primary.main',
      fontWeight: Fonts.BOLD,
      textTransform: 'uppercase',
      letterSpacing: '0.04em',
      borderBottom: '1px solid',
      borderBottomColor: 'divider',
    }}
  >
    {titulo}
  </Typography>
);

SeccionForm.propTypes = {
  titulo: PropTypes.string.isRequired,
};

const AppCrudForm = ({ titulo, accion, handleOnClose, saving, children }) => {
  const theme = useTheme();
  const { enPagina } = useAppCrudContext();

  return (
    <Box
      component={Form}
      noValidate
      autoComplete='off'
      sx={{ display: 'flex', flexDirection: 'column', minHeight: 0, flex: '1 1 auto' }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          px: { xs: 5, md: 6 },
          py: 4,
          borderBottom: '1px solid',
          borderBottomColor: 'divider',
        }}
      >
        <Box display='flex' alignItems='center' gap={1}>
          {enPagina && (
            <Tooltip title='Volver'>
              <IconButton onClick={handleOnClose} sx={{ color: 'text.primary' }}>
                <ArrowBackIosIcon />
              </IconButton>
            </Tooltip>
          )}
          <Typography
            component='h2'
            fontSize={enPagina ? 22 : 20}
            fontWeight={enPagina ? Fonts.BOLD : Fonts.MEDIUM}
            sx={{ color: 'text.primary' }}
          >
            {titulo}
          </Typography>
        </Box>
        {!enPagina && (
          <Tooltip title='Cerrar'>
            <IconButton onClick={handleOnClose} sx={{ color: 'text.primary' }}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <Box
        sx={{
          flex: '1 1 auto',
          overflowY: enPagina ? 'visible' : 'auto',
          px: { xs: 5, md: 6 },
          py: 5,
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(6, 1fr)' },
            columnGap: 5,
            rowGap: 4,
            alignItems: 'end',
            '& > *': { gridColumn: { xs: '1 / -1', sm: 'span 3' }, minWidth: 0 },
            '& > .campo-tercio': { gridColumn: { xs: '1 / -1', sm: 'span 2' } },
            '& > .campo-completo': { gridColumn: '1 / -1' },
            '& .MuiInput-root:not(.Mui-error):before': { borderBottomColor: theme.palette.divider },
          }}
        >
          {children}
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '10px',
          px: { xs: 5, md: 6 },
          py: 4,
          borderTop: '1px solid',
          borderTopColor: 'divider',
          // En página los botones siguen visibles al desplazarse por un formulario largo.
          ...(enPagina && {
            position: 'sticky',
            bottom: 0,
            zIndex: 2,
            backgroundColor: 'background.paper',
            borderRadius: '0 0 4px 4px',
          }),
        }}
      >
        <Button
          variant='outlined'
          sx={{
            px: 10,
            color: theme.palette.primary.main,
            borderColor: theme.palette.primary.main,
          }}
          onClick={handleOnClose}
        >
          <IntlMessages id={accion === 'ver' ? 'boton.close' : 'boton.cancel'} />
        </Button>
        {accion !== 'ver' && (
          <Button
            sx={{
              px: 12,
              color: theme.palette.primary.contrastText,
              '&:hover': { backgroundColor: theme.palette.colorHovers, cursor: 'pointer' },
              backgroundColor: theme.palette.primary.main,
            }}
            variant='contained'
            type='submit'
            disabled={saving}
            startIcon={saving ? <CircularProgress size={16} color='inherit' /> : null}
          >
            <IntlMessages id='boton.submit' />
          </Button>
        )}
      </Box>
    </Box>
  );
};

AppCrudForm.propTypes = {
  titulo: PropTypes.string,
  accion: PropTypes.string.isRequired,
  handleOnClose: PropTypes.func.isRequired,
  saving: PropTypes.bool,
  children: PropTypes.node,
};

export default AppCrudForm;

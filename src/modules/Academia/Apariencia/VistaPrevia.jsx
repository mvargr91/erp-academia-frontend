// Miniatura del panel y de la pantalla de ingreso con la apariencia que se está editando.
// Usa su propio tema para no tocar el del ERP hasta que se guarde.
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Paper, Typography } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { construirMenu, construirTema, logoDe } from '../../../shared/apariencia/tema';

const ALINEACION = { izquierda: 'flex-start', centro: 'center', derecha: 'flex-end' };
const MENU = ['Academia', 'Configuración', 'Seguridad'];

const VistaPrevia = ({ apariencia, fondoLogin }) => {
  const tema = useMemo(() => createTheme(construirTema(apariencia, apariencia.modo)), [apariencia]);
  const menu = useMemo(() => construirMenu(apariencia), [apariencia]);
  const logo = logoDe(apariencia, apariencia.modo);

  return (
    <ThemeProvider theme={tema}>
      <Box sx={{ display: 'grid', gap: 3 }}>
        <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden', bgcolor: 'background.default' }}>
          <Box sx={{ height: 4, bgcolor: 'primary.main' }} />
          <Box sx={{ display: 'flex' }}>
            {/* Menú lateral: logo arriba y opciones debajo */}
            <Box sx={{ width: 130, flexShrink: 0, display: 'flex', flexDirection: 'column', bgcolor: menu.sidebarBgColor }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', px: 1.5, py: 1.5, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
                <Box component='img' src={logo} alt='' sx={{ height: 34, maxWidth: 106, objectFit: 'contain' }} />
              </Box>
              <Box sx={{ display: 'grid', gap: 0.5, p: 1 }}>
                {MENU.map((opcion, i) => (
                  <Box
                    key={opcion}
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: 12,
                      color: i === 0 ? menu.sidebarMenuSelectedTextColor : menu.sidebarTextColor,
                      bgcolor: i === 0 ? menu.sidebarMenuSelectedBgColor : 'transparent',
                    }}
                  >
                    {opcion}
                  </Box>
                ))}
              </Box>
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 3, py: 2, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography sx={{ fontSize: 12, fontWeight: 500, color: tema.palette.cuarternario.main }}>Nombre del usuario</Typography>
              </Box>
              <Box sx={{ p: 3 }}>
                <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
                  <Box>
                    <Typography sx={{ fontSize: 14, fontWeight: 600, color: 'text.primary' }}>Alumnos</Typography>
                    <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Texto de ejemplo del contenido.</Typography>
                    <Typography sx={{ fontSize: 12, color: 'primary.main' }}>Enlace de ejemplo</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button size='small' variant='outlined'>Cancelar</Button>
                    <Button size='small' variant='contained'>Guardar</Button>
                  </Box>
                </Paper>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: ALINEACION[apariencia.login_posicion] ?? ALINEACION.izquierda,
            alignItems: 'center',
            minHeight: 220,
            p: 3,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            backgroundImage: `url(${fondoLogin})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <Paper sx={{ width: 170, p: 2.5, textAlign: 'center' }}>
            <Box component='img' src={logo} alt='' sx={{ height: 40, maxWidth: 130, objectFit: 'contain', mb: 1 }} />
            {apariencia.login_titulo && (
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'text.primary', overflowWrap: 'anywhere' }}>{apariencia.login_titulo}</Typography>
            )}
            {apariencia.login_subtitulo && (
              <Typography sx={{ fontSize: 10, color: 'text.secondary', overflowWrap: 'anywhere' }}>{apariencia.login_subtitulo}</Typography>
            )}
            {['Usuario', 'Contraseña'].map((campo) => (
              <Box key={campo} sx={{ mt: 1.5, px: 1, py: 0.5, border: '1px solid', borderColor: 'divider', borderRadius: 1, fontSize: 10, textAlign: 'left', color: 'text.secondary' }}>
                {campo}
              </Box>
            ))}
            <Button size='small' variant='contained' sx={{ mt: 2 }}>Ingresar</Button>
          </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

VistaPrevia.propTypes = {
  apariencia: PropTypes.object.isRequired,
  fondoLogin: PropTypes.string.isRequired,
};

export default VistaPrevia;

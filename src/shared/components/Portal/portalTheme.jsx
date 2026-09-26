// Tema claro del portal público. Se aplica solo dentro de PublicLayout,
// así el panel (tema oscuro de Crema) no se ve afectado.
import { createTheme } from '@mui/material/styles';
import { COLORES_MARCA } from '../../constants/Marca';

const portalTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: COLORES_MARCA.azul, dark: COLORES_MARCA.azulOscuro, contrastText: '#fff' },
    secondary: { main: '#732982' },
    text: { primary: COLORES_MARCA.texto },
    background: { default: '#F7F9FB', paper: '#FFFFFF' },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: "'Be Vietnam', 'Roboto', sans-serif",
    h1: { fontWeight: 700, fontSize: '2.6rem', lineHeight: 1.15 },
    h2: { fontWeight: 700, fontSize: '1.9rem' },
    h3: { fontWeight: 600, fontSize: '1.4rem' },
    h4: { fontWeight: 600, fontSize: '1.15rem' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiButton: { defaultProps: { disableElevation: true } },
    MuiCard: { styleOverrides: { root: { boxShadow: '0 4px 20px rgba(15, 40, 60, 0.08)' } } },
  },
});

export default portalTheme;

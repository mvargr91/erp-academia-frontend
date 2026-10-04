import React from 'react';
import PropTypes from 'prop-types';
import {
  createTheme,
  StyledEngineProvider,
  ThemeProvider,
} from '@mui/material/styles';
// @mui/styles (makeStyles de las pantallas de Seguridad) es v6 y trae su propio contexto de tema:
// no ve el ThemeProvider de @mui/material v5, así que hay que darle el tema aparte.
import { ThemeProvider as StylesThemeProvider } from '@mui/styles';
import GlobalStyles from '@mui/material/GlobalStyles';
import { useThemeContext } from '../AppContextProvider/ThemeContextProvider';
import { defaultTheme } from '../../constants/defaultConfig';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { esES } from '@mui/x-date-pickers/locales';
import 'dayjs/locale/es';

// Calendarios en español (meses, días y botones "Hoy"/"Limpiar").
const textosCalendario = esES.components.MuiLocalizationProvider.defaultProps.localeText;

// Lo que MUI no pinta por su cuenta al cambiar de modo: controles nativos (select, scroll,
// calendario del navegador) y los diálogos de SweetAlert.
const estilosGlobales = (theme) => ({
  ':root': { colorScheme: theme.palette.mode },
  '.swal2-popup': {
    background: theme.palette.background.paper,
    color: theme.palette.text.primary,
  },
});

const AppThemeProvider = (props) => {
  const { theme } = useThemeContext();

  const muiTheme = createTheme(theme || defaultTheme.theme);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={muiTheme}>
        <StylesThemeProvider theme={muiTheme}>
          <GlobalStyles styles={estilosGlobales} />
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='es' localeText={textosCalendario}>
            {props.children}
          </LocalizationProvider>
        </StylesThemeProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

AppThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppThemeProvider;

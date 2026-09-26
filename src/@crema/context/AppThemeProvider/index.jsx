import React from 'react';
import PropTypes from 'prop-types';
import {
  createTheme,
  StyledEngineProvider,
  ThemeProvider,
} from '@mui/material/styles';
import { useThemeContext } from '../AppContextProvider/ThemeContextProvider';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const AppThemeProvider = (props) => {
  const { theme } = useThemeContext();

  const muiTheme = createTheme(theme || defaultTheme.theme);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={muiTheme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {props.children}
        </LocalizationProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

AppThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppThemeProvider;

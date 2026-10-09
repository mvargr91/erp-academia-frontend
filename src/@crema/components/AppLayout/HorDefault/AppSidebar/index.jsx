import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Hidden from '@mui/material/Hidden';
import AppScrollbar from '../../../AppScrollbar';
import MainSidebar from '../../components/MainSidebar';
import Drawer from '@mui/material/Drawer';
import VerticalNav from '../../components/VerticalNav';
import StandardSidebarWrapper from './StandardSidebarWrapper';
import UserInfo from '../../components/UserInfo';
import AppLogo from '../../components/AppLogo';
import { useSidebarContext } from '@crema/context/AppContextProvider/SidebarContextProvider';

// Ancho del menú lateral fijo (el mismo de MainSidebar); MainContent se corre ese espacio.
export const ANCHO_MENU = 280;
// Alto de la cabecera del menú: franja de color (4) + barra superior (70), para alinear con AppHeader.
const ALTO_CABECERA = 74;

// Menú de la aplicación: fijo a la izquierda en pantallas grandes y panel deslizable en las pequeñas.
const AppSidebar = (props) => {
  const { sidebarTextColor } = useSidebarContext();

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor={props.position}
          open={props.isNavCollapsed}
          onClose={props.toggleNavCollapsed}
          classes={{
            root: clsx(props.variant),
            paper: clsx(props.variant),
          }}
          style={{ position: 'absolute' }}
        >
          <StandardSidebarWrapper className='standard-sidebar'>
            <MainSidebar>
              <UserInfo color={sidebarTextColor} />
              <AppScrollbar
                sx={{
                  py: 2,
                  height: 'calc(100vh - 70px) !important',
                }}
                scrollToTop={false}
              >
                <VerticalNav routesConfig={props.routesConfig} />
              </AppScrollbar>
            </MainSidebar>
          </StandardSidebarWrapper>
        </Drawer>
      </Hidden>
      {!props.oculto && (
        <Hidden lgDown>
          <MainSidebar>
            <Box
              sx={{
                height: ALTO_CABECERA,
                backgroundColor: 'background.paper',
                borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                '& .app-logo': { height: ALTO_CABECERA - 4 },
              }}
            >
              <Box sx={{ height: 4, backgroundColor: 'primary.main' }} />
              <AppLogo />
            </Box>
            <AppScrollbar
              sx={{
                pt: 1,
                pb: 6,
                height: `calc(100vh - ${ALTO_CABECERA}px) !important`,
              }}
              scrollToTop={false}
            >
              <VerticalNav routesConfig={props.routesConfig} />
            </AppScrollbar>
          </MainSidebar>
        </Hidden>
      )}
    </>
  );
};
export default AppSidebar;

AppSidebar.defaultProps = {
  variant: '',
  position: 'left',
};

AppSidebar.propTypes = {
  position: PropTypes.string,
  variant: PropTypes.string,
  toggleNavCollapsed: PropTypes.func,
  routesConfig: PropTypes.array,
  isNavCollapsed: PropTypes.bool,
  oculto: PropTypes.bool,
};

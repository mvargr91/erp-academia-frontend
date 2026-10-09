import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import AppContentView from '../../AppContentView';
import AppFixedFooter from './AppFixedFooter';
import AppHeader from './AppHeader';
import AppSidebar, { ANCHO_MENU } from './AppSidebar';
import { useLayoutContext } from '@crema/context/AppContextProvider/LayoutContextProvider';
import AppThemeSetting from '../../AppThemeSetting';
import HorDefaultWrapper from './HorDefaultWrapper';
import MainContent from './MainContent';
import { LayoutType } from '@crema/constants/AppEnums';
import HorDefaultContainer from './HorDefaultContainer';
import { useLocation } from 'react-router-dom';
import PropsTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// Preferencia del usuario: menú lateral oculto en pantallas grandes.
const CLAVE_MENU_OCULTO = 'menu_lateral_oculto';

const HorDefault = ({ routes, routesConfig }) => {
  const { pathname } = useLocation();
  const { footer, layoutType, footerType } = useLayoutContext();
  const [isNavCollapsed, setNavCollapsed] = useState(false);
  const [menuOculto, setMenuOculto] = useState(() => localStorage.getItem(CLAVE_MENU_OCULTO) === '1');
  const pantallaGrande = useMediaQuery(useTheme().breakpoints.up('lg'));

  const toggleNavCollapsed = () => {
    setNavCollapsed(!isNavCollapsed);
  };
  // Botón de menú de la cabecera.
  const alternarMenu = () => {
    if (!pantallaGrande) {
      toggleNavCollapsed();
      return;
    }
    localStorage.setItem(CLAVE_MENU_OCULTO, menuOculto ? '0' : '1');
    setMenuOculto(!menuOculto);
  };
  useEffect(() => {
    if (isNavCollapsed) setNavCollapsed(!isNavCollapsed);
  }, [pathname]);
  // AppMessageView usa esta variable para no quedar debajo del menú lateral fijo.
  useEffect(() => {
    document.documentElement.style.setProperty('--ancho-menu', pantallaGrande && !menuOculto ? `${ANCHO_MENU}px` : '0px');
    return () => document.documentElement.style.removeProperty('--ancho-menu');
  }, [pantallaGrande, menuOculto]);

  return (
    <HorDefaultContainer
      className={clsx({
        boxedLayout: layoutType === LayoutType.BOXED,
        framedLayout: layoutType === LayoutType.FRAMED,
      })}
    >
      <HorDefaultWrapper
        className={clsx('horDefaultWrapper', {
          appMainFooter: footer && footerType === 'fluid',
          appMainFixedFooter: footer && footerType === 'fixed',
        })}
      >
        <AppSidebar
          routesConfig={routesConfig}
          isNavCollapsed={isNavCollapsed}
          oculto={menuOculto}
          toggleNavCollapsed={toggleNavCollapsed}
        />

        <MainContent sinMenu={menuOculto}>
          <AppHeader toggleNavCollapsed={alternarMenu} menuOculto={menuOculto} />
          <AppContentView routes={routes} />
          <AppFixedFooter />
        </MainContent>
        {/* TODO:: ajuste de la aplicación */}
        {/* <AppThemeSetting /> */}
      </HorDefaultWrapper>
    </HorDefaultContainer>
  );
};

export default HorDefault;
HorDefault.propTypes = {
  routes: PropsTypes.object.isRequired,
  routesConfig: PropsTypes.array.isRequired,
};

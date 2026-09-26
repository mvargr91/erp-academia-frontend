import React, { useEffect, useState  } from 'react';
import { useUrlSearchParams } from 'use-url-search-params';
import AppContentView from '@crema/components/AppContentView';
import generateRoutes from '@crema/helpers/RouteGenerator';
import { Layouts } from '@crema/components/AppLayout';
import {
  useLayoutActionsContext,
  useLayoutContext,
} from '@crema/context/AppContextProvider/LayoutContextProvider';
import { useThemeActionsContext } from '@crema/context/AppContextProvider/ThemeContextProvider';
import { ThemeMode } from '@crema/constants/AppEnums';
import {
  anonymousStructure,
  authorizedStructure,
  publicStructure,
} from '../AppRoutes';
import { esRutaPortal } from '../AppRoutes/Portal';
import PublicLayout from '../../../shared/components/Portal/PublicLayout';
import { useLocation, useRoutes } from 'react-router-dom';
import { initialUrl } from '@crema/constants/AppConst';
import { useSelector, useDispatch } from 'react-redux';
import { getAuthUser } from '../../redux/features/auth/authSlice';

const AppLayout = () => {
  const { navStyle } = useLayoutContext();
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
  const { updateNavStyle } = useLayoutActionsContext();
  const { updateTheme, updateThemeMode } = useThemeActionsContext(); // Obtener funciones para actualizar el tema
  const AppLayout = Layouts[navStyle];
  const [params] = useUrlSearchParams();
  const  [url, setUrl] = useState(initialUrl);
  useEffect(() => {
    dispatch(getAuthUser());
  }, [dispatch]);

  const initURL = params?.redirect ? params?.redirect : url;
  const loginUrl = window.location.pathname;
  const generatedRoutes = generateRoutes({
    isAuthenticated: isAuthenticated,
    userRole: user?.role,
    anonymousStructure: anonymousStructure(initURL),
    authorizedStructure: authorizedStructure(loginUrl),
    publicStructure: publicStructure(initURL),
  });

  useEffect(() => {
    setUrl(user?.usuario?.permisos[0]['opciones'][0]['url']);
  }, [user, url]); 

  
  // Aquí debes asegurarte de que `useRoutes` recibe un array con objetos correctos
  const routes = useRoutes(generatedRoutes);
  const { pathname } = useLocation();

  useEffect(() => {
    if (isAuthenticated && !loading) {
      if (params.layout) updateNavStyle(params.layout);

      // Establecer solo el modo DARK para el tema
      updateThemeMode(ThemeMode.DARK);
      updateTheme((prevTheme) => ({
        ...prevTheme,
        // palette: { //TODO:: cambio de color globalmente
        //   ...prevTheme.palette,
        //   mode: ThemeMode.DARK,
        //   background: {
        //     default: '#2B3137',
        //     paper: '#313541',
        //   },
        //   text: {
        //     primary: '#ffffff',
        //     secondary: '#bbbbbb',
        //   },
        // },
      }));
    }
  }, [
    isAuthenticated,
    loading,
    params.layout,
    updateNavStyle,
    updateThemeMode,
    updateTheme,
  ]);

  // Páginas del portal público: layout propio con o sin sesión.
  if (esRutaPortal(pathname)) {
    return <PublicLayout>{routes}</PublicLayout>;
  }

  return (
    <>
      {isAuthenticated ? (
        <AppLayout 
          routes={routes} 
          routesConfig={user?.usuario?.permisos}
       />
      ) : (
        <AppContentView 
          routes={routes} 
        />
      )}
    </>
  );
};

export default AppLayout;

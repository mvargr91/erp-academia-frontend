import React, { useEffect, useState  } from 'react';
import { useUrlSearchParams } from 'use-url-search-params';
import AppContentView from '@crema/components/AppContentView';
import generateRoutes from '@crema/helpers/RouteGenerator';
import { Layouts } from '@crema/components/AppLayout';
import {
  useLayoutActionsContext,
  useLayoutContext,
} from '@crema/context/AppContextProvider/LayoutContextProvider';
import {
  anonymousStructure,
  authorizedStructure,
  publicStructure,
} from '../AppRoutes';
import { useRoutes } from 'react-router-dom';
import AvisoSuscripcion from '../../../shared/components/AvisoSuscripcion';
import { initialUrl } from '@crema/constants/AppConst';
import { useSelector, useDispatch } from 'react-redux';
import { getAuthUser } from '../../redux/features/auth/authSlice';

const AppLayout = () => {
  const { navStyle } = useLayoutContext();
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
  const { updateNavStyle } = useLayoutActionsContext();
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

  // Colores y modo claro/oscuro los maneja AparienciaProvider (shared/apariencia).
  useEffect(() => {
    if (isAuthenticated && !loading && params.layout) updateNavStyle(params.layout);
  }, [isAuthenticated, loading, params.layout, updateNavStyle]);

  return (
    <>
      {isAuthenticated ? (
        <AppLayout
          routes={
            <>
              <AvisoSuscripcion />
              {routes}
            </>
          }
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

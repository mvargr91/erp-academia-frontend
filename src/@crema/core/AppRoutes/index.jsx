// import React from 'react';
import { Navigate } from 'react-router-dom';

import { authRouteConfig } from './AuthRoutes';
import Error403 from '../../../modules/errorPages/Error403';
import { errorPagesConfigs } from './ErrorPagesRoutes';
import { accountPagesConfigs } from './AccountRoutes';
import { seguridadConfigs } from './Seguridad';
import { portalRoutes, cuentaConfigs } from './Portal';
import { academiaConfigs } from './Academia';

export const authorizedStructure = (loginUrl) => {
  return {
    fallbackPath: loginUrl,
    unAuthorizedComponent: <Error403 />,
    routes: [
      ...accountPagesConfigs,
      ...seguridadConfigs,
      ...academiaConfigs,
      ...cuentaConfigs,
    ],
  };
};

export const publicStructure = (initialUrl) => {
  return {
    fallbackPath: initialUrl,
    routes: authRouteConfig,
  };
};

export const anonymousStructure = (initialUrl) => {
  return {
    // Con el portal habilitado, '/' y sus páginas son públicas; si no, '/' lleva al panel como antes.
    routes: errorPagesConfigs.concat(portalRoutes, [
      ...(portalRoutes.length ? [] : [{ path: '/', element: <Navigate to={initialUrl} /> }]),
      {
        path: '*',
        element: <Navigate to='/error-pages/error-404' />,
      },
    ]),
  };
};

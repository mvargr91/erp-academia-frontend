import React from 'react';
import { Navigate } from 'react-router-dom';
import { RoutePermittedRole } from '@crema/constants/AppEnums';
import { RUTA_MI_CUENTA } from '../../../shared/constants/RutasPortal';

// La pantalla de la plantilla (modules/account/MyProfile) guardaba por el API de administración de usuarios;
// "Mi cuenta" (modules/Cuenta/MiCuenta) la reemplaza para todos los roles.
export const accountPagesConfigs = [
  {
    permittedRole: RoutePermittedRole.User,
    path: '/my-profile',
    element: <Navigate to={RUTA_MI_CUENTA} replace />,
  },
];

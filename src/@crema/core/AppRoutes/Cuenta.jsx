import React from 'react';
import { RoutePermittedRole } from '@crema/constants/AppEnums';
import { RUTA_MI_CUENTA } from '../../../shared/constants/RutasCuenta';

const MiCuenta = React.lazy(() => import('../../../modules/Cuenta/MiCuenta'));

// /mi-cuenta no depende de permisos: todo usuario con sesión puede ver y editar sus propios datos.
export const cuentaConfigs = [
  {
    permittedRole: RoutePermittedRole.User,
    path: RUTA_MI_CUENTA,
    element: <MiCuenta />,
  },
];

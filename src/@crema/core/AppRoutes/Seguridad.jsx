import React from 'react';
import { authRole } from '@crema/constants/AppConst';
import { RoutePermittedRole } from '@crema/constants/AppEnums';

const Aplicacion = React.lazy(() => import('../../../modules/Seguridad/Aplicacion'));
const Rol = React.lazy(() => import('../../../modules/Seguridad/Rol'));
const ConsultaAuditoria = React.lazy(() => import('../../../modules/Seguridad/ConsultaAuditoria'));
const Modulo = React.lazy(() => import('../../../modules/Seguridad/Modulo'));
const OpcionSistema = React.lazy(() => import('../../../modules/Seguridad/OpcionSistema'));
const Permiso = React.lazy(() => import('../../../modules/Seguridad/Permiso'));
const Permissions = React.lazy(() => import('../../../modules/Seguridad/Permissions'));
const Usuario = React.lazy(() => import('../../../modules/Seguridad/Usuario'));
const BackUpSistema = React.lazy(() => import('../../../modules/Seguridad/BackUpSistema'));

export const seguridadConfigs = [
  {
    permittedRole: RoutePermittedRole.User,
    path: '/aplicaciones',
    element: <Aplicacion route={{auth: authRole, path: '/aplicaciones'}} />,
  },
  {
    exact: true,
    permittedRole: RoutePermittedRole.User,
    path: '/roles',
    element: <Rol route={{auth: authRole, path: '/roles'}}/>,
  },
  {
    exact: true,
    permittedRole: RoutePermittedRole.User,
    path: '/modulos',
    element: <Modulo  route={{auth: authRole, path: '/modulos'}}/>,
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: '/opciones-del-sistema',
    element: <OpcionSistema route={{auth: authRole, path: '/opciones-del-sistema'}}/>,
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: '/permisos',
    element: <Permiso route={{auth: authRole, path: '/permisos'}}/>,
  },
  {
    permittedRole: RoutePermittedRole.User,
    exact: true,
    path: ['/roles/permisos/:rol_id'],
    element: <Permissions route={{auth: authRole, path: ['/roles/permisos']}}/>,
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: '/auditoria-tablas',
    element: <ConsultaAuditoria  route={{auth: authRole, path: '/auditoria-tablas'}}/>,
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: '/usuarios',
    element: <Usuario route={{auth: authRole, path: '/usuarios'}}/>,
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: '/backup-sistema-inversiones',
    element: <BackUpSistema  route={{auth: authRole, path: '/backup-sistema-inversiones'}}/>,
  },
];

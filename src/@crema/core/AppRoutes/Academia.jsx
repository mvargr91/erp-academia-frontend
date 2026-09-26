import React from 'react';
import { authRole } from '@crema/constants/AppConst';
import { RoutePermittedRole } from '@crema/constants/AppEnums';

const DashboardAcademia = React.lazy(() => import('../../../modules/Academia/DashboardAcademia'));
const Ritmos = React.lazy(() => import('../../../modules/Academia/Ritmos'));
const Planes = React.lazy(() => import('../../../modules/Academia/Planes'));
const Profesores = React.lazy(() => import('../../../modules/Academia/Profesores'));
const Alumnos = React.lazy(() => import('../../../modules/Academia/Alumnos'));
const Cursos = React.lazy(() => import('../../../modules/Academia/Cursos'));
const Pagos = React.lazy(() => import('../../../modules/Academia/Pagos'));
const Asistencias = React.lazy(() => import('../../../modules/Academia/Asistencias'));

export const academiaConfigs = [
  {
    permittedRole: RoutePermittedRole.User,
    path: '/dashboard-academia',
    element: <DashboardAcademia route={{ auth: authRole, path: '/dashboard-academia' }} />,
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: '/ritmos',
    element: <Ritmos route={{ auth: authRole, path: '/ritmos' }} />,
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: '/planes',
    element: <Planes route={{ auth: authRole, path: '/planes' }} />,
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: '/profesores',
    element: <Profesores route={{ auth: authRole, path: '/profesores' }} />,
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: '/alumnos',
    element: <Alumnos route={{ auth: authRole, path: '/alumnos' }} />,
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: '/cursos',
    element: <Cursos route={{ auth: authRole, path: '/cursos' }} />,
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: '/pagos',
    element: <Pagos route={{ auth: authRole, path: '/pagos' }} />,
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: '/asistencias',
    element: <Asistencias route={{ auth: authRole, path: '/asistencias' }} />,
  },
];

import React from 'react';
import { authRole } from '@crema/constants/AppConst';
import { RoutePermittedRole } from '@crema/constants/AppEnums';

const Metrics = React.lazy(() => import('../../../modules/dashboards/Metrics'));


export const homeConfigs = [
  {
    permittedRole: RoutePermittedRole.User,
    path: '/home',
    element: <Metrics route={{auth: authRole, path: '/home'}} />,
  },
];

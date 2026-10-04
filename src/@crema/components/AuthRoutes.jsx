import React, { useEffect, useRef, useState  } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';
import { initialUrl } from '@crema/constants/AppConst';
import { useAuthUser } from '../hooks/AuthHooks';
import AppLoader from './AppLoader';

const AuthRoutes = ({ children }) => {
  const { isLoading, user } = useAuthUser();
  const  [url, setUrl] = useState(initialUrl);
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const hasRedirected = useRef(false); // Evita múltiples redirecciones

  const publicRoutes = [
    '/signin',
    '/signup',
    '/forget-password',
    /^\/reset-password\/[^/]+$/ // Expresión regular para '/reset-password/:token'
  ];

  useEffect(() => {
    if (!isLoading && !hasRedirected.current) {
      hasRedirected.current = true; // Evita ejecuciones múltiples

      const isPublicRoute = publicRoutes.some((route) => {
        return typeof route === 'string'
          ? route === pathname
          : route.test(pathname);
      });
      setUrl(user?.usuario?.permisos[0]['opciones'][0]['url']);

      if (!user && !isPublicRoute) {
        navigate('/signin', { replace: true });
      } else if (user && isPublicRoute) {
         navigate(url, { replace: true });
      }
    }
  }, [isLoading, user, pathname, navigate, url]);

  if (isLoading) {
    return <AppLoader />;
  }

  return <>{children}</>;
};

export default AuthRoutes;

AuthRoutes.propTypes = {
  children: PropTypes.node.isRequired,
};

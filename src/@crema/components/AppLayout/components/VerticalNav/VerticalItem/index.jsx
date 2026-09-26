import React, { useEffect, useMemo } from 'react';
import { Icon, ListItemText } from '@mui/material';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import IntlMessages from '@crema/helpers/IntlMessages';
import { checkPermission } from '@crema/helpers/RouteHelper';
import VerticalNavItem from './VerticalNavItem';
import { allowMultiLanguage } from '@crema/constants/AppConst';
import { useLocation } from 'react-router-dom';
import AppBadge from '../../../../AppBadge';
import AppNavLink from '../../../../AppNavLink';

const VerticalItem = ({item, level}) => {
  const { pathname } = useLocation();
  useEffect(() => {
    if (pathname === item.url && document.getElementById(pathname)) {
      setTimeout(() => {
        document
          .getElementById(pathname)
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 1);
    }
  }, [pathname, item.url]);

  // if (!hasPermission) {
  //   return null;
  // }

  return (
    <VerticalNavItem
      level={item.posicion}
      button
      id={item.url}
      component={AppNavLink}
      to={item.url}
      activeClassName='active'
      exact={item.exact}
    >
      {item.icono_menu && (
        <Box component='span'>
          <Icon
            sx={{
              fontSize: 18,
              display: 'block',
              mr: 4,
            }}
            className={clsx('nav-item-icon', 'material-icons-outlined')}
            color='action'
          >
            {item.icono_menu}
          </Icon>
        </Box>
      )}
      <ListItemText
        className='nav-item-content'
        primary={item.nombre }
        classes={{ primary: 'nav-item-text' }}
      />
      {item.count && (
        <Box sx={{ mr: 3.5 }} className='menu-badge'>
          <AppBadge count={item.count} color={item.color} />
        </Box>
      )}
    </VerticalNavItem>
  );
};

VerticalItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    icono_menu: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    exact: PropTypes.bool,
    count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    url: PropTypes.string,
    color: PropTypes.string,
  }),
  level: PropTypes.number,
};

VerticalItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired, // Asegúrate de que sea string
    // otras propiedades
  }),
  level: PropTypes.number,
};

export default React.memo(VerticalItem);

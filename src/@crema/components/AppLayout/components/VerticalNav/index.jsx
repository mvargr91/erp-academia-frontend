import React from 'react';
import { List, ListItem, ListItemText, Icon } from '@mui/material';
import { NavLink } from 'react-router-dom';
import VerticalCollapse from './VerticalCollapse';
import VerticalItem from './VerticalItem';
import clsx from 'clsx';

const VerticalNav = ({ routesConfig }) => {
  return (
    <List
      sx={{
        position: 'relative',
        padding: 0,
      }}
      component='div'
    >
      {/* TODO:: ICONO DE INICIO EN EL MENU */}
      {/* <ListItem
        component={NavLink}
        to="/home"
        sx={{
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none',
          color: 'inherit',
          // padding: '8px 20px',
          '&.active': {
            color: 'white',
            backgroundColor: 'action.selected',
          },
        }}
      >
        <Icon sx={{ mr: 4 }}
              color='action'
              className={clsx('nav-item-icon')}
        >home</Icon>
        <ListItemText sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontSize: 14,
          }}
          className='nav-item-content'
          classes={{ primary: clsx('nav-item-text') }} 
          primary="Inicio" />
      </ListItem> */}

      {routesConfig?.map((item) => (
        <React.Fragment key={item.icono_menu}>
          {item.type === 'collapse' && (
            <VerticalCollapse
              item={{ ...item, id: String(item.id) }}
              level={item.posicion}
            />
          )}
          {item.type === 'item' && (
            <VerticalItem
              item={{ ...item, id: String(item.id) }}
              level={item.posicion}
            />
          )}
        </React.Fragment>
      ))}
    </List>
  );
};

export default VerticalNav;

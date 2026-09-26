/* eslint-disable react/prop-types */
import React from 'react';
import HorizontalGroup from './HorizontalGroup';
import HorizontalCollapse from './HorizontalCollapse';
import HorizontalItem from './HorizontalItem';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import PropTypes from 'prop-types';

const HorizontalNav = ({ routesConfig }) => {
  return (
    <List 
      sx={{
        position: 'relative',
        padding: 0,
      }}    
      
      className='navbarNav'
    >
      {routesConfig?.map((item) => (
        <React.Fragment key={item.icono_menu}>

          {item.type === 'collapse' && (
            <HorizontalCollapse
              item={{ ...item, id: String(item.id) }}
              level={item.posicion}
            />
          )}

          {item.type === 'item' && (
            <HorizontalItem
              item={{ ...item, id: String(item.id) }}
              level={item.posicion}
            />
          )}
        </React.Fragment>
      ))}
    </List>
  );
};

export default HorizontalNav;
HorizontalNav.propsTypes = {
  routesConfig: PropTypes.array.isRequired,
};

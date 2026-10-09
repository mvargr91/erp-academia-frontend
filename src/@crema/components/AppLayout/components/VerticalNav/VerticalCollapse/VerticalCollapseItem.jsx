import React from 'react';
import PropsTypes from 'prop-types';
import ListItem from '@mui/material/ListItem';
import { Fonts } from '@crema/constants/AppEnums';
import { alpha } from '@mui/material';

const VerticalCollapseItem = ({ children, sidebarTextColor, ...rest }) => {
  return (
    <ListItem
      sx={{
        // Cada módulo es el título de una sección: letra pequeña en mayúsculas y aire arriba
        // para separar los grupos; sus opciones van debajo como botones.
        minHeight: 36,
        height: 'auto',
        py: 1,
        mt: 2,
        mb: 0.5,
        mx: 3,
        width: 'calc(100% - 24px)',
        pl: 3,
        pr: 1,
        borderRadius: '10px',
        cursor: 'pointer',
        whiteSpace: 'normal',
        transition: 'background-color 0.2s ease',
        '& > span': { flexShrink: 0 },
        '& .nav-item-text': {
          lineHeight: 1.3,
          overflowWrap: 'anywhere',
          fontWeight: Fonts.SEMI_BOLD,
          fontSize: 12,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: alpha(sidebarTextColor, 0.6),
        },

        '& .nav-item-icon': {
          color: alpha(sidebarTextColor, 0.6),
          fontSize: 18,
          display: 'block',
        },

        '& .nav-item-icon-arrow': {
          color: alpha(sidebarTextColor, 0.6),
          fontSize: 20,
          transition: 'transform 0.25s ease',
          transform: 'rotate(-90deg)',
        },
        '&.open .nav-item-icon-arrow': {
          transform: 'rotate(0deg)',
        },

        '& .MuiIconButton-root': {
          mr: 0,
          padding: 0,
        },

        '& .MuiTouchRipple-root': {
          zIndex: 10,
        },

        '&.open, &:hover, &:focus': {
          '& .nav-item-text': {
            fontWeight: Fonts.MEDIUM,
            color: sidebarTextColor,
          },

          '& .nav-item-icon': {
            color: sidebarTextColor,
          },

          '& .nav-item-icon-arrow': {
            color: sidebarTextColor,
          },
        },
        '&:hover': {
          backgroundColor: alpha(sidebarTextColor, 0.06),
        },
      }}
      {...rest}
    >
      {children}
    </ListItem>
  );
};

export default VerticalCollapseItem;

VerticalCollapseItem.propTypes = {
  children: PropsTypes.node,
  sidebarTextColor: PropsTypes.string,
};

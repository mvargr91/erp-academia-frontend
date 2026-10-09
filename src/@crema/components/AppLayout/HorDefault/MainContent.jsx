import React from 'react';
import { Box } from '@mui/material';
import PropsTypes from 'prop-types';
import { ANCHO_MENU } from './AppSidebar';

const MainContent = ({ children, sinMenu, ...rest }) => {
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        left: { xs: 0, lg: sinMenu ? 0 : ANCHO_MENU },
        width: { xs: '100%', lg: sinMenu ? '100%' : `calc(100% - ${ANCHO_MENU}px)` },
        flexDirection: 'column',
        position: 'absolute',
        transition: 'all 0.5s ease',
        '& .app-content, & .footerContainer': {
          px: 5,
          width: '100%',
          maxWidth: { lg: 1340, xl: 1420 },
          mx: 'auto',
        },
      }}
      className='mainContent'
      {...rest}
    >
      {children}
    </Box>
  );
};

export default MainContent;

MainContent.propTypes = {
  children: PropsTypes.node,
  sinMenu: PropsTypes.bool,
};

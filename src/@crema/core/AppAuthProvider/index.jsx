import React from 'react';
import JWTAuthProvider from '@crema/services/auth/jwt-auth/JWTAuthProvider';
import PropTypes from 'prop-types';

const AppAuthProvider = ({ children }) => {
  return <JWTAuthProvider>{children}</JWTAuthProvider>;
};

AppAuthProvider.propTypes = {
  children: PropTypes.node,
};
export default AppAuthProvider;

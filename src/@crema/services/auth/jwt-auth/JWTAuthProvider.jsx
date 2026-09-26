import React, { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import jwtAxios, { setAuthToken } from './index';
import { useInfoViewActionsContext } from '../../../context/AppContextProvider/InfoViewContextProvider';
import {getUserFromJwtAuth} from '@crema/helpers/AuthHelper';

const JWTAuthContext = createContext();
const JWTAuthActionsContext = createContext();

export const useJWTAuth = () => useContext(JWTAuthContext);

export const useJWTAuthActions = () => useContext(JWTAuthActionsContext);

const JWTAuthAuthProvider = ({ children }) => {
  const { fetchStart, fetchSuccess, fetchError } = useInfoViewActionsContext();
  const [authData, setJWTAuthData] = useState({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const getAuthUser = () => {
      fetchStart();
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      if (!token) {
        fetchSuccess();
        setJWTAuthData({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
        return;
      }
      setAuthToken(token);
      setJWTAuthData({
        user: JSON.parse(storedUser),
        isAuthenticated: true,
        isLoading: false,
      });
      jwtAxios
        .get('/users/current/session')
        .then(({ data }) => {
          fetchSuccess();
          setJWTAuthData({
            user: data,
            isLoading: false,
            isAuthenticated: true,
          });
        })
        .catch(() => {
          setJWTAuthData({
            user: undefined,
            isLoading: false,
            isAuthenticated: false,
          });
          fetchSuccess();
        });
      
    };

    getAuthUser();
  }, []);

  const signInUser = async ({ username, password }) => {
    fetchStart();
    try {
      const { data } = await jwtAxios.post('/users/token', { username, password });
      console.log(data)
      localStorage.setItem('token', data.access_token);
      setAuthToken(data.access_token);
  
      // Obtener los datos del usuario autenticado
      const res = await jwtAxios.get('/users/current/session');
      // console.log(res.data.usuario)
      const userData = getUserFromJwtAuth(res.data)
      // Guardar los datos del usuario en localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      // Guardar los datos del usuario en el estado y en localStorage
      setJWTAuthData({
        user: userData,
        isAuthenticated: true,
        isLoading: false,
      });
      fetchSuccess();
    } catch (error) {
      setJWTAuthData({
        ...authData,
        isAuthenticated: false,
        isLoading: false,
      });
      fetchError(error?.response?.data?.messages?.[0] || 'Something went wrong');
    }
  };
  

  const signUpUser = async ({ name, email, password }) => {
    fetchStart();
    try {
      const { data } = await jwtAxios.post('users', { name, email, password });
      localStorage.setItem('token', data.token);
      setAuthToken(data.token);
      const res = await jwtAxios.get('/auth');
      setJWTAuthData({
        user: res.data,
        isAuthenticated: true,
        isLoading: false,
      });
      fetchSuccess();
    } catch (error) {
      setJWTAuthData({
        ...authData,
        isAuthenticated: false,
        isLoading: false,
      });
      console.log('error:', error.response.data.error);
      fetchError(error?.response?.data?.messages?.[0]|| 'Something went wrong');
    }
  };

  const logout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthToken();
    setJWTAuthData({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
  };

  return (
    <JWTAuthContext.Provider
      value={{
        ...authData,
        signInUser
      }}
    >
      <JWTAuthActionsContext.Provider
        value={{
          signUpUser,
          signInUser,
          logout,
        }}
      >
        {children}
      </JWTAuthActionsContext.Provider>
    </JWTAuthContext.Provider>
  );
};
export default JWTAuthAuthProvider;

JWTAuthAuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
  fetchStart: PropTypes.func,
  fetchSuccess: PropTypes.func,
  fetchError: PropTypes.func,
};

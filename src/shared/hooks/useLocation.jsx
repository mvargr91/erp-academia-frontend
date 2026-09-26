import { useState } from 'react';

export const useLocation = () => {
  const [state, setState] = useState({
    latitude: 0,
    longitude: 0,
  });

  const success = (position) => {
    const { latitude, longitude } = position.coords;
    setState({
      latitude,
      longitude,
    });
  };

  const error = (e) => {
    console.log(e);
  };

  const options = {
    enableHighAccuracy: true,
  };

  const getLocation = () => {
    navigator.geolocation.watchPosition(success, error, options);
  };

  return { ...state, getLocation };
};

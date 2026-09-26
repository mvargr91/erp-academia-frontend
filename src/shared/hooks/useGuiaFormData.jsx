import { useEffect, useState, useCallback } from 'react';
import jwtAxios from '@crema/services/auth/jwt-auth';

const initialState = {
  loading: true,
  serviviosPorTipo: [],
  cliente: [],
  parametros: [],
  tarifas: [],
  clientes: [],
  sectores: [],
  ciudades: [],
  barrios: [],
  destinatarios: [],
};

export const useGuiaFormData = ({ tipo, cliente }) => {
  const [state, setState] = useState(initialState);

  const getGuiaFormData = useCallback(async (tipo, cliente) => {
    const destinatariosPromise = jwtAxios.get('clientes-destinatarios/' + Number(cliente));
    const clientesPromise = jwtAxios.get('clientes', { params: { ligera: true } });
    const clientePromise = jwtAxios.get('clientes/' + Number(cliente));
    const parametrosPromise = jwtAxios.get('parametros-constantes');
    const tarifasPromise = jwtAxios.get('tarifas', { params: { ligera: true } });
    const serviviosPorTipoPromise = jwtAxios.get('tipos-servicios/tipo/' + tipo);

    try {
      const [
        destinatariosResp,
        clientesResp,
        parametrosResp,
        tarifasResp,
        clienteResp,
        serviviosPorTipoResp,
      ] = await Promise.all([
        destinatariosPromise,
        clientesPromise,
        parametrosPromise,
        tarifasPromise,
        clientePromise,
        serviviosPorTipoPromise,
      ]);

      setState({
        loading: false,
        serviviosPorTipo: serviviosPorTipoResp.data,
        cliente: clienteResp.data,
        parametros: parametrosResp.data,
        tarifas: tarifasResp.data,
        clientes: clientesResp.data,
        destinatarios: destinatariosResp.data,
      });
    } catch (error) {
      console.error('Error fetching guia form data:', error);
      // Handle error appropriately, e.g., set an error state
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      getGuiaFormData(tipo, cliente);
    }

    return () => {
      isMounted = false;
    };
  }, [tipo, cliente, getGuiaFormData]);

  return { ...state };
};

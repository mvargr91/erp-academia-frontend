// Apariencia de la academia (colores, logos, login) y modo claro/oscuro del usuario.
// Pide la apariencia al API al cargar (endpoint público: el login ya sale con la marca)
// y mantiene sincronizados el tema de MUI y los colores de la barra de menú.
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useThemeActionsContext } from '@crema/context/AppContextProvider/ThemeContextProvider';
import { useSidebarActionsContext } from '@crema/context/AppContextProvider/SidebarContextProvider';
import { ThemeMode } from '@crema/constants/AppEnums';
import jwtAxios from '@crema/services/auth/jwt-auth';
import {
  ICONO_DEFECTO,
  MODO_CLARO,
  MODO_OSCURO,
  construirMenu,
  construirTema,
  guardarApariencia,
  guardarModo,
  leerAparienciaGuardada,
  leerModoGuardado,
  logoDe,
  normalizarApariencia,
} from './tema';

const AparienciaContext = createContext({
  apariencia: normalizarApariencia(),
  modo: MODO_CLARO,
  logo: logoDe(normalizarApariencia(), MODO_CLARO),
  alternarModo: () => {},
  aplicarApariencia: () => {},
});

export const useApariencia = () => useContext(AparienciaContext);

const AparienciaProvider = ({ children }) => {
  const { updateTheme, updateThemeMode } = useThemeActionsContext();
  const { updateSidebarColorSet } = useSidebarActionsContext();
  const [apariencia, setApariencia] = useState(leerAparienciaGuardada);
  const [modoUsuario, setModoUsuario] = useState(leerModoGuardado);
  const modo = modoUsuario ?? apariencia.modo;

  const aplicarApariencia = useCallback((datos) => {
    const nueva = normalizarApariencia(datos);
    guardarApariencia(nueva);
    setApariencia(nueva);
  }, []);

  useEffect(() => {
    let vigente = true;
    jwtAxios
      .get('apariencia')
      .then(({ data }) => vigente && aplicarApariencia(data))
      .catch(() => {
        // Sin conexión o academia suspendida: se queda con lo guardado o con los valores por defecto.
      });
    return () => {
      vigente = false;
    };
  }, [aplicarApariencia]);

  useEffect(() => {
    updateTheme(construirTema(apariencia, modo));
    updateThemeMode(modo === MODO_OSCURO ? ThemeMode.DARK : ThemeMode.LIGHT);
    updateSidebarColorSet(construirMenu(apariencia));
  }, [apariencia, modo, updateTheme, updateThemeMode, updateSidebarColorSet]);

  useEffect(() => {
    if (apariencia.nombre) document.title = apariencia.nombre;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', apariencia.color_menu);
  }, [apariencia.nombre, apariencia.color_menu]);

  // Ícono de la pestaña: el de la academia, si no su logo, si no el del ERP. (En producción el servidor
  // ya entrega la página con él; esto lo actualiza en desarrollo y apenas se guarda en Apariencia.)
  useEffect(() => {
    const icono = apariencia.icono_url || apariencia.logo_url || ICONO_DEFECTO;
    document.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"]').forEach((link) => {
      link.setAttribute('href', icono);
      link.removeAttribute('type');
      link.removeAttribute('sizes');
    });
  }, [apariencia.icono_url, apariencia.logo_url]);

  const alternarModo = useCallback(() => {
    const nuevo = modo === MODO_OSCURO ? MODO_CLARO : MODO_OSCURO;
    guardarModo(nuevo);
    setModoUsuario(nuevo);
  }, [modo]);

  const valor = useMemo(
    () => ({ apariencia, modo, logo: logoDe(apariencia, modo), alternarModo, aplicarApariencia }),
    [apariencia, modo, alternarModo, aplicarApariencia],
  );

  return <AparienciaContext.Provider value={valor}>{children}</AparienciaContext.Provider>;
};

AparienciaProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AparienciaProvider;

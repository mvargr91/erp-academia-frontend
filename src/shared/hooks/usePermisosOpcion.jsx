import { useMemo } from 'react';
import { useSelector } from 'react-redux';

/**
 * Busca la opción del sistema cuyo url coincide con `path` dentro de los permisos
 * del usuario autenticado y devuelve su título, url de ayuda y permisos concedidos.
 * Misma lógica que usan los módulos existentes (Banco, Proveedor...).
 */
export const usePermisosOpcion = (path) => {
  const { user } = useSelector(({ auth }) => auth);

  return useMemo(() => {
    const resultado = { titulo: '', urlAyuda: '', permisos: [], cargado: false };
    if (!user?.usuario?.permisos) {
      return resultado;
    }
    resultado.cargado = true;
    user.usuario.permisos.forEach((modulo) => {
      modulo.opciones.forEach((opcion) => {
        if (opcion.url === path) {
          resultado.titulo = opcion.nombre;
          resultado.urlAyuda = opcion.url_ayuda ?? '';
          resultado.permisos = opcion.permisos
            .filter((permiso) => permiso.permitido)
            .map((permiso) => permiso.titulo);
        }
      });
    });
    return resultado;
  }, [user, path]);
};

export default usePermisosOpcion;

import { useCallback, useState } from 'react';

/**
 * Estado de pantalla común a los módulos CRUD: qué formulario está abierto
 * (crear/editar/ver + registro) y la clave para recargar la tabla.
 */
export const useCrudModulo = () => {
  const [formulario, setFormulario] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const abrirCrear = useCallback(() => setFormulario({ accion: 'crear', id: null, row: null }), []);
  const abrirEditar = useCallback((row) => setFormulario({ accion: 'editar', id: row.id, row }), []);
  const abrirVer = useCallback((row) => setFormulario({ accion: 'ver', id: row.id, row }), []);
  const cerrar = useCallback(() => setFormulario(null), []);
  const updateColeccion = useCallback(() => setRefreshKey((key) => key + 1), []);

  return { formulario, abrirCrear, abrirEditar, abrirVer, cerrar, refreshKey, updateColeccion };
};

export default useCrudModulo;

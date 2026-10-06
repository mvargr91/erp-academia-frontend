// Formularios CRUD como vista propia (no modal). Cada módulo tiene:
//   /recurso            lista
//   /recurso/crear      formulario nuevo
//   /recurso/:id/editar formulario de edición
//   /recurso/:id/ver    formulario de solo lectura
// PaginaCrud lee el id de la URL y avisa (por contexto) a AppCrudDialog que se pinte como página;
// "Volver", "Cancelar" y el guardado regresan a la lista.
import React, { createContext, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { authRole } from '@crema/constants/AppConst';
import { RoutePermittedRole } from '@crema/constants/AppEnums';
import AppMessageView from '@crema/components/AppMessageView';
import { hideMessage } from '@crema/redux/features/cammon/commonSlice';
import usePermisosOpcion from '../../hooks/usePermisosOpcion';
import { ERROR_TYPE } from '../../constants/Constantes';

const PaginaCrudContext = createContext(false);
export const useEnPaginaCrud = () => useContext(PaginaCrudContext);

export const rutaCrear = (base) => `${base}/crear`;
export const rutaEditar = (base, id) => `${base}/${id}/editar`;
export const rutaVer = (base, id) => `${base}/${id}/ver`;

/**
 * Props para AppCrudTable: navegar a la vista del formulario en lugar de abrir un modal.
 * Uso: <AppCrudTable {...accionesEnPagina(navigate, '/alumnos')} ... />
 */
export const accionesEnPagina = (navigate, base, { crear = true, editar = true, ver = true } = {}) => ({
  ...(crear && { onCrear: () => navigate(rutaCrear(base)) }),
  ...(editar && { onEditar: (row) => navigate(rutaEditar(base, row.id)) }),
  ...(ver && { onVer: (row) => navigate(rutaVer(base, row.id)) }),
});

const PaginaCrud = ({ base, accion, render }) => {
  const { id } = useParams();
  const [query] = useSearchParams();
  const navigate = useNavigate();
  const { titulo } = usePermisosOpcion(base);
  const dispatch = useDispatch();
  const store = useStore();
  const { message, messageType } = useSelector(({ common }) => common);

  // Un error que quedó pendiente no debe reaparecer en la lista al salir del formulario
  // (el mensaje de guardado exitoso sí se deja: lo muestra la lista).
  useEffect(
    () => () => {
      if (store.getState().common.messageType === ERROR_TYPE) {
        dispatch(hideMessage());
      }
    },
    [dispatch, store],
  );

  // ?volver=/ruta permite regresar a otra pantalla (solo rutas internas).
  const destino = query.get('volver');
  const volver = () => navigate(destino && destino.startsWith('/') && !destino.startsWith('//') ? destino : base);

  return (
    <PaginaCrudContext.Provider value>
      {render({ id: accion === 'crear' ? 0 : id, accion, volver, titulo, query })}
      {/* Los errores al guardar se muestran aquí: la tabla de la lista no está montada. */}
      <AppMessageView variant='error' message={messageType === ERROR_TYPE ? message : ''} />
    </PaginaCrudContext.Provider>
  );
};

PaginaCrud.propTypes = {
  base: PropTypes.string.isRequired,
  accion: PropTypes.oneOf(['crear', 'editar', 'ver']).isRequired,
  // ({ id, accion, volver, titulo, query }) => <XCreador ... />
  render: PropTypes.func.isRequired,
};

/**
 * Rutas de un módulo: lista + crear / editar / ver como vistas propias.
 * `acciones` limita las vistas (p. ej. ['crear', 'ver'] si el recurso no se edita).
 */
export const rutasCrud = (base, Lista, render, acciones = ['crear', 'editar', 'ver']) => [
  {
    permittedRole: RoutePermittedRole.User,
    path: base,
    element: <Lista route={{ auth: authRole, path: base }} />,
  },
  ...acciones.map((accion) => ({
    permittedRole: RoutePermittedRole.User,
    path: accion === 'crear' ? rutaCrear(base) : `${base}/:id/${accion}`,
    element: <PaginaCrud base={base} accion={accion} render={render} />,
  })),
];

export default PaginaCrud;

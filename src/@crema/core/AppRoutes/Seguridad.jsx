import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { authRole } from '@crema/constants/AppConst';
import { RoutePermittedRole } from '@crema/constants/AppEnums';
import PaginaCrud, { rutasCrud } from '../../../shared/components/PaginaCrud';
import { onGetColeccionLigera as onGetAplicaciones } from '../../redux/features/aplicacion/aplicacionSlice';
import { onGetColeccionLigera as onGetModulos } from '../../redux/features/modulo/moduloSlice';
import { onGetColeccionLigera as onGetOpcionesSistema } from '../../redux/features/opcionSistema/opcionSistemaSlice';

const Aplicacion = React.lazy(() => import('../../../modules/Seguridad/Aplicacion'));
const AplicacionCreador = React.lazy(() => import('../../../modules/Seguridad/Aplicacion/AplicacionCreador'));
const Rol = React.lazy(() => import('../../../modules/Seguridad/Rol'));
const RolCreador = React.lazy(() => import('../../../modules/Seguridad/Rol/RolCreator'));
const ConsultaAuditoria = React.lazy(() => import('../../../modules/Seguridad/ConsultaAuditoria'));
const Modulo = React.lazy(() => import('../../../modules/Seguridad/Modulo'));
const ModuloCreador = React.lazy(() => import('../../../modules/Seguridad/Modulo/ModuloCreador'));
const OpcionSistema = React.lazy(() => import('../../../modules/Seguridad/OpcionSistema'));
const OpcionSistemaCreador = React.lazy(() => import('../../../modules/Seguridad/OpcionSistema/OpcionSistemaCreador'));
const Permiso = React.lazy(() => import('../../../modules/Seguridad/Permiso'));
const PermisoCreador = React.lazy(() => import('../../../modules/Seguridad/Permiso/PermisoCreador'));
const Permissions = React.lazy(() => import('../../../modules/Seguridad/Permissions'));
const Usuario = React.lazy(() => import('../../../modules/Seguridad/Usuario'));
const UsuarioCreador = React.lazy(() => import('../../../modules/Seguridad/Usuario/UsuarioCreador'));
const CambioContrasena = React.lazy(() => import('../../../modules/Seguridad/Usuario/CambioContraseña'));

// Catálogo que el formulario necesita (antes lo cargaba la lista y lo pasaba al modal).
const ConCatalogo = ({ cargar, estado, children }) => {
  const dispatch = useDispatch();
  const lista = useSelector((state) => state[estado].coleccionLigera);
  useEffect(() => {
    dispatch(cargar());
  }, [dispatch, cargar]);
  return children(lista ?? []);
};

ConCatalogo.propTypes = {
  cargar: PropTypes.func.isRequired,
  estado: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
};

const sinRecarga = () => {};

// Props comunes de los formularios mostrados como vista (ver PaginaCrud).
const props = ({ accion, volver, titulo }) => ({
  accion,
  titulo,
  showForm: true,
  handleOnClose: volver,
  updateColeccion: sinRecarga,
});

export const seguridadConfigs = [
  ...rutasCrud('/aplicaciones', Aplicacion, (p) => <AplicacionCreador aplicacion={p.id} {...props(p)} />),
  ...rutasCrud('/roles', Rol, (p) => <RolCreador rol={p.id} {...props(p)} />),
  ...rutasCrud('/modulos', Modulo, (p) => (
    <ConCatalogo cargar={onGetAplicaciones} estado='aplicaciones'>
      {(aplicaciones) => <ModuloCreador modulo={p.id} aplicaciones={aplicaciones} {...props(p)} />}
    </ConCatalogo>
  )),
  ...rutasCrud('/opciones-del-sistema', OpcionSistema, (p) => (
    <ConCatalogo cargar={onGetModulos} estado='modulos'>
      {(modulos) => <OpcionSistemaCreador opcionSistema={p.id} modulos={modulos} {...props(p)} />}
    </ConCatalogo>
  )),
  ...rutasCrud('/permisos', Permiso, (p) => (
    <ConCatalogo cargar={onGetOpcionesSistema} estado='opcionSistema'>
      {(opcionesSistema) => <PermisoCreador permiso={p.id} opcionesSistema={opcionesSistema} {...props(p)} />}
    </ConCatalogo>
  )),
  {
    permittedRole: RoutePermittedRole.User,
    exact: true,
    path: ['/roles/permisos/:rol_id'],
    element: <Permissions route={{ auth: authRole, path: ['/roles/permisos'] }} />,
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: '/auditoria-tablas',
    element: <ConsultaAuditoria route={{ auth: authRole, path: '/auditoria-tablas' }} />,
  },
  ...rutasCrud('/usuarios', Usuario, (p) => <UsuarioCreador usuario={p.id} {...props(p)} />),
  {
    permittedRole: RoutePermittedRole.User,
    path: '/usuarios/:id/cambiar-clave',
    element: (
      <PaginaCrud
        base='/usuarios'
        accion='editar'
        render={(p) => <CambioContrasena usuario={p.id} {...props(p)} accion='crear' />}
      />
    ),
  },
];

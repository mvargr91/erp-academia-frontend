import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AppCrudTable, { auditCells } from '../../../shared/components/AppCrudTable';
import usePermisosOpcion from '../../../shared/hooks/usePermisosOpcion';
import { accionesEnPagina } from '../../../shared/components/PaginaCrud';
import useCrudModulo from '../../../shared/hooks/useCrudModulo';
import { onGetColeccion, onDelete } from '../../../@crema/redux/features/sedes/sedesSlice';
import { sincronizarSedes } from '../../../@crema/redux/features/sedes/sedeActualSlice';
import { valorActivo, colorActivo } from '../../../shared/constants/Academia';

const cells = [
  { id: 'nombre', typeHead: 'string', label: 'Nombre', value: (v) => v, align: 'left', mostrarInicio: true },
  { id: 'direccion', typeHead: 'string', label: 'Dirección', value: (v) => v, align: 'left', mostrarInicio: true, ordenable: false },
  { id: 'ciudad', typeHead: 'string', label: 'Ciudad', value: (v) => v, align: 'left', mostrarInicio: true },
  { id: 'telefono', typeHead: 'string', label: 'Teléfono', value: (v) => v, align: 'left', mostrarInicio: true, ordenable: false },
  { id: 'estado', typeHead: 'string', label: 'Estado', value: valorActivo, cellColor: colorActivo, align: 'left', mostrarInicio: true },
  ...auditCells,
];

const filtrosConfig = [{ name: 'nombre', label: 'Nombre', type: 'text' }];

const Sedes = ({ route }) => {
  const { titulo, urlAyuda, permisos } = usePermisosOpcion(route.path);
  const { refreshKey } = useCrudModulo();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { rows } = useSelector((state) => state.sedes);

  // El selector del encabezado y los formularios usan esta lista: se refresca al cambiar las sedes.
  useEffect(() => {
    dispatch(sincronizarSedes());
  }, [dispatch, rows]);

  return (
    <>
      <AppCrudTable
        stateKey='sedes'
        onGetColeccion={onGetColeccion}
        onDelete={onDelete}
        cells={cells}
        filtrosConfig={filtrosConfig}
        titulo={titulo}
        urlAyuda={urlAyuda}
        permisos={permisos}
        entidadNombre='Sede'
        refreshKey={refreshKey}
        {...accionesEnPagina(navigate, route.path)}
      />
    </>
  );
};

Sedes.propTypes = {
  route: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
};

export default Sedes;

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import AppCrudTable, { auditCells } from '../../../shared/components/AppCrudTable';
import { useSedes, celdaSede } from '../../../shared/sedes';
import usePermisosOpcion from '../../../shared/hooks/usePermisosOpcion';
import { accionesEnPagina } from '../../../shared/components/PaginaCrud';
import useCrudModulo from '../../../shared/hooks/useCrudModulo';
import { onGetColeccion, onDelete } from '../../../@crema/redux/features/cierres/cierresSlice';

const columnas = (variasSedes) => [
  { id: 'fecha_desde', typeHead: 'string', label: 'Desde', value: (v) => v, align: 'left', mostrarInicio: true, ordenable: false },
  { id: 'fecha_hasta', typeHead: 'string', label: 'Hasta', value: (v) => v, align: 'left', mostrarInicio: true, ordenable: false },
  { id: 'dias', typeHead: 'numeric', label: 'Días', value: (v) => v, align: 'center', mostrarInicio: true, ordenable: false },
  { id: 'motivo', typeHead: 'string', label: 'Motivo', value: (v) => v, align: 'left', mostrarInicio: true, ordenable: false },
  celdaSede(variasSedes),
  ...auditCells,
];

const Cierres = ({ route }) => {
  const { variasSedes } = useSedes();
  const cells = useMemo(() => columnas(variasSedes), [variasSedes]);
  const { titulo, urlAyuda, permisos } = usePermisosOpcion(route.path);
  const { refreshKey } = useCrudModulo();
  const navigate = useNavigate();

  return (
    <AppCrudTable
      stateKey='cierres'
      onGetColeccion={onGetColeccion}
      onDelete={onDelete}
      cells={cells}
      titulo={titulo}
      subtitulo='Fechas en que la academia no dicta clases: igual que los festivos, esas clases se corren a la semana siguiente.'
      urlAyuda={urlAyuda}
      permisos={permisos}
      entidadNombre='Cierre'
      refreshKey={refreshKey}
      defaultOrderBy=''
      {...accionesEnPagina(navigate, route.path)}
    />
  );
};

Cierres.propTypes = {
  route: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
};

export default Cierres;

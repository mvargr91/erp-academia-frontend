import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import AppCrudTable, { auditCells } from '../../../shared/components/AppCrudTable';
import { useSedes, celdaSede } from '../../../shared/sedes';
import usePermisosOpcion from '../../../shared/hooks/usePermisosOpcion';
import { accionesEnPagina } from '../../../shared/components/PaginaCrud';
import useCrudModulo from '../../../shared/hooks/useCrudModulo';
import { onGetColeccion, onDelete } from '../../../@crema/redux/features/planes/planesSlice';
import { formatoMoneda, nombreDe, PERIODICIDADES, valorActivo, colorActivo } from '../../../shared/constants/Academia';

const columnas = (variasSedes) => [
  { id: 'nombre', typeHead: 'string', label: 'Nombre', value: (v) => v, align: 'left', mostrarInicio: true },
  celdaSede(variasSedes),
  { id: 'valor', typeHead: 'string', label: 'Valor', value: formatoMoneda, align: 'left', mostrarInicio: true },
  { id: 'periodicidad', typeHead: 'string', label: 'Periodicidad', value: (v) => nombreDe(PERIODICIDADES, v), align: 'left', mostrarInicio: true },
  { id: 'num_clases', typeHead: 'string', label: 'N.° clases', value: (v) => v, align: 'left', mostrarInicio: true, ordenable: false },
  { id: 'estado', typeHead: 'string', label: 'Estado', value: valorActivo, cellColor: colorActivo, align: 'left', mostrarInicio: true },
  ...auditCells,
];

const filtrosConfig = [{ name: 'nombre', label: 'Nombre', type: 'text' }];

const Planes = ({ route }) => {
  const { variasSedes } = useSedes();
  const cells = useMemo(() => columnas(variasSedes), [variasSedes]);
  const { titulo, urlAyuda, permisos } = usePermisosOpcion(route.path);
  const { refreshKey } = useCrudModulo();
  const navigate = useNavigate();

  return (
    <>
      <AppCrudTable
        stateKey='planes'
        onGetColeccion={onGetColeccion}
        onDelete={onDelete}
        cells={cells}
        filtrosConfig={filtrosConfig}
        titulo={titulo}
        urlAyuda={urlAyuda}
        permisos={permisos}
        entidadNombre='Plan'
        refreshKey={refreshKey}
        {...accionesEnPagina(navigate, route.path)}
      />
    </>
  );
};

Planes.propTypes = {
  route: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
};

export default Planes;

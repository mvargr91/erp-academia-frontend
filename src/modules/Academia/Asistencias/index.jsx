import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import AppCrudTable, { auditCells } from '../../../shared/components/AppCrudTable';
import { useSedes, celdaSede } from '../../../shared/sedes';
import usePermisosOpcion from '../../../shared/hooks/usePermisosOpcion';
import { accionesEnPagina } from '../../../shared/components/PaginaCrud';
import useCrudModulo from '../../../shared/hooks/useCrudModulo';
import { onGetColeccion, onDelete } from '../../../@crema/redux/features/asistencias/asistenciasSlice';

const columnas = (variasSedes) => [
  { id: 'curso_nombre', typeHead: 'string', label: 'Curso', value: (v) => v, align: 'left', mostrarInicio: true },
  celdaSede(variasSedes),
  { id: 'fecha_sesion', typeHead: 'string', label: 'Fecha', value: (v) => v, align: 'left', mostrarInicio: true },
  { id: 'presentes', typeHead: 'numeric', label: 'Presentes', value: (v) => v, align: 'center', mostrarInicio: true, ordenable: false },
  { id: 'total_alumnos', typeHead: 'numeric', label: 'Total', value: (v) => v, align: 'center', mostrarInicio: true, ordenable: false },
  { id: 'observacion', typeHead: 'string', label: 'Observación', value: (v) => v, align: 'left', mostrarInicio: false, ordenable: false },
  ...auditCells,
];

const Asistencias = ({ route }) => {
  const { variasSedes } = useSedes();
  const cells = useMemo(() => columnas(variasSedes), [variasSedes]);
  const { titulo, urlAyuda, permisos } = usePermisosOpcion(route.path);
  const { refreshKey } = useCrudModulo();
  const navigate = useNavigate();

  return (
    <>
      <AppCrudTable
        stateKey='asistencias'
        onGetColeccion={onGetColeccion}
        onDelete={onDelete}
        cells={cells}
        titulo={titulo}
        urlAyuda={urlAyuda}
        permisos={permisos}
        entidadNombre='Asistencia'
        refreshKey={refreshKey}
        {...accionesEnPagina(navigate, route.path)}
      />
    </>
  );
};

Asistencias.propTypes = {
  route: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
};

export default Asistencias;

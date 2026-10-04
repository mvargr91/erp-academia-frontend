import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import AppCrudTable from '../../../shared/components/AppCrudTable';
import usePermisosOpcion from '../../../shared/hooks/usePermisosOpcion';
import { accionesEnPagina } from '../../../shared/components/PaginaCrud';
import useCrudModulo from '../../../shared/hooks/useCrudModulo';
import { onGetColeccion, onDelete } from '../../../@crema/redux/features/festivos/festivosSlice';

const cells = [
  { id: 'fecha', typeHead: 'string', label: 'Fecha', value: (v) => v, align: 'left', mostrarInicio: true, ordenable: false },
  { id: 'dia_semana', typeHead: 'string', label: 'Día', value: (v) => v, align: 'left', mostrarInicio: true, ordenable: false },
  { id: 'nombre', typeHead: 'string', label: 'Festivo', value: (v) => v, align: 'left', mostrarInicio: true, ordenable: false },
  { id: 'origen_nombre', typeHead: 'string', label: 'Origen', value: (v) => v, align: 'left', mostrarInicio: true, ordenable: false },
];

const anioActual = new Date().getFullYear();
const ANIOS = [anioActual - 1, anioActual, anioActual + 1, anioActual + 2].map((a) => ({ id: a, nombre: String(a) }));
const filtrosConfig = [{ name: 'anio', label: 'Año', type: 'select', options: ANIOS }];

const Festivos = ({ route }) => {
  const { titulo, urlAyuda, permisos } = usePermisosOpcion(route.path);
  const { refreshKey } = useCrudModulo();
  const navigate = useNavigate();

  return (
    <AppCrudTable
      stateKey='festivos'
      onGetColeccion={onGetColeccion}
      onDelete={onDelete}
      cells={cells}
      filtrosConfig={filtrosConfig}
      titulo={titulo}
      subtitulo='Festivos de Colombia para todas las academias. Los de ley se generan solos cada 1 de diciembre; aquí puedes agregar festivos extraordinarios.'
      urlAyuda={urlAyuda}
      permisos={permisos}
      entidadNombre='Festivo'
      refreshKey={refreshKey}
      defaultOrderBy=''
      {...accionesEnPagina(navigate, route.path, { editar: false })}
    />
  );
};

Festivos.propTypes = {
  route: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
};

export default Festivos;

// Modalidades de los cursos: lo que vende la academia (ciclo de 4 clases, de 8, mensualidad…) con la
// duración de cada clase. Su precio se define en Tarifas.
import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import AppCrudTable, { auditCells } from '../../../shared/components/AppCrudTable';
import usePermisosOpcion from '../../../shared/hooks/usePermisosOpcion';
import { accionesEnPagina } from '../../../shared/components/PaginaCrud';
import useCrudModulo from '../../../shared/hooks/useCrudModulo';
import { onGetColeccion, onDelete } from '../../../@crema/redux/features/modalidades/modalidadesSlice';
import { valorActivo, colorActivo, TIPOS_COBRO } from '../../../shared/constants/Academia';

const cells = [
  { id: 'nombre', typeHead: 'string', label: 'Nombre', value: (v) => v, align: 'left', mostrarInicio: true },
  { id: 'tipo_cobro', typeHead: 'string', label: 'Cobro', value: (v) => TIPOS_COBRO.find((t) => t.value === v)?.label ?? v, align: 'left', mostrarInicio: true },
  { id: 'clases_por_ciclo', typeHead: 'numeric', label: 'Clases por ciclo', value: (v) => v ?? '—', align: 'center', mostrarInicio: true },
  { id: 'duracion_minutos', typeHead: 'numeric', label: 'Duración (min)', value: (v) => v, align: 'center', mostrarInicio: true },
  { id: 'cursos', typeHead: 'numeric', label: 'Cursos', value: (v) => v, align: 'center', mostrarInicio: true, ordenable: false },
  { id: 'estado', typeHead: 'string', label: 'Estado', value: valorActivo, cellColor: colorActivo, align: 'left', mostrarInicio: true },
  ...auditCells,
];

const filtrosConfig = [{ name: 'nombre', label: 'Nombre', type: 'text' }];

const Modalidades = ({ route }) => {
  const { titulo, urlAyuda, permisos } = usePermisosOpcion(route.path);
  const { refreshKey } = useCrudModulo();
  const navigate = useNavigate();

  return (
    <AppCrudTable
      stateKey='modalidades'
      onGetColeccion={onGetColeccion}
      onDelete={onDelete}
      cells={cells}
      filtrosConfig={filtrosConfig}
      titulo={titulo}
      urlAyuda={urlAyuda}
      permisos={permisos}
      entidadNombre='Modalidad'
      refreshKey={refreshKey}
      {...accionesEnPagina(navigate, route.path)}
    />
  );
};

Modalidades.propTypes = {
  route: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
};

export default Modalidades;

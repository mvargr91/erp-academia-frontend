import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import AppCrudTable, { auditCells } from '../../../shared/components/AppCrudTable';
import { useSedes, celdaSede } from '../../../shared/sedes';
import usePermisosOpcion from '../../../shared/hooks/usePermisosOpcion';
import { accionesEnPagina } from '../../../shared/components/PaginaCrud';
import useCrudModulo from '../../../shared/hooks/useCrudModulo';
import { onGetColeccion, onDelete } from '../../../@crema/redux/features/paquetes/paquetesSlice';
import { formatoMoneda } from '../../../shared/constants/Academia';

const COLORES = { activo: 'green', agotado: 'gray', vencido: 'red', anulado: 'gray' };

const columnas = (variasSedes) => [
  { id: 'alumno_nombre', typeHead: 'string', label: 'Alumno', value: (v) => v, align: 'left', mostrarInicio: true, ordenable: false },
  { id: 'plan_nombre', typeHead: 'string', label: 'Plan', value: (v) => v, align: 'left', mostrarInicio: true, ordenable: false },
  celdaSede(variasSedes),
  {
    id: 'clases_restantes',
    typeHead: 'string',
    label: 'Clases',
    value: (v, row) => `${v} de ${row.clases_total} disponibles`,
    align: 'left',
    mostrarInicio: true,
    ordenable: false,
  },
  { id: 'fecha_compra', typeHead: 'string', label: 'Compra', value: (v) => v, align: 'left', mostrarInicio: true, ordenable: false },
  { id: 'fecha_vencimiento', typeHead: 'string', label: 'Vence', value: (v) => v ?? 'No vence', align: 'left', mostrarInicio: true, ordenable: false },
  {
    id: 'estado_nombre',
    typeHead: 'string',
    label: 'Estado',
    value: (v) => v,
    cellColor: (_v, row) => COLORES[row?.estado_efectivo] ?? '',
    align: 'left',
    mostrarInicio: true,
    ordenable: false,
  },
  { id: 'valor', typeHead: 'numeric', label: 'Valor', value: formatoMoneda, align: 'right', mostrarInicio: false, ordenable: false },
  {
    id: 'saldo',
    typeHead: 'numeric',
    label: 'Por pagar',
    value: formatoMoneda,
    cellColor: (v) => (Number(v) > 0 ? 'red' : ''),
    align: 'right',
    mostrarInicio: true,
    ordenable: false,
  },
  ...auditCells,
];

const filtrosConfig = [
  { name: 'nombre', label: 'Alumno', type: 'text' },
  {
    name: 'estado',
    label: 'Estado',
    type: 'select',
    options: [
      { id: 'activo', nombre: 'Activo' },
      { id: 'agotado', nombre: 'Agotado' },
      { id: 'vencido', nombre: 'Vencido' },
      { id: 'anulado', nombre: 'Anulado' },
    ],
  },
];

const Paquetes = ({ route }) => {
  const { variasSedes } = useSedes();
  const cells = useMemo(() => columnas(variasSedes), [variasSedes]);
  const { titulo, urlAyuda, permisos } = usePermisosOpcion(route.path);
  const { refreshKey } = useCrudModulo();
  const navigate = useNavigate();

  return (
    <AppCrudTable
      stateKey='paquetes'
      onGetColeccion={onGetColeccion}
      onDelete={onDelete}
      cells={cells}
      filtrosConfig={filtrosConfig}
      titulo={titulo}
      subtitulo='Cada clase privada o grupal (si la matrícula es por paquete) descuenta 1 del paquete vigente que vence primero.'
      urlAyuda={urlAyuda}
      permisos={permisos}
      entidadNombre='Paquete'
      refreshKey={refreshKey}
      defaultOrderBy=''
      {...accionesEnPagina(navigate, route.path)}
    />
  );
};

Paquetes.propTypes = {
  route: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
};

export default Paquetes;

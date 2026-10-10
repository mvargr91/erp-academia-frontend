import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PaymentsIcon from '@mui/icons-material/Payments';
import AppCrudTable, { auditCells } from '../../../shared/components/AppCrudTable';
import { useSedes, celdaSede } from '../../../shared/sedes';
import usePermisosOpcion from '../../../shared/hooks/usePermisosOpcion';
import { accionesEnPagina, rutaEditar, rutaVer } from '../../../shared/components/PaginaCrud';
import useCrudModulo from '../../../shared/hooks/useCrudModulo';
import { onGetColeccion, onDelete } from '../../../@crema/redux/features/paquetes/paquetesSlice';
import { formatoMoneda } from '../../../shared/constants/Academia';

const COLORES = { activo: 'green', agotado: 'gray', vencido: 'red', anulado: 'gray' };

const columnas = (variasSedes) => [
  { id: 'alumno_nombre', typeHead: 'string', label: 'Alumno', value: (v) => v, align: 'left', mostrarInicio: true, ordenable: false },
  { id: 'plan_nombre', typeHead: 'string', label: 'Tipo de paquete', value: (v) => v, align: 'left', mostrarInicio: true, ordenable: false },
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
      subtitulo='Después de crear el paquete, usa «Registrar clases» para anotar cada clase y «Registrar pago» para cobrarlo.'
      urlAyuda={urlAyuda}
      permisos={permisos}
      entidadNombre='Paquete'
      refreshKey={refreshKey}
      defaultOrderBy=''
      {...accionesEnPagina(navigate, route.path)}
      accionesExtra={[
        {
          titulo: 'Registrar clases',
          icono: EventAvailableIcon,
          permiso: 'RegistrarClases',
          color: 'green',
          onClick: (row) => navigate((permisos.indexOf('Modificar') >= 0 ? rutaEditar : rutaVer)(route.path, row.id)),
        },
        {
          titulo: 'Registrar pago',
          icono: PaymentsIcon,
          permiso: 'Pagar',
          onClick: (row) => navigate(`${route.path}/${row.id}/pago`),
        },
      ]}
    />
  );
};

Paquetes.propTypes = {
  route: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
};

export default Paquetes;

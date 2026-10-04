import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import AppCrudTable from '../../../shared/components/AppCrudTable';
import usePermisosOpcion from '../../../shared/hooks/usePermisosOpcion';
import useCrudModulo from '../../../shared/hooks/useCrudModulo';
import { onGetColeccion } from '../../../@crema/redux/features/enviosCorreo/enviosCorreoSlice';

const cells = [
  { id: 'fecha_creacion', typeHead: 'string', label: 'Fecha', value: (v) => v, align: 'left', mostrarInicio: true, ordenable: false },
  { id: 'asunto', typeHead: 'string', label: 'Asunto', value: (v) => v, align: 'left', mostrarInicio: true, ordenable: false },
  { id: 'audiencia_nombre', typeHead: 'string', label: 'Para', value: (v) => v, align: 'left', mostrarInicio: true, ordenable: false },
  {
    id: 'enviados',
    typeHead: 'string',
    label: 'Enviados',
    value: (v, row) => `${v} de ${row.total}${row.errores ? ` · ${row.errores} con error` : ''}`,
    cellColor: (_v, row) => (row?.errores ? 'red' : ''),
    align: 'left',
    mostrarInicio: true,
    ordenable: false,
  },
  {
    id: 'estado_nombre',
    typeHead: 'string',
    label: 'Estado',
    value: (v) => v,
    cellColor: (_v, row) => (row?.estado === 'completado' ? 'green' : '#F9A825'),
    align: 'left',
    mostrarInicio: true,
    ordenable: false,
  },
  { id: 'usuario_creacion_nombre', typeHead: 'string', label: 'Enviado por', value: (v) => v, align: 'left', mostrarInicio: false, ordenable: false },
];

const EnviosCorreo = ({ route }) => {
  const { titulo, urlAyuda, permisos } = usePermisosOpcion(route.path);
  const { refreshKey } = useCrudModulo();
  const navigate = useNavigate();

  return (
    <AppCrudTable
      stateKey='enviosCorreo'
      onGetColeccion={onGetColeccion}
      cells={cells}
      titulo={titulo}
      subtitulo='Correos que envías a un grupo (alumnos de un curso, en mora, todos…). Cada uno sale personalizado con el nombre del destinatario.'
      urlAyuda={urlAyuda}
      permisos={permisos}
      entidadNombre='Envío'
      refreshKey={refreshKey}
      defaultOrderBy=''
      onCrear={() => navigate(`${route.path}/crear`)}
      onVer={(row) => navigate(`${route.path}/${row.id}/ver`)}
    />
  );
};

EnviosCorreo.propTypes = {
  route: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
};

export default EnviosCorreo;

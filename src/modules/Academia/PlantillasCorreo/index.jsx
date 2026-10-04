import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import AppCrudTable from '../../../shared/components/AppCrudTable';
import usePermisosOpcion from '../../../shared/hooks/usePermisosOpcion';
import { accionesEnPagina } from '../../../shared/components/PaginaCrud';
import useCrudModulo from '../../../shared/hooks/useCrudModulo';
import { onGetColeccion, onDelete } from '../../../@crema/redux/features/plantillasCorreo/plantillasCorreoSlice';
import { valorActivo, colorActivo } from '../../../shared/constants/Academia';

const cells = [
  { id: 'nombre', typeHead: 'string', label: 'Correo', value: (v) => v, align: 'left', mostrarInicio: true, ordenable: false },
  {
    id: 'tipo_nombre',
    typeHead: 'string',
    label: 'Tipo',
    value: (v) => v,
    cellColor: (_v, row) => (row?.tipo === 'manual' ? '#1A73E8' : ''),
    align: 'left',
    mostrarInicio: true,
    ordenable: false,
  },
  { id: 'asunto', typeHead: 'string', label: 'Asunto', value: (v) => v, align: 'left', mostrarInicio: true, ordenable: false },
  { id: 'estado', typeHead: 'string', label: 'Estado', value: valorActivo, cellColor: colorActivo, align: 'left', mostrarInicio: true, ordenable: false },
  { id: 'usuario_modificacion_nombre', typeHead: 'string', label: 'Modificado por', value: (v) => v, align: 'left', mostrarInicio: false, ordenable: false },
  { id: 'fecha_modificacion', typeHead: 'string', label: 'Fecha modificación', value: (v) => v, align: 'left', mostrarInicio: true, ordenable: false },
];

const filtrosConfig = [
  { name: 'nombre', label: 'Buscar', type: 'text' },
  {
    name: 'tipo',
    label: 'Tipo',
    type: 'select',
    options: [
      { id: 'sistema', nombre: 'Automáticas' },
      { id: 'manual', nombre: 'Manuales' },
    ],
  },
];

const PlantillasCorreo = ({ route }) => {
  const { titulo, urlAyuda, permisos } = usePermisosOpcion(route.path);
  const { refreshKey } = useCrudModulo();
  const navigate = useNavigate();

  return (
    <AppCrudTable
      stateKey='plantillasCorreo'
      onGetColeccion={onGetColeccion}
      onDelete={onDelete}
      eliminable={(row) => row.tipo === 'manual'}
      cells={cells}
      filtrosConfig={filtrosConfig}
      titulo={titulo}
      subtitulo='Automáticas: las envía el sistema (se editan, no se borran). Manuales: las creas tú para enviarlas desde Envíos de correo.'
      urlAyuda={urlAyuda}
      permisos={permisos}
      entidadNombre='Plantilla'
      refreshKey={refreshKey}
      defaultOrderBy=''
      {...accionesEnPagina(navigate, route.path)}
    />
  );
};

PlantillasCorreo.propTypes = {
  route: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
};

export default PlantillasCorreo;

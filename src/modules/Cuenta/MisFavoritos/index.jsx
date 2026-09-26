// Favoritos del cliente autenticado. El backend usa el usuario del token (AlcancePorRol).
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AppCrudTable from '../../../shared/components/AppCrudTable';
import usePermisosOpcion from '../../../shared/hooks/usePermisosOpcion';
import { onGetColeccion, onDelete } from '../../../@crema/redux/features/favoritos/favoritosSlice';
import { formatoMoneda } from '../../../shared/constants/Turismo';
import { RUTAS_PORTAL } from '../../../shared/constants/RutasPortal';

const cells = [
  { id: 'experiencia_nombre', typeHead: 'string', label: 'Experiencia', value: (v) => v, align: 'left', mostrarInicio: true },
  { id: 'precio_desde', typeHead: 'numeric', label: 'Precio Desde', value: formatoMoneda, align: 'right', mostrarInicio: true },
  { id: 'fecha_creacion', typeHead: 'string', label: 'Guardado', value: (v) => (v ? moment(v).format('YYYY-MM-DD') : ''), align: 'left', mostrarInicio: true },
];

const accionesExtra = [
  {
    titulo: 'Ver en el portal',
    icono: OpenInNewIcon,
    permiso: 'Listar',
    visible: (row) => Boolean(row.experiencia_slug),
    onClick: (row) => window.open(RUTAS_PORTAL.tour(row.experiencia_slug), '_blank', 'noopener'),
  },
];

const MisFavoritos = ({ route }) => {
  const { titulo, urlAyuda, permisos } = usePermisosOpcion(route.path);

  return (
    <AppCrudTable
      stateKey='favoritos'
      onGetColeccion={onGetColeccion}
      onDelete={onDelete}
      cells={cells}
      paginado={false}
      titulo={titulo}
      urlAyuda={urlAyuda}
      permisos={permisos}
      entidadNombre='Favorito'
      accionesExtra={accionesExtra}
    />
  );
};

MisFavoritos.propTypes = {
  route: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
};

export default MisFavoritos;

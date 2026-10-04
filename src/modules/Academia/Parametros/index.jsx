import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import AppCrudTable from '../../../shared/components/AppCrudTable';
import usePermisosOpcion from '../../../shared/hooks/usePermisosOpcion';
import { accionesEnPagina } from '../../../shared/components/PaginaCrud';
import useCrudModulo from '../../../shared/hooks/useCrudModulo';
import { onGetColeccion } from '../../../@crema/redux/features/parametros/parametrosSlice';

export const valorParametro = (valor, row) => {
  if (valor === null || valor === undefined || valor === '') return '—';
  if (row?.tipo === 'porcentaje') return `${valor} %`;
  return String(valor).length > 60 ? `${String(valor).slice(0, 60)}…` : valor;
};

const cells = [
  { id: 'grupo', typeHead: 'string', label: 'Grupo', value: (v) => v, align: 'left', mostrarInicio: true, ordenable: false },
  { id: 'descripcion', typeHead: 'string', label: 'Parámetro', value: (v) => v, align: 'left', mostrarInicio: true, ordenable: false },
  { id: 'valor', typeHead: 'string', label: 'Valor', value: valorParametro, align: 'left', mostrarInicio: true, ordenable: false },
  { id: 'codigo', typeHead: 'string', label: 'Código', value: (v) => v, align: 'left', mostrarInicio: false, ordenable: false },
  { id: 'usuario_modificacion_nombre', typeHead: 'string', label: 'Modificado por', value: (v) => v, align: 'left', mostrarInicio: false, ordenable: false },
  { id: 'fecha_modificacion', typeHead: 'string', label: 'Fecha modificación', value: (v) => v, align: 'left', mostrarInicio: false, ordenable: false },
];

const filtrosConfig = [{ name: 'nombre', label: 'Buscar parámetro', type: 'text' }];

const Parametros = ({ route }) => {
  const { titulo, urlAyuda, permisos } = usePermisosOpcion(route.path);
  const { refreshKey } = useCrudModulo();
  const navigate = useNavigate();

  return (
    <AppCrudTable
      stateKey='parametros'
      onGetColeccion={onGetColeccion}
      cells={cells}
      filtrosConfig={filtrosConfig}
      titulo={titulo}
      subtitulo='Valores que usa el sistema en sus procesos (cobros, avisos, clases). Solo se edita el valor.'
      urlAyuda={urlAyuda}
      permisos={permisos}
      entidadNombre='Parámetro'
      refreshKey={refreshKey}
      defaultOrderBy=''
      {...accionesEnPagina(navigate, route.path, { crear: false })}
    />
  );
};

Parametros.propTypes = {
  route: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
};

export default Parametros;

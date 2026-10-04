import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import AppCrudTable from '../../../shared/components/AppCrudTable';
import usePermisosOpcion from '../../../shared/hooks/usePermisosOpcion';
import { accionesEnPagina } from '../../../shared/components/PaginaCrud';
import useCrudModulo from '../../../shared/hooks/useCrudModulo';
import { onGetColeccion } from '../../../@crema/redux/features/academias/academiasSlice';
import { valorActivo, colorActivo, valorSiNo, formatoMoneda } from '../../../shared/constants/Academia';
import { colorEstadoCuenta } from '../../../shared/constants/Administracion';

const cells = [
  { id: 'codigo', typeHead: 'string', label: 'Código', value: (v) => v, align: 'left', mostrarInicio: true },
  { id: 'nombre', typeHead: 'string', label: 'Nombre', value: (v) => v, align: 'left', mostrarInicio: true },
  { id: 'url', typeHead: 'string', label: 'URL', value: (v) => v, align: 'left', mostrarInicio: true, ordenable: false },
  { id: 'correo', typeHead: 'string', label: 'Correo', value: (v) => v, align: 'left', mostrarInicio: false, ordenable: false },
  { id: 'tarifa_mensual', typeHead: 'numeric', label: 'Tarifa', value: formatoMoneda, align: 'right', mostrarInicio: true },
  { id: 'dia_corte', typeHead: 'numeric', label: 'Día de corte', value: (v) => v, align: 'center', mostrarInicio: false },
  { id: 'estado_cuenta_nombre', typeHead: 'string', label: 'Estado de cuenta', value: (v) => v, cellColor: colorEstadoCuenta, align: 'left', mostrarInicio: true, ordenable: false },
  { id: 'saldo_pendiente', typeHead: 'numeric', label: 'Saldo', value: formatoMoneda, align: 'right', mostrarInicio: true, ordenable: false },
  { id: 'alumnos_activos', typeHead: 'numeric', label: 'Alumnos activos', value: (v) => v, align: 'center', mostrarInicio: true, ordenable: false },
  { id: 'activa', typeHead: 'string', label: 'Acceso', value: valorActivo, cellColor: colorActivo, align: 'left', mostrarInicio: false },
  { id: 'es_administradora', typeHead: 'string', label: 'Administradora', value: valorSiNo, align: 'center', mostrarInicio: false, ordenable: false },
  { id: 'base_datos', typeHead: 'string', label: 'Base de datos', value: (v) => v, align: 'left', mostrarInicio: false, ordenable: false },
  { id: 'fecha_creacion', typeHead: 'string', label: 'Fecha creación', value: (v) => v, align: 'left', mostrarInicio: false, ordenable: false },
];

const filtrosConfig = [{ name: 'nombre', label: 'Nombre o código', type: 'text' }];

const Academias = ({ route }) => {
  const { titulo, urlAyuda, permisos } = usePermisosOpcion(route.path);
  const { refreshKey } = useCrudModulo();
  const navigate = useNavigate();

  return (
    <>
      <AppCrudTable
        stateKey='academias'
        onGetColeccion={onGetColeccion}
        cells={cells}
        filtrosConfig={filtrosConfig}
        titulo={titulo}
        urlAyuda={urlAyuda}
        permisos={permisos}
        entidadNombre='Academia'
        refreshKey={refreshKey}
        {...accionesEnPagina(navigate, route.path)}
      />
    </>
  );
};

Academias.propTypes = {
  route: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
};

export default Academias;

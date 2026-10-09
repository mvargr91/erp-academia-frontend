import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AppCrudTable, { auditCells } from '../../../shared/components/AppCrudTable';
import { useSedes, celdaSede } from '../../../shared/sedes';
import usePermisosOpcion from '../../../shared/hooks/usePermisosOpcion';
import { accionesEnPagina } from '../../../shared/components/PaginaCrud';
import useCrudModulo from '../../../shared/hooks/useCrudModulo';
import { onGetColeccion, onDelete } from '../../../@crema/redux/features/alumnos/alumnosSlice';
import { valorActivo, colorActivo, formatoMoneda } from '../../../shared/constants/Academia';

const columnas = (variasSedes) => [
  { id: 'nombres', typeHead: 'string', label: 'Nombres', value: (v) => v, align: 'left', mostrarInicio: true },
  { id: 'apellidos', typeHead: 'string', label: 'Apellidos', value: (v) => v, align: 'left', mostrarInicio: true },
  { id: 'documento', typeHead: 'string', label: 'Documento', value: (v) => v, align: 'left', mostrarInicio: true, ordenable: false },
  { id: 'telefono', typeHead: 'string', label: 'Teléfono', value: (v) => v, align: 'left', mostrarInicio: true, ordenable: false },
  celdaSede(variasSedes),
  {
    id: 'saldo_pendiente',
    typeHead: 'numeric',
    label: 'Debe',
    value: (v) => formatoMoneda(v ?? 0),
    align: 'right',
    mostrarInicio: true,
    ordenable: false,
  },
  { id: 'correo', typeHead: 'string', label: 'Correo', value: (v) => v, align: 'left', mostrarInicio: true, ordenable: false },
  { id: 'estado', typeHead: 'string', label: 'Estado', value: valorActivo, cellColor: colorActivo, align: 'left', mostrarInicio: true },
  ...auditCells,
];

const filtrosConfig = [{ name: 'nombre', label: 'Nombre o apellido', type: 'text' }];

const Alumnos = ({ route }) => {
  const { variasSedes } = useSedes();
  const cells = useMemo(() => columnas(variasSedes), [variasSedes]);
  const { titulo, urlAyuda, permisos } = usePermisosOpcion(route.path);
  const { refreshKey } = useCrudModulo();
  const navigate = useNavigate();

  return (
    <>
      <AppCrudTable
        stateKey='alumnos'
        onGetColeccion={onGetColeccion}
        onDelete={onDelete}
        cells={cells}
        filtrosConfig={filtrosConfig}
        titulo={titulo}
        urlAyuda={urlAyuda}
        permisos={permisos}
        entidadNombre='Alumno'
        refreshKey={refreshKey}
        {...accionesEnPagina(navigate, route.path)}
        accionesExtra={[
          {
            titulo: 'Estado de cuenta y pagos',
            icono: AccountBalanceWalletIcon,
            permiso: 'EstadoCuenta',
            onClick: (row) => navigate(`${route.path}/${row.id}/cuenta`),
          },
        ]}
      />
    </>
  );
};

Alumnos.propTypes = {
  route: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
};

export default Alumnos;

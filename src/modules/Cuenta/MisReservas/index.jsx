// Reservas del cliente autenticado. El backend filtra por el usuario del token (AlcancePorRol).
import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import Swal from 'sweetalert2';
import AppCrudTable from '../../../shared/components/AppCrudTable';
import usePermisosOpcion from '../../../shared/hooks/usePermisosOpcion';
import useCrudModulo from '../../../shared/hooks/useCrudModulo';
import { onGetColeccion, onCambiarEstado } from '../../../@crema/redux/features/reservas/reservasSlice';
import {
  ESTADOS_RESERVA,
  aHoraCorta,
  colorDe,
  formatoMoneda,
  nombreDe,
} from '../../../shared/constants/Turismo';

const cells = [
  { id: 'codigo_reserva', typeHead: 'string', label: 'Código', value: (v) => v, align: 'left', mostrarInicio: true },
  { id: 'experiencia_nombre', typeHead: 'string', label: 'Experiencia', value: (v) => v, align: 'left', mostrarInicio: true },
  { id: 'fecha', typeHead: 'string', label: 'Fecha', value: (v, row) => `${v ?? ''} ${aHoraCorta(row.hora_inicio)}`.trim(), align: 'left', mostrarInicio: true },
  { id: 'cantidad_personas', typeHead: 'numeric', label: 'Personas', value: (v) => v, align: 'right', mostrarInicio: true, ordenable: false },
  { id: 'valor_total', typeHead: 'numeric', label: 'Valor', value: formatoMoneda, align: 'right', mostrarInicio: true },
  {
    id: 'estado',
    typeHead: 'string',
    label: 'Estado',
    value: (v) => nombreDe(ESTADOS_RESERVA, v),
    cellColor: (v) => colorDe(ESTADOS_RESERVA, v),
    align: 'left',
    mostrarInicio: true,
  },
];

const filtrosConfig = [{ name: 'estado', label: 'Estado', type: 'select', options: ESTADOS_RESERVA }];

const MisReservas = ({ route }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { titulo, urlAyuda, permisos } = usePermisosOpcion(route.path);
  const { refreshKey, updateColeccion } = useCrudModulo();

  const cancelar = (row) => {
    Swal.fire({
      title: 'Cancelar reserva',
      text: `¿Seguro que desea cancelar la reserva ${row.codigo_reserva}?`,
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No',
      background: theme.palette.background.default,
      color: theme.palette.text.primary,
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        dispatch(onCambiarEstado({ params: { id: row.id, estado: 'cancelada' }, updateColeccion }));
      }
    });
  };

  const accionesExtra = [
    {
      titulo: 'Cancelar Reserva',
      icono: EventBusyIcon,
      permiso: 'Modificar',
      color: theme.palette.redBottoms,
      visible: (row) => ['pendiente', 'aceptada'].includes(row.estado),
      onClick: cancelar,
    },
  ];

  return (
    <AppCrudTable
      stateKey='reservas'
      onGetColeccion={onGetColeccion}
      cells={cells}
      filtrosConfig={filtrosConfig}
      titulo={titulo}
      urlAyuda={urlAyuda}
      permisos={permisos}
      entidadNombre='Reserva'
      refreshKey={refreshKey}
      accionesExtra={accionesExtra}
    />
  );
};

MisReservas.propTypes = {
  route: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
};

export default MisReservas;

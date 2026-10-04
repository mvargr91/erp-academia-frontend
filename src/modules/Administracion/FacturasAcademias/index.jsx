import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material';
import PaymentsIcon from '@mui/icons-material/Payments';
import BlockIcon from '@mui/icons-material/Block';
import AppCrudTable from '../../../shared/components/AppCrudTable';
import usePermisosOpcion from '../../../shared/hooks/usePermisosOpcion';
import useCrudModulo from '../../../shared/hooks/useCrudModulo';
import jwtAxios from '../../../@crema/services/auth/jwt-auth';
import { onGetColeccion } from '../../../@crema/redux/features/facturasAcademias/facturasAcademiasSlice';
import { onGetColeccionLigera as onGetAcademias } from '../../../@crema/redux/features/academias/academiasSlice';
import { formatoMoneda } from '../../../shared/constants/Academia';
import { ESTADOS_FACTURA, colorEstadoFactura } from '../../../shared/constants/Administracion';

const cells = [
  { id: 'numero', typeHead: 'string', label: 'N.°', value: (v) => v, align: 'left', mostrarInicio: true, ordenable: false },
  { id: 'academia_nombre', typeHead: 'string', label: 'Academia', value: (v) => v, align: 'left', mostrarInicio: true, ordenable: false },
  { id: 'periodo_nombre', typeHead: 'string', label: 'Periodo', value: (v) => v, align: 'left', mostrarInicio: true, ordenable: false },
  { id: 'fecha_vencimiento', typeHead: 'string', label: 'Vence', value: (v) => v, align: 'left', mostrarInicio: true },
  { id: 'valor', typeHead: 'numeric', label: 'Valor', value: formatoMoneda, align: 'right', mostrarInicio: true },
  { id: 'saldo', typeHead: 'numeric', label: 'Saldo', value: formatoMoneda, align: 'right', mostrarInicio: true },
  { id: 'estado_nombre', typeHead: 'string', label: 'Estado', value: (v) => v, cellColor: colorEstadoFactura, align: 'left', mostrarInicio: true, ordenable: false },
  { id: 'observacion', typeHead: 'string', label: 'Observación', value: (v) => v, align: 'left', mostrarInicio: false, ordenable: false },
];

const porCobrar = (row) => ['pendiente', 'vencida'].includes(row.estado);

const FacturasAcademias = ({ route }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const swalBase = { background: theme.palette.background.default, color: theme.palette.text.primary };
  const { titulo, urlAyuda, permisos } = usePermisosOpcion(route.path);
  const { refreshKey, updateColeccion } = useCrudModulo();
  const { coleccionLigera: academias } = useSelector((s) => s.academias);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(onGetAcademias());
  }, [dispatch]);

  const filtrosConfig = [
    { name: 'academia_id', label: 'Academia', type: 'select', options: academias ?? [] },
    { name: 'estado', label: 'Estado', type: 'select', options: ESTADOS_FACTURA },
  ];

  const anular = (row) => {
    Swal.fire({
      ...swalBase,
      title: `Anular ${row.numero}`,
      text: 'La cuenta de cobro dejará de cobrarse. Escribe el motivo:',
      input: 'text',
      showCancelButton: true,
      confirmButtonText: 'Anular',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      inputValidator: (valor) => (!valor ? 'El motivo es obligatorio' : undefined),
    }).then(({ isConfirmed, value }) => {
      if (!isConfirmed) return;
      jwtAxios
        .put(`facturas-academias/${row.id}`, { anular: true, observacion: value })
        .then(() => {
          Swal.fire({ ...swalBase, title: 'Anulada', icon: 'success' });
          updateColeccion();
        })
        .catch((e) => Swal.fire({ ...swalBase, title: 'Error', text: e?.response?.data?.mensajes?.[0] ?? 'No se pudo anular.', icon: 'error' }));
    });
  };

  const accionesExtra = [
    { titulo: 'Registrar pago', icono: PaymentsIcon, onClick: (row) => navigate(`/pagos-academias/crear?factura=${row.id}&volver=/facturas-academias`), visible: porCobrar, color: 'green' },
    { titulo: 'Anular', icono: BlockIcon, onClick: anular, visible: (row) => porCobrar(row) && row.saldo === row.valor, permiso: 'Modificar', color: 'red' },
  ];

  return (
    <>
      <AppCrudTable
        stateKey='facturasAcademias'
        onGetColeccion={onGetColeccion}
        cells={cells}
        filtrosConfig={filtrosConfig}
        filtrosFijos={{}}
        titulo={titulo}
        urlAyuda={urlAyuda}
        permisos={permisos}
        entidadNombre='Cuenta de cobro'
        refreshKey={refreshKey}
        defaultOrderBy='fecha_vencimiento:desc'
        accionesExtra={accionesExtra}
      />
    </>
  );
};

FacturasAcademias.propTypes = {
  route: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
};

export default FacturasAcademias;

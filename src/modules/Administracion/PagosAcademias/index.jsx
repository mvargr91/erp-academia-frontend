import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AppCrudTable from '../../../shared/components/AppCrudTable';
import usePermisosOpcion from '../../../shared/hooks/usePermisosOpcion';
import { accionesEnPagina } from '../../../shared/components/PaginaCrud';
import useCrudModulo from '../../../shared/hooks/useCrudModulo';
import { onGetColeccion, onDelete } from '../../../@crema/redux/features/pagosAcademias/pagosAcademiasSlice';
import { onGetColeccionLigera as onGetAcademias } from '../../../@crema/redux/features/academias/academiasSlice';
import { formatoMoneda } from '../../../shared/constants/Academia';
import { METODOS_PAGO_ERP } from '../../../shared/constants/Administracion';

const nombreMetodo = (v) => METODOS_PAGO_ERP.find((m) => m.id === v)?.nombre ?? v;

const cells = [
  { id: 'fecha_pago', typeHead: 'string', label: 'Fecha', value: (v) => v, align: 'left', mostrarInicio: true, ordenable: false },
  { id: 'academia_nombre', typeHead: 'string', label: 'Academia', value: (v) => v, align: 'left', mostrarInicio: true, ordenable: false },
  { id: 'factura_numero', typeHead: 'string', label: 'Cuenta de cobro', value: (v) => v, align: 'left', mostrarInicio: true, ordenable: false },
  { id: 'valor', typeHead: 'numeric', label: 'Valor', value: formatoMoneda, align: 'right', mostrarInicio: true, ordenable: false },
  { id: 'metodo', typeHead: 'string', label: 'Método', value: nombreMetodo, align: 'left', mostrarInicio: true, ordenable: false },
  { id: 'referencia', typeHead: 'string', label: 'Referencia', value: (v) => v, align: 'left', mostrarInicio: true, ordenable: false },
  { id: 'soporte', typeHead: 'string', label: 'Soporte', value: (v) => (v ? 'Sí' : ''), align: 'center', mostrarInicio: true, ordenable: false },
  { id: 'usuario_creacion_nombre', typeHead: 'string', label: 'Registrado por', value: (v) => v, align: 'left', mostrarInicio: false, ordenable: false },
];

const PagosAcademias = ({ route }) => {
  const dispatch = useDispatch();
  const { titulo, urlAyuda, permisos } = usePermisosOpcion(route.path);
  const { refreshKey } = useCrudModulo();
  const navigate = useNavigate();
  const { coleccionLigera: academias } = useSelector((s) => s.academias);

  useEffect(() => {
    dispatch(onGetAcademias());
  }, [dispatch]);

  const filtrosConfig = [
    { name: 'academia_id', label: 'Academia', type: 'select', options: academias ?? [] },
    { name: 'fecha_desde', label: 'Desde', type: 'date' },
    { name: 'fecha_hasta', label: 'Hasta', type: 'date' },
  ];

  return (
    <>
      <AppCrudTable
        stateKey='pagosAcademias'
        onGetColeccion={onGetColeccion}
        onDelete={onDelete}
        cells={cells}
        filtrosConfig={filtrosConfig}
        titulo={titulo}
        urlAyuda={urlAyuda}
        permisos={permisos}
        entidadNombre='Pago'
        refreshKey={refreshKey}
        {...accionesEnPagina(navigate, route.path, { editar: false })}
        defaultOrderBy=''
      />
    </>
  );
};

PagosAcademias.propTypes = {
  route: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
};

export default PagosAcademias;

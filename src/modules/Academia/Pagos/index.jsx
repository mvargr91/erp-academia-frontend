import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import AppCrudTable, { auditCells } from '../../../shared/components/AppCrudTable';
import usePermisosOpcion from '../../../shared/hooks/usePermisosOpcion';
import { accionesEnPagina } from '../../../shared/components/PaginaCrud';
import useCrudModulo from '../../../shared/hooks/useCrudModulo';
import { onGetColeccion, onDelete } from '../../../@crema/redux/features/pagos/pagosSlice';
import { useSedes, celdaSede } from '../../../shared/sedes';
import { METODOS_PAGO, nombreDe, formatoMoneda } from '../../../shared/constants/Academia';

const columnas = (variasSedes) => [
  { id: 'alumno_nombre', typeHead: 'string', label: 'Alumno', value: (v) => v, align: 'left', mostrarInicio: true },
  { id: 'curso_nombre', typeHead: 'string', label: 'Curso', value: (v) => v, align: 'left', mostrarInicio: true, ordenable: false },
  celdaSede(variasSedes, { ordenable: true }),
  { id: 'monto', typeHead: 'numeric', label: 'Monto', value: formatoMoneda, align: 'right', mostrarInicio: true },
  { id: 'fecha_pago', typeHead: 'string', label: 'Fecha de pago', value: (v) => v, align: 'left', mostrarInicio: true },
  { id: 'metodo_pago', typeHead: 'string', label: 'Método', value: (v) => nombreDe(METODOS_PAGO, v), align: 'left', mostrarInicio: true },
  { id: 'referencia', typeHead: 'string', label: 'Referencia', value: (v) => v, align: 'left', mostrarInicio: false, ordenable: false },
  ...auditCells,
];

const filtrosConfig = [{ name: 'nombre', label: 'Alumno', type: 'text' }];

const Pagos = ({ route }) => {
  const { variasSedes } = useSedes();
  const cells = useMemo(() => columnas(variasSedes), [variasSedes]);
  const { titulo, urlAyuda, permisos } = usePermisosOpcion(route.path);
  const { refreshKey } = useCrudModulo();
  const navigate = useNavigate();

  return (
    <>
      <AppCrudTable
        stateKey='pagos'
        onGetColeccion={onGetColeccion}
        onDelete={onDelete}
        cells={cells}
        filtrosConfig={filtrosConfig}
        titulo={titulo}
        urlAyuda={urlAyuda}
        permisos={permisos}
        entidadNombre='Pago'
        refreshKey={refreshKey}
        {...accionesEnPagina(navigate, route.path)}
        // El pago de una clase personalizada se corrige desde la clase, no desde aquí.
        onEditar={(row) =>
          navigate(row.clase_privada_id ? `/clases-privadas/${row.clase_privada_id}/pago` : `${route.path}/${row.id}/editar`)
        }
      />
    </>
  );
};

Pagos.propTypes = {
  route: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
};

export default Pagos;

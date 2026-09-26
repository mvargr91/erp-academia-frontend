import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AppCrudTable, { auditCells } from '../../../shared/components/AppCrudTable';
import usePermisosOpcion from '../../../shared/hooks/usePermisosOpcion';
import useCrudModulo from '../../../shared/hooks/useCrudModulo';
import { onGetColeccion, onDelete } from '../../../@crema/redux/features/pagos/pagosSlice';
import { METODOS_PAGO, nombreDe, formatoMoneda } from '../../../shared/constants/Academia';
import PagoCreador from './PagoCreador';

const cells = [
  { id: 'alumno_nombre', typeHead: 'string', label: 'Alumno', value: (v) => v, align: 'left', mostrarInicio: true },
  { id: 'curso_nombre', typeHead: 'string', label: 'Curso', value: (v) => v, align: 'left', mostrarInicio: true, ordenable: false },
  { id: 'plan_nombre', typeHead: 'string', label: 'Plan', value: (v) => v, align: 'left', mostrarInicio: false, ordenable: false },
  { id: 'monto', typeHead: 'numeric', label: 'Monto', value: formatoMoneda, align: 'right', mostrarInicio: true },
  { id: 'fecha_pago', typeHead: 'string', label: 'Fecha de pago', value: (v) => v, align: 'left', mostrarInicio: true },
  { id: 'metodo_pago', typeHead: 'string', label: 'Método', value: (v) => nombreDe(METODOS_PAGO, v), align: 'left', mostrarInicio: true },
  { id: 'referencia', typeHead: 'string', label: 'Referencia', value: (v) => v, align: 'left', mostrarInicio: false, ordenable: false },
  ...auditCells,
];

const filtrosConfig = [{ name: 'nombre', label: 'Alumno', type: 'text' }];

const Pagos = ({ route }) => {
  const { titulo, urlAyuda, permisos } = usePermisosOpcion(route.path);
  const { refreshKey, updateColeccion } = useCrudModulo();
  const [form, setForm] = useState({ open: false, accion: 'crear', id: 0 });

  const cerrar = () => setForm({ open: false, accion: 'crear', id: 0 });

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
        onCrear={() => setForm({ open: true, accion: 'crear', id: 0 })}
        onEditar={(row) => setForm({ open: true, accion: 'editar', id: row.id })}
        onVer={(row) => setForm({ open: true, accion: 'ver', id: row.id })}
      />
      {form.open && (
        <PagoCreador
          pago={form.id}
          accion={form.accion}
          titulo={titulo}
          handleOnClose={cerrar}
          updateColeccion={updateColeccion}
        />
      )}
    </>
  );
};

Pagos.propTypes = {
  route: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
};

export default Pagos;

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AppCrudTable, { auditCells } from '../../../shared/components/AppCrudTable';
import usePermisosOpcion from '../../../shared/hooks/usePermisosOpcion';
import useCrudModulo from '../../../shared/hooks/useCrudModulo';
import { onGetColeccion, onDelete } from '../../../@crema/redux/features/asistencias/asistenciasSlice';
import AsistenciaCreador from './AsistenciaCreador';

const cells = [
  { id: 'curso_nombre', typeHead: 'string', label: 'Curso', value: (v) => v, align: 'left', mostrarInicio: true },
  { id: 'fecha_sesion', typeHead: 'string', label: 'Fecha', value: (v) => v, align: 'left', mostrarInicio: true },
  { id: 'presentes', typeHead: 'numeric', label: 'Presentes', value: (v) => v, align: 'center', mostrarInicio: true, ordenable: false },
  { id: 'total_alumnos', typeHead: 'numeric', label: 'Total', value: (v) => v, align: 'center', mostrarInicio: true, ordenable: false },
  { id: 'observacion', typeHead: 'string', label: 'Observación', value: (v) => v, align: 'left', mostrarInicio: false, ordenable: false },
  ...auditCells,
];

const Asistencias = ({ route }) => {
  const { titulo, urlAyuda, permisos } = usePermisosOpcion(route.path);
  const { refreshKey, updateColeccion } = useCrudModulo();
  const [form, setForm] = useState({ open: false, accion: 'crear', id: 0 });

  const cerrar = () => setForm({ open: false, accion: 'crear', id: 0 });

  return (
    <>
      <AppCrudTable
        stateKey='asistencias'
        onGetColeccion={onGetColeccion}
        onDelete={onDelete}
        cells={cells}
        titulo={titulo}
        urlAyuda={urlAyuda}
        permisos={permisos}
        entidadNombre='Asistencia'
        refreshKey={refreshKey}
        onCrear={() => setForm({ open: true, accion: 'crear', id: 0 })}
        onEditar={(row) => setForm({ open: true, accion: 'editar', id: row.id })}
        onVer={(row) => setForm({ open: true, accion: 'ver', id: row.id })}
      />
      {form.open && (
        <AsistenciaCreador
          asistencia={form.id}
          accion={form.accion}
          titulo={titulo}
          handleOnClose={cerrar}
          updateColeccion={updateColeccion}
        />
      )}
    </>
  );
};

Asistencias.propTypes = {
  route: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
};

export default Asistencias;

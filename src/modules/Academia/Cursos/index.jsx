import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AppCrudTable, { auditCells } from '../../../shared/components/AppCrudTable';
import usePermisosOpcion from '../../../shared/hooks/usePermisosOpcion';
import useCrudModulo from '../../../shared/hooks/useCrudModulo';
import { onGetColeccion, onDelete } from '../../../@crema/redux/features/cursos/cursosSlice';
import {
  DIAS_SEMANA,
  nombreDe,
  valorActivo,
  colorActivo,
  valorSiNo,
} from '../../../shared/constants/Academia';
import CursoCreador from './CursoCreador';

const cells = [
  { id: 'ritmo_nombre', typeHead: 'string', label: 'Ritmo', value: (v) => v, align: 'left', mostrarInicio: true },
  { id: 'profesor_nombre', typeHead: 'string', label: 'Profesor', value: (v) => v, align: 'left', mostrarInicio: true },
  { id: 'dia', typeHead: 'string', label: 'Día', value: (v) => nombreDe(DIAS_SEMANA, v), align: 'left', mostrarInicio: true },
  { id: 'hora', typeHead: 'string', label: 'Hora', value: (v) => (v ? String(v).substring(0, 5) : ''), align: 'left', mostrarInicio: true },
  { id: 'plan_nombre', typeHead: 'string', label: 'Plan', value: (v) => v, align: 'left', mostrarInicio: true, ordenable: false },
  { id: 'matriculados', typeHead: 'numeric', label: 'Matriculados', value: (v) => v, align: 'center', mostrarInicio: true, ordenable: false },
  { id: 'activo', typeHead: 'string', label: 'Activo', value: valorSiNo, cellColor: colorActivo, align: 'left', mostrarInicio: true },
  { id: 'estado', typeHead: 'string', label: 'Estado', value: valorActivo, cellColor: colorActivo, align: 'left', mostrarInicio: false },
  ...auditCells,
];

const filtrosConfig = [{ name: 'nombre', label: 'Ritmo', type: 'text' }];

const Cursos = ({ route }) => {
  const { titulo, urlAyuda, permisos } = usePermisosOpcion(route.path);
  const { refreshKey, updateColeccion } = useCrudModulo();
  const [form, setForm] = useState({ open: false, accion: 'crear', id: 0 });

  const cerrar = () => setForm({ open: false, accion: 'crear', id: 0 });

  return (
    <>
      <AppCrudTable
        stateKey='cursos'
        onGetColeccion={onGetColeccion}
        onDelete={onDelete}
        cells={cells}
        filtrosConfig={filtrosConfig}
        titulo={titulo}
        urlAyuda={urlAyuda}
        permisos={permisos}
        entidadNombre='Curso'
        refreshKey={refreshKey}
        onCrear={() => setForm({ open: true, accion: 'crear', id: 0 })}
        onEditar={(row) => setForm({ open: true, accion: 'editar', id: row.id })}
        onVer={(row) => setForm({ open: true, accion: 'ver', id: row.id })}
      />
      {form.open && (
        <CursoCreador
          curso={form.id}
          accion={form.accion}
          titulo={titulo}
          handleOnClose={cerrar}
          updateColeccion={updateColeccion}
        />
      )}
    </>
  );
};

Cursos.propTypes = {
  route: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
};

export default Cursos;

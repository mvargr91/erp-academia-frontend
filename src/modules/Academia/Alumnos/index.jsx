import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AppCrudTable, { auditCells } from '../../../shared/components/AppCrudTable';
import usePermisosOpcion from '../../../shared/hooks/usePermisosOpcion';
import useCrudModulo from '../../../shared/hooks/useCrudModulo';
import { onGetColeccion, onDelete } from '../../../@crema/redux/features/alumnos/alumnosSlice';
import { valorActivo, colorActivo } from '../../../shared/constants/Academia';
import AlumnoCreador from './AlumnoCreador';

const cells = [
  { id: 'nombres', typeHead: 'string', label: 'Nombres', value: (v) => v, align: 'left', mostrarInicio: true },
  { id: 'apellidos', typeHead: 'string', label: 'Apellidos', value: (v) => v, align: 'left', mostrarInicio: true },
  { id: 'documento', typeHead: 'string', label: 'Documento', value: (v) => v, align: 'left', mostrarInicio: true, ordenable: false },
  { id: 'telefono', typeHead: 'string', label: 'Teléfono', value: (v) => v, align: 'left', mostrarInicio: true, ordenable: false },
  { id: 'correo', typeHead: 'string', label: 'Correo', value: (v) => v, align: 'left', mostrarInicio: true, ordenable: false },
  { id: 'estado', typeHead: 'string', label: 'Estado', value: valorActivo, cellColor: colorActivo, align: 'left', mostrarInicio: true },
  ...auditCells,
];

const filtrosConfig = [{ name: 'nombre', label: 'Nombre o apellido', type: 'text' }];

const Alumnos = ({ route }) => {
  const { titulo, urlAyuda, permisos } = usePermisosOpcion(route.path);
  const { refreshKey, updateColeccion } = useCrudModulo();
  const [form, setForm] = useState({ open: false, accion: 'crear', id: 0 });

  const cerrar = () => setForm({ open: false, accion: 'crear', id: 0 });

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
        onCrear={() => setForm({ open: true, accion: 'crear', id: 0 })}
        onEditar={(row) => setForm({ open: true, accion: 'editar', id: row.id })}
        onVer={(row) => setForm({ open: true, accion: 'ver', id: row.id })}
      />
      {form.open && (
        <AlumnoCreador
          alumno={form.id}
          accion={form.accion}
          titulo={titulo}
          handleOnClose={cerrar}
          updateColeccion={updateColeccion}
        />
      )}
    </>
  );
};

Alumnos.propTypes = {
  route: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
};

export default Alumnos;

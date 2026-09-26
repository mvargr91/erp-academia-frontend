import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AppCrudTable, { auditCells } from '../../../shared/components/AppCrudTable';
import usePermisosOpcion from '../../../shared/hooks/usePermisosOpcion';
import useCrudModulo from '../../../shared/hooks/useCrudModulo';
import { onGetColeccion, onDelete } from '../../../@crema/redux/features/ritmos/ritmosSlice';
import { valorActivo, colorActivo } from '../../../shared/constants/Academia';
import RitmoCreador from './RitmoCreador';

const cells = [
  { id: 'nombre', typeHead: 'string', label: 'Nombre', value: (v) => v, align: 'left', mostrarInicio: true },
  { id: 'descripcion', typeHead: 'string', label: 'Descripción', value: (v) => v, align: 'left', mostrarInicio: true, ordenable: false },
  { id: 'estado', typeHead: 'string', label: 'Estado', value: valorActivo, cellColor: colorActivo, align: 'left', mostrarInicio: true },
  ...auditCells,
];

const filtrosConfig = [{ name: 'nombre', label: 'Nombre', type: 'text' }];

const Ritmos = ({ route }) => {
  const { titulo, urlAyuda, permisos } = usePermisosOpcion(route.path);
  const { refreshKey, updateColeccion } = useCrudModulo();
  const [form, setForm] = useState({ open: false, accion: 'crear', id: 0 });

  const cerrar = () => setForm({ open: false, accion: 'crear', id: 0 });

  return (
    <>
      <AppCrudTable
        stateKey='ritmos'
        onGetColeccion={onGetColeccion}
        onDelete={onDelete}
        cells={cells}
        filtrosConfig={filtrosConfig}
        titulo={titulo}
        urlAyuda={urlAyuda}
        permisos={permisos}
        entidadNombre='Ritmo'
        refreshKey={refreshKey}
        onCrear={() => setForm({ open: true, accion: 'crear', id: 0 })}
        onEditar={(row) => setForm({ open: true, accion: 'editar', id: row.id })}
        onVer={(row) => setForm({ open: true, accion: 'ver', id: row.id })}
      />
      {form.open && (
        <RitmoCreador
          ritmo={form.id}
          accion={form.accion}
          titulo={titulo}
          handleOnClose={cerrar}
          updateColeccion={updateColeccion}
        />
      )}
    </>
  );
};

Ritmos.propTypes = {
  route: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
};

export default Ritmos;

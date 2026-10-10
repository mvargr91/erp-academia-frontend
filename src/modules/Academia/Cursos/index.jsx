import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AppCrudTable, { auditCells } from '../../../shared/components/AppCrudTable';
import usePermisosOpcion from '../../../shared/hooks/usePermisosOpcion';
import { accionesEnPagina } from '../../../shared/components/PaginaCrud';
import useCrudModulo from '../../../shared/hooks/useCrudModulo';
import { onGetColeccion, onDelete } from '../../../@crema/redux/features/cursos/cursosSlice';
import { useSedes, celdaSede } from '../../../shared/sedes';
import {
  DIAS_SEMANA,
  nombreDe,
  valorActivo,
  colorActivo,
  valorSiNo,
} from '../../../shared/constants/Academia';

const columnas = (variasSedes) => [
  { id: 'ritmo_nombre', typeHead: 'string', label: 'Ritmo', value: (v) => v, align: 'left', mostrarInicio: true },
  celdaSede(variasSedes, { ordenable: true }),
  { id: 'profesor_nombre', typeHead: 'string', label: 'Profesor', value: (v) => v, align: 'left', mostrarInicio: true },
  { id: 'dia', typeHead: 'string', label: 'Día', value: (v) => nombreDe(DIAS_SEMANA, v), align: 'left', mostrarInicio: true },
  { id: 'hora', typeHead: 'string', label: 'Hora', value: (v) => (v ? String(v).substring(0, 5) : ''), align: 'left', mostrarInicio: true },
  { id: 'matriculados', typeHead: 'numeric', label: 'Matriculados', value: (v) => v, align: 'center', mostrarInicio: true, ordenable: false },
  { id: 'activo', typeHead: 'string', label: 'Activo', value: valorSiNo, cellColor: colorActivo, align: 'left', mostrarInicio: true },
  { id: 'estado', typeHead: 'string', label: 'Estado', value: valorActivo, cellColor: colorActivo, align: 'left', mostrarInicio: false },
  ...auditCells,
];

const filtrosConfig = [{ name: 'nombre', label: 'Ritmo', type: 'text' }];

const Cursos = ({ route }) => {
  const { variasSedes } = useSedes();
  const cells = useMemo(() => columnas(variasSedes), [variasSedes]);
  const { titulo, urlAyuda, permisos } = usePermisosOpcion(route.path);
  const { refreshKey } = useCrudModulo();
  const navigate = useNavigate();

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
        {...accionesEnPagina(navigate, route.path)}
        accionesExtra={[
          { titulo: 'Calendario de clases', icono: CalendarMonthIcon, onClick: (row) => navigate(`${route.path}/${row.id}/calendario`) },
        ]}
      />
    </>
  );
};

Cursos.propTypes = {
  route: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
};

export default Cursos;

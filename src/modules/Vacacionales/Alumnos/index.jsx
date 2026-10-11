// Alumnos de vacacionales: un público aparte de los alumnos de la academia.
import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import AppCrudTable, { auditCells } from '../../../shared/components/AppCrudTable';
import usePermisosOpcion from '../../../shared/hooks/usePermisosOpcion';
import { accionesEnPagina } from '../../../shared/components/PaginaCrud';
import useCrudModulo from '../../../shared/hooks/useCrudModulo';
import { onGetColeccion, onDelete } from '../../../@crema/redux/features/vacacionales/vacacionalAlumnosSlice';
import { valorActivo, colorActivo } from '../../../shared/constants/Academia';

const texto = { typeHead: 'string', value: (v) => v, align: 'left', ordenable: false };

const cells = [
  { id: 'nombre', label: 'Alumno', ...texto, mostrarInicio: true },
  { id: 'documento', label: 'Documento', ...texto, mostrarInicio: false },
  { id: 'fecha_nacimiento', label: 'Nacimiento', ...texto, mostrarInicio: false },
  { id: 'telefono', label: 'Teléfono', ...texto, mostrarInicio: true },
  { id: 'correo', label: 'Correo', ...texto, mostrarInicio: true },
  { id: 'acudiente_nombre', label: 'Acudiente', ...texto, mostrarInicio: true },
  { id: 'acudiente_telefono', label: 'Tel. acudiente', ...texto, mostrarInicio: false },
  { id: 'inscripciones', label: 'Vacacionales tomados', ...texto, typeHead: 'numeric', align: 'right', mostrarInicio: true },
  { id: 'ultimo_vacacional', label: 'Último vacacional', ...texto, mostrarInicio: true },
  { id: 'estado', label: 'Estado', ...texto, value: valorActivo, cellColor: colorActivo, mostrarInicio: true },
  ...auditCells,
];

const filtrosConfig = [{ name: 'nombre', label: 'Nombre o apellido', type: 'text' }];

const VacacionalAlumnos = ({ route }) => {
  const { titulo, urlAyuda, permisos } = usePermisosOpcion(route.path);
  const { refreshKey } = useCrudModulo();
  const navigate = useNavigate();

  return (
    <AppCrudTable
      stateKey='vacacionalAlumnos'
      onGetColeccion={onGetColeccion}
      onDelete={onDelete}
      cells={cells}
      filtrosConfig={filtrosConfig}
      titulo={titulo}
      subtitulo='Este listado es solo de vacacionales: no se mezcla con los alumnos de la academia.'
      urlAyuda={urlAyuda}
      permisos={permisos}
      entidadNombre='Alumno'
      refreshKey={refreshKey}
      defaultOrderBy=''
      {...accionesEnPagina(navigate, route.path)}
      accionesExtra={[
        {
          titulo: 'Inscribir a un vacacional',
          icono: HowToRegIcon,
          color: 'green',
          permiso: 'Inscribir',
          onClick: (row) => navigate(`/vacacionales-inscripciones/crear?alumno=${row.id}&volver=${route.path}`),
        },
      ]}
    />
  );
};

VacacionalAlumnos.propTypes = {
  route: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
};

export default VacacionalAlumnos;

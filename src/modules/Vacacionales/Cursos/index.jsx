// Cursos vacacionales: género, profesor y días de clase sueltos. Desde aquí se inscribe a los alumnos
// y se anuncia por correo un vacacional próximo.
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import GroupsIcon from '@mui/icons-material/Groups';
import CampaignIcon from '@mui/icons-material/Campaign';
import ChecklistIcon from '@mui/icons-material/Checklist';
import AppCrudTable, { auditCells } from '../../../shared/components/AppCrudTable';
import { useSedes, celdaSede } from '../../../shared/sedes';
import usePermisosOpcion from '../../../shared/hooks/usePermisosOpcion';
import { accionesEnPagina } from '../../../shared/components/PaginaCrud';
import useCrudModulo from '../../../shared/hooks/useCrudModulo';
import { onGetColeccion, onDelete } from '../../../@crema/redux/features/vacacionales/vacacionalCursosSlice';
import { formatoMoneda, valorActivo, colorActivo } from '../../../shared/constants/Academia';

const COLORES = { proximo: 'green', en_curso: 'orange', finalizado: 'gray' };
const texto = { typeHead: 'string', value: (v) => v, align: 'left', ordenable: false };
const horario = (_v, row) => (row.hora_inicio ? `${row.hora_inicio}${row.hora_fin ? ` a ${row.hora_fin}` : ''}` : '');

const columnas = (variasSedes) => [
  { id: 'nombre', label: 'Curso', ...texto, mostrarInicio: true },
  { id: 'ritmo_nombre', label: 'Género', ...texto, mostrarInicio: true },
  { id: 'profesor_nombre', label: 'Profesor', ...texto, mostrarInicio: false },
  celdaSede(variasSedes),
  { id: 'fechas_texto', label: 'Días de clase', ...texto, mostrarInicio: true },
  { id: 'hora_inicio', label: 'Horario', ...texto, value: horario, mostrarInicio: true },
  { id: 'clases_por_alumno', label: 'Clases por alumno', ...texto, typeHead: 'numeric', align: 'right', mostrarInicio: false },
  { id: 'valor', label: 'Valor', ...texto, typeHead: 'numeric', value: formatoMoneda, align: 'right', mostrarInicio: true },
  {
    id: 'inscritos',
    label: 'Inscritos',
    ...texto,
    value: (v, row) => (row.cupo_max ? `${v} (cupo ${row.cupo_max} por clase)` : v),
    mostrarInicio: false,
  },
  { id: 'momento_nombre', label: 'Momento', ...texto, cellColor: (_v, row) => COLORES[row?.momento] ?? '', mostrarInicio: true },
  { id: 'estado', label: 'Estado', ...texto, value: valorActivo, cellColor: colorActivo, mostrarInicio: false },
  ...auditCells,
];

const filtrosConfig = [
  { name: 'nombre', label: 'Curso', type: 'text' },
  {
    name: 'momento',
    label: 'Momento',
    type: 'select',
    options: [
      { id: 'vigente', nombre: 'Próximos y en curso' },
      { id: 'finalizado', nombre: 'Finalizados' },
    ],
  },
];

const VacacionalCursos = ({ route }) => {
  const { variasSedes } = useSedes();
  const cells = useMemo(() => columnas(variasSedes), [variasSedes]);
  const { titulo, urlAyuda, permisos } = usePermisosOpcion(route.path);
  const { permisos: permisosAsistencia } = usePermisosOpcion('/vacacionales-asistencia');
  const { permisos: permisosEnvio } = usePermisosOpcion('/envios-correo');
  const { refreshKey } = useCrudModulo();
  const navigate = useNavigate();

  return (
    <AppCrudTable
      stateKey='vacacionalCursos'
      onGetColeccion={onGetColeccion}
      onDelete={onDelete}
      cells={cells}
      filtrosConfig={filtrosConfig}
      titulo={titulo}
      subtitulo='Usa «Inscritos» para inscribir alumnos y cobrar, «Tomar asistencia» en cada día de clase y «Anunciar por correo» para avisar de un vacacional próximo.'
      urlAyuda={urlAyuda}
      permisos={permisos}
      entidadNombre='Curso vacacional'
      refreshKey={refreshKey}
      defaultOrderBy=''
      {...accionesEnPagina(navigate, route.path)}
      accionesExtra={[
        {
          titulo: 'Inscritos',
          icono: GroupsIcon,
          color: 'green',
          permiso: 'VerInscritos',
          onClick: (row) => navigate(`/vacacionales-inscripciones?curso=${row.id}`),
        },
        // Tomar asistencia es otra opción del menú: la habilitan sus propios permisos.
        {
          titulo: 'Tomar asistencia',
          icono: ChecklistIcon,
          visible: () => permisosAsistencia.length > 0,
          onClick: (row) => navigate(`/vacacionales-asistencia?curso=${row.id}`),
        },
        // Además del permiso «Anunciar», enviar exige poder crear envíos de correo.
        {
          titulo: 'Anunciar por correo',
          icono: CampaignIcon,
          permiso: 'Anunciar',
          visible: (row) => row.momento !== 'finalizado' && permisosEnvio.indexOf('Crear') >= 0,
          onClick: (row) => navigate(`/envios-correo/crear?vacacional=${row.id}`),
        },
      ]}
    />
  );
};

VacacionalCursos.propTypes = {
  route: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
};

export default VacacionalCursos;

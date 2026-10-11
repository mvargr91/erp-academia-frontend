// Inscripciones a cursos vacacionales. Con ?curso=ID (desde «Inscritos» del curso) muestra solo las de ese curso.
import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PaymentsIcon from '@mui/icons-material/Payments';
import AppCrudTable, { auditCells } from '../../../shared/components/AppCrudTable';
import { useSedes, celdaSede } from '../../../shared/sedes';
import usePermisosOpcion from '../../../shared/hooks/usePermisosOpcion';
import { rutaCrear, rutaEditar, rutaVer } from '../../../shared/components/PaginaCrud';
import useCrudModulo from '../../../shared/hooks/useCrudModulo';
import jwtAxios from '../../../@crema/services/auth/jwt-auth';
import { onGetColeccion, onDelete } from '../../../@crema/redux/features/vacacionales/vacacionalInscripcionesSlice';
import { formatoMoneda } from '../../../shared/constants/Academia';

const texto = { typeHead: 'string', value: (v) => v, align: 'left', ordenable: false };
const dinero = { ...texto, typeHead: 'numeric', value: formatoMoneda, align: 'right' };

const columnas = (variasSedes) => [
  { id: 'alumno_nombre', label: 'Alumno', ...texto, mostrarInicio: true },
  { id: 'curso_nombre', label: 'Curso vacacional', ...texto, mostrarInicio: true },
  celdaSede(variasSedes),
  { id: 'fechas_texto', label: 'Clases que toma', ...texto, mostrarInicio: true },
  {
    id: 'asistencias',
    label: 'Asistencia',
    ...texto,
    value: (v, row) => `${v} de ${row.fechas.length}${row.faltas ? ` · ${row.faltas} falta${row.faltas === 1 ? '' : 's'}` : ''}`,
    mostrarInicio: true,
  },
  { id: 'fecha_inscripcion', label: 'Inscripción', ...texto, mostrarInicio: false },
  { id: 'alumno_telefono', label: 'Teléfono', ...texto, mostrarInicio: false },
  { id: 'alumno_correo', label: 'Correo', ...texto, mostrarInicio: false },
  { id: 'valor', label: 'Valor', ...dinero, mostrarInicio: true },
  { id: 'pagado', label: 'Pagado', ...dinero, mostrarInicio: true },
  { id: 'saldo', label: 'Por pagar', ...dinero, cellColor: (v) => (Number(v) > 0 ? 'red' : ''), mostrarInicio: true },
  {
    id: 'estado',
    label: 'Estado',
    ...texto,
    value: (v) => (v ? 'Activa' : 'Anulada'),
    cellColor: (v) => (v ? 'green' : 'gray'),
    mostrarInicio: true,
  },
  ...auditCells,
];

const filtrosConfig = [
  { name: 'nombre', label: 'Alumno', type: 'text' },
  {
    name: 'pago',
    label: 'Pago',
    type: 'select',
    options: [
      { id: 'pendiente', nombre: 'Con saldo por pagar' },
      { id: 'pagado', nombre: 'Pagado completo' },
    ],
  },
];

const VacacionalInscripciones = ({ route }) => {
  const { variasSedes } = useSedes();
  const cells = useMemo(() => columnas(variasSedes), [variasSedes]);
  const { titulo, urlAyuda, permisos: propios } = usePermisosOpcion(route.path);
  const { permisos: permisosCurso } = usePermisosOpcion('/vacacionales-cursos');
  const { refreshKey } = useCrudModulo();
  const navigate = useNavigate();
  const [query] = useSearchParams();
  const cursoId = Number(query.get('curso')) || null;
  const [curso, setCurso] = useState(null);
  // Quien llega con «Inscritos» desde un curso (permiso VerInscritos) puede ver la lista de ese curso.
  const permisos = useMemo(
    () => (cursoId && permisosCurso.includes('VerInscritos') && !propios.includes('Listar') ? [...propios, 'Listar'] : propios),
    [cursoId, permisosCurso, propios],
  );

  useEffect(() => {
    setCurso(null);
    if (cursoId) {
      jwtAxios.get(`vacacionales-cursos/${cursoId}`).then(({ data }) => setCurso(data)).catch(() => {});
    }
  }, [cursoId]);

  // Los formularios regresan a esta misma lista (filtrada por el curso si venía así).
  const aqui = cursoId ? `${route.path}?curso=${cursoId}` : route.path;
  const con = (ruta, extra = '') => `${ruta}?volver=${encodeURIComponent(aqui)}${extra}`;

  return (
    <AppCrudTable
      stateKey='vacacionalInscripciones'
      onGetColeccion={onGetColeccion}
      onDelete={onDelete}
      cells={cells}
      filtrosConfig={filtrosConfig}
      filtrosFijos={cursoId ? { curso_id: cursoId } : {}}
      titulo={curso ? `Inscritos · ${curso.nombre}` : titulo}
      subtitulo={
        curso
          ? `${curso.fechas_texto}${curso.cupo_max ? ` · cupo ${curso.cupo_max} por clase` : ''}`
          : 'Después de inscribir al alumno, usa «Registrar pago» para cobrarle (completo o por abonos).'
      }
      urlAyuda={urlAyuda}
      permisos={permisos}
      entidadNombre='Inscripción'
      refreshKey={refreshKey}
      defaultOrderBy=''
      onVolver={cursoId ? () => navigate('/vacacionales-cursos') : undefined}
      onCrear={() => navigate(con(rutaCrear(route.path), cursoId ? `&curso=${cursoId}` : ''))}
      onEditar={(row) => navigate(con(rutaEditar(route.path, row.id)))}
      onVer={(row) => navigate(con(rutaVer(route.path, row.id)))}
      accionesExtra={[
        {
          titulo: 'Registrar pago',
          icono: PaymentsIcon,
          permiso: 'Pagar',
          onClick: (row) => navigate(con(`${route.path}/${row.id}/pago`)),
        },
      ]}
    />
  );
};

VacacionalInscripciones.propTypes = {
  route: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
};

export default VacacionalInscripciones;

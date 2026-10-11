import React from 'react';
import { authRole } from '@crema/constants/AppConst';
import { RoutePermittedRole } from '@crema/constants/AppEnums';
import { rutasCrud } from '../../../shared/components/PaginaCrud';

const Alumnos = React.lazy(() => import('../../../modules/Vacacionales/Alumnos'));
const AlumnoCreador = React.lazy(() => import('../../../modules/Vacacionales/Alumnos/AlumnoCreador'));
const Cursos = React.lazy(() => import('../../../modules/Vacacionales/Cursos'));
const CursoCreador = React.lazy(() => import('../../../modules/Vacacionales/Cursos/CursoCreador'));
const Inscripciones = React.lazy(() => import('../../../modules/Vacacionales/Inscripciones'));
const InscripcionCreador = React.lazy(() => import('../../../modules/Vacacionales/Inscripciones/InscripcionCreador'));
const PagarInscripcion = React.lazy(() => import('../../../modules/Vacacionales/Inscripciones/PagarInscripcion'));
const Pagos = React.lazy(() => import('../../../modules/Vacacionales/Pagos'));
const Asistencia = React.lazy(() => import('../../../modules/Vacacionales/Asistencia'));
const Matriculas = React.lazy(() => import('../../../modules/Vacacionales/Matriculas'));

// Al guardar se vuelve a la lista, que se recarga al montarse.
const sinRecarga = () => {};

const props = ({ accion, volver, titulo }) => ({
  accion,
  titulo,
  handleOnClose: volver,
  updateColeccion: sinRecarga,
});

// Cursos vacacionales: público aparte de la academia (alumnos, cursos, inscripciones y pagos propios).
export const vacacionalesConfigs = [
  ...rutasCrud('/vacacionales-alumnos', Alumnos, (p) => <AlumnoCreador alumno={p.id} {...props(p)} />),
  ...rutasCrud('/vacacionales-cursos', Cursos, (p) => <CursoCreador curso={p.id} {...props(p)} />),
  // /vacacionales-inscripciones/crear?alumno=ID&curso=ID abre la inscripción con esos datos.
  ...rutasCrud('/vacacionales-inscripciones', Inscripciones, (p) => (
    <InscripcionCreador
      inscripcion={p.id}
      inicial={{
        alumno_id: Number(p.query.get('alumno')) || '',
        curso_id: Number(p.query.get('curso')) || '',
      }}
      {...props(p)}
    />
  )),
  {
    permittedRole: RoutePermittedRole.User,
    path: '/vacacionales-inscripciones/:id/pago',
    element: <PagarInscripcion />,
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: '/vacacionales-matriculas',
    element: <Matriculas route={{ auth: authRole, path: '/vacacionales-matriculas' }} />,
  },
  // /vacacionales-asistencia?curso=ID abre la asistencia de ese curso.
  {
    permittedRole: RoutePermittedRole.User,
    path: '/vacacionales-asistencia',
    element: <Asistencia route={{ auth: authRole, path: '/vacacionales-asistencia' }} />,
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: '/vacacionales-pagos',
    element: <Pagos route={{ auth: authRole, path: '/vacacionales-pagos' }} />,
  },
];

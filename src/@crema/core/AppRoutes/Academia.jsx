import React from 'react';
import { authRole } from '@crema/constants/AppConst';
import { RoutePermittedRole } from '@crema/constants/AppEnums';
import { rutasCrud } from '../../../shared/components/PaginaCrud';

const DashboardAcademia = React.lazy(() => import('../../../modules/Academia/DashboardAcademia'));
const Sedes = React.lazy(() => import('../../../modules/Academia/Sedes'));
const SedeCreador = React.lazy(() => import('../../../modules/Academia/Sedes/SedeCreador'));
const Ritmos = React.lazy(() => import('../../../modules/Academia/Ritmos'));
const RitmoCreador = React.lazy(() => import('../../../modules/Academia/Ritmos/RitmoCreador'));
const Planes = React.lazy(() => import('../../../modules/Academia/Planes'));
const PlanCreador = React.lazy(() => import('../../../modules/Academia/Planes/PlanCreador'));
const Profesores = React.lazy(() => import('../../../modules/Academia/Profesores'));
const ProfesorCreador = React.lazy(() => import('../../../modules/Academia/Profesores/ProfesorCreador'));
const Alumnos = React.lazy(() => import('../../../modules/Academia/Alumnos'));
const AlumnoCreador = React.lazy(() => import('../../../modules/Academia/Alumnos/AlumnoCreador'));
const EstadoCuenta = React.lazy(() => import('../../../modules/Academia/Alumnos/EstadoCuenta'));
const Cursos = React.lazy(() => import('../../../modules/Academia/Cursos'));
const CursoCreador = React.lazy(() => import('../../../modules/Academia/Cursos/CursoCreador'));
const Pagos = React.lazy(() => import('../../../modules/Academia/Pagos'));
const PagoCreador = React.lazy(() => import('../../../modules/Academia/Pagos/PagoCreador'));
const Asistencias = React.lazy(() => import('../../../modules/Academia/Asistencias'));
const AsistenciaCreador = React.lazy(() => import('../../../modules/Academia/Asistencias/AsistenciaCreador'));
const CalendarioCurso = React.lazy(() => import('../../../modules/Academia/Cursos/CalendarioCurso'));
const Paquetes = React.lazy(() => import('../../../modules/Academia/Paquetes'));
const PaqueteCreador = React.lazy(() => import('../../../modules/Academia/Paquetes/PaqueteCreador'));
const ClasesPrivadas = React.lazy(() => import('../../../modules/Academia/ClasesPrivadas'));
const ClasePrivadaCreador = React.lazy(() => import('../../../modules/Academia/ClasesPrivadas/ClasePrivadaCreador'));
const RegistrarClase = React.lazy(() => import('../../../modules/Academia/ClasesPrivadas/RegistrarClase'));
const Cierres = React.lazy(() => import('../../../modules/Academia/Cierres'));
const Parametros = React.lazy(() => import('../../../modules/Academia/Parametros'));
const EnviosCorreo = React.lazy(() => import('../../../modules/Academia/EnviosCorreo'));
const NuevoEnvio = React.lazy(() => import('../../../modules/Academia/EnviosCorreo/NuevoEnvio'));
const DetalleEnvio = React.lazy(() => import('../../../modules/Academia/EnviosCorreo/DetalleEnvio'));
const ParametroCreador = React.lazy(() => import('../../../modules/Academia/Parametros/ParametroCreador'));
const Apariencia = React.lazy(() => import('../../../modules/Academia/Apariencia'));
const PlantillasCorreo = React.lazy(() => import('../../../modules/Academia/PlantillasCorreo'));
const PlantillaCreador = React.lazy(() => import('../../../modules/Academia/PlantillasCorreo/PlantillaCreador'));
const CierreCreador = React.lazy(() => import('../../../modules/Academia/Cierres/CierreCreador'));
const Festivos = React.lazy(() => import('../../../modules/Administracion/Festivos'));
const FestivoCreador = React.lazy(() => import('../../../modules/Administracion/Festivos/FestivoCreador'));
const Academias = React.lazy(() => import('../../../modules/Administracion/Academias'));
const AcademiaCreador = React.lazy(() => import('../../../modules/Administracion/Academias/AcademiaCreador'));
const PanelErp = React.lazy(() => import('../../../modules/Administracion/PanelErp'));
const FacturasAcademias = React.lazy(() => import('../../../modules/Administracion/FacturasAcademias'));
const PagosAcademias = React.lazy(() => import('../../../modules/Administracion/PagosAcademias'));
const PagoAcademiaCreador = React.lazy(() =>
  import('../../../modules/Administracion/PagosAcademias/PagoAcademiaCreador'),
);

// Al guardar se vuelve a la lista, que se recarga al montarse.
const sinRecarga = () => {};

// Props comunes de los "Creador" mostrados como vista (ver PaginaCrud).
const props = ({ accion, volver, titulo }) => ({
  accion,
  titulo,
  handleOnClose: volver,
  updateColeccion: sinRecarga,
});

export const academiaConfigs = [
  {
    permittedRole: RoutePermittedRole.User,
    path: '/dashboard-academia',
    element: <DashboardAcademia route={{ auth: authRole, path: '/dashboard-academia' }} />,
  },
  ...rutasCrud('/sedes', Sedes, (p) => <SedeCreador sede={p.id} {...props(p)} />),
  ...rutasCrud('/ritmos', Ritmos, (p) => <RitmoCreador ritmo={p.id} {...props(p)} />),
  ...rutasCrud('/planes', Planes, (p) => <PlanCreador plan={p.id} {...props(p)} />),
  ...rutasCrud('/profesores', Profesores, (p) => <ProfesorCreador profesor={p.id} {...props(p)} />),
  ...rutasCrud('/alumnos', Alumnos, (p) => <AlumnoCreador alumno={p.id} {...props(p)} />),
  {
    permittedRole: RoutePermittedRole.User,
    path: '/alumnos/:id/cuenta',
    element: <EstadoCuenta />,
  },
  ...rutasCrud('/cursos', Cursos, (p) => <CursoCreador curso={p.id} {...props(p)} />),
  {
    permittedRole: RoutePermittedRole.User,
    path: '/cursos/:id/calendario',
    element: <CalendarioCurso />,
  },
  // /pagos/crear?alumno=ID&curso=ID&paquete=ID&monto=N abre el pago con esos datos (estado de cuenta del alumno).
  ...rutasCrud('/pagos', Pagos, (p) => (
    <PagoCreador
      pago={p.id}
      inicial={{
        alumno_id: Number(p.query.get('alumno')) || '',
        curso_id: Number(p.query.get('curso')) || '',
        paquete_id: Number(p.query.get('paquete')) || '',
        monto: Number(p.query.get('monto')) || '',
      }}
      {...props(p)}
    />
  )),
  ...rutasCrud('/asistencias', Asistencias, (p) => <AsistenciaCreador asistencia={p.id} {...props(p)} />),
  ...rutasCrud('/cierres', Cierres, (p) => <CierreCreador cierre={p.id} {...props(p)} />),
  // Configuración: los registros los define el sistema; solo se editan.
  ...rutasCrud('/parametros', Parametros, (p) => <ParametroCreador parametro={p.id} {...props(p)} />, ['editar', 'ver']),
  ...rutasCrud('/plantillas-correo', PlantillasCorreo, (p) => <PlantillaCreador plantilla={p.id} {...props(p)} />),
  {
    permittedRole: RoutePermittedRole.User,
    path: '/apariencia',
    element: <Apariencia route={{ auth: authRole, path: '/apariencia' }} />,
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: '/envios-correo',
    element: <EnviosCorreo route={{ auth: authRole, path: '/envios-correo' }} />,
  },
  { permittedRole: RoutePermittedRole.User, path: '/envios-correo/crear', element: <NuevoEnvio /> },
  { permittedRole: RoutePermittedRole.User, path: '/envios-correo/:id/ver', element: <DetalleEnvio /> },
  ...rutasCrud('/paquetes', Paquetes, (p) => <PaqueteCreador paquete={p.id} {...props(p)} />),
  ...rutasCrud('/clases-privadas', ClasesPrivadas, (p) => <ClasePrivadaCreador clase={p.id} {...props(p)} />),
  {
    permittedRole: RoutePermittedRole.User,
    path: '/clases-privadas/:id/registrar',
    element: <RegistrarClase />,
  },

  // Administración ERP (el menú solo existe en la academia administradora).
  ...rutasCrud('/academias', Academias, (p) => <AcademiaCreador academia={p.id} {...props(p)} />),
  ...rutasCrud('/festivos', Festivos, (p) => <FestivoCreador festivo={p.id} {...props(p)} />, ['crear', 'ver']),
  {
    permittedRole: RoutePermittedRole.User,
    path: '/panel-erp',
    element: <PanelErp route={{ auth: authRole, path: '/panel-erp' }} />,
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: '/facturas-academias',
    element: <FacturasAcademias route={{ auth: authRole, path: '/facturas-academias' }} />,
  },
  // Los pagos no se editan (se eliminan y se registran de nuevo).
  // /pagos-academias/crear?factura=ID abre el pago ya aplicado a esa cuenta de cobro.
  ...rutasCrud(
    '/pagos-academias',
    PagosAcademias,
    (p) => (
      <PagoAcademiaCreador
        pago={p.id}
        factura={p.query.get('factura') ? { id: Number(p.query.get('factura')) } : undefined}
        {...props(p)}
      />
    ),
    ['crear', 'ver'],
  ),
];

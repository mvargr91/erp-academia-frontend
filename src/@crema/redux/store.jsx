import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import usuariosReducer from './features/usuarios/usuariosSlice';
import commonReducer from './features/cammon/commonSlice' 
import rolesReducer from  './features/rol/rolesSlice';
import modulosReducer from  './features/modulo/moduloSlice';
import opcionSistemaReducer from  './features/opcionSistema/opcionSistemaSlice';
import permisosReducer  from  './features/permiso/permisoSlice';
import aplicacionesReducer  from  './features/aplicacion/aplicacionSlice';
import auditoriasReducer  from  './features/auditorias/auditoriasSlice';

// Mi cuenta
import cuentaReducer from './features/cuenta/cuentaSlice';
// Academia
import sedesReducer from './features/sedes/sedesSlice';
import sedeActualReducer from './features/sedes/sedeActualSlice';
import ritmosReducer from './features/ritmos/ritmosSlice';
import planesReducer from './features/planes/planesSlice';
import profesoresReducer from './features/profesores/profesoresSlice';
import alumnosReducer from './features/alumnos/alumnosSlice';
import cursosReducer from './features/cursos/cursosSlice';
import pagosReducer from './features/pagos/pagosSlice';
import asistenciasReducer from './features/asistencias/asistenciasSlice';
import cierresReducer from './features/cierres/cierresSlice';
import enviosCorreoReducer from './features/enviosCorreo/enviosCorreoSlice';
import parametrosReducer from './features/parametros/parametrosSlice';
import plantillasCorreoReducer from './features/plantillasCorreo/plantillasCorreoSlice';
import paquetesReducer from './features/paquetes/paquetesSlice';
import clasesPrivadasReducer from './features/clasesPrivadas/clasesPrivadasSlice';
import festivosReducer from './features/festivos/festivosSlice';
import academiasReducer from './features/academias/academiasSlice';
import facturasAcademiasReducer from './features/facturasAcademias/facturasAcademiasSlice';
import pagosAcademiasReducer from './features/pagosAcademias/pagosAcademiasSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    usuarios: usuariosReducer,
    common: commonReducer,
    roles: rolesReducer,
    modulos: modulosReducer,
    opcionSistema: opcionSistemaReducer,
    permisos: permisosReducer,
    aplicaciones: aplicacionesReducer,
    auditorias: auditoriasReducer,
    // Mi cuenta
    cuenta: cuentaReducer,
    // Academia
    sedes: sedesReducer,
    sedeActual: sedeActualReducer,
    ritmos: ritmosReducer,
    planes: planesReducer,
    profesores: profesoresReducer,
    alumnos: alumnosReducer,
    cursos: cursosReducer,
    pagos: pagosReducer,
    asistencias: asistenciasReducer,
    cierres: cierresReducer,
    enviosCorreo: enviosCorreoReducer,
    parametros: parametrosReducer,
    plantillasCorreo: plantillasCorreoReducer,
    paquetes: paquetesReducer,
    clasesPrivadas: clasesPrivadasReducer,
    // Administración ERP
    academias: academiasReducer,
    festivos: festivosReducer,
    facturasAcademias: facturasAcademiasReducer,
    pagosAcademias: pagosAcademiasReducer,
  },
});

export default store;

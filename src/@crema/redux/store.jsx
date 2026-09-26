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
import parametroConstantesReducer from './features/parametroConstante/parametroConstanteSlice';
import parametroCorreosReducer from './features/parametroCorreo/parametroCorreoSlice';
import ciudadesReducer from './features/ciudades/ciudadesSlice';
import tiposProyectosReducer from './features/tipoProyecto/tiposProyectosSlice';
import sectoresProyectosReducer from './features/sectorProyecto/sectoresProyectosSlice';
import listasDocumentosReducer from './features/ListaDocumento/listaDocumentosSlice';
import companiasReducer from './features/Compania/companiasSlice';
import companiasDocumentosReducer from './features/companiaDocumento/companiaDocumentosSlice';
import gestoresReducer from './features/gestor/gestoresSlice';
import gestoresDocumentosReducer from './features/gestorDocumento/gestorDocumentosSlice';
import categoriasInversionesReducer from './features/categoriaInversion/categoriaInversionesSlice';
import proyectosReducer from './features/Proyecto/proyectosSlice';
import proyectosDocumentosReducer from './features/proyectoDocumento/proyectoDocumentosSlice';
import proyectosFotosReducer from './features/proyectoFoto/proyectoFotosSlice';
import inversionistasReducer from './features/inversionista/inversionistasSlice';
import inversionistasDocumentosReducer from './features/inversionistaDocumento/inversionistaDocumentosSlice';
import inversionistasContactosReducer from './features/inversionistaContacto/inversionistaContactosSlice';
import inversionistasContactosLegalesReducer from './features/inversionistaContactoLegal/inversionistaContactosLegalesSlice';
import inversionReducer from './features/inversion/inversionSlice';
import planDetalladoReducer from './features/planDetallado/planDetalladoSlice';
import inversionProyectoReducer from './features/inversionProyecto/inversionProyectoSlice';
import copiaSeguridadReducer from './features/copiaSeguridad/copiaSeguridadSlice';
import envioExtractoReducer from './features/envioExtracto/envioExtractoSlice';
import descargaPortafolioReducer from './features/descargaPortafolio/descargaPortafolioSlice';
import consultaProxPagosReducer from './features/consultaProxPagos/consultaProxPagosSlice';
import vehiculoInversionReducer from './features/VehiculoInversion/vehiculoInversionSlice';
import etapaProyectoReducer from './features/etapaProyecto/etapaProyectoSlice';
import actividadProyectoReducer from './features/actividadProyecto/actividadProyectoSlice';
import condicionesPlazoReducer from './features/condicionesPlazo/condicionesPlazoSlice';
import conceptoProyectoReducer from './features/conceptoProyecto/conceptoProyectoSlice';
import parametroMensualReducer from './features/parametroMensual/parametroMensualSlice';
import actividadPorProyectoReducer from './features/actividadPorProyecto/actividadPorProyectoSlice';
import conceptoPorProyectoReducer from './features/conceptoPorProyecto/conceptoPorProyectoSlice';
import comunidadEnergeticaReducer from './features/comunidadEnergetica/comunidadEnergeticaSlice';
import bancosReducer from './features/bancos/bancosSlice';
import proveedoresReducer from './features/Proveedor/proveedoresSlice';
import proveedoresDocumentosReducer from './features/proveedorDocumento/proveedorDocumentosSlice';
import precioProyectadoReducer from './features/precioProyectado/precioProyectadoSlice';
import simulacionPorProyectoReducer from './features/simulacionPorProyecto/simulacionPorProyectoSlice';
import proyectoDesembolsoReducer from './features/proyectoDesembolso/proyectoDesembolsoSlice';
import nivelConsumoReducer from './features/nivelConsumo/nivelConsumoSlice';
import proyectoPlanInversionReducer from './features/proyectoPlanInversion/proyectoPlanInversionSlice';
import descuentoTarifaReducer from './features/descuentoTarifa/descuentoTarifaSlice';

// Travel Tours
import destinosReducer from './features/destinos/destinosSlice';
import categoriasReducer from './features/categorias/categoriasSlice';
import caracteristicasReducer from './features/caracteristicas/caracteristicasSlice';
import cuponesReducer from './features/cupones/cuponesSlice';
import favoritosReducer from './features/favoritos/favoritosSlice';
import notificacionesReducer from './features/notificaciones/notificacionesSlice';
import proveedoresTuristicosReducer from './features/proveedoresTuristicos/proveedoresTuristicosSlice';
import documentosProveedorTuristicoReducer from './features/documentosProveedorTuristico/documentosProveedorTuristicoSlice';
import experienciasReducer from './features/experiencias/experienciasSlice';
import experienciaCategoriasReducer from './features/experienciaCategorias/experienciaCategoriasSlice';
import experienciaCaracteristicasReducer from './features/experienciaCaracteristicas/experienciaCaracteristicasSlice';
import experienciaPreciosReducer from './features/experienciaPrecios/experienciaPreciosSlice';
import experienciaMultimediaReducer from './features/experienciaMultimedia/experienciaMultimediaSlice';
import experienciaHorariosReducer from './features/experienciaHorarios/experienciaHorariosSlice';
import experienciaDisponibilidadReducer from './features/experienciaDisponibilidad/experienciaDisponibilidadSlice';
import reservasReducer from './features/reservas/reservasSlice';
import acompanantesReservaReducer from './features/acompanantesReserva/acompanantesReservaSlice';
import resenasReducer from './features/resenas/resenasSlice';
import multimediaResenaReducer from './features/multimediaResena/multimediaResenaSlice';
import promocionesReducer from './features/promociones/promocionesSlice';
import promocionExperienciasReducer from './features/promocionExperiencias/promocionExperienciasSlice';
// Portal público
import portalExperienciasReducer from './features/portalExperiencias/portalExperienciasSlice';
import portalDestinosReducer from './features/portalDestinos/portalDestinosSlice';
import portalCategoriasReducer from './features/portalCategorias/portalCategoriasSlice';
import portalPromocionesReducer from './features/portalPromociones/portalPromocionesSlice';
import portalRegistroReducer from './features/portalRegistro/portalRegistroSlice';
import usuariosProveedorReducer from './features/usuariosProveedor/usuariosProveedorSlice';
import cuentaReducer from './features/cuenta/cuentaSlice';
// Academia
import ritmosReducer from './features/ritmos/ritmosSlice';
import planesReducer from './features/planes/planesSlice';
import profesoresReducer from './features/profesores/profesoresSlice';
import alumnosReducer from './features/alumnos/alumnosSlice';
import cursosReducer from './features/cursos/cursosSlice';
import pagosReducer from './features/pagos/pagosSlice';
import asistenciasReducer from './features/asistencias/asistenciasSlice';

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
    parametroConstantes: parametroConstantesReducer,
    parametroCorreos: parametroCorreosReducer,
    ciudades: ciudadesReducer,
    tiposProyectos: tiposProyectosReducer,
    sectoresProyectos: sectoresProyectosReducer,
    listasDocumentos: listasDocumentosReducer,
    companias: companiasReducer,
    companiasDocumento: companiasDocumentosReducer,
    gestores: gestoresReducer,
    gestoresDocumento: gestoresDocumentosReducer,
    categoriasInversiones: categoriasInversionesReducer,
    proyectos: proyectosReducer,
    proyectosDocumento: proyectosDocumentosReducer,
    proyectoFoto: proyectosFotosReducer,
    inversionistas: inversionistasReducer,
    inversionistasDocumento: inversionistasDocumentosReducer,
    inversionistasContacto: inversionistasContactosReducer,
    inversionistasContactoLegal: inversionistasContactosLegalesReducer,
    vehiculoInversion: vehiculoInversionReducer,
    etapaProyecto: etapaProyectoReducer,
    inversiones: inversionReducer,
    planDetallado: planDetalladoReducer,
    inversionProyecto: inversionProyectoReducer,
    copiaSeguridad: copiaSeguridadReducer,
    envioExtracto: envioExtractoReducer,
    descargaPortafolio: descargaPortafolioReducer,
    consultaProxPagos: consultaProxPagosReducer,
    actividadProyecto: actividadProyectoReducer,
    condicionesPlazo: condicionesPlazoReducer,
    conceptoProyecto:  conceptoProyectoReducer,
    parametroMensual: parametroMensualReducer,
    actividadPorProyecto: actividadPorProyectoReducer,
    conceptoPorProyecto: conceptoPorProyectoReducer,
    comunidadEnergetica: comunidadEnergeticaReducer,
    bancos: bancosReducer,
    proveedores: proveedoresReducer,
    proveedoresDocumento: proveedoresDocumentosReducer,
    precioProyectado: precioProyectadoReducer,
    simulacionPorProyecto: simulacionPorProyectoReducer,
    proyectoPlanInversion: proyectoPlanInversionReducer,
    nivelConsumo: nivelConsumoReducer,
    proyectoDesembolso: proyectoDesembolsoReducer, 
    descuentoTarifa: descuentoTarifaReducer,
    // Travel Tours
    destinos: destinosReducer,
    categorias: categoriasReducer,
    caracteristicas: caracteristicasReducer,
    cupones: cuponesReducer,
    favoritos: favoritosReducer,
    notificaciones: notificacionesReducer,
    proveedoresTuristicos: proveedoresTuristicosReducer,
    documentosProveedorTuristico: documentosProveedorTuristicoReducer,
    experiencias: experienciasReducer,
    experienciaCategorias: experienciaCategoriasReducer,
    experienciaCaracteristicas: experienciaCaracteristicasReducer,
    experienciaPrecios: experienciaPreciosReducer,
    experienciaMultimedia: experienciaMultimediaReducer,
    experienciaHorarios: experienciaHorariosReducer,
    experienciaDisponibilidad: experienciaDisponibilidadReducer,
    reservas: reservasReducer,
    acompanantesReserva: acompanantesReservaReducer,
    resenas: resenasReducer,
    multimediaResena: multimediaResenaReducer,
    promociones: promocionesReducer,
    promocionExperiencias: promocionExperienciasReducer,
    // Portal público
    portalExperiencias: portalExperienciasReducer,
    portalDestinos: portalDestinosReducer,
    portalCategorias: portalCategoriasReducer,
    portalPromociones: portalPromocionesReducer,
    portalRegistro: portalRegistroReducer,
    usuariosProveedor: usuariosProveedorReducer,
    cuenta: cuentaReducer,
    // Academia
    ritmos: ritmosReducer,
    planes: planesReducer,
    profesores: profesoresReducer,
    alumnos: alumnosReducer,
    cursos: cursosReducer,
    pagos: pagosReducer,
    asistencias: asistenciasReducer,
  },
});

export default store;

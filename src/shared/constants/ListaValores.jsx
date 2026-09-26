export const TIPOS_ROLES = [
  {id: 'IN', nombre: 'Interno', estado: 1},
  {id: 'EX', nombre: 'Externo', estado: 1},
  {id: 'AC', nombre: 'Administrador Cliente', estado: 1},
];

export const DATO_BOOLEAN = [
  {id: 'S', nombre: 'Sí', estado: 1},
  {id: 'N', nombre: 'No', estado: 1},
];

export const DATO_BOOLEAN_RADIO = [
  {value: 'S', label: 'Sí', estado: 1},
  {value: 'N', label: 'No', estado: 1},
];

export const DATO_TIPO_PERSONA = [
  {value: 'N', label: 'Natural', estado: 1},
  {value: 'J', label: 'Jurídica', estado: 1},
];

export const TIPO_CUENTA_RADIO = [
  {value: 'A', label: 'Ahorros', estado: 1},
  {value: 'C', label: 'Corriente', estado: 1},
];

export const ESTADO_RADIO = [
  {value: '1', label: 'Activo', estado: 1},
  {value: '0', label: 'Inactivo', estado: 1},
];

export const ESTADO = [
  {id: '1', nombre: 'Activo', estado: 1},
  {id: '0', nombre: 'Inactivo', estado: 1},
];

export const TIPO_LISTA_RADIO = [
  {value: 'D', label: 'Detalle', estado: 1},
  {value: 'T', label: 'Totales', estado: 1},
];

export const TIPO_LISTA = [
  {id: 'C', nombre: 'Compañias', estado: 1},
  {id: 'I', nombre: 'Inversionista', estado: 1},
  {id: 'P', nombre: 'Proyectos', estado: 1},
  {id: 'G', nombre: 'Gestores', estado: 1},
  {id: 'R', nombre: 'Proveedor', estado: 1},
];


export const VALOR_BASE  = [
  {id: 'P', nombre: 'Proyecto', estado: 1},
  {id: 'I', nombre: 'Ingresos', estado: 1},
  {id: 'R', nombre: 'Renta liquida', estado: 1},
  {id: 'A', nombre: 'Valor anterior', estado: 1},
];

export const OPERADORES  = [
  {id: '+', nombre: '+', estado: 1},
  {id: '-', nombre: '-', estado: 1},
  {id: '*', nombre: '*', estado: 1},
  {id: '/', nombre: '/', estado: 1},
  {id: '%', nombre: '%', estado: 1},
];

export const TIPO_CONCEPTO = [
  {id: 'ING', nombre: 'Ingreso', estado: 1},
  {id: 'EGR', nombre: 'Egreso', estado: 1},
  {id: 'IMP', nombre: 'Impuestos', estado: 1},
  {id: 'OTR', nombre: 'Otros', estado: 1},
  {id: 'UTI', nombre: 'Utilidad', estado: 1},
];

export const TIPO_DOCUMENTO = [
  {id: 'CC', nombre: 'Cedula ciudadania', estado: 1},
  {id: 'CE', nombre: 'Cedula extranjeria', estado: 1},
  {id: 'NIT', nombre: 'Nit', estado: 1},
  {id: 'TI', nombre: 'Tarjeta de identidad', estado: 1},
];

export const ESTADO_DOCUMENTO = [
  {id: 'C', nombre: 'Cargado', estado: 1},
  {id: 'V', nombre: 'Verificado', estado: 1},
  {id: 'A', nombre: 'Aprobado', estado: 1},
];

export const TIPO_CUENTA = [
  {id: 'A', nombre: 'Ahorros', estado: 1},
  {id: 'C', nombre: 'Corriente', estado: 1},
];

export const FORMA_PAGO = [
  {id: 'M', nombre: 'Mensual', estado: 1},
  {id: 'I', nombre: 'Intereses despues de capital', estado: 1},
  {id: 'F', nombre: 'Final de plazo capital', estado: 1},
  {id: 'A', nombre: 'Plan amortizacion', estado: 1},
];

export const TIPOS_VALOR = [
  {id: 'K', nombre: 'Reintegro Capital', estado: 1},
  {id: 'I', nombre: 'Rendimientos', estado: 1},
  {id: 'C', nombre: 'Comision Gestion', estado: 1},
];

export const TIPOS_VALOR_CONCEPTO = [
  {id: 'P', nombre: 'Precio', estado: 1},
  {id: 'C', nombre: 'Cantidad', estado: 1},
  {id: 'V', nombre: 'Valor', estado: 1},
  {id: 'R', nombre: 'Porcentaje', estado: 1},
];

export const ESTADOS_INVERSIONES = [
  {id: 'GEN', nombre: 'Activa', estado: 1},
  {id: 'ANU', nombre: 'Anulada', estado: 1},
  {id: 'PAG', nombre: 'Pagada', estado: 1},
];

export const ESTADOS_PROYECTOS_PLAN_INVERSIONES = [
  {id: 'PLA', nombre: 'Planeada', estado: 1},
  {id: 'PAG', nombre: 'Pagada', estado: 1},
];

export const ESTADOS_PLAN_DETALLADO_INVERSIONES = [
  {id: 'GEN', nombre: 'Generada', estado: 1},
  {id: 'PRG', nombre: 'Programada', estado: 1},
  {id: 'LIQ', nombre: 'Liquidada', estado: 1},
  {id: 'PAG', nombre: 'Pagada', estado: 1},
  {id: 'ANU', nombre: 'Anulada', estado: 1},
  {id: 'REI', nombre: 'Cancelada por reinversión', estado: 1},
];

export const DATO_TIPO_CONTACTO_RADIO = [
  {value: 'S', label: 'Socio', estado: 1},
  {value: 'R', label: 'Representante legal', estado: 1},
];

export const DATO_CONSULTA_RADIO = [
  {value: 'S', label: 'Semanal', estado: 1},
  {value: 'A', label: 'Acumulado', estado: 1},
];

export const TIPO_CONTACTO_LEGAL = [
  {id: 'S', nombre: 'Socio', estado: 1},
  {id: 'R', nombre: 'Rep. Legal', estado: 1},
];

export const TIPO_CONTACTOS = [
  {id: 'LG', nombre: 'Legal', estado: 1},
  {id: 'AP', nombre: 'Apoderado', estado: 1},
  {id: 'OT', nombre: 'Otros', estado: 1},
];

export const ESTADO_ACTIVIDADES_POR_PROYECTO = [
  {id: 'EJE', nombre: 'En ejecucion', estado: 1},
  {id: 'APL', nombre: 'Aplazada', estado: 1},
  {id: 'CAN', nombre: 'Cancelada', estado: 1},
  {id: 'TER', nombre: 'Terminada', estado: 1},
];


export const MODELO_COMERCIALIZACION_ENERGIA = [
  {id: 'BO', nombre: 'Bolsa', estado: 1},
  {id: 'CE', nombre: 'Comunidad energetica', estado: 1},
];


export const TIPO_SIMULACION = [
  {id: 'P', nombre: 'Proyecto', estado: 1},
  {id: 'I', nombre: 'Inversionista', estado: 1},
];

export const TIPO_COMUNIDAD_ENERGETICA = [
  {id: 'AC', nombre: 'Autogenerador', estado: 1},
  {id: 'GDC', nombre: 'Generador Distribuido Colectivo', estado: 1},
];

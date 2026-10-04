// Catálogos del cobro del ERP a las academias (Administración ERP).
// Deben coincidir con el backend (PagoAcademiaController, FacturaAcademiaController, FacturacionAcademias).

export const METODOS_PAGO_ERP = [
  { id: 'transferencia', nombre: 'Transferencia' },
  { id: 'consignacion', nombre: 'Consignación' },
  { id: 'nequi', nombre: 'Nequi' },
  { id: 'daviplata', nombre: 'Daviplata' },
  { id: 'efectivo', nombre: 'Efectivo' },
  { id: 'tarjeta', nombre: 'Tarjeta' },
  { id: 'otro', nombre: 'Otro' },
];

export const ESTADOS_FACTURA = [
  { id: 'por_cobrar', nombre: 'Por cobrar (pendientes y vencidas)' },
  { id: 'pendiente', nombre: 'Pendiente' },
  { id: 'vencida', nombre: 'Vencida' },
  { id: 'pagada', nombre: 'Pagada' },
  { id: 'anulada', nombre: 'Anulada' },
];

const COLORES_FACTURA = { pendiente: '#F9A825', vencida: 'red', pagada: 'green', anulada: 'gray' };
export const colorEstadoFactura = (_valor, row) => COLORES_FACTURA[row?.estado] ?? '';

const COLORES_CUENTA = { al_dia: 'green', pendiente: '#F9A825', en_mora: 'red', suspendida: 'red', sin_cobro: 'gray' };
export const colorEstadoCuenta = (_valor, row) => COLORES_CUENTA[row?.estado_cuenta] ?? '';

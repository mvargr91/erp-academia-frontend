// Catálogos y helpers del dominio Academia.
// Deben coincidir con las reglas `in:` de los controladores del backend.

// Para MyRadioField (usa { value, label }).
export const OPCIONES_ESTADO = [
  { value: '1', label: 'Activo' },
  { value: '0', label: 'Inactivo' },
];

export const OPCIONES_SI_NO = [
  { value: '1', label: 'Sí' },
  { value: '0', label: 'No' },
];

// Para MySelectField / autocompletes (usan { id, nombre }).
export const DIAS_SEMANA = [
  { id: 0, nombre: 'Domingo' },
  { id: 1, nombre: 'Lunes' },
  { id: 2, nombre: 'Martes' },
  { id: 3, nombre: 'Miércoles' },
  { id: 4, nombre: 'Jueves' },
  { id: 5, nombre: 'Viernes' },
  { id: 6, nombre: 'Sábado' },
];

export const METODOS_PAGO = [
  { id: 'efectivo', nombre: 'Efectivo' },
  { id: 'transferencia', nombre: 'Transferencia' },
  { id: 'tarjeta', nombre: 'Tarjeta' },
  { id: 'otro', nombre: 'Otro' },
];

// Helpers para columnas de tabla / formularios.

export const nombreDe = (lista, id) =>
  lista.find((item) => String(item.id) === String(id))?.nombre ?? id ?? '';

export const colorDe = (lista, id) =>
  lista.find((item) => String(item.id) === String(id))?.color ?? '';

export const esActivo = (valor) => valor === 1 || valor === true || valor === '1';

export const valorActivo = (valor) => (esActivo(valor) ? 'Activo' : 'Inactivo');
export const colorActivo = (valor) => (esActivo(valor) ? 'green' : 'red');
export const valorSiNo = (valor) => (esActivo(valor) ? 'Sí' : 'No');

// Inicializa radios de Formik ('1' | '0') a partir del valor del backend.
export const aRadio = (valor, porDefecto = '1') =>
  valor === undefined || valor === null ? porDefecto : esActivo(valor) ? '1' : '0';

// El backend valida horas con date_format:H:i; MySQL devuelve HH:mm:ss.
export const aHoraCorta = (hora) => (hora ? String(hora).substring(0, 5) : '');

export const formatoMoneda = (valor) =>
  valor === null || valor === undefined || valor === ''
    ? ''
    : new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0,
      }).format(Number(valor));

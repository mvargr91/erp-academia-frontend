// Catálogos de valores del dominio Travel Tours.
// Deben coincidir con las reglas `in:` de los controladores del backend.
// Formato { id, nombre } para usarlos directamente en MySelectField.

export const OPCIONES_ESTADO = [
  { value: '1', label: 'Activo' },
  { value: '0', label: 'Inactivo' },
];

export const OPCIONES_SI_NO = [
  { value: '1', label: 'Sí' },
  { value: '0', label: 'No' },
];

export const ESTADOS_EXPERIENCIA = [
  { id: 'borrador', nombre: 'Borrador', color: '#9e9e9e' },
  { id: 'en_revision', nombre: 'En revisión', color: '#FE8500' },
  { id: 'aprobada', nombre: 'Aprobada', color: '#2E75B6' },
  { id: 'publicada', nombre: 'Publicada', color: 'green' },
  { id: 'rechazada', nombre: 'Rechazada', color: 'red' },
  { id: 'suspendida', nombre: 'Suspendida', color: '#B80001' },
  { id: 'archivada', nombre: 'Archivada', color: '#3B3838' },
];

export const ESTADOS_RESERVA = [
  { id: 'pendiente', nombre: 'Pendiente', color: '#FE8500' },
  { id: 'aceptada', nombre: 'Aceptada', color: 'green' },
  { id: 'rechazada', nombre: 'Rechazada', color: 'red' },
  { id: 'cancelada', nombre: 'Cancelada', color: '#B80001' },
  { id: 'finalizada', nombre: 'Finalizada', color: '#2E75B6' },
  { id: 'no_asistio', nombre: 'No asistió', color: '#3B3838' },
];

export const ESTADOS_VERIFICACION = [
  { id: 'pendiente', nombre: 'Pendiente', color: '#FE8500' },
  { id: 'aprobado', nombre: 'Aprobado', color: 'green' },
  { id: 'rechazado', nombre: 'Rechazado', color: 'red' },
];

export const ESTADOS_DOCUMENTO = [
  { id: 'pendiente', nombre: 'Pendiente', color: '#FE8500' },
  { id: 'aprobado', nombre: 'Aprobado', color: 'green' },
  { id: 'rechazado', nombre: 'Rechazado', color: 'red' },
  { id: 'vencido', nombre: 'Vencido', color: '#3B3838' },
];

export const ESTADOS_RESENA = [
  { id: 'pendiente', nombre: 'Pendiente', color: '#FE8500' },
  { id: 'aprobada', nombre: 'Aprobada', color: 'green' },
  { id: 'rechazada', nombre: 'Rechazada', color: 'red' },
];

export const ESTADOS_DISPONIBILIDAD = [
  { id: 'disponible', nombre: 'Disponible', color: 'green' },
  { id: 'agotado', nombre: 'Agotado', color: '#FE8500' },
  { id: 'cancelado', nombre: 'Cancelado', color: 'red' },
];

export const TIPOS_DESCUENTO = [
  { id: 'porcentaje', nombre: 'Porcentaje' },
  { id: 'valor_fijo', nombre: 'Valor fijo' },
];

export const TIPOS_MULTIMEDIA = [
  { id: 'foto', nombre: 'Foto' },
  { id: 'video', nombre: 'Video' },
];

// Un precio es de adulto o de niño; una experiencia puede tener varios de cada tipo.
export const TIPOS_PRECIO = [
  { id: 'adulto', nombre: 'Adulto' },
  { id: 'nino', nombre: 'Niño' },
];

export const TIPOS_DOCUMENTO_PROVEEDOR = [
  { id: 'rut', nombre: 'RUT' },
  { id: 'camara_comercio', nombre: 'Cámara de comercio' },
  { id: 'rnt', nombre: 'Registro Nacional de Turismo' },
  { id: 'poliza', nombre: 'Póliza de responsabilidad civil' },
  { id: 'cedula_representante', nombre: 'Cédula representante legal' },
  { id: 'otro', nombre: 'Otro' },
];

export const DIAS_SEMANA = [
  { id: 0, nombre: 'Domingo' },
  { id: 1, nombre: 'Lunes' },
  { id: 2, nombre: 'Martes' },
  { id: 3, nombre: 'Miércoles' },
  { id: 4, nombre: 'Jueves' },
  { id: 5, nombre: 'Viernes' },
  { id: 6, nombre: 'Sábado' },
];

export const IDIOMAS = [
  { id: 'Español', nombre: 'Español' },
  { id: 'Inglés', nombre: 'Inglés' },
  { id: 'Español / Inglés', nombre: 'Español / Inglés' },
  { id: 'Francés', nombre: 'Francés' },
  { id: 'Portugués', nombre: 'Portugués' },
];

// Helpers para columnas de tabla

export const nombreDe = (lista, id) =>
  lista.find((item) => String(item.id) === String(id))?.nombre ?? id ?? '';

export const colorDe = (lista, id) =>
  lista.find((item) => String(item.id) === String(id))?.color ?? '';

export const esActivo = (valor) => valor === 1 || valor === true || valor === '1';

export const valorActivo = (valor) => (esActivo(valor) ? 'Activo' : 'Inactivo');
export const colorActivo = (valor) => (esActivo(valor) ? 'green' : 'red');
export const valorSiNo = (valor) => (esActivo(valor) ? 'Sí' : 'No');

// Para inicializar radios de Formik ('1' | '0') a partir del valor del backend.
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

export const slugify = (texto = '') =>
  texto
    .toString()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

// Cada cantidad de un precio es el valor por persona que aplica desde ese número de personas.
export const textoCantidad = (cantidad) =>
  Number(cantidad) > 1 ? `Desde ${cantidad} personas` : '1 persona';

export const resumenCantidades = (cantidades = []) =>
  cantidades.map((c) => `${textoCantidad(c.cantidad)}: ${formatoMoneda(c.valor)}`).join(' · ');

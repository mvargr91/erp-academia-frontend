// Archivos subidos al backend (storage de Laravel).
// En BD se guarda la ruta relativa (ej. "destinos/12-guatape/imagen/20260925-...-k3x9p.jpg");
// las rutas http(s) son URLs externas (ej. YouTube) y se usan tal cual.
import environment from '../../env';
import jwtAxios from '../../@crema/services/auth/jwt-auth';

// Carpeta pública de Laravel (php artisan storage:link). Se puede cambiar con VITE__STORAGE_URL.
export const STORAGE_URL = (import.meta.env.VITE__STORAGE_URL || `${environment.API_URL}/storage`).replace(/\/$/, '');

export const esUrlExterna = (ruta) => /^(https?:|blob:|data:)/i.test(ruta ?? '');

export const urlArchivo = (ruta) => {
  if (!ruta) return '';
  return esUrlExterna(ruta) ? ruta : `${STORAGE_URL}/${String(ruta).replace(/^\/+/, '')}`;
};

export const nombreDeRuta = (ruta) => (ruta ? decodeURIComponent(String(ruta).split('/').pop()) : '');

export const tieneArchivo = (params = {}) => Object.values(params).some((valor) => valor instanceof Blob);

// Laravel lee booleanos como '1'/'0' y los vacíos como null (ConvertEmptyStringsToNull).
export const aFormData = (params = {}) => {
  const formData = new FormData();
  Object.entries(params).forEach(([campo, valor]) => {
    if (valor === undefined || valor === null) return;
    if (valor instanceof Blob) formData.append(campo, valor);
    else if (typeof valor === 'boolean') formData.append(campo, valor ? '1' : '0');
    else if (Array.isArray(valor)) valor.forEach((item) => formData.append(`${campo}[]`, item));
    else if (typeof valor === 'object') formData.append(campo, JSON.stringify(valor));
    else formData.append(campo, valor);
  });
  return formData;
};

// Descarga un archivo privado (ej. documentos del proveedor) enviando el token de sesión.
export const descargarArchivo = async (ruta, nombreSugerido) => {
  const response = await jwtAxios.get(ruta, { responseType: 'blob' });
  const tipo = response.headers['content-type'] ?? '';

  // Documentos registrados como URL externa: el backend responde { url }.
  if (tipo.includes('application/json')) {
    const { url } = JSON.parse(await response.data.text());
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
    return;
  }

  const url = URL.createObjectURL(response.data);
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = nombreSugerido || 'documento';
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

// Identidad visual de Travel City LGTBIQ+.
// Las imágenes viven en /public/brand (generadas a partir de /public/logo512.png).

export const MARCA = {
  nombre: 'Travel City LGTBIQ+',
  eslogan: 'Explora Colombia con libertad',
  logos: {
    // Fondos claros: portal público, correos, documentos.
    principal: '/brand/logo.png',
    // Fondos oscuros: panel de administración (tema oscuro). El "+" pasa a blanco.
    oscuro: '/brand/logo-oscuro.png',
    // Espacios cuadrados o pequeños: menú colapsado, avatar, loader, redes.
    isotipo: '/brand/isotipo.png',
  },
};

// Colores tomados del logo.
export const COLORES_MARCA = {
  azul: '#00A1CC', // "Travel"
  azulOscuro: '#1C4A59',
  gris: '#C6C6C6', // "City"
  texto: '#1F2933',
};

// Arcoíris del logo (orden de la bandera).
export const ARCOIRIS = ['#E40303', '#FF8C00', '#FFED00', '#008026', '#24408E', '#732982'];

// Franja decorativa reutilizable (encabezado/footer del portal).
export const gradienteArcoiris = `linear-gradient(90deg, ${ARCOIRIS.join(', ')})`;

// Interruptor del tema del panel: con VITE__TEMA_MARCA=false en .env el panel vuelve a los colores anteriores.
export const TEMA_MARCA_PANEL = import.meta.env.VITE__TEMA_MARCA !== 'false';

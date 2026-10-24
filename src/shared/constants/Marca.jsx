// Identidad visual por defecto de la plataforma, Zunevia (cada academia la sobrescribe en Apariencia).
// Las imágenes viven en /public/brand (generadas a partir del logo de Zunevia).

export const MARCA = {
  nombre: 'Zunevia',
  eslogan: 'Tu academia, en evolución.',
  logos: {
    // Fondos claros: portal público, correos, documentos.
    principal: '/brand/logo.png',
    // Fondos oscuros: el nombre y el eslogan pasan a blanco.
    oscuro: '/brand/logo-oscuro.png',
    // Espacios cuadrados o pequeños: la «Z» (menú colapsado, avatar, loader, redes).
    isotipo: '/brand/isotipo.png',
  },
};

// Colores tomados del logo de Zunevia.
export const COLORES_MARCA = {
  azul: '#0058F4', // «Z»
  azulOscuro: '#111736', // nombre «Zunevia»
  violeta: '#8943E7', // punto de la «Z»
  cian: '#16DCDB',
  texto: '#111736',
};

// Interruptor del tema del panel: con VITE__TEMA_MARCA=false en .env el panel vuelve a los colores anteriores.
export const TEMA_MARCA_PANEL = import.meta.env.VITE__TEMA_MARCA !== 'false';

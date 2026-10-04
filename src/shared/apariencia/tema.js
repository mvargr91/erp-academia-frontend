// Apariencia del ERP por academia: arma el tema de MUI (claro u oscuro) y los colores de la
// barra de menú a partir de lo que la academia configuró en Configuración → Apariencia.
import { alpha, darken, lighten, getContrastRatio } from '@mui/material/styles';
import {
  defaultTheme,
  backgroundLight,
  backgroundDark,
  textLight,
  textDark,
} from '@crema/constants/defaultConfig';
import { ThemeMode } from '@crema/constants/AppEnums';
import environment from '../../env';

export const MODO_CLARO = 'claro';
export const MODO_OSCURO = 'oscuro';
export const MODOS = [MODO_CLARO, MODO_OSCURO];

// Mismos valores por defecto que el backend (App\Support\Academias\Apariencia).
export const APARIENCIA_DEFECTO = {
  nombre: '',
  color_primario: '#00A1CC',
  color_menu: '#1C4A59',
  color_acento: '#00A1CC',
  modo: MODO_CLARO,
  login_titulo: '',
  login_subtitulo: '',
  login_posicion: 'izquierda',
  logo_url: null,
  logo_oscuro_url: null,
  login_fondo_url: null,
};

export const LOGO_DEFECTO = '/brand/logo.png';
export const LOGO_OSCURO_DEFECTO = '/brand/logo-oscuro.png';

const ES_COLOR = /^#[0-9a-fA-F]{6}$/;
export const esColor = (valor) => ES_COLOR.test(valor ?? '');

export const normalizarApariencia = (datos) => {
  const apariencia = { ...APARIENCIA_DEFECTO, ...(datos ?? {}) };
  ['color_primario', 'color_menu', 'color_acento'].forEach((campo) => {
    if (!esColor(apariencia[campo])) apariencia[campo] = APARIENCIA_DEFECTO[campo];
  });
  if (!MODOS.includes(apariencia.modo)) apariencia.modo = MODO_CLARO;
  return apariencia;
};

const TEXTO_CLARO = '#FFFFFF';
const TEXTO_OSCURO = '#1F2933';

// Por debajo de este contraste el texto blanco sobre el color ya no se lee bien.
export const CONTRASTE_MINIMO = 2.8;
export const contrasteConBlanco = (color) => getContrastRatio(TEXTO_CLARO, color);
export const textoSobre = (color) => (contrasteConBlanco(color) >= CONTRASTE_MINIMO ? TEXTO_CLARO : TEXTO_OSCURO);

export const construirTema = (datos, modo) => {
  const apariencia = normalizarApariencia(datos);
  const oscuro = modo === MODO_OSCURO;
  const base = defaultTheme.theme;

  // En modo oscuro un color de marca muy oscuro no se leería como texto o borde: se aclara.
  const legible = (color) =>
    oscuro && getContrastRatio(color, backgroundDark.paper) < 4.5 ? lighten(color, 0.35) : color;
  const primario = legible(apariencia.color_primario);
  const acento = legible(apariencia.color_acento);
  // Títulos de la cabecera: el color del menú, salvo que no contraste con el fondo.
  const encabezado = getContrastRatio(apariencia.color_menu, backgroundLight.paper) >= 3
    ? apariencia.color_menu
    : textLight.primary;

  return {
    ...base,
    palette: {
      ...base.palette,
      mode: oscuro ? ThemeMode.DARK : ThemeMode.LIGHT,
      background: oscuro ? backgroundDark : backgroundLight,
      text: oscuro ? textDark : textLight,
      divider: oscuro ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
      grayBottoms: primario,
      menu: { menuOpacity: alpha(primario, oscuro ? 0.16 : 0.08) },
      primary: { main: primario, contrastText: textoSobre(primario) },
      secondary: { ...base.palette.secondary, main: primario, light: acento },
      tertiary: { ...base.palette.tertiary, main: primario },
      cuarternario: { ...base.palette.cuarternario, main: oscuro ? textDark.primary : encabezado },
      success: { ...base.palette.success, main: acento },
      action: { hover: oscuro ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)' },
      colorHover: darken(primario, 0.25),
      colorHovers: darken(primario, 0.25),
      colorFiltro: acento,
    },
  };
};

// Barra de menú (horizontal en escritorio, lateral en móvil).
export const construirMenu = (datos) => {
  const apariencia = normalizarApariencia(datos);
  return {
    sidebarBgColor: apariencia.color_menu,
    sidebarTextColor: textoSobre(apariencia.color_menu),
    sidebarHeaderColor: apariencia.color_menu,
    sidebarMenuSelectedBgColor: apariencia.color_acento,
    sidebarMenuSelectedTextColor: textoSobre(apariencia.color_acento),
    mode: ThemeMode.LIGHT,
  };
};

export const logoDe = (apariencia, modo) =>
  modo === MODO_OSCURO
    ? apariencia.logo_oscuro_url || apariencia.logo_url || LOGO_OSCURO_DEFECTO
    : apariencia.logo_url || LOGO_DEFECTO;

// Lo último que se vio en este navegador, para pintar la marca sin esperar al API.
const CLAVE_APARIENCIA = `erp-apariencia:${environment.ACADEMIA}`;
const CLAVE_MODO = `erp-modo:${environment.ACADEMIA}`;

export const leerAparienciaGuardada = () => {
  try {
    return normalizarApariencia(JSON.parse(localStorage.getItem(CLAVE_APARIENCIA)));
  } catch (e) {
    return normalizarApariencia();
  }
};

export const guardarApariencia = (apariencia) => {
  try {
    localStorage.setItem(CLAVE_APARIENCIA, JSON.stringify(apariencia));
  } catch (e) {
    // Sin almacenamiento local (modo privado): se pide de nuevo al API en cada carga.
  }
};

// Modo elegido por el usuario en este navegador; null = usar el modo por defecto de la academia.
export const leerModoGuardado = () => {
  try {
    const modo = localStorage.getItem(CLAVE_MODO);
    return MODOS.includes(modo) ? modo : null;
  } catch (e) {
    return null;
  }
};

export const guardarModo = (modo) => {
  try {
    localStorage.setItem(CLAVE_MODO, modo);
  } catch (e) {
    // El modo solo dura esta sesión.
  }
};

export const modoInicial = () => leerModoGuardado() ?? leerAparienciaGuardada().modo;
export const temaInicial = () => construirTema(leerAparienciaGuardada(), modoInicial());
export const menuInicial = () => construirMenu(leerAparienciaGuardada());

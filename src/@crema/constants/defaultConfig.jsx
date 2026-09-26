import {
  Fonts,
  FooterType,
  HeaderType,
  LayoutDirection,
  MenuStyle,
  ThemeMode,
  ThemeStyle,
  ThemeStyleRadius,
  NavStyle,
  LayoutType,
} from './AppEnums';
import environment from './../../env';
import { COLORES_MARCA, TEMA_MARCA_PANEL } from '../../shared/constants/Marca';

// Colores del panel. "anterior" es el tema original; "marca" alinea el panel con el portal (Travel City).
const COLORES_PANEL = {
  anterior: {
    principal: '#5d9802',
    acento: '#0588b0',
    textoEncabezado: '#0588b0',
    barraMenu: '#0588b0',
  },
  marca: {
    principal: COLORES_MARCA.azul,
    acento: COLORES_MARCA.azul,
    textoEncabezado: COLORES_MARCA.azulOscuro,
    barraMenu: COLORES_MARCA.azulOscuro,
  },
};
export const coloresPanel = TEMA_MARCA_PANEL ? COLORES_PANEL.marca : COLORES_PANEL.anterior;

export const textLight = {
  primary: 'rgb(45, 47, 51)',
  // primary: '#5f1860',
  secondary: 'rgb(86, 91, 102)',
  disabled: 'rgb(149, 156, 169)',
};

export const textDark = {
  primary: 'rgb(255,255,255)',
  secondary: 'rgb(229, 231, 235)',
  disabled: 'rgb(156, 163, 175)',
};

export const backgroundDark = {
  paper: '#FFFFFF',
  default: '#F4F7FE',
};

export const backgroundLight = {
  paper: '#FFFFFF',
  default: '#F4F7FE',
};

const cardRadius = ThemeStyleRadius.STANDARD;
export const defaultTheme = {
  theme: {
    spacing: 4,
    cardRadius: cardRadius,
    direction: LayoutDirection.LTR,
    palette: {
      mode: ThemeMode.LIGHT,
      background: backgroundLight, 
      text: textLight, 
      grayBottoms: coloresPanel.principal,
      redBottoms: '#be1e2d',
      enviaEmailBottoms: '#D22E1C',
      menu: {
        menuOpacity: '#0588b010',
      },
      primary: {
        main: coloresPanel.principal,
        contrastText: '#fff',
      },
      secondary: {
        main: coloresPanel.principal,
        light: coloresPanel.acento,
        dark: '#9E3F1C',
      },
      tertiary:{
        main: coloresPanel.principal,
        light: '#1A1449',
        dark: '#222165',
      },
      cuarternario: {
        main: coloresPanel.textoEncabezado,
        light: '#006430',
        dark: '#009136',
      },
      success: {
        main: coloresPanel.acento,
        light: '#D9F5E5',
      },
      warning: {
        main: '#FF5252',
        light: '#FFECDC',
      },
      action:{
        hover:  'rgba(0, 0, 0, 0.04)'
      },
      gray: {
        50: '#fafafa',  
        100: '#F5F6FA',
        200: '#edf2f7',
        300: '#E0E0E0',
        400: '#c5c6cb',
        500: '#A8A8A8',
        600: '#666666',
        700: '#4a5568',
        800: '#201e21',
        900: '#1a202c',
        A100: '#d5d5d5',
        A200: '#aaaaaa',
        A400: '#303030',
        A700: '#616161',
      },
      colorHover: '#5f1860',
      colorHovers: '#5f1860',
      colorFiltro: coloresPanel.acento,
    },
    status: {
      danger: 'orange',
    },
    divider: 'rgba(224, 224, 224, 1)',
    typography: {
      fontFamily: ['Be Vietnam', 'sans-serif'].join(','),
      fontSize: 14,
      fontWeight: 400,
      h1: {
        fontSize: 22,
        fontWeight: 600,
      },
      h2: {
        fontSize: 20,
        fontWeight: 500,
      },
      h3: {
        fontSize: 18,
        fontWeight: 500,
      },
      h4: {
        fontSize: 16,
        fontWeight: 500,
      },
      h5: {
        fontSize: 14,
        fontWeight: 500,
      },
      h6: {
        fontSize: 12,
        fontWeight: 500,
      },
      subtitle1: {
        fontSize: 14,
      },
      subtitle2: {
        fontSize: 16,
      },
      body1: {
        fontSize: 14,
      },
      body2: {
        fontSize: 12,
      },
    },
    components: {
      MuiToggleButton: {
        styleOverrides: {
          root: {
            borderRadius: cardRadius,
          },
        },
      },
      MuiCardLg: {
        styleOverrides: {
          root: {
            borderRadius:
              cardRadius === ThemeStyleRadius.STANDARD
                ? ThemeStyleRadius.STANDARD
                : ThemeStyleRadius.MODERN + 20,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: cardRadius,
            boxShadow: '0px 10px 10px 4px rgba(0, 0, 0, 0.04)',
            '& .MuiCardContent-root:last-of-type': {
              paddingBottom: 16,
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: cardRadius / 2,
            boxShadow: '0px 5px 6px rgba(0, 0, 0, 0.04)',
            textTransform: 'capitalize',
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: cardRadius / 2,
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            borderRadius: cardRadius / 2,
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            padding: 9,
          },
        },
      },
      MuiLink: {
        styleOverrides: {
          root: {
            fontWeight: Fonts.REGULAR,
          },
        },
      },
    },
  },
};


export const DarkSidebar = {
  sidebarBgColor: '#FFFFFF',
  sidebarTextColor: '#fff',
  sidebarHeaderColor: '#FFFFFF',
  sidebarMenuSelectedBgColor: '#F4F7FE',
  sidebarMenuSelectedTextColor: 'rgba(255, 255, 255, 0.87)',
  mode: ThemeMode.LIGHT,
};
export const LightSidebar = {
  sidebarBgColor: coloresPanel.barraMenu,
  sidebarTextColor: '#fff',
  sidebarHeaderColor: coloresPanel.barraMenu,
  sidebarMenuSelectedBgColor: coloresPanel.acento,
  sidebarMenuSelectedTextColor: '#ffff',
  mode: ThemeMode.LIGHT,
};
const defaultConfig = {
  sidebar: {
    borderColor: '#757575',
    menuStyle: MenuStyle.BIT_BUCKET,
    allowSidebarBgImage: false,
    sidebarBgImageId: 1,
    colorSet: LightSidebar,
  },
  themeStyle: ThemeStyle.MODERN,
  themeMode: ThemeMode.LIGHT,
  // navStyle: NavStyle.HEADER_USER_MINI,
  navStyle: NavStyle.H_DEFAULT,
  layoutType: LayoutType.FULL_WIDTH,
  footerType: FooterType.FLUID,
  headerType: HeaderType.FLUID,
  footer: false,
  locale: {
    languageId: 'spanish',
    locale: 'es',
    name: 'Español',
    icon: 'es',
  },
  rtlLocale: ['ar'],
  API_URL: environment.API_URL,
};
export default defaultConfig;

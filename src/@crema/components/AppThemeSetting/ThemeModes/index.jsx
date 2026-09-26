import { CustomizerItemWrapper, StyledToggleButton } from "../index.style";
import Box from "@mui/material/Box";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { ThemeMode } from "@crema/constants/AppEnums";
import clsx from "clsx";
import {
  useThemeActionsContext,
  useThemeContext,
} from "@crema/context/AppContextProvider/ThemeContextProvider";
import { useSidebarActionsContext } from "@crema/context/AppContextProvider/SidebarContextProvider";
import {
  backgroundDark,
  backgroundLight,
  DarkSidebar,
  LightSidebar,
  textDark,
  textLight,
} from "@crema/constants/defaultConfig";
import IntlMessages from "@crema/helpers/IntlMessages";
import { useEffect } from "react";

const ThemeModes = () => {
  const { updateTheme, updateThemeMode } = useThemeActionsContext();
  const { updateSidebarColorSet } = useSidebarActionsContext();
  const { theme } = useThemeContext();

  // Forzar el modo DARK en la primera carga del componente
  useEffect(() => {
    // Establecer el modo oscuro por defecto
    updateThemeMode(ThemeMode.DARK);
    updateSidebarColorSet({
      sidebarBgColor: DarkSidebar.sidebarBgColor,
      sidebarTextColor: DarkSidebar.sidebarTextColor,
      sidebarMenuSelectedBgColor: DarkSidebar.sidebarMenuSelectedBgColor,
      sidebarMenuSelectedTextColor: DarkSidebar.sidebarMenuSelectedTextColor,
      sidebarHeaderColor: DarkSidebar.sidebarHeaderColor,
    });
    updateTheme({
      ...theme,
      palette: {
        ...theme.palette,
        mode: ThemeMode.DARK,
        background: backgroundDark,
        text: textDark,
      },
    });
  }, [updateThemeMode, updateSidebarColorSet, updateTheme, theme]);

  const onModeChange = (event, themeMode) => {
    // Ignorar cambios y forzar siempre el modo DARK
    updateThemeMode(ThemeMode.DARK);
    updateSidebarColorSet({
      sidebarBgColor: DarkSidebar.sidebarBgColor,
      sidebarTextColor: DarkSidebar.sidebarTextColor,
      sidebarMenuSelectedBgColor: DarkSidebar.sidebarMenuSelectedBgColor,
      sidebarMenuSelectedTextColor: DarkSidebar.sidebarMenuSelectedTextColor,
      sidebarHeaderColor: DarkSidebar.sidebarHeaderColor,
    });
    updateTheme({
      ...theme,
      palette: {
        ...theme.palette,
        mode: ThemeMode.DARK,
        background: backgroundDark,
        text: textDark,
      },
    });
  };

  return (
    <CustomizerItemWrapper>
      <Box component="h4" sx={{ mb: 2 }}>
        <IntlMessages id="customizer.themeMode" />
      </Box>
      <ToggleButtonGroup
        value={ThemeMode.DARK} // Forzar siempre a "DARK"
        exclusive
        onChange={onModeChange}
        aria-label="text alignment"
      >
        <StyledToggleButton
          value={ThemeMode.LIGHT}
          className={clsx({
            active: ThemeMode.DARK === ThemeMode.LIGHT,
          })}
          aria-label="left aligned"
          disabled // Deshabilitar el botón de modo "LIGHT"
        >
          <IntlMessages id="customizer.light" />
        </StyledToggleButton>

        <StyledToggleButton
          value={ThemeMode.DARK}
          className={clsx({
            active: true, // Siempre activo en "DARK"
          })}
          aria-label="centered"
        >
          <IntlMessages id="customizer.dark" />
        </StyledToggleButton>
      </ToggleButtonGroup>
    </CustomizerItemWrapper>
  );
};

export default ThemeModes;

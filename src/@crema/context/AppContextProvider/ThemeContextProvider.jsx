import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import defaultConfig, { defaultTheme } from "@crema/constants/defaultConfig";
import PropTypes from "prop-types";
import { LayoutDirection } from "@crema/constants/AppEnums";
import { temaInicial } from "../../../shared/apariencia/tema";


const ThemeContext = createContext({
  theme: defaultTheme.theme,
  themeStyle: defaultConfig.themeStyle,
  themeMode: defaultConfig.themeMode,
});
const ThemeActionsContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

export const useThemeActionsContext = () => useContext(ThemeActionsContext);

const ThemeContextProvider = ({ children }) => {
  // Arranca con la apariencia de la academia vista por última vez en este navegador;
  // AparienciaProvider la actualiza (tema + modo claro/oscuro) al responder el API.
  const [theme, setTheme] = useState(temaInicial);
  const [themeMode, updateThemeMode] = useState(() => theme.palette.mode);
  const [themeStyle, updateThemeStyle] = useState(defaultConfig.themeStyle);

  const updateTheme = useCallback((theme) => {
    setTheme(theme);
  }, []);

  useEffect(() => {
    if (theme.direction === LayoutDirection.RTL) {
      document.body.setAttribute("dir", LayoutDirection.RTL);
    } else {
      document.body.setAttribute("ltr", LayoutDirection.LTR);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeStyle,
        themeMode,
      }}
    >
      <ThemeActionsContext.Provider
        value={{
          updateTheme,
          updateThemeStyle,
          updateThemeMode,
        }}
      >
        {children}
      </ThemeActionsContext.Provider>
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider;

ThemeContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

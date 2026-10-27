import React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AppLogo from "../../components/AppLogo";
import UserInfo from "../../components/UserInfo";
import BotonModo from "../../../../../shared/apariencia/BotonModo";
import { SelectorSede } from "../../../../../shared/sedes";

// Cabecera: botón del menú, logo, selector de sede, modo claro/oscuro y el usuario (Mi cuenta y
// Cerrar sesión). En el celular el usuario se ve como un ícono que abre esas mismas opciones.
const AppHeader = ({ toggleNavCollapsed, menuOculto }) => {
  return (
    <AppBar
      position="relative"
      color="inherit"
      sx={{
        boxShadow: "none",
        borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
        backgroundColor: "background.paper",
        width: {
          xs: "100%",
        },
      }}
      className="app-bar"
    >
      <Box sx={{ height: 4, backgroundColor: "primary.main" }} />
      <Toolbar
        sx={{
          boxSizing: "border-box",
          minHeight: { xs: 56, sm: 70 },
          px: { xs: 0 },
          borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: { lg: 1340, xl: 1420 },
            mx: "auto",
            px: { xs: 3, sm: 5 },
            display: "flex",
            alignItems: "center",
          }}
        >
          <IconButton
            sx={{
              marginRight: (theme) => theme.spacing(2),
              color: "text.secondary",
            }}
            edge="start"
            className="menu-btn"
            color="inherit"
            aria-label="Mostrar u ocultar el menú"
            onClick={toggleNavCollapsed}
            size="large"
          >
            <MenuIcon
              sx={{
                width: 35,
                height: 35,
              }}
            />
          </IconButton>
          <Box
            sx={{
              display: { lg: menuOculto ? "block" : "none" },
              "& .app-logo": {
                pl: 0,
              },
              // En el celular el logo es más pequeño para dejar espacio a la sede y al usuario.
              "& .app-logo img": {
                height: { xs: 36, sm: 65 },
                maxWidth: { xs: 96, sm: 240 },
              },
              "& .logo-text": {
                display: { xs: "none", sm: "block" },
              },
            }}
          >
            <AppLogo />
          </Box>
          <Box
            sx={{
              flexGrow: 1,
            }}
          />
          <Box
            sx={{
              ml: { xs: 1, sm: 4 },
              display: "flex",
              alignItems: "center",
            }}
          >
            <SelectorSede sx={{ mr: { xs: 1, sm: 2 }, minWidth: { xs: 110, sm: 190 }, maxWidth: { xs: 130, sm: "none" } }} />
            <BotonModo />
            <Box
              sx={{
                ml: { xs: 1, sm: 4 },
                minWidth: { md: 220 },
                "& .user-info-view": {
                  p: 0,
                },
                "& .user-info": {
                  display: { xs: "none", md: "block" },
                },
              }}
            >
              <UserInfo />
            </Box>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
export default AppHeader;

AppHeader.propTypes = {
  toggleNavCollapsed: PropTypes.func,
  menuOculto: PropTypes.bool,
};

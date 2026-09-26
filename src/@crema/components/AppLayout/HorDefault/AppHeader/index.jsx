import React from "react";
import { styled, useTheme } from '@mui/material/styles';
import PropTypes from "prop-types";
import PropsTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import AppLngSwitcher from "../../../AppLngSwitcher";
import Box from "@mui/material/Box";
import AppSearchBar from "../../../AppSearchBar";
import Hidden from "@mui/material/Hidden";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AppMessages from "../../../AppMessages";
import AppNotifications from "../../../AppNotifications";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AppTooltip from "../../../AppTooltip";
import { alpha } from "@mui/material/styles";
import NotificationBar from "../NotificationBar";
import AppLogo from "../../components/AppLogo";
import UserInfo from "../../components/UserInfo";
import HeaderNavWrapper from "./HeaderNavWrapper";
import HorizontalNav from "../../components/HorizontalNav";
import { allowMultiLanguage } from "../../../../constants/AppConst";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import { TEMA_MARCA_PANEL, gradienteArcoiris } from "../../../../../shared/constants/Marca";
import { PORTAL_HABILITADO, RUTAS_PORTAL } from "../../../../../shared/constants/RutasPortal";

const AppHeader = ({ toggleNavCollapsed, routesConfig }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const theme = useTheme();
  const navigate = useNavigate();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
      {TEMA_MARCA_PANEL && <Box sx={{ height: 4, background: gradienteArcoiris }} />}
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
            maxWidth: { lg: 1140, xl: 1420 },
            mx: "auto",
            px: 5,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Hidden lgUp>
            <IconButton
              sx={{
                marginRight: (theme) => theme.spacing(2),
                color: "text.secondary",
              }}
              edge="start"
              className="menu-btn"
              color="inherit"
              aria-label="open drawer"
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
          </Hidden>
          <Box
            sx={{
              "& .app-logo": {
                pl: 0,
              },
              "& .logo-text": {
                display: { xs: "none", sm: "block" },
              },
            }}
          >
            <AppLogo />
          </Box>
          <Hidden smDown>
            {!TEMA_MARCA_PANEL && (
            <Box
              sx={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                color: theme.palette.cuarternario.main,
                fontSize: 30,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Sistema de Inversiones
            </Box>
            )}
          </Hidden>

          <Box
            sx={{
              flexGrow: 1,
            }}
          />
          <Box
            sx={{
              ml: 4,
              display: "flex",
              alignItems: "center",
            }}
          >
            {TEMA_MARCA_PANEL && PORTAL_HABILITADO && (
              <Hidden mdDown>
                <Button
                  variant="outlined"
                  startIcon={<TravelExploreIcon />}
                  onClick={() => navigate(RUTAS_PORTAL.inicio)}
                  sx={{ textTransform: "none", fontWeight: 600 }}
                >
                  Ver portal
                </Button>
              </Hidden>
            )}
            <Box
              sx={{
                ml: { sm: 4 },
                mr: { xs: 4, sm: 0 },
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

            <Hidden smUp>
              <Box
                sx={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  marginLeft: -2,
                  marginRight: -2,
                }}
              >
                <Box
                  sx={{
                    px: 1.85,
                  }}
                >
                  <AppTooltip title="More">
                    <IconButton
                      sx={{
                        borderRadius: "50%",
                        width: 40,
                        height: 40,
                        color: (theme) => theme.palette.text.secondary,
                        backgroundColor: (theme) =>
                          theme.palette.background.default,
                        border: 1,
                        borderColor: "transparent",
                        "&:hover, &:focus": {
                          color: (theme) => theme.palette.text.primary,
                          backgroundColor: (theme) =>
                            alpha(theme.palette.background.default, 0.9),
                          borderColor: (theme) =>
                            alpha(theme.palette.text.secondary, 0.25),
                        },
                      }}
                      onClick={handleClick}
                      size="large"
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </AppTooltip>
                </Box>
              </Box>
            </Hidden>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem>
                <AppNotifications isMenu />
              </MenuItem>
              <MenuItem>
                <AppMessages isMenu />
              </MenuItem>
              <MenuItem>Setting</MenuItem>
            </Menu>
          </Box>
        </Box>
      </Toolbar>
      <Hidden lgDown>
        <HeaderNavWrapper>
          <Box
            sx={{
              width: "100%",
              maxWidth: { lg: 1140, xl: 1436 },
              mx: "auto",
              px: 5,
            }}
          >
            <HorizontalNav routesConfig={routesConfig} />
          </Box>
        </HeaderNavWrapper>
      </Hidden>
    </AppBar>
  );
};
export default AppHeader;

AppHeader.propTypes = {
  toggleNavCollapsed: PropTypes.func,
  routesConfig: PropsTypes.array.isRequired,
};

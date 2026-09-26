import React from "react";
import PropTypes from "prop-types";
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
import AppLogo from "../../components/AppLogo";
import UserInfo from "../../components/UserInfo";
import { allowMultiLanguage } from "../../../../constants/AppConst";
import { margin, padding, width } from "@mui/system";
import { position } from "stylis";

const AppHeader = ({ toggleNavCollapsed }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      color="inherit"
      sx={{
        boxShadow: "none",
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        backgroundColor: (theme) => theme.palette.background.paper,
        // backgroundColor: "purper",
        // transition: "width 0.5s ease",
        width: "100%",
      }}
      className="app-bar"
    >
      <Toolbar
        sx={{
          boxSizing: "border-box",
          minHeight: { xs: 56, sm: 70 },
          paddingLeft: { xs: 2.5, md: 5 },
          paddingRight: { xs: 2.5, md: 5 },
        }}
      >
        <Hidden lgUp>
          <IconButton
            sx={{ color: "text.secondary" }}
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
            "& .logo-text": {
              display: { xs: "none", sm: "block" },
            },
          }}
        >
            <Box
              sx={{
                width: 115, // Cambia el ancho del logo
                height: 'auto', // Mantén la relación de aspecto
                '& img': {
                  width: '90%', // Asegúrate de que la imagen ocupe todo el contenedor
                  height: 'auto',
                },
              }}
            >
              <AppLogo />
            </Box>
          {/* // TODO:: logo del la página principal...  */}
        </Box>

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
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
export default AppHeader;

AppHeader.propTypes = {
  toggleNavCollapsed: PropTypes.func,
};

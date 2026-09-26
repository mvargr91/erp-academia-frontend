import React from "react";
import orange from "@mui/material/colors/orange";
import { Box, useMediaQuery, Button } from "@mui/material"; // <-- Importa useMediaQuery
import { useThemeContext } from '@crema/context/AppContextProvider/ThemeContextProvider';
import Avatar from "@mui/material/Avatar";
import { styled, useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Fonts } from "@crema/constants/AppEnums";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Business, Person } from '@mui/icons-material';
import { useAuthMethod, useAuthUser } from "@crema/hooks/AuthHooks";
import { useSelector, useDispatch } from 'react-redux';
import { logout, logoutUser } from "../../../../redux/features/auth/authSlice";
import { PORTAL_HABILITADO, RUTAS_PORTAL, RUTA_MI_CUENTA } from "../../../../../shared/constants/RutasPortal";

const useStyles = makeStyles((theme) => ({
  userRoot: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    justifyContent: 'center',
  },
  avatar: {
    fontSize: 24,
    backgroundColor: orange[500],
  },
  userName: {
    textOverflow: 'ellipsis',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    fontSize: 15,
    fontWeight: Fonts.MEDIUM,
    color: 'white',
  },
  logoutBtn: {
    backgroundColor: 'red',
    width: '92%',
    color: 'white',
    '&:hover': {
      backgroundColor: 'rgba(203,36,40,0.7)',
    },
    display: 'flex',
    alignContent: 'center',
    margin: 'auto',
    marginTop: 5,
    marginBottom:5,

  },
  btnContainer: {
    borderTop: '1px solid rgb(231,180,38)',
  },
}));

const UserInfo = ({ color }) => {
  const { logout } = useAuthMethod();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const theme = useTheme();
  const classes = useStyles({ theme });

  // Detectar si es móvil
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const irA = (ruta) => {
    handleClose();
    navigate(ruta);
  };

  const handleLogout = () => {
    dispatch(logoutUser(navigate));
    logout();
  };

  return (
    <>
    <Box >
      <Box 
        onClick={handleClick}
        sx={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
        }}
      >
        <Box
          display="flex"
          style={{ justifyContent: "space-evenly", alignItems: "center" }}
          ml={3}
          className={classes.userName}
        >
          {!isMobile && (
            <Person
              style={{
                width: "50px",
                height: "50px",
                color: theme.palette.cuarternario.main,
              }}
            />
          )}
        </Box>
        
        <Box
          sx={{
            width: { xs: "calc(100% - 62px)", xl: "calc(100% - 72px)" },
            ml: 5,
            color: color,
          }}
          className="user-info"
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                mb: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontSize: 16,
                fontWeight: Fonts.MEDIUM,
                color: theme.palette.cuarternario.main,
              }}
              component="span"
            >
              {user.usuario.nombre ? user.usuario.nombre : "No hay Data"}
            </Box>
            <Box
              sx={{
                ml: 3,
                color: theme.palette.cuarternario.main,
                display: "flex",
              }}
            >
              <ExpandMoreIcon />
            </Box>
          </Box>
          <Box
            sx={{
              mt: 0.5,
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              color: theme.palette.cuarternario.main,
            }}
          >
            {user.usuario.identificacion_usuario
              ? user.usuario.identificacion_usuario
              : "No hay Data"}
          </Box>
        </Box>
      </Box>

        <Box className={classes.userInfo}>
        <Menu
          id='simple-menu'
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem
            className={classes.font}
            style={{ fontWeight: 'bold', color: 'black' }}
            disabled={true}  
          >
            {user.usuario.nombre }
          </MenuItem>
          <MenuItem
            className={classes.font}
            style={{ fontWeight: 'bold', color: 'black' }}
            disabled={true}
          >
            {user.usuario.correo_electronico}
          </MenuItem>
          <MenuItem onClick={() => irA(RUTA_MI_CUENTA)}>
            Mi cuenta
          </MenuItem>
          {PORTAL_HABILITADO && (
            <MenuItem onClick={() => irA(RUTAS_PORTAL.inicio)}>
              Ir al portal
            </MenuItem>
          )}
          <Box className={classes.btnContainer}>
            <Button
              onClick={handleLogout} className={classes.logoutBtn}
              variant='contained'
            >
              Cerrar Sesión
            </Button>
          </Box>
        </Menu>
      </Box>
    </Box>
    </>
  );
};

export default UserInfo;

UserInfo.defaultProps = {
  color: "text.secondary",
};

UserInfo.propTypes = {
  color: PropTypes.string,
};

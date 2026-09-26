import React from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { useLocation } from "react-router-dom";

const AppContentViewWrapper = ({ children, ...rest }) => {
  const location = useLocation();
  const isHomeRoute = location.pathname === "/home";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        maxWidth: { xl: 1650 },
        minHeight: "100vh", // Para asegurar que abarque el viewport completo
        height: "100%", // Para manejar espacios residuales en móviles
        mx: { xl: "auto" },
        width: { xl: "100%" },
        // width: isHomeRoute ? "100%" : { xl: "100%" },
        // backgroundColor: isHomeRoute ? "#00274d" : "",
        // backgroundImage: isHomeRoute
          // ? "url('/path-to-background-image.jpg')" // Opcional: reemplaza con tu imagen de fondo
          // : "none",
        backgroundSize: "cover", // Asegura que la imagen cubra todo el fondo
        backgroundPosition: "center",
        transition: "background-image 5s ease-in-out",
        // "&::before": isHomeRoute
        //   ? {
        //       content: '""',
        //       position: "absolute",
        //       top: 0,
        //       left: 0,
        //       width: "100%",
        //       height: "100%", // Ahora abarcará siempre toda la pantalla
        //       zIndex: -1, // Mueve la capa detrás del contenido
        //     }
        //   : {},
        zIndex: 0, // Asegura que el contenido esté sobre el fondo
      }}
      {...rest}
    >
      {children}
    </Box>
  );
};

export default AppContentViewWrapper;

AppContentViewWrapper.propTypes = {
  children: PropTypes.node,
};

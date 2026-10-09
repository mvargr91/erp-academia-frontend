import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import SnackbarContent from '@mui/material/SnackbarContent';
import WarningIcon from '@mui/icons-material/Warning';
import Snackbar from '@mui/material/Snackbar';
import { Portal, Slide } from '@mui/material';
import { amber, green } from '@mui/material/colors';
import { hideMessage } from '../../redux/features/cammon/commonSlice';
import { useDispatch } from 'react-redux';


const PREFIX = 'AppMessageView';

const classes = {
  success: `${PREFIX}-success`,
  error: `${PREFIX}-error`,
  info: `${PREFIX}-info`,
  warning: `${PREFIX}-warning`,
  icon: `${PREFIX}-icon`,
  iconVariant: `${PREFIX}-iconVariant`,
  message: `${PREFIX}-message`,
};

const StyledSnackbar = styled(Snackbar)(({ theme }) => ({
  [`& .${classes.success}`]: {
    backgroundColor: green[600],
  },
  [`& .${classes.error}`]: {
    backgroundColor: theme.palette.error.main,
  },
  [`& .${classes.info}`]: {
    backgroundColor: theme.palette.primary.light,
  },
  [`& .${classes.warning}`]: {
    backgroundColor: amber[700],
  },
  [`& .${classes.icon}`]: {
    fontSize: 20,
  },
  [`& .${classes.iconVariant}`]: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  [`& .${classes.message}`]: {
    display: 'flex',
    alignItems: 'center',
  },
}));

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

function TransitionLeft(props) {
  return <Slide {...props} direction="left" />;
}

const AppMessageView = ({ clearInfoView, className, message, variant, ...other }) => {
  const [open, setOpen] = useState(false);
  const Icon = variantIcon[variant];
  const dispatch = useDispatch();
  useEffect(() => {
    if (message) {
      setOpen(true); // abre el Snackbar cuando hay un mensaje nuevo
    }
    return () => setOpen(false); // cierra el Snackbar al desmontar o cuando no hay mensaje
  }, [message]);

  const onClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
    setTimeout(() => {
      dispatch(hideMessage()); // Limpia globalmente
    }, 500); // Ajusta el tiempo según el auto-cierre
  }

  // Se dibuja en el <body> (Portal): dentro de la página quedaba atrapado en el área de contenido y,
  // al medir el 90 % de la pantalla, su borde izquierdo se escondía bajo el menú lateral.
  return (
    <Portal>
    <StyledSnackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      open={open}
      onClose={onClose}
      autoHideDuration={variant === 'error' ? 6000 : 3000}
      TransitionComponent={TransitionLeft}
      sx={{
        // Ocupa solo el área de contenido: a la derecha del menú lateral cuando está visible.
        left: 'calc(var(--ancho-menu, 0px) + 16px) !important',
        right: '16px !important',
        bottom: '24px !important',
        transform: 'none !important',
        justifyContent: 'center',
        zIndex: (theme) => theme.zIndex.snackbar,
        '& .MuiSnackbarContent-root': {
          fontSize: '0.9rem',
          display: 'flex',
          flexWrap: 'nowrap',
          alignItems: 'center',
          width: '100%',
          maxWidth: 760,
          color: 'white',
          borderRadius: '10px',
          boxShadow: '0 8px 24px rgb(0 0 0 / 25%)',
        },
        '& .MuiSnackbarContent-message': { flex: 1, minWidth: 0 },
      }}
    >
      {message && (
        <SnackbarContent
          className={clsx(classes[variant], className)}
          aria-describedby="client-snackbar"
          message={
            <span id="client-snackbar" className={classes.message}>
              <Icon className={clsx(classes.icon, classes.iconVariant)} />
              {message}
            </span>
          }
          action={[
            <IconButton
              key="close"
              aria-label="close"
              color="inherit"
              onClick={onClose}
              size="large"
            >
              <CloseIcon className={classes.icon} />
            </IconButton>,
          ]}
          {...other}
        />
      )}
    </StyledSnackbar>
    </Portal>
  );
};

AppMessageView.propTypes = {
  clearInfoView: PropTypes.func.isRequired,
  className: PropTypes.string,
  message: PropTypes.string,
  variant: PropTypes.oneOf(['error', 'info', 'success', 'warning']).isRequired,
};

export default AppMessageView;

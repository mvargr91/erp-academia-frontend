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
import { Slide } from '@mui/material';
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

  return (
    <StyledSnackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      open={open}
      onClose={onClose}
      autoHideDuration={1000}
      TransitionComponent={TransitionLeft}
      sx={{
        '& .MuiSnackbarContent-root': {
          fontSize: '0.8rem', // Aumenta el tamaño de la fuente
          textAlign: 'center', // Centra el texto
          display:'flex',
          maxWidth: '1200px', // Ajusta el ancho del Snackbar
          color: 'white', // Cambia el color del texto
          width: '90vw', 
        },
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
  );
};

AppMessageView.propTypes = {
  clearInfoView: PropTypes.func.isRequired,
  className: PropTypes.string,
  message: PropTypes.string,
  variant: PropTypes.oneOf(['error', 'info', 'success', 'warning']).isRequired,
};

export default AppMessageView;

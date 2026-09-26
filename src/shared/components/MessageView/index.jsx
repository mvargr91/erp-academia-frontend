import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import { amber, green } from '@mui/material/colors';
import IconButton from '@mui/material/IconButton';
import SnackbarContent from '@mui/material/SnackbarContent';
import WarningIcon from '@mui/icons-material/Warning';
import { makeStyles } from '@mui/styles';
import Snackbar from '@mui/material/Snackbar';

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};
const useStyles1 = makeStyles((theme) => ({
  success: {
    backgroundColor: green[600],
    width: '95vw',
  },
  error: {
    backgroundColor: theme.palette.error.dark,
    width: '95vw',
  },
  info: {
    backgroundColor: theme.palette.primary.main,
    width: '95vw',
  },
  warning: {
    backgroundColor: amber[700],
    width: '95vw',
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(2),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
}));
const AppSnackbar = (props) => {
  const classes = useStyles1();

  const [open, setOpen] = React.useState(false);
  const { className, message, variant, ...other } = props;
  const Icon = variantIcon[variant];

  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (message) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [message]);

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={open}
      style={{ width: '90%', left: 85 }}
      autoHideDuration={4000}
      onClose={onClose}
    >
      <SnackbarContent
        style={{ width: '100%' }}
        className={clsx(classes[variant], className)}
        aria-describedby='client-snackbar'
        message={
          <span id='client-snackbar' className={classes.message}>
            <Icon className={clsx(classes.icon, classes.iconVariant)} />
            {message}
          </span>
        }
        action={[
          <IconButton
            key='close'
            aria-label='close'
            color='inherit'
            onClick={onClose}
          >
            <CloseIcon className={classes.icon} />
          </IconButton>,
        ]}
        {...other}
      />
    </Snackbar>
  );
};
AppSnackbar.propTypes = {
  className: PropTypes.string,
  message: PropTypes.string,
  variant: PropTypes.oneOf(['error', 'info', 'success', 'warning']).isRequired,
};

export default AppSnackbar;

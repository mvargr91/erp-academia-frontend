// Interruptor de modo claro/oscuro (cabecera del panel y pantalla de ingreso).
import React from 'react';
import PropTypes from 'prop-types';
import { IconButton, Tooltip } from '@mui/material';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { useApariencia } from './index';
import { MODO_OSCURO } from './tema';

const BotonModo = ({ sx }) => {
  const { modo, alternarModo } = useApariencia();
  const oscuro = modo === MODO_OSCURO;
  const titulo = oscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';

  return (
    <Tooltip title={titulo}>
      <IconButton onClick={alternarModo} aria-label={titulo} sx={{ color: 'text.secondary', ...sx }}>
        {oscuro ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
      </IconButton>
    </Tooltip>
  );
};

BotonModo.propTypes = {
  sx: PropTypes.object,
};

export default BotonModo;

import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { HelpOutline } from '@mui/icons-material';
import PropTypes from 'prop-types'; // Importa PropTypes

// Usamos styled para crear el estilo del botón
const StyledIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  padding: 5,
  height: 48,
  aspectRatio: '1 / 1',
  boxShadow:
    '0px 3px 5px -1px rgb(0 0 0 / 30%), 0px 6px 10px 0px rgb(0 0 0 / 20%), 0px 1px 18px 0px rgb(0 0 0 / 16%)',
  '&:hover': {
    backgroundColor: theme.palette.secondary.main,
    cursor: 'pointer',
  },
}));

const HelpButton = (props) => {
  const { url } = props;

  const onClick = (url) => {
    if (url) {
      window.open(url, '_blank').focus();
    }
  };

  return (
    <Tooltip title="Ayuda">
      <StyledIconButton onClick={() => onClick(url)} aria-label="help button">
        <HelpOutline
          sx={{
            fontSize: 40,
            color: 'white',
          }}
        />
      </StyledIconButton>
    </Tooltip>
  );
};

// Define las propTypes para el componente
HelpButton.propTypes = {
  url: PropTypes.string,
};

export default HelpButton;

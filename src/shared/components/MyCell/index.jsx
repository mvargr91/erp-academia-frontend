import React from 'react';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import PropTypes from 'prop-types'; // Importa PropTypes
import { styled } from '@mui/material/styles';

const MyCell = (props) => {
  const { align, width, claseBase, value, cellColor, useStyles } = props;
  const classes = useStyles({ width: width, cellColor: cellColor });

  let allClassName = claseBase;

  if (width !== undefined) {
    allClassName = `${allClassName} ${classes.cellWidth}`;
  }

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  return (
    <StyledTableCell align={align} className={allClassName}>
      <span className={cellColor ? classes.cellColor : ''}>{value}</span>
    </StyledTableCell>
  );
};

// Agrega la validación de PropTypes
MyCell.propTypes = {
  align: PropTypes.string.isRequired,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  claseBase: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  cellColor: PropTypes.string.isRequired,
  useStyles: PropTypes.func.isRequired,
};

export default MyCell;

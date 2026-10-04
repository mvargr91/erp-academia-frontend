// Sedes de la academia: selector del encabezado, campo de formulario y columna de tabla.
// Con una sola sede nada de esto se muestra: los registros toman esa sede automáticamente.
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { MenuItem, TextField } from '@mui/material';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import FormikAutocomplete from '../components/FormikAutocomplete';
import { elegirSede, sincronizarSedes } from '../../@crema/redux/features/sedes/sedeActualSlice';

const TODAS = 'todas';

/**
 * sedeId: sede del encabezado (null = todas). sedePorDefecto: la que debe proponer un formulario
 * nuevo (la del encabezado o la única que existe).
 */
export const useSedes = () => {
  const { id: sedeId, lista: sedes } = useSelector((state) => state.sedeActual);
  const variasSedes = sedes.length > 1;
  const sedePorDefecto = sedeId ?? (sedes.length === 1 ? sedes[0].id : '');
  return { sedes, sedeId, variasSedes, sedePorDefecto };
};

/** Selector del encabezado. Solo aparece cuando la academia tiene más de una sede. */
export const SelectorSede = ({ sx }) => {
  const dispatch = useDispatch();
  const { sedes, sedeId, variasSedes } = useSedes();

  useEffect(() => {
    dispatch(sincronizarSedes());
  }, [dispatch]);

  if (!variasSedes) {
    return null;
  }

  return (
    <TextField
      select
      size='small'
      value={sedeId ?? TODAS}
      onChange={(e) => dispatch(elegirSede(e.target.value === TODAS ? null : e.target.value))}
      aria-label='Sede'
      InputProps={{ startAdornment: <StorefrontOutlinedIcon fontSize='small' sx={{ mr: 1, color: 'text.secondary' }} /> }}
      sx={{ minWidth: { xs: 130, sm: 190 }, ...sx }}
    >
      <MenuItem value={TODAS}>Todas las sedes</MenuItem>
      {sedes.map((sede) => (
        <MenuItem key={sede.id} value={sede.id}>
          {sede.nombre}
        </MenuItem>
      ))}
    </TextField>
  );
};

SelectorSede.propTypes = {
  sx: PropTypes.object,
};

/**
 * Campo "Sede" de un formulario Formik (name='sede_id'). Con una sola sede no se pinta, salvo
 * `opcional`, donde vacío significa "todas las sedes" y tampoco aporta con una sola.
 */
export const CampoSede = ({ disabled, opcional, label, helperText, ...props }) => {
  const { sedes, variasSedes } = useSedes();
  if (!variasSedes) {
    return null;
  }
  return (
    <FormikAutocomplete
      name='sede_id'
      label={label ?? (opcional ? 'Sede (vacío = todas)' : 'Sede')}
      options={sedes}
      disabled={disabled}
      textFieldProps={{ variant: 'standard', ...(helperText ? { helperText } : {}) }}
      {...props}
    />
  );
};

CampoSede.propTypes = {
  disabled: PropTypes.bool,
  opcional: PropTypes.bool,
  label: PropTypes.string,
  helperText: PropTypes.string,
};

/** Columna "Sede" para AppCrudTable: visible de entrada solo si hay varias sedes. */
export const celdaSede = (variasSedes, extra = {}) => ({
  id: 'sede_nombre',
  typeHead: 'string',
  label: 'Sede',
  value: (v) => v,
  align: 'left',
  mostrarInicio: variasSedes,
  ordenable: false,
  ...extra,
});

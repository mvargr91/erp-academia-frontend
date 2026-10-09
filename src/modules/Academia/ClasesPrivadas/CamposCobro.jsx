// Cobro de una clase personalizada que se paga aparte (clase suelta o alumno sin paquete): su valor
// y, si ya la pagaron, los datos del pago. El pago queda registrado en Pagos y cuenta en los ingresos.
// Se usa al agendar la clase y al registrar su resultado.
import React from 'react';
import PropTypes from 'prop-types';
import { FormControlLabel, MenuItem, Switch, TextField } from '@mui/material';
import { METODOS_PAGO } from '../../../shared/constants/Academia';

export const hoy = () => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);

// Valores del cobro a partir de la clase que devuelve el backend.
export const cobroDe = (clase) => ({
  valor: clase?.valor ?? '',
  pagada: Boolean(clase?.pago),
  fecha_pago: clase?.pago?.fecha_pago ?? hoy(),
  metodo_pago: clase?.pago?.metodo_pago ?? 'efectivo',
  referencia: clase?.pago?.referencia ?? '',
});

const CamposCobro = ({ valores, onCambio, errores, disabled, className, soloValor }) => {
  const campo = (nombre) => ({
    className,
    fullWidth: true,
    variant: 'standard',
    disabled,
    value: valores[nombre] ?? '',
    onChange: (e) => onCambio(nombre, e.target.value),
    error: Boolean(errores?.[nombre]),
    helperText: errores?.[nombre] ?? '',
  });

  return (
    <>
      <TextField {...campo('valor')} type='number' label='Valor de la clase' required={valores.pagada} />
      {/* Quien no maneja pagos solo fija el valor; el pago lo registra el perfil de pagos. */}
      {soloValor ? null : (
        <>
      <FormControlLabel
        className={className}
        label='Pagada'
        control={
          <Switch color='success' checked={Boolean(valores.pagada)} disabled={disabled} onChange={(e) => onCambio('pagada', e.target.checked)} />
        }
      />
      {valores.pagada && (
        <>
          <TextField {...campo('fecha_pago')} type='date' label='Fecha de pago' InputLabelProps={{ shrink: true }} />
          <TextField {...campo('metodo_pago')} select label='Método de pago'>
            {METODOS_PAGO.map((m) => (
              <MenuItem key={m.id} value={m.id}>
                {m.nombre}
              </MenuItem>
            ))}
          </TextField>
          <TextField {...campo('referencia')} label='Referencia' />
        </>
      )}
        </>
      )}
    </>
  );
};

CamposCobro.propTypes = {
  valores: PropTypes.object.isRequired,
  onCambio: PropTypes.func.isRequired,
  errores: PropTypes.object,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  soloValor: PropTypes.bool,
};

export default CamposCobro;

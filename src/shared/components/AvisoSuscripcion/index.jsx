// Aviso para el administrador de una academia cuando tiene cuentas de cobro del ERP
// pendientes o vencidas. El backend decide si se muestra (solo al rol administrador).
import React, { useEffect, useState } from 'react';
import { Alert, AlertTitle, Box, Collapse } from '@mui/material';
import jwtAxios from '../../../@crema/services/auth/jwt-auth';
import { formatoMoneda } from '../../constants/Academia';

const fecha = (iso) => (iso ? iso.split('-').reverse().join('/') : '');

const AvisoSuscripcion = () => {
  const [cuenta, setCuenta] = useState(null);
  const [abierto, setAbierto] = useState(true);

  useEffect(() => {
    jwtAxios
      .get('mi-suscripcion')
      .then(({ data }) => setCuenta(data))
      .catch(() => setCuenta(null));
  }, []);

  if (!cuenta?.mostrar) return null;

  const enMora = cuenta.estado === 'en_mora';
  return (
    <Collapse in={abierto}>
      <Alert severity={enMora ? 'error' : 'warning'} onClose={() => setAbierto(false)} sx={{ mb: 3 }}>
        <AlertTitle>{enMora ? 'Tu suscripción al ERP está vencida' : 'Tienes una cuenta de cobro pendiente'}</AlertTitle>
        Saldo: <strong>{formatoMoneda(cuenta.saldo)}</strong>
        {enMora && cuenta.fecha_suspension
          ? ` · El acceso se suspenderá el ${fecha(cuenta.fecha_suspension)} si no se registra el pago.`
          : ` · Vence el ${fecha(cuenta.proximo_vencimiento)}.`}
        {cuenta.datos_pago && (
          <Box sx={{ mt: 1, whiteSpace: 'pre-line' }}>
            <strong>Datos para el pago:</strong> {cuenta.datos_pago}
          </Box>
        )}
        {cuenta.contacto && <Box sx={{ mt: 1 }}>Envía el soporte a {cuenta.contacto}.</Box>}
      </Alert>
    </Collapse>
  );
};

export default AvisoSuscripcion;

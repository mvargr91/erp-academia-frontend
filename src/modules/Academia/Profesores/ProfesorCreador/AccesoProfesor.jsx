// Acceso al ERP del profesor: con «Dar acceso» se crea su cuenta (entra con su correo y una contraseña
// inicial que debe cambiar al entrar) con el rol Profesor, que solo ve Mis cursos y Tomar asistencia.
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, Box, Button, Chip, CircularProgress, TextField, Typography } from '@mui/material';
import KeyIcon from '@mui/icons-material/Key';
import jwtAxios from '../../../../@crema/services/auth/jwt-auth';

const mensajeDe = (e) => e?.response?.data?.mensajes?.[0] ?? 'No se pudo completar la operación.';

const AccesoProfesor = ({ profesorId, accesoInicial, puedeModificar }) => {
  const [acceso, setAcceso] = useState(accesoInicial ?? null);
  const [clave, setClave] = useState('');
  const [aviso, setAviso] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const enviar = (peticion) => {
    setAviso(null);
    setEnviando(true);
    peticion
      .then(({ data }) => {
        setAcceso(data.datos.acceso);
        setClave('');
        setAviso({ tipo: 'success', texto: data.mensajes[0] });
      })
      .catch((e) => setAviso({ tipo: 'error', texto: mensajeDe(e) }))
      .finally(() => setEnviando(false));
  };
  const dar = () => enviar(jwtAxios.post(`profesores/${profesorId}/acceso`, { clave }));
  const quitar = () => {
    if (window.confirm('¿Quitar el acceso al ERP? El profesor ya no podrá entrar con su cuenta.')) {
      enviar(jwtAxios.delete(`profesores/${profesorId}/acceso`));
    }
  };

  return (
    <Box className='campo-completo'>
      {acceso ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Typography>
            Entra con <strong>{acceso.identificacion_usuario}</strong>
          </Typography>
          {!acceso.activo && <Chip size='small' color='error' label='Cuenta desactivada' />}
          {acceso.activo && acceso.debe_cambiar_clave && (
            <Chip size='small' color='warning' label='Aún no cambia la contraseña inicial' />
          )}
          {puedeModificar && (
            <Button size='small' color='error' disabled={enviando} onClick={quitar}>
              Quitar acceso
            </Button>
          )}
        </Box>
      ) : puedeModificar ? (
        <>
          <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
            El profesor entrará con su correo y esta contraseña inicial, que deberá cambiar al entrar. Solo verá sus cursos y
            podrá tomar asistencia.
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              variant='standard'
              type='text'
              label='Contraseña inicial'
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              helperText='Mínimo 8 caracteres. Entrégasela al profesor.'
              inputProps={{ maxLength: 32, autoComplete: 'off' }}
            />
            <Button
              variant='outlined'
              startIcon={enviando ? <CircularProgress size={16} color='inherit' /> : <KeyIcon />}
              disabled={enviando || clave.length < 8}
              onClick={dar}
              sx={{ mt: 1 }}
            >
              Dar acceso al ERP
            </Button>
          </Box>
        </>
      ) : (
        <Typography color='text.secondary'>No tiene acceso al ERP.</Typography>
      )}
      {aviso && (
        <Alert severity={aviso.tipo} sx={{ mt: 2 }} onClose={() => setAviso(null)}>
          {aviso.texto}
        </Alert>
      )}
    </Box>
  );
};

AccesoProfesor.propTypes = {
  profesorId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  accesoInicial: PropTypes.object,
  puedeModificar: PropTypes.bool,
};

export default AccesoProfesor;

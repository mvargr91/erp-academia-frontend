// Certificado SSL del subdominio de la academia: al crearla, el servidor lo amplía en segundo plano.
// Si falló, se ve el motivo y se puede volver a pedir.
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, Button, CircularProgress } from '@mui/material';
import jwtAxios from '../../../../@crema/services/auth/jwt-auth';

const TEXTOS = {
  listo: ['success', 'El certificado SSL del subdominio está listo: la dirección abre con https sin avisos.'],
  pendiente: ['info', 'El certificado SSL del subdominio se está generando. Recarga en unos segundos.'],
  error: ['error', 'No se pudo generar el certificado SSL del subdominio: la dirección puede mostrar «sitio no seguro».'],
};

const CertificadoAcademia = ({ academiaId, estadoInicial, mensajeInicial, puedeModificar }) => {
  const [estado, setEstado] = useState(estadoInicial);
  const [mensaje, setMensaje] = useState(mensajeInicial);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  if (!estado) return null; // El servidor no gestiona certificados (desarrollo).
  const [severidad, texto] = TEXTOS[estado] ?? TEXTOS.pendiente;

  const reintentar = () => {
    setError('');
    setEnviando(true);
    jwtAxios
      .post(`academias/${academiaId}/certificado`)
      .then(({ data }) => {
        setEstado(data.datos.certificado);
        setMensaje(data.datos.certificado_mensaje);
      })
      .catch((e) => setError(e?.response?.data?.mensajes?.[0] ?? 'No se pudo pedir el certificado.'))
      .finally(() => setEnviando(false));
  };

  return (
    <Alert
      severity={severidad}
      className='campo-completo'
      action={
        estado === 'error' && puedeModificar ? (
          <Button color='inherit' size='small' disabled={enviando} onClick={reintentar} startIcon={enviando ? <CircularProgress size={14} color='inherit' /> : null}>
            Reintentar
          </Button>
        ) : null
      }
    >
      {texto}
      {estado === 'error' && mensaje && <pre style={{ whiteSpace: 'pre-wrap', margin: '8px 0 0', fontSize: 12 }}>{mensaje}</pre>}
      {error && <div>{error}</div>}
    </Alert>
  );
};

CertificadoAcademia.propTypes = {
  academiaId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  estadoInicial: PropTypes.string,
  mensajeInicial: PropTypes.string,
  puedeModificar: PropTypes.bool,
};

export default CertificadoAcademia;

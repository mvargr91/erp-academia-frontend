// Eliminar la academia: borra su base de datos completa (con respaldo previo en el servidor), sus
// cuentas de cobro y pagos al ERP. Se confirma escribiendo el código de la academia.
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import jwtAxios from '../../../../@crema/services/auth/jwt-auth';

const EliminarAcademia = ({ academia, onEliminada }) => {
  const [enviando, setEnviando] = useState(false);

  const eliminar = async () => {
    const pagos = Number(academia.pagos_registrados) || 0;
    const { value: confirmacion, isConfirmed } = await Swal.fire({
      icon: 'warning',
      title: `Eliminar ${academia.nombre}`,
      html:
        'Se borrarán su base de datos completa (alumnos, cursos, pagos, asistencias y usuarios), sus cuentas de cobro y ' +
        'sus pagos al ERP. Antes se guarda un respaldo en el servidor.' +
        (pagos > 0
          ? `<p style="color:#d32f2f;font-weight:bold">Tiene ${pagos} pago(s) registrado(s) al ERP: ese historial de cobro también se pierde.</p>`
          : '') +
        `<p>Para confirmar escribe su código: <b>${academia.codigo}</b></p>`,
      input: 'text',
      inputAttributes: { autocapitalize: 'off', autocomplete: 'off' },
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      inputValidator: (valor) => (valor?.trim() === academia.codigo ? null : 'El código no coincide.'),
    });
    if (!isConfirmed) return;

    setEnviando(true);
    try {
      const { data } = await jwtAxios.delete(`academias/${academia.id}`, { data: { confirmacion: confirmacion.trim() } });
      await Swal.fire({ icon: 'success', title: 'Academia eliminada', text: data.mensajes[0] });
      onEliminada();
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'No se pudo eliminar', text: e?.response?.data?.mensajes?.[0] ?? 'Ocurrió un error.' });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Box className='campo-completo' sx={{ p: 2, border: '1px solid', borderColor: 'error.main', borderRadius: 1 }}>
      <Typography variant='h5' color='error' sx={{ mb: 1 }}>
        Eliminar academia
      </Typography>
      <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
        Borra la academia y toda su información. No se puede deshacer, pero queda un respaldo de su base de datos en el servidor.
        Si solo quieres que nadie entre, deja «Acceso al ERP» en Inactivo.
      </Typography>
      <Button
        color='error'
        variant='outlined'
        disabled={enviando}
        startIcon={enviando ? <CircularProgress size={16} color='inherit' /> : <DeleteForeverIcon />}
        onClick={eliminar}
      >
        Eliminar academia
      </Button>
    </Box>
  );
};

EliminarAcademia.propTypes = {
  academia: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    codigo: PropTypes.string.isRequired,
    nombre: PropTypes.string,
    pagos_registrados: PropTypes.number,
  }).isRequired,
  onEliminada: PropTypes.func.isRequired,
};

export default EliminarAcademia;

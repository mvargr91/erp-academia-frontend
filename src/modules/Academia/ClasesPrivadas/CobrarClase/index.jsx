// Cobro de una clase personalizada: su valor y su pago. Va separado del registro de asistencia porque
// es de otro perfil: exige el permiso «Pagar» de Clases personalizadas (registrar, cambiar o quitar
// el pago), distinto del permiso «Modificar» con el que se registra la asistencia.
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Alert, Box, Button, Card, CardContent, IconButton, LinearProgress, Tooltip, Typography } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import jwtAxios from '../../../../@crema/services/auth/jwt-auth';
import { showMessage } from '../../../../@crema/redux/features/cammon/commonSlice';
import usePermisosOpcion from '../../../../shared/hooks/usePermisosOpcion';
import CamposCobro, { cobroDe } from '../CamposCobro';

const CobrarClase = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { permisos, cargado } = usePermisosOpcion('/clases-privadas');
  const [clase, setClase] = useState(null);
  const [cobro, setCobro] = useState(cobroDe(null));
  const [errorCarga, setErrorCarga] = useState('');
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    jwtAxios
      .get(`clases-privadas/${id}`)
      .then(({ data }) => {
        setClase(data);
        setCobro(cobroDe(data));
      })
      .catch(() => setErrorCarga('No se pudo cargar la clase.'));
  }, [id]);

  if (errorCarga) return <Alert severity='error'>{errorCarga}</Alert>;
  if (!clase || !cargado) return <LinearProgress />;

  const puedeGuardar = permisos.indexOf('Pagar') >= 0;

  const guardar = () => {
    if (cobro.pagada && !(Number(cobro.valor) > 0)) {
      setError('Indica el valor de la clase para registrar su pago.');
      return;
    }
    setError('');
    setGuardando(true);
    jwtAxios
      .put(`clases-privadas/${id}/pago`, { ...cobro, valor: cobro.valor === '' ? null : cobro.valor })
      .then(({ data }) => {
        dispatch(showMessage(data.mensajes));
        navigate('/clases-privadas');
      })
      .catch((e) => setError(e?.response?.data?.mensajes?.[0] ?? 'No se pudo guardar el cobro.'))
      .finally(() => setGuardando(false));
  };

  return (
    <Box sx={{ maxWidth: 900 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Tooltip title='Volver'>
          <IconButton onClick={() => navigate('/clases-privadas')}>
            <ArrowBackIosIcon />
          </IconButton>
        </Tooltip>
        <Box>
          <Typography variant='h2' sx={{ fontWeight: 'bold' }}>
            Pago de la clase personalizada
          </Typography>
          <Typography color='text.secondary'>
            {clase.fecha.split('-').reverse().join('/')} · {clase.hora} · {clase.alumnos_nombres}
            {clase.profesor_nombre ? ` · ${clase.profesor_nombre}` : ''}
          </Typography>
        </Box>
      </Box>

      {!puedeGuardar && (
        <Alert severity='warning' sx={{ mb: 2 }}>
          Tu perfil no tiene el permiso «Pagar» de Clases personalizadas: solo puedes consultar el cobro.
        </Alert>
      )}

      <Card sx={{ mb: 2, boxShadow: '0px 0px 5px 2px rgb(0 0 0 / 8%)' }}>
        <CardContent>
          <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
            Solo para clases que se cobran aparte (clase suelta o alumno sin paquete). Al marcar «Pagada» el pago queda registrado
            en Pagos; las clases de un paquete se pagan en el paquete.
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, columnGap: 4, rowGap: 3, alignItems: 'end' }}>
            <CamposCobro valores={cobro} onCambio={(campo, valor) => setCobro((c) => ({ ...c, [campo]: valor }))} disabled={!puedeGuardar} />
          </Box>
        </CardContent>
      </Card>

      {error && (
        <Alert severity='error' sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
        <Button onClick={() => navigate('/clases-privadas')}>Cancelar</Button>
        <Button variant='contained' onClick={guardar} disabled={guardando || !puedeGuardar}>
          Guardar cobro
        </Button>
      </Box>
    </Box>
  );
};

export default CobrarClase;

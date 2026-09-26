// Tarjeta de reserva del detalle. Reutiliza el slice de reservas (onCreate); el backend
// fuerza usuario y proveedor según el token, así que el portal no decide esos datos.
import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { onCreate as onCrearReserva } from '@crema/redux/features/reservas/reservasSlice';
import MyTextField from '../../../shared/components/MyTextField';
import { aHoraCorta, formatoMoneda } from '../../../shared/constants/Turismo';
import { RUTAS_PORTAL } from '../../../shared/constants/RutasPortal';

const validacionContacto = yup.object({
  nombre: yup.string().required('Requerido').max(150),
  correo: yup.string().required('Requerido').email('Correo inválido'),
  telefono: yup.string().required('Requerido').max(30).matches(/^[+]?[0-9\s-]*$/, 'Teléfono inválido'),
});

// Descuento de la promoción vigente sobre el total.
export const calcularTotal = (precio, personas, promocion) => {
  const subtotal = Number(precio || 0) * Number(personas || 0);
  if (!promocion) return { subtotal, descuento: 0, total: subtotal };
  const descuento = promocion.tipo_descuento === 'porcentaje'
    ? Math.round((subtotal * Number(promocion.valor_descuento)) / 100)
    : Math.min(Number(promocion.valor_descuento), subtotal);
  return { subtotal, descuento, total: subtotal - descuento };
};

const ReservaWidget = ({ experiencia }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { saving } = useSelector((state) => state.reservas);
  const [disponibilidadId, setDisponibilidadId] = useState(experiencia.disponibilidad[0]?.id ?? '');
  const [personas, setPersonas] = useState(1);
  const [confirmando, setConfirmando] = useState(false);

  const disponibilidad = experiencia.disponibilidad.find((d) => d.id === disponibilidadId);
  const maxPersonas = disponibilidad?.cupos_disponibles ?? experiencia.capacidad_maxima ?? 20;
  const { subtotal, descuento, total } = useMemo(
    () => calcularTotal(experiencia.precio_desde, personas, experiencia.promocion),
    [experiencia, personas],
  );

  const reservar = () => {
    if (!isAuthenticated) {
      navigate(`/signin?redirect=${RUTAS_PORTAL.tour(experiencia.slug)}`);
      return;
    }
    setConfirmando(true);
  };

  const enviar = (contacto) => {
    dispatch(
      onCrearReserva({
        params: {
          ...contacto,
          usuario_id: user?.usuario?.id,
          experiencia_id: experiencia.id,
          proveedor_id: experiencia.proveedor_id,
          disponibilidad_id: disponibilidad?.id ?? null,
          fecha: disponibilidad?.fecha,
          hora_inicio: aHoraCorta(disponibilidad?.hora_inicio),
          cantidad_personas: personas,
          cantidad_chicos: 0,
          idioma: experiencia.idioma,
          valor_total: total,
        },
        handleOnClose: () => setConfirmando(false),
        updateColeccion: () => navigate('/mis-reservas'),
      }),
    );
  };

  return (
    <Paper sx={{ p: 3, position: { md: 'sticky' }, top: { md: 100 } }}>
      <Typography variant='caption' color='text.secondary'>Desde</Typography>
      <Typography variant='h2' color='primary.main'>
        {formatoMoneda(experiencia.precio_desde)}
        <Typography component='span' color='text.secondary'> / persona</Typography>
      </Typography>
      {experiencia.promocion && (
        <Alert severity='success' sx={{ mt: 1 }}>
          {experiencia.promocion.nombre}:{' '}
          {experiencia.promocion.tipo_descuento === 'porcentaje'
            ? `${Number(experiencia.promocion.valor_descuento)}% de descuento`
            : `${formatoMoneda(experiencia.promocion.valor_descuento)} de descuento`}{' '}
          hasta {experiencia.promocion.fecha_fin}
        </Alert>
      )}

      <Stack spacing={2} sx={{ mt: 2.5 }}>
        {experiencia.disponibilidad.length > 0 ? (
          <TextField select label='Fecha y hora' value={disponibilidadId} onChange={(e) => setDisponibilidadId(e.target.value)}>
            {experiencia.disponibilidad.map((d) => (
              <MenuItem key={d.id} value={d.id}>
                {d.fecha} · {aHoraCorta(d.hora_inicio)} ({d.cupos_disponibles} cupos)
              </MenuItem>
            ))}
          </TextField>
        ) : (
          <Alert severity='info'>No hay fechas publicadas. Pronto el proveedor abrirá nuevos cupos.</Alert>
        )}
        <TextField
          type='number'
          label='Personas'
          value={personas}
          inputProps={{ min: 1, max: maxPersonas }}
          onChange={(e) => setPersonas(Math.max(1, Math.min(maxPersonas, Number(e.target.value) || 1)))}
        />
      </Stack>

      <Box sx={{ mt: 2.5 }}>
        <Stack direction='row' justifyContent='space-between'>
          <Typography color='text.secondary'>{formatoMoneda(experiencia.precio_desde)} × {personas}</Typography>
          <Typography>{formatoMoneda(subtotal)}</Typography>
        </Stack>
        {descuento > 0 && (
          <Stack direction='row' justifyContent='space-between' sx={{ color: 'success.main' }}>
            <Typography>Descuento</Typography>
            <Typography>- {formatoMoneda(descuento)}</Typography>
          </Stack>
        )}
        <Divider sx={{ my: 1 }} />
        <Stack direction='row' justifyContent='space-between'>
          <Typography fontWeight={700}>Total estimado</Typography>
          <Typography fontWeight={700}>{formatoMoneda(total)}</Typography>
        </Stack>
      </Box>

      <Button
        fullWidth
        size='large'
        variant='contained'
        startIcon={<EventAvailableIcon />}
        sx={{ mt: 2.5 }}
        disabled={!disponibilidad}
        onClick={reservar}
      >
        {isAuthenticated ? 'Solicitar reserva' : 'Ingresa para reservar'}
      </Button>
      <Typography variant='caption' color='text.secondary' component='p' sx={{ mt: 1, textAlign: 'center' }}>
        El proveedor confirmará tu reserva. Podrás verla en “Mis reservas”.
      </Typography>
      {!isAuthenticated && (
        <Button fullWidth size='small' sx={{ mt: 1 }} onClick={() => navigate(`${RUTAS_PORTAL.registro}?redirect=${RUTAS_PORTAL.tour(experiencia.slug)}`)}>
          ¿No tienes cuenta? Regístrate
        </Button>
      )}

      <Dialog open={confirmando} onClose={() => setConfirmando(false)} maxWidth='xs' fullWidth>
        <Formik
          initialValues={{
            nombre: user?.usuario?.nombre ?? '',
            correo: user?.usuario?.correo_electronico ?? '',
            telefono: user?.usuario?.telefono ?? '',
            observaciones: '',
          }}
          validationSchema={validacionContacto}
          onSubmit={enviar}
        >
          <Form noValidate>
            <DialogTitle>Confirmar reserva</DialogTitle>
            <DialogContent>
              <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                {experiencia.nombre} · {disponibilidad?.fecha} {aHoraCorta(disponibilidad?.hora_inicio)} · {personas} persona(s) · {formatoMoneda(total)}
              </Typography>
              <Stack spacing={2}>
                <MyTextField name='nombre' label='Nombre completo' fullWidth required />
                <MyTextField name='correo' label='Correo' type='email' fullWidth required />
                <MyTextField name='telefono' label='Teléfono / WhatsApp' fullWidth required />
                <MyTextField name='observaciones' label='Comentarios para el proveedor' fullWidth multiline minRows={2} />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setConfirmando(false)}>Cancelar</Button>
              <Button type='submit' variant='contained' disabled={saving}>Enviar solicitud</Button>
            </DialogActions>
          </Form>
        </Formik>
      </Dialog>
    </Paper>
  );
};

ReservaWidget.propTypes = {
  experiencia: PropTypes.object.isRequired,
};

export default ReservaWidget;

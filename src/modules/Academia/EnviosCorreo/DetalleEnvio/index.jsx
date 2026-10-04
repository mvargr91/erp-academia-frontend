// Detalle de un envío: mensaje enviado y estado de cada destinatario (se actualiza mientras envía).
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import jwtAxios from '../../../../@crema/services/auth/jwt-auth';

const ESTADOS = {
  pendiente: { label: 'En cola', color: 'warning' },
  enviado: { label: 'Enviado', color: 'success' },
  error: { label: 'Error', color: 'error' },
};

const DetalleEnvio = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [envio, setEnvio] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let timer;
    const cargar = () =>
      jwtAxios
        .get(`envios-correo/${id}`)
        .then(({ data }) => {
          setEnvio(data);
          // Mientras haya correos en cola se refresca solo.
          if (data.estado !== 'completado') timer = setTimeout(cargar, 10000);
        })
        .catch(() => setError('No se pudo cargar el envío.'));
    cargar();
    return () => clearTimeout(timer);
  }, [id]);

  if (error) return <Alert severity='error'>{error}</Alert>;
  if (!envio) return <LinearProgress />;

  const avance = envio.total ? ((envio.enviados + envio.errores) / envio.total) * 100 : 100;

  return (
    <Box sx={{ maxWidth: 1000 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Tooltip title='Volver'>
          <IconButton onClick={() => navigate('/envios-correo')}>
            <ArrowBackIosIcon />
          </IconButton>
        </Tooltip>
        <Box>
          <Typography variant='h2' sx={{ fontWeight: 'bold' }}>
            {envio.asunto}
          </Typography>
          <Typography color='text.secondary'>
            {envio.audiencia_nombre} · {envio.fecha_creacion} · por {envio.usuario_creacion_nombre}
          </Typography>
        </Box>
      </Box>

      <Card sx={{ mb: 3, boxShadow: '0px 0px 5px 2px rgb(0 0 0 / 8%)' }}>
        <CardContent>
          <Typography sx={{ mb: 1 }}>
            <strong>{envio.enviados}</strong> enviados de {envio.total}
            {envio.errores > 0 && ` · ${envio.errores} con error`}
            {envio.pendientes > 0 && ` · ${envio.pendientes} en cola (se envían cada minuto)`}
          </Typography>
          <LinearProgress variant='determinate' value={avance} sx={{ height: 8, borderRadius: 4 }} />
        </CardContent>
      </Card>

      <Card sx={{ mb: 3, boxShadow: '0px 0px 5px 2px rgb(0 0 0 / 8%)' }}>
        <CardContent>
          <Typography variant='h5' sx={{ fontWeight: 'bold', mb: 2 }}>
            Destinatarios
          </Typography>
          <Box sx={{ overflowX: 'auto' }}>
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Correo</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Detalle</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {envio.destinatarios.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell>{d.nombre}</TableCell>
                    <TableCell>{d.correo}</TableCell>
                    <TableCell>
                      <Chip size='small' color={ESTADOS[d.estado]?.color} label={ESTADOS[d.estado]?.label ?? d.estado} />
                    </TableCell>
                    <TableCell sx={{ color: 'error.main', maxWidth: 360 }}>{d.error ?? (d.enviado_en ? d.enviado_en : '')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ boxShadow: '0px 0px 5px 2px rgb(0 0 0 / 8%)' }}>
        <CardContent>
          <Typography variant='h5' sx={{ fontWeight: 'bold', mb: 2 }}>
            Mensaje enviado
          </Typography>
          {/* Contenido escrito por la propia academia (con variables sin reemplazar). */}
          <Box sx={{ p: 2, background: '#fff', color: '#222', borderRadius: 1 }} dangerouslySetInnerHTML={{ __html: envio.texto }} />
        </CardContent>
      </Card>
    </Box>
  );
};

export default DetalleEnvio;

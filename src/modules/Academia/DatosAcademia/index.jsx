// Datos de contacto de la academia: el correo y el teléfono que van en el pie de todos sus correos.
// El correo es además a donde llegan las respuestas de los alumnos (los correos salen de la plataforma).
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, Box, Button, Card, CardContent, CircularProgress, LinearProgress, TextField, Typography } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import jwtAxios from '../../../@crema/services/auth/jwt-auth';
import usePermisosOpcion from '../../../shared/hooks/usePermisosOpcion';
import { useApariencia } from '../../../shared/apariencia';

const sombra = { mb: 3, boxShadow: '0px 0px 5px 2px rgb(0 0 0 / 8%)' };
const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DatosAcademia = ({ route }) => {
  const { titulo, permisos } = usePermisosOpcion(route.path);
  const puedeEditar = permisos.indexOf('Modificar') >= 0;
  const { apariencia } = useApariencia();
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    jwtAxios
      .get('datos-academia')
      .then(({ data }) => setDatos({ ...data, correo: data.correo ?? '', telefono: data.telefono ?? '' }))
      .catch(() => setError('No se pudieron cargar los datos de contacto.'));
  }, []);

  if (!datos) return error ? <Alert severity='error'>{error}</Alert> : <LinearProgress />;

  const correoInvalido = datos.correo.trim() !== '' && !CORREO_VALIDO.test(datos.correo.trim());
  const cambiar = (campo) => (e) => setDatos({ ...datos, [campo]: e.target.value });

  const guardar = () => {
    setError('');
    setExito('');
    setGuardando(true);
    jwtAxios
      .put('datos-academia', { correo: datos.correo.trim(), telefono: datos.telefono.trim() })
      .then(({ data }) => {
        setDatos({ ...data.datos, correo: data.datos.correo ?? '', telefono: data.datos.telefono ?? '' });
        setExito(data.mensajes[0]);
      })
      .catch((e) => setError(e?.response?.data?.mensajes?.[0] ?? 'No se pudieron guardar los datos.'))
      .finally(() => setGuardando(false));
  };

  // Como en el pie de los correos (emails/academia/layout).
  const pie = [datos.telefono.trim() && `Tel. ${datos.telefono.trim()}`, datos.correo.trim()].filter(Boolean);

  return (
    <Box sx={{ maxWidth: 760 }}>
      <Typography variant='h2' sx={{ fontWeight: 'bold', mb: 1 }}>
        {titulo || 'Datos de contacto'}
      </Typography>
      <Typography color='text.secondary' sx={{ mb: 3 }}>
        Van al pie de todos los correos que la academia envía a sus alumnos (recordatorios, cumpleaños, envíos). Cuando un alumno
        responde un correo, la respuesta llega a este correo de contacto.
      </Typography>
      {error && (
        <Alert severity='error' sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {exito && (
        <Alert severity='success' sx={{ mb: 2 }} onClose={() => setExito('')}>
          {exito}
        </Alert>
      )}

      <Card sx={sombra}>
        <CardContent sx={{ display: 'grid', gap: 3 }}>
          <TextField variant='standard' label='Academia' value={datos.nombre} disabled helperText='El nombre lo cambia el administrador del ERP.' />
          <TextField
            variant='standard'
            type='email'
            label='Correo de contacto'
            placeholder='contacto@miacademia.com'
            value={datos.correo}
            onChange={cambiar('correo')}
            disabled={!puedeEditar}
            error={correoInvalido}
            helperText={correoInvalido ? 'Revisa el correo: no es válido.' : 'Usa un correo de la academia, no uno personal.'}
            inputProps={{ maxLength: 150 }}
          />
          <TextField
            variant='standard'
            label='Teléfono o WhatsApp'
            placeholder='300 123 4567'
            value={datos.telefono}
            onChange={cambiar('telefono')}
            disabled={!puedeEditar}
            inputProps={{ maxLength: 30 }}
          />
        </CardContent>
      </Card>

      <Card sx={sombra}>
        <CardContent>
          <Typography variant='h5' sx={{ fontWeight: 'bold', mb: 2 }}>
            Así se ve el pie de los correos
          </Typography>
          <Box sx={{ p: 2, bgcolor: '#fafafa', borderTop: '1px solid #eee', fontSize: 12, color: '#777', borderRadius: 1 }}>
            <Box component='strong' sx={{ color: apariencia.color_primario }}>
              {datos.nombre}
            </Box>
            {pie.map((dato) => ` · ${dato}`)}
            <br />
            Este es un mensaje automático; si tienes dudas responde a este correo o comunícate con la academia.
          </Box>
        </CardContent>
      </Card>

      {puedeEditar && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant='contained'
            disabled={guardando || correoInvalido}
            startIcon={guardando ? <CircularProgress size={16} color='inherit' /> : <SaveIcon />}
            onClick={guardar}
          >
            Guardar
          </Button>
        </Box>
      )}
    </Box>
  );
};

DatosAcademia.propTypes = {
  route: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
};

export default DatosAcademia;

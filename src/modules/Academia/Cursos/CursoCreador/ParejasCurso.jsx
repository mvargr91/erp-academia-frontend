// Cómo paga cada alumno este curso: individual o en pareja con otro alumno del mismo curso.
// Es por matrícula, no por curso: en el mismo curso unos pagan solos y otros dos pagan juntos
// (escala de pareja de Configuración → Tarifas; cada uno paga la mitad). Cada cambio se guarda al elegirlo.
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, Box, Checkbox, Chip, FormControlLabel, MenuItem, TextField, Typography } from '@mui/material';
import jwtAxios from '../../../../@crema/services/auth/jwt-auth';

const ParejasCurso = ({ cursoId, matriculados, soloLectura }) => {
  const [lista, setLista] = useState(matriculados);
  const [ajustarCiclo, setAjustarCiclo] = useState(false);
  const [guardando, setGuardando] = useState(null);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  const cambiar = (alumnoId, parejaId) => {
    setError('');
    setExito('');
    setGuardando(alumnoId);
    jwtAxios
      .put(`cursos/${cursoId}/alumnos/${alumnoId}/pareja`, { pareja_alumno_id: parejaId || null, ajustar_ciclo: ajustarCiclo })
      .then(({ data }) => {
        setLista(data.datos);
        setExito(data.mensajes[0]);
      })
      .catch((e) => setError(e?.response?.data?.mensajes?.[0] ?? 'No se pudo guardar la pareja.'))
      .finally(() => setGuardando(null));
  };

  if (lista.length === 0) {
    return (
      <Typography className='campo-completo' color='text.secondary'>
        El curso aún no tiene alumnos matriculados.
      </Typography>
    );
  }

  return (
    <Box className='campo-completo'>
      <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
        Por defecto cada alumno paga individual. Para que dos paguen en pareja, elige en uno de ellos a su pareja: el enlace queda en
        los dos. El precio nuevo aplica desde el siguiente ciclo de cada uno.
      </Typography>
      {!soloLectura && (
        <FormControlLabel
          sx={{ mb: 1 }}
          control={<Checkbox checked={ajustarCiclo} onChange={(e) => setAjustarCiclo(e.target.checked)} />}
          label='Aplicar también al ciclo actual (suma o resta la diferencia de precio al saldo de los dos)'
        />
      )}
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
      {lista.map((a) => (
        <Box
          key={a.id}
          sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 320px 110px' }, gap: 2, alignItems: 'center', py: 1, borderBottom: 1, borderColor: 'divider' }}
        >
          <Typography>{a.nombre}</Typography>
          <TextField
            select
            size='small'
            label='Paga'
            value={a.pareja_alumno_id ?? ''}
            onChange={(e) => cambiar(a.id, e.target.value)}
            disabled={soloLectura || guardando !== null}
          >
            <MenuItem value=''>Individual</MenuItem>
            {lista
              .filter((otro) => otro.id !== a.id)
              .map((otro) => (
                <MenuItem key={otro.id} value={otro.id}>
                  En pareja con {otro.nombre}
                  {otro.pareja_alumno_id && otro.pareja_alumno_id !== a.id ? ` (hoy con ${otro.pareja_nombre})` : ''}
                </MenuItem>
              ))}
          </TextField>
          <Chip size='small' color={a.pareja_alumno_id ? 'secondary' : 'default'} label={a.pareja_alumno_id ? 'En pareja' : 'Individual'} />
        </Box>
      ))}
    </Box>
  );
};

ParejasCurso.propTypes = {
  cursoId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  matriculados: PropTypes.array.isRequired,
  soloLectura: PropTypes.bool,
};

export default ParejasCurso;

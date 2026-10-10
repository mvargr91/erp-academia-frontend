// Cómo paga cada alumno este curso. Es por matrícula, no por curso:
//  - Individual o en pareja con otro alumno del mismo curso (tarifa de pareja de Configuración →
//    Tarifas; cada uno paga la mitad).
//  - Valor especial: un precio pactado con ese alumno (beca, convenio, cortesía) que reemplaza la tarifa.
// Cada cambio se guarda al hacerlo.
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, Box, Button, Checkbox, Chip, FormControlLabel, MenuItem, TextField, Typography } from '@mui/material';
import jwtAxios from '../../../../@crema/services/auth/jwt-auth';
import { formatoMoneda } from '../../../../shared/constants/Academia';

const ParejasCurso = ({ cursoId, matriculados, soloLectura, puedeValorEspecial }) => {
  const [lista, setLista] = useState(matriculados);
  const [ajustarCiclo, setAjustarCiclo] = useState(false);
  const [guardando, setGuardando] = useState(null);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  // Alumno cuyo valor especial se está editando: { id, valor, motivo }
  const [especial, setEspecial] = useState(null);

  const guardar = (alumnoId, ruta, datos, mensajeError) => {
    setError('');
    setExito('');
    setGuardando(alumnoId);
    jwtAxios
      .put(`cursos/${cursoId}/alumnos/${alumnoId}/${ruta}`, { ...datos, ajustar_ciclo: ajustarCiclo })
      .then(({ data }) => {
        setLista(data.datos);
        setExito(data.mensajes[0]);
        setEspecial(null);
      })
      .catch((e) => setError(e?.response?.data?.mensajes?.[0] ?? mensajeError))
      .finally(() => setGuardando(null));
  };
  const cambiarPareja = (alumnoId, parejaId) => guardar(alumnoId, 'pareja', { pareja_alumno_id: parejaId || null }, 'No se pudo guardar la pareja.');
  const guardarEspecial = (alumnoId, valor, motivo) =>
    guardar(alumnoId, 'valor-especial', { valor, motivo: motivo || null }, 'No se pudo guardar el valor especial.');

  if (lista.length === 0) {
    return (
      <Typography className='campo-completo' color='text.secondary'>
        El curso aún no tiene alumnos matriculados.
      </Typography>
    );
  }

  const tieneEspecial = (a) => a.valor_especial !== null && a.valor_especial !== undefined;
  const valorInvalido = especial && (especial.valor === '' || !(Number(especial.valor) >= 0));

  return (
    <Box className='campo-completo'>
      <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
        Por defecto cada alumno paga individual según Tarifas. Para que dos paguen en pareja, elige en uno de ellos a su pareja: el
        enlace queda en los dos. Con un valor especial, ese alumno paga ese valor por ciclo en lugar de la tarifa. El precio nuevo
        aplica desde el siguiente ciclo.
      </Typography>
      {(!soloLectura || puedeValorEspecial) && (
        <FormControlLabel
          sx={{ mb: 1 }}
          control={<Checkbox checked={ajustarCiclo} onChange={(e) => setAjustarCiclo(e.target.checked)} />}
          label='Aplicar también al ciclo actual (suma o resta la diferencia de precio al saldo)'
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
        <Box key={a.id} sx={{ py: 1, borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 300px 230px' }, gap: 2, alignItems: 'center' }}>
            <Typography>{a.nombre}</Typography>
            <TextField
              select
              size='small'
              label='Paga'
              value={a.pareja_alumno_id ?? ''}
              onChange={(e) => cambiarPareja(a.id, e.target.value)}
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                size='small'
                color={tieneEspecial(a) ? 'warning' : a.pareja_alumno_id ? 'secondary' : 'default'}
                label={`${formatoMoneda(a.precio_ciclo)} · ${a.precio_regla}`}
              />
              {puedeValorEspecial && especial?.id !== a.id && (
                <Button
                  size='small'
                  disabled={guardando !== null}
                  onClick={() => setEspecial({ id: a.id, valor: a.valor_especial ?? '', motivo: a.valor_especial_motivo ?? '' })}
                >
                  {tieneEspecial(a) ? 'Cambiar' : 'Valor especial'}
                </Button>
              )}
            </Box>
          </Box>
          {tieneEspecial(a) && a.valor_especial_motivo && especial?.id !== a.id && (
            <Typography variant='caption' color='text.secondary'>
              Motivo del valor especial: {a.valor_especial_motivo}
            </Typography>
          )}
          {especial?.id === a.id && (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', mt: 1.5 }}>
              <TextField
                size='small'
                type='number'
                label='Valor por ciclo'
                value={especial.valor}
                onChange={(e) => setEspecial({ ...especial, valor: e.target.value })}
                error={Boolean(valorInvalido)}
                helperText='0 = no paga'
                inputProps={{ min: 0 }}
                sx={{ width: 160 }}
              />
              <TextField
                size='small'
                label='Motivo (beca, convenio…)'
                value={especial.motivo}
                onChange={(e) => setEspecial({ ...especial, motivo: e.target.value })}
                inputProps={{ maxLength: 150 }}
                sx={{ flex: 1, minWidth: 200 }}
              />
              <Button
                size='small'
                variant='contained'
                disabled={Boolean(valorInvalido) || guardando !== null}
                onClick={() => guardarEspecial(a.id, Number(especial.valor), especial.motivo.trim())}
              >
                Guardar
              </Button>
              {tieneEspecial(a) && (
                <Button size='small' color='error' disabled={guardando !== null} onClick={() => guardarEspecial(a.id, null, null)}>
                  Volver a la tarifa
                </Button>
              )}
              <Button size='small' disabled={guardando !== null} onClick={() => setEspecial(null)}>
                Cancelar
              </Button>
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
};

ParejasCurso.propTypes = {
  cursoId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  matriculados: PropTypes.array.isRequired,
  soloLectura: PropTypes.bool,
  puedeValorEspecial: PropTypes.bool,
};

export default ParejasCurso;

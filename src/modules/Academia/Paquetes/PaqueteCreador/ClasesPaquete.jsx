// Planilla de clases del paquete: una fila por cada clase comprada. En cada fila se registra la clase
// personalizada (fecha, hora, profesor) y qué pasó con ella; de eso depende si se descuenta del paquete:
// asistió / no asistió / canceló tarde → descuenta; canceló a tiempo o sigue programada → no descuenta.
import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, Box, Button, Chip, CircularProgress, IconButton, MenuItem, TextField, Tooltip, Typography } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import jwtAxios from '../../../../@crema/services/auth/jwt-auth';

export const RESULTADOS_CLASE = [
  { id: 'pendiente', nombre: 'Programada', descuenta: false },
  { id: 'asistio', nombre: 'Asistió', descuenta: true },
  { id: 'no_asistio', nombre: 'No asistió', descuenta: true },
  { id: 'cancelo_a_tiempo', nombre: 'Canceló a tiempo', descuenta: false },
  { id: 'cancelo_tarde', nombre: 'Canceló tarde', descuenta: true },
];
const resultadoDe = (id) => RESULTADOS_CLASE.find((r) => r.id === id) ?? RESULTADOS_CLASE[0];
const fechaCorta = (iso) => (iso ? iso.split('-').reverse().join('/') : '');
const columnas = { xs: '1fr', md: '36px 150px 110px 1fr 190px 130px 150px' };

const borradorDe = (clase) => ({
  fecha: clase?.fecha ?? '',
  hora: clase?.hora ?? '',
  profesor_id: clase?.profesor_id ?? '',
  resultado: clase?.resultado ?? 'pendiente',
});

const FilaClase = ({ numero, clase, profesores, soloLectura, guardando, onGuardar, onQuitar }) => {
  const [borrador, setBorrador] = useState(() => borradorDe(clase));
  const cambiar = (campo) => (e) => setBorrador((b) => ({ ...b, [campo]: e.target.value }));
  const resultado = resultadoDe(borrador.resultado);
  const original = borradorDe(clase);
  const cambio = Object.keys(original).some((k) => String(original[k]) !== String(borrador[k]));
  const completa = Boolean(borrador.fecha && borrador.hora);

  // Clases que no se registraron aquí (agendadas en Clases personalizadas): solo se muestran.
  if (clase && !clase.editable) {
    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: columnas, gap: 2, alignItems: 'center', py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
        <Typography color='text.secondary'>{numero}.</Typography>
        <Typography>{fechaCorta(clase.fecha)}</Typography>
        <Typography>{clase.hora ?? ''}</Typography>
        <Typography color='text.secondary'>
          Clase personalizada{clase.profesor_nombre ? ` · ${clase.profesor_nombre}` : ''}
        </Typography>
        <Typography>{resultadoDe(clase.resultado).nombre}</Typography>
        <Chip size='small' color='warning' label='Descuenta' />
        <span />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: columnas, gap: 2, alignItems: 'center', py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
      <Typography color='text.secondary'>{numero ? `${numero}.` : '—'}</Typography>
      <TextField
        size='small'
        type='date'
        label='Fecha'
        value={borrador.fecha}
        onChange={cambiar('fecha')}
        disabled={soloLectura}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        size='small'
        type='time'
        label='Hora'
        value={borrador.hora}
        onChange={cambiar('hora')}
        disabled={soloLectura}
        InputLabelProps={{ shrink: true }}
      />
      <TextField size='small' select label='Profesor' value={borrador.profesor_id} onChange={cambiar('profesor_id')} disabled={soloLectura}>
        <MenuItem value=''>Sin asignar</MenuItem>
        {profesores.map((p) => (
          <MenuItem key={p.id} value={p.id}>
            {p.nombre}
          </MenuItem>
        ))}
      </TextField>
      <TextField size='small' select label='Resultado' value={borrador.resultado} onChange={cambiar('resultado')} disabled={soloLectura}>
        {RESULTADOS_CLASE.map((r) => (
          <MenuItem key={r.id} value={r.id}>
            {r.nombre}
          </MenuItem>
        ))}
      </TextField>
      {clase || completa ? (
        <Chip
          size='small'
          color={resultado.descuenta ? 'warning' : borrador.resultado === 'pendiente' ? 'default' : 'success'}
          label={resultado.descuenta ? 'Descuenta' : 'No descuenta'}
        />
      ) : (
        <Chip size='small' variant='outlined' label='Disponible' />
      )}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {!soloLectura && (
          <>
            <Button
              size='small'
              variant={clase ? 'outlined' : 'contained'}
              disabled={guardando || !completa || (Boolean(clase) && !cambio)}
              onClick={() => onGuardar(clase, borrador)}
              startIcon={guardando ? <CircularProgress size={14} color='inherit' /> : null}
            >
              {clase ? 'Guardar' : 'Registrar'}
            </Button>
            {clase && (
              <Tooltip title='Quitar esta clase del paquete'>
                <span>
                  <IconButton size='small' disabled={guardando} onClick={() => onQuitar(clase)}>
                    <DeleteOutlineIcon fontSize='small' />
                  </IconButton>
                </span>
              </Tooltip>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

FilaClase.propTypes = {
  numero: PropTypes.number,
  clase: PropTypes.object,
  profesores: PropTypes.array.isRequired,
  soloLectura: PropTypes.bool,
  guardando: PropTypes.bool,
  onGuardar: PropTypes.func.isRequired,
  onQuitar: PropTypes.func.isRequired,
};

// Ocupan un cupo del paquete las que descuentan y las programadas; las canceladas a tiempo, no.
const ocupan = (c) => c.descuenta || c.resultado === 'pendiente';
const cuposLibres = (total, clases) => Math.max(0, Number(total) - clases.filter(ocupan).length);

const ClasesPaquete = ({ paquete, profesores, soloLectura, onCambio }) => {
  const [clases, setClases] = useState(paquete.clases ?? []);
  // Filas vacías (cupos libres). Cada una tiene un id propio para que, al registrar una,
  // las demás conserven lo que ya se les haya escrito.
  const [vacias, setVacias] = useState(() => Array.from({ length: cuposLibres(paquete.clases_total, paquete.clases ?? []) }, (_, i) => i));
  const siguienteId = useRef(vacias.length);
  const [ocupada, setOcupada] = useState(null);
  const [error, setError] = useState('');
  const base = `paquetes/${paquete.id}/clases`;

  const enviar = (clave, peticion, vaciaId) => {
    setError('');
    setOcupada(clave);
    peticion
      .then(({ data }) => {
        const libres = cuposLibres(data.datos.clases_total, data.datos.clases);
        setClases(data.datos.clases);
        setVacias((actuales) => {
          const lista = actuales.filter((id) => id !== vaciaId);
          while (lista.length < libres) {
            lista.push(siguienteId.current);
            siguienteId.current += 1;
          }
          return lista.slice(0, libres);
        });
        onCambio(data.datos);
      })
      .catch((e) => setError(e?.response?.data?.mensajes?.join(' ') ?? 'No se pudo guardar la clase.'))
      .finally(() => setOcupada(null));
  };

  const guardar = (clave, vaciaId) => (clase, borrador) => {
    const datos = { ...borrador, profesor_id: borrador.profesor_id || null, observacion: clase?.observacion ?? null };
    enviar(clave, clase ? jwtAxios.put(`${base}/${clase.clase_id}`, datos) : jwtAxios.post(base, datos), vaciaId);
  };
  const quitar = (clave) => (clase) => enviar(clave, jwtAxios.delete(`${base}/${clase.clase_id}`));

  let numero = 0;

  return (
    <Box className='campo-completo'>
      <Alert severity='info' sx={{ mb: 2 }}>
        Asistió, no asistió o canceló tarde: la clase se descuenta del paquete. Canceló a tiempo (al menos{' '}
        {paquete.horas_cancelacion} horas antes): no se descuenta y el cupo queda libre para reprogramarla.
      </Alert>
      {error && (
        <Alert severity='error' sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {clases.map((c, i) => {
        const clave = `${c.origen}-${c.clase_id ?? `i${i}`}`;
        if (ocupan(c)) numero += 1;
        return (
          <FilaClase
            key={clave}
            numero={ocupan(c) ? numero : undefined}
            clase={c}
            profesores={profesores}
            soloLectura={soloLectura}
            guardando={ocupada === clave}
            onGuardar={guardar(clave)}
            onQuitar={quitar(clave)}
          />
        );
      })}
      {vacias.map((id) => {
        const clave = `nueva-${id}`;
        numero += 1;
        return (
          <FilaClase
            key={clave}
            numero={numero}
            profesores={profesores}
            soloLectura={soloLectura}
            guardando={ocupada === clave}
            onGuardar={guardar(clave, id)}
            onQuitar={quitar(clave)}
          />
        );
      })}
    </Box>
  );
};

ClasesPaquete.propTypes = {
  paquete: PropTypes.object.isRequired,
  profesores: PropTypes.array.isRequired,
  soloLectura: PropTypes.bool,
  onCambio: PropTypes.func.isRequired,
};

export default ClasesPaquete;

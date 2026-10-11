// Calendario para elegir varias fechas sueltas (días discontinuos): cada clic marca o desmarca un día.
// El valor es un arreglo de textos 'YYYY-MM-DD'. Con `disponibles` solo se pueden marcar esos días
// (p. ej. las clases de un curso) y con `max` se limita cuántos se eligen.
import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { Box, Chip, FormHelperText, IconButton, Typography } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const FORMATO = 'YYYY-MM-DD';
const DIAS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const DIAS_LARGOS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];

export const fechaConDia = (iso) => {
  const d = dayjs(iso);
  return `${DIAS_LARGOS[d.day()]} ${d.format('DD/MM/YYYY')}`;
};

const SelectorFechas = ({ value, onChange, disponibles, max, disabled, label, error, className }) => {
  const elegidas = useMemo(() => new Set(value), [value]);
  const permitidas = useMemo(() => (disponibles ? new Set(disponibles) : null), [disponibles]);
  const primera = [...value].sort()[0] ?? [...(disponibles ?? [])].sort()[0];
  const [mes, setMes] = useState(() => dayjs(primera).startOf('month'));

  // Al cambiar el conjunto de días disponibles (otro curso) el calendario salta a su primer mes.
  const claveDisponibles = (disponibles ?? []).join(',');
  useEffect(() => {
    if (primera) setMes(dayjs(primera).startOf('month'));
  }, [claveDisponibles]); // eslint-disable-line react-hooks/exhaustive-deps

  const lleno = Boolean(max) && value.length >= max;
  const hoy = dayjs().format(FORMATO);
  // Semanas del mes empezando en lunes; los huecos antes del día 1 van vacíos.
  const huecos = (mes.day() + 6) % 7;
  const celdas = [...Array(huecos).fill(null), ...Array.from({ length: mes.daysInMonth() }, (_, i) => mes.date(i + 1).format(FORMATO))];

  const alternar = (iso) => onChange(elegidas.has(iso) ? value.filter((f) => f !== iso) : [...value, iso].sort());

  return (
    <Box className={className}>
      {label && (
        <Typography variant='body2' color={error ? 'error' : 'text.secondary'} sx={{ mb: 1 }}>
          {label}
          {max ? ` (${value.length} de ${max})` : value.length ? ` (${value.length})` : ''}
        </Typography>
      )}
      <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <Box sx={{ width: 300, border: 1, borderColor: error ? 'error.main' : 'divider', borderRadius: 1, p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <IconButton size='small' aria-label='Mes anterior' onClick={() => setMes(mes.subtract(1, 'month'))}>
              <ChevronLeftIcon />
            </IconButton>
            <Typography sx={{ fontWeight: 'bold' }}>
              {MESES[mes.month()]} {mes.year()}
            </Typography>
            <IconButton size='small' aria-label='Mes siguiente' onClick={() => setMes(mes.add(1, 'month'))}>
              <ChevronRightIcon />
            </IconButton>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5, textAlign: 'center' }}>
            {DIAS.map((d) => (
              <Typography key={d} variant='caption' color='text.secondary'>
                {d}
              </Typography>
            ))}
            {celdas.map((iso, i) => {
              if (!iso) return <span key={`h${i}`} />;
              const marcada = elegidas.has(iso);
              const permitida = !permitidas || permitidas.has(iso);
              const bloqueada = disabled || !permitida || (!marcada && lleno);
              return (
                <Box
                  key={iso}
                  component='button'
                  type='button'
                  disabled={bloqueada}
                  aria-pressed={marcada}
                  aria-label={fechaConDia(iso)}
                  onClick={() => alternar(iso)}
                  sx={{
                    aspectRatio: '1',
                    border: 1,
                    borderColor: marcada ? 'primary.main' : permitidas && permitida ? 'primary.light' : iso === hoy ? 'text.disabled' : 'transparent',
                    borderRadius: '50%',
                    font: 'inherit',
                    fontSize: 13,
                    cursor: bloqueada ? 'default' : 'pointer',
                    bgcolor: marcada ? 'primary.main' : 'transparent',
                    color: marcada ? 'primary.contrastText' : permitida ? 'text.primary' : 'text.disabled',
                    opacity: bloqueada && !marcada ? 0.55 : 1,
                    '&:hover': bloqueada ? {} : { bgcolor: marcada ? 'primary.dark' : 'action.hover' },
                  }}
                >
                  {Number(iso.slice(8))}
                </Box>
              );
            })}
          </Box>
        </Box>
        <Box sx={{ flex: '1 1 220px', display: 'flex', gap: 1, flexWrap: 'wrap', alignContent: 'flex-start' }}>
          {value.length === 0 && <Typography color='text.secondary'>Haz clic en cada día del calendario para marcarlo.</Typography>}
          {[...value].sort().map((iso) => (
            <Chip key={iso} label={fechaConDia(iso)} onDelete={disabled ? undefined : () => alternar(iso)} />
          ))}
        </Box>
      </Box>
      {error && <FormHelperText error>{error}</FormHelperText>}
    </Box>
  );
};

SelectorFechas.propTypes = {
  value: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  disponibles: PropTypes.arrayOf(PropTypes.string),
  max: PropTypes.number,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  error: PropTypes.string,
  className: PropTypes.string,
};

export default SelectorFechas;

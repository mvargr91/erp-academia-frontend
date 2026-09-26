// Editor de precios de una experiencia (Formik FieldArray).
// Una experiencia tiene uno o varios precios; cada precio es de adulto o de niño (puede haber varios
// de cada tipo) y tiene una o varias cantidades: el valor por persona desde ese número de personas.
import React from 'react';
import PropTypes from 'prop-types';
import { FieldArray, getIn, useFormikContext } from 'formik';
import * as yup from 'yup';
import { Box, Button, Chip, FormControlLabel, FormHelperText, IconButton, Switch, Tooltip, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import MyTextField from '../MyTextField';
import MyCurrencyField from '../MyCurrencyField';
import MySelectField from '../MySelectField';
import { TIPOS_PRECIO, esActivo, formatoMoneda, nombreDe } from '../../constants/Turismo';

// El panel corre en modo oscuro con fondos claros: se fijan colores para que íconos y bordes se vean.
const BORDE = '#DDE3E8';
const COLOR_TIPO = { adulto: '#00A1CC', nino: '#732982' };
const iconoEliminar = { color: '#9AA5B1', '&:hover': { color: 'error.main' } };

export const cantidadNueva = (cantidades = []) => ({
  cantidad: cantidades.length ? Math.max(...cantidades.map((c) => Number(c.cantidad) || 0)) + 1 : 1,
  valor: '',
});

export const precioNuevo = (tipo = 'adulto') => ({
  id: '',
  descripcion: tipo === 'nino' ? 'Tarifa niño' : 'Tarifa adulto',
  tipo,
  estado: true,
  cantidades: [cantidadNueva()],
});

// Valores iniciales a partir de lo que devuelve el backend (precios con cantidades).
export const precioInicial = (precio) => ({
  id: precio.id ?? '',
  descripcion: precio.descripcion ?? '',
  tipo: precio.tipo ?? 'adulto',
  estado: precio.estado === undefined ? true : esActivo(precio.estado),
  cantidades: (precio.cantidades ?? []).map((c) => ({ cantidad: c.cantidad, valor: c.valor === null ? '' : String(Math.round(c.valor)) })),
});

export const preciosIniciales = (precios) => (precios?.length ? precios.map(precioInicial) : [precioNuevo('adulto')]);

// Lo que espera la API: números y sin el id vacío de los precios nuevos.
export const precioAParams = ({ id, cantidades, ...precio }) => ({
  ...(id ? { id } : {}),
  ...precio,
  cantidades: cantidades.map((c) => ({ cantidad: Number(c.cantidad), valor: Number(c.valor) })),
});

export const esquemaCantidades = yup
  .array()
  .of(
    yup.object({
      cantidad: yup.number().typeError('Debe ser un número').required('Requerido').integer('Sin decimales').min(1, 'Mínimo 1'),
      valor: yup.number().typeError('Requerido').required('Requerido').min(0, 'No puede ser negativo'),
    }),
  )
  .min(1, 'Agrega al menos una cantidad')
  .test('cantidades-unicas', 'No repitas la misma cantidad de personas', (lista = []) => {
    const valores = lista.map((c) => Number(c.cantidad));
    return new Set(valores).size === valores.length;
  });

export const esquemaPrecio = {
  descripcion: yup.string().required('Requerido').max(150, 'Máximo 150 caracteres'),
  tipo: yup.string().oneOf(TIPOS_PRECIO.map((t) => t.id), 'Adulto o niño').required('Requerido'),
  cantidades: esquemaCantidades,
};

export const esquemaPrecios = yup.array().of(yup.object(esquemaPrecio)).min(1, 'La experiencia necesita al menos un precio');

// Error de un arreglo completo (mínimo uno, cantidades repetidas), que Formik guarda como texto.
const ErrorArreglo = ({ name }) => {
  const { errors, submitCount } = useFormikContext();
  const error = getIn(errors, name);
  return typeof error === 'string' && submitCount > 0 ? <FormHelperText error>{error}</FormHelperText> : null;
};
ErrorArreglo.propTypes = { name: PropTypes.string.isRequired };

export const CantidadesPrecio = ({ name, disabled }) => {
  const { values } = useFormikContext();
  const cantidades = getIn(values, name) ?? [];

  return (
    <FieldArray name={name}>
      {({ push, remove }) => (
        <Box>
          {cantidades.map((_, i) => (
            <Box key={i} sx={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr 40px', gap: 3, alignItems: 'flex-end', mb: 2 }}>
              <MyTextField
                fullWidth
                type='number'
                label='Desde (personas)'
                name={`${name}.${i}.cantidad`}
                inputProps={{ min: 1, step: 1 }}
                disabled={disabled}
              />
              <MyCurrencyField fullWidth label='Valor por persona' name={`${name}.${i}.valor`} disabled={disabled} />
              {!disabled && (
                <Tooltip title='Quitar cantidad'>
                  <span>
                    <IconButton size='small' onClick={() => remove(i)} disabled={cantidades.length === 1} sx={iconoEliminar} aria-label='Quitar cantidad'>
                      <DeleteOutlineIcon fontSize='small' />
                    </IconButton>
                  </span>
                </Tooltip>
              )}
            </Box>
          ))}
          <ErrorArreglo name={name} />
          {!disabled && (
            <Button size='small' startIcon={<AddIcon />} onClick={() => push(cantidadNueva(cantidades))} sx={{ mt: 1 }}>
              Agregar cantidad
            </Button>
          )}
        </Box>
      )}
    </FieldArray>
  );
};
CantidadesPrecio.propTypes = { name: PropTypes.string.isRequired, disabled: PropTypes.bool };

const PreciosExperiencia = ({ name = 'precios', disabled }) => {
  const { values, setFieldValue } = useFormikContext();
  const precios = getIn(values, name) ?? [];

  return (
    <FieldArray name={name}>
      {({ push, remove }) => (
        <Box className='campo-completo'>
          <Typography variant='body2' sx={{ color: 'text.secondary', mb: 3 }}>
            Cada precio es de adulto o de niño y puede tener varias cantidades: el valor por persona que aplica
            desde ese número de personas (ej. 1 persona $200.000, desde 4 personas $150.000).
          </Typography>

          {precios.map((precio, i) => (
            <Box key={i} sx={{ border: `1px solid ${BORDE}`, borderLeft: `4px solid ${COLOR_TIPO[precio.tipo] ?? BORDE}`, borderRadius: 2, p: 4, mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Chip
                  size='small'
                  label={nombreDe(TIPOS_PRECIO, precio.tipo)}
                  sx={{ bgcolor: COLOR_TIPO[precio.tipo] ?? '#9AA5B1', color: '#fff', fontWeight: 600 }}
                />
                <Typography sx={{ fontWeight: 600, flex: 1 }}>Precio {i + 1}</Typography>
                {precio.cantidades?.length > 0 && precio.cantidades.every((c) => c.valor !== '') && (
                  <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                    Desde {formatoMoneda(Math.min(...precio.cantidades.map((c) => Number(c.valor))))}
                  </Typography>
                )}
                {!disabled && (
                  <Tooltip title='Quitar precio'>
                    <span>
                      <IconButton size='small' onClick={() => remove(i)} disabled={precios.length === 1} sx={iconoEliminar} aria-label='Quitar precio'>
                        <DeleteOutlineIcon fontSize='small' />
                      </IconButton>
                    </span>
                  </Tooltip>
                )}
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '2fr 1fr auto' }, gap: 3, alignItems: 'flex-end', mb: 3 }}>
                <MyTextField fullWidth label='Descripción' name={`${name}.${i}.descripcion`} placeholder='Ej: Tarifa estándar, Tour privado' disabled={disabled} required />
                <MySelectField fullWidth variant='standard' label='Tipo' name={`${name}.${i}.tipo`} options={TIPOS_PRECIO} disabled={disabled} required />
                <FormControlLabel
                  label='Activo'
                  disabled={disabled}
                  control={<Switch checked={!!precio.estado} onChange={(e) => setFieldValue(`${name}.${i}.estado`, e.target.checked)} />}
                />
              </Box>

              <CantidadesPrecio name={`${name}.${i}.cantidades`} disabled={disabled} />
            </Box>
          ))}

          <ErrorArreglo name={name} />
          {!disabled && (
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button variant='outlined' startIcon={<AddIcon />} onClick={() => push(precioNuevo('adulto'))}>
                Agregar precio de adulto
              </Button>
              <Button variant='outlined' startIcon={<AddIcon />} onClick={() => push(precioNuevo('nino'))} sx={{ color: COLOR_TIPO.nino, borderColor: COLOR_TIPO.nino }}>
                Agregar precio de niño
              </Button>
            </Box>
          )}
        </Box>
      )}
    </FieldArray>
  );
};

PreciosExperiencia.propTypes = {
  name: PropTypes.string,
  disabled: PropTypes.bool,
};

export default PreciosExperiencia;

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useFormikContext } from 'formik';
import { Alert, Box, Chip, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import AppCrudForm, { SeccionForm } from '../../../../shared/components/AppCrudForm';
import MyTextField from '../../../../shared/components/MyTextField';
import MyDateField from '../../../../shared/components/MyDateField';
import MySelectField from '../../../../shared/components/MySelectField';
import FormikAutocomplete from '../../../../shared/components/FormikAutocomplete';
import { CampoSede } from '../../../../shared/sedes';
import { formatoMoneda } from '../../../../shared/constants/Academia';

const MOTIVOS = { asistio: 'Asistió', no_asistio: 'No asistió', cancelacion_tardia: 'Canceló tarde (<24 h)' };
const sumarDias = (iso, dias) => {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + Number(dias));
  return d.toISOString().slice(0, 10);
};

const PaqueteForm = ({ accion, titulo, handleOnClose, saving, registro, alumnos, planes }) => {
  const crear = accion === 'crear';
  const ver = accion === 'ver';
  const { values, setFieldValue } = useFormikContext();

  // Al elegir el plan se proponen sus clases, precio y vencimiento.
  useEffect(() => {
    if (!crear || !values.plan_id) return;
    const plan = planes.find((p) => String(p.id) === String(values.plan_id));
    if (!plan) return;
    setFieldValue('clases_total', plan.num_clases ?? '');
    setFieldValue('valor', plan.valor ?? '');
    setFieldValue('fecha_vencimiento', plan.vigencia_dias ? sumarDias(values.fecha_compra, plan.vigencia_dias) : '');
  }, [values.plan_id, values.fecha_compra]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AppCrudForm titulo={titulo} accion={accion} handleOnClose={handleOnClose} saving={saving}>
      {!crear && registro && (
        <Box className='campo-completo' sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
          <Chip color='primary' label={`${registro.clases_restantes} de ${registro.clases_total} clases disponibles`} />
          <Chip label={registro.estado_nombre} />
          {registro.saldo > 0 && <Chip color='error' label={`Por pagar ${formatoMoneda(registro.saldo)}`} />}
        </Box>
      )}

      <SeccionForm titulo='Paquete' />
      <FormikAutocomplete name='alumno_id' label='Alumno' options={alumnos} disabled={!crear} textFieldProps={{ variant: 'standard' }} />
      <FormikAutocomplete
        name='plan_id'
        label='Plan de paquete'
        options={planes}
        disabled={!crear}
        textFieldProps={{ variant: 'standard', helperText: crear ? 'Propone clases, valor y vencimiento.' : '' }}
      />
      <CampoSede disabled={!crear} label='Sede de venta' helperText='El paquete se puede usar en cualquier sede.' />
      <MyTextField fullWidth type='number' label='Clases' name='clases_total' disabled={!crear} required={crear} />
      <MyTextField fullWidth type='number' label='Valor' name='valor' disabled={!crear} required={crear} />
      <MyDateField label='Fecha de compra' name='fecha_compra' disabled={!crear} />
      <MyDateField label='Vence (vacío = no vence)' name='fecha_vencimiento' disabled={ver} />
      {!crear && (
        <MySelectField
          fullWidth
          variant='standard'
          label='Estado'
          name='estado'
          disabled={ver}
          options={[
            { id: 'activo', nombre: 'Activo' },
            { id: 'anulado', nombre: 'Anulado' },
          ]}
        />
      )}
      <MyTextField className='campo-completo' fullWidth multiline minRows={2} label='Observación' name='observacion' disabled={ver} />
      {crear && (
        <Alert severity='info' className='campo-completo'>
          El valor queda como saldo por pagar del alumno: regístralo en Pagos eligiendo este paquete.
        </Alert>
      )}

      {!crear && registro && (
        <>
          <SeccionForm titulo='Clases usadas' />
          {registro.consumos?.length ? (
            <Table size='small' className='campo-completo'>
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Detalle</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {registro.consumos.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>{c.fecha}</TableCell>
                    <TableCell>{c.origen === 'grupal' ? `Grupal · ${c.curso ?? ''}` : 'Clase personalizada'}</TableCell>
                    <TableCell>{MOTIVOS[c.motivo] ?? c.motivo}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Typography className='campo-completo' color='text.secondary'>
              Aún no ha usado clases de este paquete.
            </Typography>
          )}
          <SeccionForm titulo='Pagos' />
          {registro.pagos?.length ? (
            <Table size='small' className='campo-completo'>
              <TableBody>
                {registro.pagos.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.fecha_pago}</TableCell>
                    <TableCell>{p.metodo_pago}</TableCell>
                    <TableCell align='right'>{formatoMoneda(p.monto)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Typography className='campo-completo' color='text.secondary'>
              Sin pagos registrados.
            </Typography>
          )}
        </>
      )}
    </AppCrudForm>
  );
};

PaqueteForm.propTypes = {
  accion: PropTypes.string.isRequired,
  titulo: PropTypes.string,
  handleOnClose: PropTypes.func.isRequired,
  saving: PropTypes.bool,
  registro: PropTypes.object,
  alumnos: PropTypes.array.isRequired,
  planes: PropTypes.array.isRequired,
};

export default PaqueteForm;

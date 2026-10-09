import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormikContext } from 'formik';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Button, Chip, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material';
import AppCrudForm, { SeccionForm } from '../../../../shared/components/AppCrudForm';
import MyTextField from '../../../../shared/components/MyTextField';
import MyDateField from '../../../../shared/components/MyDateField';
import MySelectField from '../../../../shared/components/MySelectField';
import FormikAutocomplete from '../../../../shared/components/FormikAutocomplete';
import { CampoSede } from '../../../../shared/sedes';
import { formatoMoneda } from '../../../../shared/constants/Academia';
import usePermisosOpcion from '../../../../shared/hooks/usePermisosOpcion';
import ClasesPaquete from './ClasesPaquete';

const sumarDias = (iso, dias) => {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + Number(dias));
  return d.toISOString().slice(0, 10);
};

const PaqueteForm = ({ accion, titulo, handleOnClose, saving, registro, alumnos, planes, profesores }) => {
  const crear = accion === 'crear';
  const ver = accion === 'ver';
  const { values, setFieldValue } = useFormikContext();
  // Clases disponibles y estado al día: cambian al registrar clases en la planilla, sin recargar el formulario.
  const [alDia, setAlDia] = useState(null);
  const navigate = useNavigate();
  // El pago es una opción aparte, con su propio permiso.
  const { permisos } = usePermisosOpcion('/paquetes');
  const puedePagar = permisos.indexOf('Pagar') >= 0;
  // La planilla de clases depende de su propio permiso, no de poder modificar el paquete.
  const puedeRegistrarClases = permisos.indexOf('RegistrarClases') >= 0;
  const resumen = alDia?.id === registro?.id ? alDia : registro;

  // Al elegir el plan se proponen sus clases, precio y vencimiento (precio de alumno si ya toma un curso grupal).
  useEffect(() => {
    if (!crear || !values.plan_id) return;
    const plan = planes.find((p) => String(p.id) === String(values.plan_id));
    if (!plan) return;
    setFieldValue('clases_total', plan.num_clases ?? '');
    const alumno = alumnos.find((a) => String(a.id) === String(values.alumno_id));
    const esAlumnoDeCurso = Boolean(Number(alumno?.con_curso));
    setFieldValue('valor', (esAlumnoDeCurso && plan.valor_alumno ? plan.valor_alumno : plan.valor) ?? '');
    setFieldValue('fecha_vencimiento', plan.vigencia_dias ? sumarDias(values.fecha_compra, plan.vigencia_dias) : '');
  }, [values.plan_id, values.fecha_compra, values.alumno_id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AppCrudForm titulo={titulo} accion={accion} handleOnClose={handleOnClose} saving={saving}>
      {!crear && registro && (
        <Box className='campo-completo' sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
          <Chip color='primary' label={`${resumen.clases_restantes} de ${resumen.clases_total} clases disponibles`} />
          <Chip label={resumen.estado_nombre} />
          {registro.saldo > 0 && <Chip color='error' label={`Por pagar ${formatoMoneda(registro.saldo)}`} />}
          {puedePagar && (
            <Button size='small' variant='outlined' onClick={() => navigate(`/paquetes/${registro.id}/pago`)}>
              {registro.saldo > 0 ? 'Registrar pago' : 'Ver pagos'}
            </Button>
          )}
        </Box>
      )}

      <SeccionForm titulo='Paquete' />
      <FormikAutocomplete name='alumno_id' label='Alumno' options={alumnos} disabled={!crear} textFieldProps={{ variant: 'standard' }} />
      <FormikAutocomplete
        name='plan_id'
        label='Plan de paquete'
        options={planes}
        disabled={!crear}
        textFieldProps={{ variant: 'standard' }}
      />
      <CampoSede disabled={!crear} label='Sede de venta' />
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
          El valor queda como saldo por pagar del alumno: se cobra con «Registrar pago» en la lista de paquetes.
        </Alert>
      )}

      {!crear && registro && (
        <>
          <SeccionForm titulo='Clases del paquete' />
          <ClasesPaquete key={registro.id} paquete={registro} profesores={profesores} soloLectura={!puedeRegistrarClases} onCambio={setAlDia} />
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
  profesores: PropTypes.array.isRequired,
};

export default PaqueteForm;

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useFormikContext } from 'formik';
import { Link, TextField } from '@mui/material';
import AppCrudForm, { SeccionForm } from '../../../../shared/components/AppCrudForm';
import MyTextField from '../../../../shared/components/MyTextField';
import MyDateField from '../../../../shared/components/MyDateField';
import MySelectField from '../../../../shared/components/MySelectField';
import MyFileField from '../../../../shared/components/MyFileField';
import FormikAutocomplete from '../../../../shared/components/FormikAutocomplete';
import { METODOS_PAGO_ERP } from '../../../../shared/constants/Administracion';

const PagoAcademiaForm = ({ accion, titulo, handleOnClose, saving, registro, facturas }) => {
  const crear = accion === 'crear';
  const disabled = !crear;
  const { values, setFieldValue } = useFormikContext();

  // Al elegir la cuenta de cobro se propone pagar todo su saldo.
  useEffect(() => {
    if (!crear || !values.factura_id) return;
    const factura = facturas.find((f) => String(f.id) === String(values.factura_id));
    if (factura && !values.valor) {
      setFieldValue('valor', factura.saldo);
    }
  }, [crear, values.factura_id, facturas]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AppCrudForm titulo={titulo} accion={accion} handleOnClose={handleOnClose} saving={saving}>
      <SeccionForm titulo='Pago recibido' />
      {crear ? (
        <FormikAutocomplete
          name='factura_id'
          label='Cuenta de cobro'
          options={facturas}
          textFieldProps={{ variant: 'standard', helperText: 'Solo aparecen cuentas con saldo pendiente.' }}
        />
      ) : (
        <TextField
          variant='standard'
          fullWidth
          label='Cuenta de cobro'
          value={`${registro?.factura_numero ?? ''} · ${registro?.academia_nombre ?? ''}`}
          disabled
        />
      )}
      <MyTextField fullWidth type='number' label='Valor' name='valor' disabled={disabled} required />
      <MyDateField label='Fecha del pago' name='fecha_pago' disabled={disabled} />
      <MySelectField name='metodo' label='Método' options={METODOS_PAGO_ERP} disabled={disabled} fullWidth variant='standard' />
      <MyTextField fullWidth label='Referencia / N.° de transacción' name='referencia' disabled={disabled} />

      <SeccionForm titulo='Soporte' />
      {crear ? (
        <MyFileField className='campo-completo' name='soporte' label='Comprobante (PDF o imagen, opcional)' tipo='documento' />
      ) : registro?.soporte_url ? (
        <Link className='campo-completo' href={registro.soporte_url} target='_blank' rel='noopener'>
          Ver comprobante
        </Link>
      ) : null}
      <MyTextField className='campo-completo' fullWidth multiline minRows={2} label='Observación' name='observacion' disabled={disabled} />
    </AppCrudForm>
  );
};

PagoAcademiaForm.propTypes = {
  accion: PropTypes.string.isRequired,
  titulo: PropTypes.string,
  handleOnClose: PropTypes.func.isRequired,
  saving: PropTypes.bool,
  registro: PropTypes.object,
  facturas: PropTypes.array.isRequired,
};

export default PagoAcademiaForm;

import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from '@mui/material';
import { StyledTextField } from '../../../../shared/components/MyTextField';
import AppCrudForm, { SeccionForm } from '../../../../shared/components/AppCrudForm';
import MyTextField from '../../../../shared/components/MyTextField';
import MyRadioField from '../../../../shared/components/MyRadioField';
import MyDateField from '../../../../shared/components/MyDateField';
import { OPCIONES_ESTADO } from '../../../../shared/constants/Academia';

const AcademiaForm = ({ accion, titulo, handleOnClose, saving, registro }) => {
  const disabled = accion === 'ver';
  const crear = accion === 'crear';

  return (
    <AppCrudForm titulo={titulo} accion={accion} handleOnClose={handleOnClose} saving={saving}>
      <SeccionForm titulo='Datos de la academia' />
      <MyTextField fullWidth
        autoFocus
        label={crear ? 'Código (subdominio, no se puede cambiar después)' : 'Código (subdominio)'}
        name='codigo'
        disabled={!crear}
        required={crear}
      />
      <MyTextField fullWidth label='Nombre comercial' name='nombre' disabled={disabled} required />
      {!crear && registro?.url && <StyledTextField fullWidth variant='standard' label='Dirección web' value={registro.url} disabled />}
      <MyTextField fullWidth label='Correo de contacto' name='correo' disabled={disabled} />
      <MyTextField fullWidth label='Teléfono' name='telefono' disabled={disabled} />
      <SeccionForm titulo='Cobro del ERP' />
      <MyTextField fullWidth label='Tarifa mensual (0 = no se cobra)' name='tarifa_mensual' type='number' disabled={disabled} required />
      <MyTextField
        fullWidth
        label='Día de corte (1-28)'
        name='dia_corte'
        type='number'
        disabled={disabled}
        required
      />
      <MyDateField label='Cobrar desde' name='fecha_inicio_cobro' disabled={disabled} />
      {registro?.suspendida_por_mora === 1 && (
        <Alert severity='warning' className='campo-completo'>
          Suspendida automáticamente por falta de pago. Se reactiva sola al registrar el pago de sus cuentas vencidas.
          Si la activas a mano, el proceso diario la volverá a suspender mientras siga en mora.
        </Alert>
      )}
      {!crear && (
        <MyRadioField
          className='campo-completo'
          label='Acceso al ERP'
          name='activa'
          disabled={disabled || registro?.es_administradora === 1}
          required
          options={OPCIONES_ESTADO}
        />
      )}

      {crear && (
        <>
          <SeccionForm titulo='Administrador de la academia' />
          <MyTextField fullWidth label='Usuario' name='usuario_admin' required />
          <MyTextField fullWidth label='Clave inicial' name='clave_admin' type='password' required />
          <Alert severity='info' className='campo-completo'>
            Se creará una base de datos independiente para la academia. Puede tardar unos segundos.
          </Alert>
        </>
      )}
    </AppCrudForm>
  );
};

AcademiaForm.propTypes = {
  accion: PropTypes.string.isRequired,
  titulo: PropTypes.string,
  handleOnClose: PropTypes.func.isRequired,
  saving: PropTypes.bool,
  registro: PropTypes.object,
};

export default AcademiaForm;

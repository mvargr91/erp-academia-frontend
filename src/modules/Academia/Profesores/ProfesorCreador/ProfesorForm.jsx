import React from 'react';
import PropTypes from 'prop-types';
import AppCrudForm, { SeccionForm } from '../../../../shared/components/AppCrudForm';
import MyTextField from '../../../../shared/components/MyTextField';
import MyRadioField from '../../../../shared/components/MyRadioField';
import { OPCIONES_ESTADO } from '../../../../shared/constants/Academia';

const ProfesorForm = ({ accion, titulo, handleOnClose, saving }) => {
  const disabled = accion === 'ver';

  return (
    <AppCrudForm titulo={titulo} accion={accion} handleOnClose={handleOnClose} saving={saving}>
      <SeccionForm titulo='Datos personales' />
      <MyTextField autoFocus fullWidth label='Nombres' name='nombres' disabled={disabled} required />
      <MyTextField fullWidth label='Apellidos' name='apellidos' disabled={disabled} required />
      <MyTextField fullWidth label='Documento' name='documento' disabled={disabled} />
      <MyTextField fullWidth label='Teléfono' name='telefono' disabled={disabled} />
      <MyTextField fullWidth type='email' label='Correo' name='correo' disabled={disabled} />
      <MyTextField fullWidth label='Especialidad' name='especialidad' disabled={disabled} />
      <MyRadioField className='campo-completo' label='Estado' name='estado' disabled={disabled} required options={OPCIONES_ESTADO} />
    </AppCrudForm>
  );
};

ProfesorForm.propTypes = {
  accion: PropTypes.string.isRequired,
  titulo: PropTypes.string,
  handleOnClose: PropTypes.func.isRequired,
  saving: PropTypes.bool,
};

export default ProfesorForm;

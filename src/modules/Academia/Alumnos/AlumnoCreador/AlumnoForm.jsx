import React from 'react';
import PropTypes from 'prop-types';
import AppCrudForm, { SeccionForm } from '../../../../shared/components/AppCrudForm';
import MyTextField from '../../../../shared/components/MyTextField';
import MyDateField from '../../../../shared/components/MyDateField';
import MyRadioField from '../../../../shared/components/MyRadioField';
import { CampoSede } from '../../../../shared/sedes';
import { OPCIONES_ESTADO } from '../../../../shared/constants/Academia';

const AlumnoForm = ({ accion, titulo, handleOnClose, saving }) => {
  const disabled = accion === 'ver';

  return (
    <AppCrudForm titulo={titulo} accion={accion} handleOnClose={handleOnClose} saving={saving}>
      <SeccionForm titulo='Datos personales' />
      <MyTextField autoFocus fullWidth label='Nombres' name='nombres' disabled={disabled} required />
      <MyTextField fullWidth label='Apellidos' name='apellidos' disabled={disabled} required />
      <MyTextField fullWidth label='Documento' name='documento' disabled={disabled} />
      <MyTextField fullWidth label='Teléfono' name='telefono' disabled={disabled} />
      <MyTextField fullWidth type='email' label='Correo' name='correo' disabled={disabled} />
      <MyDateField label='Fecha de nacimiento' name='fecha_nacimiento' disabled={disabled} />
      <MyTextField className='campo-completo' fullWidth label='Dirección' name='direccion' disabled={disabled} />
      <CampoSede
        className='campo-completo'
        disabled={disabled}
        label='Sede principal'
        helperText='Es informativa: el alumno puede tomar cursos en cualquier sede.'
      />
      <SeccionForm titulo='Contacto de emergencia' />
      <MyTextField fullWidth label='Contacto de emergencia' name='contacto_emergencia' disabled={disabled} />
      <MyTextField fullWidth label='Teléfono de emergencia' name='telefono_emergencia' disabled={disabled} />
      <MyRadioField className='campo-completo' label='Estado' name='estado' disabled={disabled} required options={OPCIONES_ESTADO} />
    </AppCrudForm>
  );
};

AlumnoForm.propTypes = {
  accion: PropTypes.string.isRequired,
  titulo: PropTypes.string,
  handleOnClose: PropTypes.func.isRequired,
  saving: PropTypes.bool,
};

export default AlumnoForm;

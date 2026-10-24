import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';
import AppCrudForm, { SeccionForm } from '../../../../shared/components/AppCrudForm';
import MyTextField from '../../../../shared/components/MyTextField';
import MyRadioField from '../../../../shared/components/MyRadioField';
import usePermisosOpcion from '../../../../shared/hooks/usePermisosOpcion';
import { OPCIONES_ESTADO } from '../../../../shared/constants/Academia';
import AccesoProfesor from './AccesoProfesor';

const ProfesorForm = ({ accion, titulo, handleOnClose, saving, registro }) => {
  const disabled = accion === 'ver';
  const puedeModificar = usePermisosOpcion('/profesores').permisos.indexOf('Modificar') >= 0;

  return (
    <AppCrudForm titulo={titulo} accion={accion} handleOnClose={handleOnClose} saving={saving}>
      <SeccionForm titulo='Datos obligatorios' />
      <MyTextField autoFocus fullWidth label='Nombres' name='nombres' disabled={disabled} required />
      <MyTextField fullWidth label='Apellidos' name='apellidos' disabled={disabled} required />
      <MyTextField className='campo-completo' fullWidth type='email' label='Correo' name='correo' disabled={disabled} required />
      <SeccionForm titulo='Otros datos' />
      <MyTextField fullWidth label='Documento' name='documento' disabled={disabled} />
      <MyTextField fullWidth label='Teléfono' name='telefono' disabled={disabled} />
      <MyTextField fullWidth label='Especialidad' name='especialidad' disabled={disabled} />
      <MyRadioField className='campo-completo' label='Estado' name='estado' disabled={disabled} required options={OPCIONES_ESTADO} />
      <SeccionForm titulo='Acceso al ERP' />
      {registro?.id ? (
        <AccesoProfesor key={registro.id} profesorId={registro.id} accesoInicial={registro.acceso} puedeModificar={puedeModificar} />
      ) : (
        <Typography className='campo-completo' color='text.secondary'>
          Guarda el profesor y luego, al editarlo, podrás darle acceso al ERP.
        </Typography>
      )}
    </AppCrudForm>
  );
};

ProfesorForm.propTypes = {
  accion: PropTypes.string.isRequired,
  titulo: PropTypes.string,
  handleOnClose: PropTypes.func.isRequired,
  saving: PropTypes.bool,
  registro: PropTypes.object,
};

export default ProfesorForm;

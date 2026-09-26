import React from 'react';
import PropTypes from 'prop-types';
import AppCrudForm from '../../../../shared/components/AppCrudForm';
import MyTextField from '../../../../shared/components/MyTextField';
import MyRadioField from '../../../../shared/components/MyRadioField';
import { OPCIONES_ESTADO } from '../../../../shared/constants/Academia';

const RitmoForm = ({ accion, titulo, handleOnClose, saving }) => {
  const disabled = accion === 'ver';

  return (
    <AppCrudForm titulo={titulo} accion={accion} handleOnClose={handleOnClose} saving={saving}>
      <MyTextField autoFocus className='campo-completo' fullWidth label='Nombre' name='nombre' disabled={disabled} required />
      <MyTextField className='campo-completo' fullWidth multiline minRows={3} label='Descripción' name='descripcion' disabled={disabled} />
      <MyRadioField className='campo-completo' label='Estado' name='estado' disabled={disabled} required options={OPCIONES_ESTADO} />
    </AppCrudForm>
  );
};

RitmoForm.propTypes = {
  accion: PropTypes.string.isRequired,
  titulo: PropTypes.string,
  handleOnClose: PropTypes.func.isRequired,
  saving: PropTypes.bool,
};

export default RitmoForm;

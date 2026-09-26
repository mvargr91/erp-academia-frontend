import React from 'react';
import PropTypes from 'prop-types';
import AppCrudForm from '../../../../shared/components/AppCrudForm';
import MyTextField from '../../../../shared/components/MyTextField';
import MySelectField from '../../../../shared/components/MySelectField';
import MyRadioField from '../../../../shared/components/MyRadioField';
import { OPCIONES_ESTADO, PERIODICIDADES } from '../../../../shared/constants/Academia';

const PlanForm = ({ accion, titulo, handleOnClose, saving }) => {
  const disabled = accion === 'ver';

  return (
    <AppCrudForm titulo={titulo} accion={accion} handleOnClose={handleOnClose} saving={saving}>
      <MyTextField autoFocus className='campo-completo' fullWidth label='Nombre' name='nombre' disabled={disabled} required />
      <MyTextField className='campo-completo' fullWidth multiline minRows={2} label='Descripción' name='descripcion' disabled={disabled} />
      <MyTextField fullWidth type='number' label='Valor' name='valor' disabled={disabled} required />
      <MySelectField fullWidth variant='standard' label='Periodicidad' name='periodicidad' disabled={disabled} required options={PERIODICIDADES} />
      <MyTextField fullWidth type='number' label='N.° de clases' name='num_clases' disabled={disabled} helperText='Para planes por paquete de clases' />
      <MyRadioField className='campo-completo' label='Estado' name='estado' disabled={disabled} required options={OPCIONES_ESTADO} />
    </AppCrudForm>
  );
};

PlanForm.propTypes = {
  accion: PropTypes.string.isRequired,
  titulo: PropTypes.string,
  handleOnClose: PropTypes.func.isRequired,
  saving: PropTypes.bool,
};

export default PlanForm;

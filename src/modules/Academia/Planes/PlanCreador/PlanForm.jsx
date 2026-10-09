import React from 'react';
import PropTypes from 'prop-types';
import { useFormikContext } from 'formik';
import AppCrudForm from '../../../../shared/components/AppCrudForm';
import MyTextField from '../../../../shared/components/MyTextField';
import MySelectField from '../../../../shared/components/MySelectField';
import MyRadioField from '../../../../shared/components/MyRadioField';
import { CampoSede } from '../../../../shared/sedes';
import { OPCIONES_ESTADO, PERIODICIDADES } from '../../../../shared/constants/Academia';

const PlanForm = ({ accion, titulo, handleOnClose, saving }) => {
  const disabled = accion === 'ver';
  const { values } = useFormikContext();

  return (
    <AppCrudForm titulo={titulo} accion={accion} handleOnClose={handleOnClose} saving={saving}>
      <MyTextField autoFocus className='campo-completo' fullWidth label='Nombre' name='nombre' disabled={disabled} required />
      <MyTextField className='campo-completo' fullWidth multiline minRows={2} label='Descripción' name='descripcion' disabled={disabled} />
      <CampoSede
        className='campo-completo'
        opcional
        disabled={disabled}
      />
      <MyTextField fullWidth type='number' label='Valor' name='valor' disabled={disabled} required />
      <MySelectField fullWidth variant='standard' label='Periodicidad' name='periodicidad' disabled={disabled} required options={PERIODICIDADES} />
      <MyTextField
        fullWidth
        type='number'
        label='N.° de clases (vacío = 4)'
        name='num_clases'
        disabled={disabled}
      />
      {values.periodicidad === 'paquete' && (
        <MyTextField
          fullWidth
          type='number'
          label='Valor para alumnos de cursos (opcional)'
          name='valor_alumno'
          disabled={disabled}
        />
      )}
      {values.periodicidad === 'paquete' && (
        <MyTextField
          fullWidth
          type='number'
          label='Vigencia en días (vacío = no vence)'
          name='vigencia_dias'
          disabled={disabled}
        />
      )}
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

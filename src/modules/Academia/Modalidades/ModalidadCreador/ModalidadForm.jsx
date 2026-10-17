import React from 'react';
import PropTypes from 'prop-types';
import { useFormikContext } from 'formik';
import { Alert } from '@mui/material';
import AppCrudForm from '../../../../shared/components/AppCrudForm';
import MyTextField from '../../../../shared/components/MyTextField';
import MyRadioField from '../../../../shared/components/MyRadioField';
import { OPCIONES_ESTADO, TIPOS_COBRO } from '../../../../shared/constants/Academia';

const ModalidadForm = ({ accion, titulo, handleOnClose, saving }) => {
  const disabled = accion === 'ver';
  const mensual = useFormikContext().values.tipo_cobro === 'mensual';

  return (
    <AppCrudForm titulo={titulo} accion={accion} handleOnClose={handleOnClose} saving={saving}>
      <MyTextField
        autoFocus
        className='campo-completo'
        fullWidth
        label='Nombre'
        name='nombre'
        placeholder='Ej.: Ciclo de 4 clases'
        disabled={disabled}
        required
      />
      <MyRadioField
        className='campo-completo'
        label='Cómo se cobra'
        name='tipo_cobro'
        disabled={disabled}
        required
        options={TIPOS_COBRO}
      />
      {mensual ? (
        <Alert severity='info' className='campo-completo'>
          Se cobra el día 1 de cada mes, el mismo valor si el mes trae 4 o 5 clases. Las clases que caen en festivo o cierre no se
          reponen, y un mes sin ninguna clase no se cobra. Quien entra a mitad de mes paga solo las clases que le quedan.
        </Alert>
      ) : (
        <MyTextField
          fullWidth
          type='number'
          label='Clases por ciclo'
          name='clases_por_ciclo'
          helperText='Clases dictadas que paga el alumno en cada ciclo. Festivos y cierres no cuentan: el ciclo se corre.'
          inputProps={{ min: 1, max: 60 }}
          disabled={disabled}
          required
        />
      )}
      <MyTextField
        fullWidth
        type='number'
        label='Duración de cada clase (minutos)'
        name='duracion_minutos'
        helperText='Cada curso puede cambiarla.'
        inputProps={{ min: 15, max: 600, step: 5 }}
        disabled={disabled}
        required
      />
      <MyRadioField
        className='campo-completo'
        label='Estado'
        name='estado'
        disabled={disabled}
        required
        options={OPCIONES_ESTADO}
      />
    </AppCrudForm>
  );
};

ModalidadForm.propTypes = {
  accion: PropTypes.string.isRequired,
  titulo: PropTypes.string,
  handleOnClose: PropTypes.func.isRequired,
  saving: PropTypes.bool,
};

export default ModalidadForm;

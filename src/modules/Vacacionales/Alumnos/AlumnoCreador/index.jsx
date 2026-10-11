import React from 'react';
import PropTypes from 'prop-types';
import * as yup from 'yup';
import AppCrudDialog from '../../../../shared/components/AppCrudDialog';
import AppCrudForm, { SeccionForm } from '../../../../shared/components/AppCrudForm';
import MyTextField from '../../../../shared/components/MyTextField';
import MyDateField from '../../../../shared/components/MyDateField';
import MyRadioField from '../../../../shared/components/MyRadioField';
import {
  onShow,
  onCreate,
  onUpdate,
  resetActual,
} from '../../../../@crema/redux/features/vacacionales/vacacionalAlumnosSlice';
import { aRadio, OPCIONES_ESTADO } from '../../../../shared/constants/Academia';

const validationSchema = yup.object({
  nombres: yup.string().required('Requerido').max(100, 'Máximo 100 caracteres'),
  apellidos: yup.string().required('Requerido').max(100, 'Máximo 100 caracteres'),
  correo: yup.string().email('Correo inválido').nullable(),
});

const initialValues = (registro) => ({
  id: registro?.id ?? '',
  nombres: registro?.nombres ?? '',
  apellidos: registro?.apellidos ?? '',
  documento: registro?.documento ?? '',
  fecha_nacimiento: registro?.fecha_nacimiento ?? '',
  telefono: registro?.telefono ?? '',
  correo: registro?.correo ?? '',
  acudiente_nombre: registro?.acudiente_nombre ?? '',
  acudiente_telefono: registro?.acudiente_telefono ?? '',
  observacion: registro?.observacion ?? '',
  estado: aRadio(registro?.estado),
});

const VacacionalAlumnoCreador = ({ alumno, accion, handleOnClose, updateColeccion, titulo }) => {
  const disabled = accion === 'ver';

  return (
    <AppCrudDialog
      stateKey='vacacionalAlumnos'
      registroId={alumno}
      accion={accion}
      handleOnClose={handleOnClose}
      updateColeccion={updateColeccion}
      onShow={onShow}
      onCreate={onCreate}
      onUpdate={onUpdate}
      resetActual={resetActual}
      initialValues={initialValues}
      validationSchema={validationSchema}
      maxWidth='md'
    >
      {({ saving }) => (
        <AppCrudForm titulo={titulo} accion={accion} handleOnClose={handleOnClose} saving={saving}>
          <SeccionForm titulo='Datos del alumno' />
          <MyTextField autoFocus fullWidth label='Nombres' name='nombres' disabled={disabled} required />
          <MyTextField fullWidth label='Apellidos' name='apellidos' disabled={disabled} required />
          <MyTextField fullWidth label='Documento' name='documento' disabled={disabled} />
          <MyDateField label='Fecha de nacimiento' name='fecha_nacimiento' disabled={disabled} />

          <SeccionForm titulo='Contacto' />
          <MyTextField fullWidth label='Teléfono' name='telefono' disabled={disabled} />
          <MyTextField
            fullWidth
            type='email'
            label='Correo'
            name='correo'
            disabled={disabled}
            helperText='A este correo llegan los avisos de próximos vacacionales.'
          />
          <MyTextField fullWidth label='Acudiente' name='acudiente_nombre' disabled={disabled} />
          <MyTextField fullWidth label='Teléfono del acudiente' name='acudiente_telefono' disabled={disabled} />
          <MyTextField className='campo-completo' fullWidth label='Observación' name='observacion' disabled={disabled} />
          <MyRadioField className='campo-completo' label='Estado' name='estado' disabled={disabled} required options={OPCIONES_ESTADO} />
        </AppCrudForm>
      )}
    </AppCrudDialog>
  );
};

VacacionalAlumnoCreador.propTypes = {
  alumno: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  accion: PropTypes.string.isRequired,
  handleOnClose: PropTypes.func.isRequired,
  updateColeccion: PropTypes.func.isRequired,
  titulo: PropTypes.string,
};

export default VacacionalAlumnoCreador;

import React from 'react';
import PropTypes from 'prop-types';
import * as yup from 'yup';
import AppCrudDialog from '../../../../shared/components/AppCrudDialog';
import {
  onShow,
  onCreate,
  onUpdate,
  resetActual,
} from '../../../../@crema/redux/features/alumnos/alumnosSlice';
import { aRadio } from '../../../../shared/constants/Academia';
import { useSedes } from '../../../../shared/sedes';
import AlumnoForm from './AlumnoForm';

const validationSchema = yup.object({
  nombres: yup.string().required('Requerido').max(100, 'Máximo 100 caracteres'),
  apellidos: yup.string().required('Requerido').max(100, 'Máximo 100 caracteres'),
  correo: yup.string().email('Correo inválido').nullable(),
  documento: yup.string().nullable(),
  telefono: yup.string().nullable(),
  direccion: yup.string().nullable(),
  contacto_emergencia: yup.string().nullable(),
  telefono_emergencia: yup.string().nullable(),
});

const initialValues = (registro, sedePorDefecto) => ({
  id: registro?.id ?? '',
  sede_id: registro?.sede_id ?? sedePorDefecto,
  nombres: registro?.nombres ?? '',
  apellidos: registro?.apellidos ?? '',
  documento: registro?.documento ?? '',
  telefono: registro?.telefono ?? '',
  correo: registro?.correo ?? '',
  fecha_nacimiento: registro?.fecha_nacimiento ?? '',
  direccion: registro?.direccion ?? '',
  contacto_emergencia: registro?.contacto_emergencia ?? '',
  telefono_emergencia: registro?.telefono_emergencia ?? '',
  estado: aRadio(registro?.estado),
});

const AlumnoCreador = ({ alumno, accion, handleOnClose, updateColeccion, titulo }) => {
  const { sedePorDefecto } = useSedes();
  return (
  <AppCrudDialog
    stateKey='alumnos'
    registroId={alumno}
    accion={accion}
    handleOnClose={handleOnClose}
    updateColeccion={updateColeccion}
    onShow={onShow}
    onCreate={onCreate}
    onUpdate={onUpdate}
    resetActual={resetActual}
    initialValues={(registro) => initialValues(registro, sedePorDefecto)}
    validationSchema={validationSchema}
    maxWidth='md'
  >
    {({ registro, saving }) => (
      <AlumnoForm registro={registro} accion={accion} titulo={titulo} handleOnClose={handleOnClose} saving={saving} />
    )}
  </AppCrudDialog>
  );
};

AlumnoCreador.propTypes = {
  alumno: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  accion: PropTypes.string.isRequired,
  handleOnClose: PropTypes.func.isRequired,
  updateColeccion: PropTypes.func.isRequired,
  titulo: PropTypes.string,
};

export default AlumnoCreador;

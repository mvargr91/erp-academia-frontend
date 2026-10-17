import React from 'react';
import PropTypes from 'prop-types';
import * as yup from 'yup';
import AppCrudDialog from '../../../../shared/components/AppCrudDialog';
import {
  onShow,
  onCreate,
  onUpdate,
  resetActual,
} from '../../../../@crema/redux/features/modalidades/modalidadesSlice';
import { aRadio } from '../../../../shared/constants/Academia';
import ModalidadForm from './ModalidadForm';

const entero = (min, max) =>
  yup.number().typeError('Debe ser un número').required('Requerido').integer('Sin decimales').min(min, `Mínimo ${min}`).max(max, `Máximo ${max}`);

const validationSchema = yup.object({
  nombre: yup.string().required('Requerido').max(100, 'Máximo 100 caracteres'),
  tipo_cobro: yup.string().required('Requerido'),
  // En una mensualidad no aplica: el mes trae las clases que traiga.
  clases_por_ciclo: yup.mixed().when('tipo_cobro', { is: 'ciclo', then: () => entero(1, 60), otherwise: (s) => s.nullable() }),
  duracion_minutos: entero(15, 600),
});

const initialValues = (registro) => ({
  id: registro?.id ?? '',
  nombre: registro?.nombre ?? '',
  tipo_cobro: registro?.tipo_cobro ?? 'ciclo',
  clases_por_ciclo: registro?.clases_por_ciclo ?? 4,
  duracion_minutos: registro?.duracion_minutos ?? 60,
  estado: aRadio(registro?.estado),
});

const ModalidadCreador = ({ modalidad, accion, handleOnClose, updateColeccion, titulo }) => (
  <AppCrudDialog
    stateKey='modalidades'
    registroId={modalidad}
    accion={accion}
    handleOnClose={handleOnClose}
    updateColeccion={updateColeccion}
    onShow={onShow}
    onCreate={onCreate}
    onUpdate={onUpdate}
    resetActual={resetActual}
    initialValues={initialValues}
    validationSchema={validationSchema}
    maxWidth='sm'
  >
    {({ registro, saving }) => (
      <ModalidadForm registro={registro} accion={accion} titulo={titulo} handleOnClose={handleOnClose} saving={saving} />
    )}
  </AppCrudDialog>
);

ModalidadCreador.propTypes = {
  modalidad: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  accion: PropTypes.string.isRequired,
  handleOnClose: PropTypes.func.isRequired,
  updateColeccion: PropTypes.func.isRequired,
  titulo: PropTypes.string,
};

export default ModalidadCreador;

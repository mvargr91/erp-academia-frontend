import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as yup from 'yup';
import { useFormikContext } from 'formik';
import { Alert } from '@mui/material';
import jwtAxios from '../../../../@crema/services/auth/jwt-auth';
import AppCrudDialog from '../../../../shared/components/AppCrudDialog';
import AppCrudForm from '../../../../shared/components/AppCrudForm';
import MyTextField from '../../../../shared/components/MyTextField';
import MyDateField from '../../../../shared/components/MyDateField';
import FormikMultiSelect from '../../../../shared/components/FormikMultiSelect';
import { CampoSede } from '../../../../shared/sedes';
import { DIAS_SEMANA, nombreDe } from '../../../../shared/constants/Academia';
import {
  onShow,
  onCreate,
  onUpdate,
  resetActual,
} from '../../../../@crema/redux/features/cierres/cierresSlice';

const validationSchema = yup.object({
  fecha_desde: yup.string().required('Requerido'),
  fecha_hasta: yup
    .string()
    .required('Requerido')
    .test('orden', 'No puede ser anterior a la fecha inicial', function (hasta) {
      return !hasta || !this.parent.fecha_desde || hasta >= this.parent.fecha_desde;
    }),
  motivo: yup.string().required('Requerido').max(150, 'Máximo 150 caracteres'),
});

const initialValues = (registro) => ({
  id: registro?.id ?? '',
  fecha_desde: registro?.fecha_desde ?? '',
  fecha_hasta: registro?.fecha_hasta ?? '',
  motivo: registro?.motivo ?? '',
  sede_id: registro?.sede_id ?? '',
  cursos: registro?.cursos ?? [],
});

// Sin cursos el cierre es de toda la academia (o de la sede elegida); con cursos, solo de esos.
const CamposCierre = ({ ver, cursos }) => {
  const { values } = useFormikContext();
  const porCursos = (values.cursos ?? []).length > 0;
  return (
    <>
      <FormikMultiSelect
        name='cursos'
        label='Cursos (opcional)'
        placeholder='Vacío = todos los cursos'
        helperText='Elige cursos solo si el cierre es de algunos: por ejemplo, cuando el profesor no puede ese día.'
        options={cursos}
        disabled={ver}
      />
      {!porCursos && <CampoSede className='campo-completo' opcional disabled={ver} />}
      <Alert severity='info' className='campo-completo'>
        {porCursos ? 'Las clases de los cursos elegidos' : 'Las clases'} que caigan en estas fechas no se cuentan: los ciclos de 4
        clases de los alumnos se corren a la semana siguiente y su próximo pago también.
      </Alert>
    </>
  );
};

CamposCierre.propTypes = {
  ver: PropTypes.bool,
  cursos: PropTypes.array.isRequired,
};

// Opción de curso: nombre · día hora · profesor.
const nombreCurso = (c) =>
  [c.ritmo ?? c.nombre, `${nombreDe(DIAS_SEMANA, Number(c.dia))} ${c.hora ?? ''}`.trim(), c.profesor_nombre]
    .filter(Boolean)
    .join(' · ');

const CierreCreador = ({ cierre, accion, handleOnClose, updateColeccion, titulo }) => {
  const [cursos, setCursos] = useState([]);

  useEffect(() => {
    jwtAxios
      .get('cursos', { params: { ligera: 1 } })
      .then(({ data }) => setCursos(data.map((c) => ({ id: c.id, nombre: nombreCurso(c) }))))
      .catch(() => setCursos([]));
  }, []);

  return (
    <AppCrudDialog
      stateKey='cierres'
      registroId={cierre}
      accion={accion}
      handleOnClose={handleOnClose}
      updateColeccion={updateColeccion}
      onShow={onShow}
      onCreate={onCreate}
      onUpdate={onUpdate}
      resetActual={resetActual}
      initialValues={initialValues}
      validationSchema={validationSchema}
    >
      {({ saving }) => (
        <AppCrudForm titulo={titulo} accion={accion} handleOnClose={handleOnClose} saving={saving}>
          <MyDateField label='Desde' name='fecha_desde' disabled={accion === 'ver'} />
          <MyDateField label='Hasta' name='fecha_hasta' disabled={accion === 'ver'} />
          <MyTextField
            className='campo-completo'
            fullWidth
            label='Motivo'
            name='motivo'
            placeholder='Ej.: Vacaciones de fin de año'
            disabled={accion === 'ver'}
            required
          />
          <CamposCierre ver={accion === 'ver'} cursos={cursos} />
        </AppCrudForm>
      )}
    </AppCrudDialog>
  );
};

CierreCreador.propTypes = {
  cierre: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  accion: PropTypes.string.isRequired,
  handleOnClose: PropTypes.func.isRequired,
  updateColeccion: PropTypes.func,
  titulo: PropTypes.string,
};

export default CierreCreador;

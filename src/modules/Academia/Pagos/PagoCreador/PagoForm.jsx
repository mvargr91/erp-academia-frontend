import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormikContext } from 'formik';
import jwtAxios from '../../../../@crema/services/auth/jwt-auth';
import AppCrudForm, { SeccionForm } from '../../../../shared/components/AppCrudForm';
import MyTextField from '../../../../shared/components/MyTextField';
import MySelectField from '../../../../shared/components/MySelectField';
import MyDateField from '../../../../shared/components/MyDateField';
import FormikAutocomplete from '../../../../shared/components/FormikAutocomplete';
import { CampoSede } from '../../../../shared/sedes';
import { METODOS_PAGO } from '../../../../shared/constants/Academia';

const PagoForm = (props) => {
  const { accion, titulo, handleOnClose, saving, alumnos, cursos, planes } = props;
  const disabled = accion === 'ver';
  const { values } = useFormikContext();
  const [paquetes, setPaquetes] = useState([]);

  // Paquetes del alumno elegido (para abonar a un paquete de clases en lugar de a un curso).
  useEffect(() => {
    if (!values.alumno_id) {
      setPaquetes([]);
      return;
    }
    jwtAxios
      .get('paquetes', { params: { ligera: 1, alumno_id: values.alumno_id } })
      .then(({ data }) => setPaquetes(data))
      .catch(() => setPaquetes([]));
  }, [values.alumno_id]);

  return (
    <AppCrudForm titulo={titulo} accion={accion} handleOnClose={handleOnClose} saving={saving}>
      <SeccionForm titulo='Datos del pago' />
      <FormikAutocomplete name='alumno_id' label='Alumno' options={alumnos} disabled={disabled} textFieldProps={{ variant: 'standard' }} />
      <FormikAutocomplete
        name='paquete_id'
        label='Paquete de clases (opcional)'
        options={paquetes}
        disabled={disabled}
        textFieldProps={{ variant: 'standard', helperText: 'Si eliges un paquete, el pago abona a su saldo.' }}
      />
      {!values.paquete_id && (
        <FormikAutocomplete name='curso_id' label='Curso' options={cursos} disabled={disabled} textFieldProps={{ variant: 'standard', helperText: 'El pago descuenta el saldo del alumno en este curso.' }} />
      )}
      <FormikAutocomplete name='plan_id' label='Plan (opcional)' options={planes} disabled={disabled} textFieldProps={{ variant: 'standard' }} />
      <MyTextField fullWidth type='number' label='Monto' name='monto' disabled={disabled} required />
      <MyDateField label='Fecha de pago' name='fecha_pago' disabled={disabled} />
      <CampoSede disabled={disabled} label='Sede donde se recibe' />
      <MySelectField name='metodo_pago' label='Método de pago' options={METODOS_PAGO} disabled={disabled} fullWidth variant='standard' />

      <SeccionForm titulo='Detalle' />
      <MyTextField fullWidth label='Referencia' name='referencia' disabled={disabled} />
      <MyTextField className='campo-completo' fullWidth multiline minRows={2} label='Observación' name='observacion' disabled={disabled} />
    </AppCrudForm>
  );
};

PagoForm.propTypes = {
  accion: PropTypes.string.isRequired,
  titulo: PropTypes.string,
  handleOnClose: PropTypes.func.isRequired,
  saving: PropTypes.bool,
  alumnos: PropTypes.array.isRequired,
  cursos: PropTypes.array.isRequired,
  planes: PropTypes.array.isRequired,
};

export default PagoForm;

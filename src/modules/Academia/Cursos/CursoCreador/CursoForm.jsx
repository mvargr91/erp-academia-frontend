import React from 'react';
import PropTypes from 'prop-types';
import AppCrudForm, { SeccionForm } from '../../../../shared/components/AppCrudForm';
import MyTextField from '../../../../shared/components/MyTextField';
import MySelectField from '../../../../shared/components/MySelectField';
import MyDateField from '../../../../shared/components/MyDateField';
import MyRadioField from '../../../../shared/components/MyRadioField';
import FormikAutocomplete from '../../../../shared/components/FormikAutocomplete';
import FormikMultiSelect from '../../../../shared/components/FormikMultiSelect';
import { CampoSede } from '../../../../shared/sedes';
import { DIAS_SEMANA, OPCIONES_ESTADO, OPCIONES_SI_NO } from '../../../../shared/constants/Academia';
import ParejasCurso from './ParejasCurso';
import usePermisosOpcion from '../../../../shared/hooks/usePermisosOpcion';

const CursoForm = (props) => {
  const { accion, titulo, handleOnClose, saving, ritmos, profesores, alumnos, registro } = props;
  const disabled = accion === 'ver';
  // Definir cómo paga cada alumno (individual o en pareja) es un permiso aparte de modificar el curso.
  const { permisos } = usePermisosOpcion('/cursos');
  const puedeFormaDePago = permisos.indexOf('FormaDePago') >= 0;
  // Pactar un valor distinto de la tarifa con un alumno (beca, convenio) es otro permiso.
  const puedeValorEspecial = permisos.indexOf('ValorEspecial') >= 0;

  return (
    <AppCrudForm titulo={titulo} accion={accion} handleOnClose={handleOnClose} saving={saving}>
      <SeccionForm titulo='Datos del curso' />
      <CampoSede disabled={disabled} />
      <FormikAutocomplete name='ritmo_id' label='Ritmo' options={ritmos} disabled={disabled} textFieldProps={{ variant: 'standard' }} />
      <FormikAutocomplete name='profesor_id' label='Profesor' options={profesores} disabled={disabled} textFieldProps={{ variant: 'standard' }} />
      <MyTextField fullWidth label='Nombre (opcional)' name='nombre' disabled={disabled} />

      <SeccionForm titulo='Horario' />
      <MySelectField name='dia' label='Día' options={DIAS_SEMANA} disabled={disabled} fullWidth variant='standard' />
      <MyTextField fullWidth type='time' label='Hora' name='hora' disabled={disabled} required InputLabelProps={{ shrink: true }} />
      <MyDateField label='Fecha de inicio' name='fecha_inicio' disabled={disabled} />
      <MyTextField fullWidth type='number' label='Cupo máximo' name='cupo_max' disabled={disabled} />

      <SeccionForm titulo='Matrícula y estado' />
      <FormikMultiSelect
        name='alumnos'
        label='Alumnos matriculados'
        placeholder='Buscar alumno...'
        options={alumnos}
        disabled={disabled}
      />
      <MyRadioField label='Activo' name='activo' disabled={disabled} required options={OPCIONES_SI_NO} />
      <MyRadioField label='Estado' name='estado' disabled={disabled} required options={OPCIONES_ESTADO} />

      {accion !== 'crear' && registro && (
        <>
          <SeccionForm titulo='Cómo paga cada alumno' />
          <ParejasCurso key={registro.id} cursoId={registro.id} matriculados={registro.matriculados ?? []} soloLectura={!puedeFormaDePago} puedeValorEspecial={puedeValorEspecial} />
        </>
      )}
    </AppCrudForm>
  );
};

CursoForm.propTypes = {
  accion: PropTypes.string.isRequired,
  titulo: PropTypes.string,
  handleOnClose: PropTypes.func.isRequired,
  saving: PropTypes.bool,
  ritmos: PropTypes.array.isRequired,
  profesores: PropTypes.array.isRequired,
  alumnos: PropTypes.array.isRequired,
  registro: PropTypes.object,
};

export default CursoForm;

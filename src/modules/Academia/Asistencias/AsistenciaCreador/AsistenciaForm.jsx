import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useFormikContext } from 'formik';
import { Box, Button, Checkbox, FormControlLabel, Typography, Divider } from '@mui/material';
import AppCrudForm, { SeccionForm } from '../../../../shared/components/AppCrudForm';
import MyTextField from '../../../../shared/components/MyTextField';
import MyDateField from '../../../../shared/components/MyDateField';
import FormikAutocomplete from '../../../../shared/components/FormikAutocomplete';
import { onShow as onShowCurso } from '../../../../@crema/redux/features/cursos/cursosSlice';

const AsistenciaForm = (props) => {
  const { accion, titulo, handleOnClose, saving, cursos } = props;
  const disabled = accion === 'ver';
  const soloCrear = accion === 'crear';

  const dispatch = useDispatch();
  const { values, setFieldValue } = useFormikContext();
  const { actual: cursoActual } = useSelector((s) => s.cursos);
  const rosterAplicadoRef = useRef(null);

  // Al elegir un curso (modo crear) carga sus alumnos matriculados.
  useEffect(() => {
    if (soloCrear && values.curso_id) {
      dispatch(onShowCurso(values.curso_id));
    }
  }, [soloCrear, values.curso_id, dispatch]);

  useEffect(() => {
    if (
      soloCrear &&
      cursoActual &&
      String(cursoActual.id) === String(values.curso_id) &&
      rosterAplicadoRef.current !== String(values.curso_id)
    ) {
      const roster = (cursoActual.matriculados ?? []).map((m) => ({
        alumno_id: m.id,
        nombre: m.nombre,
        presente: true,
      }));
      setFieldValue('asistentes', roster);
      rosterAplicadoRef.current = String(values.curso_id);
    }
  }, [soloCrear, cursoActual, values.curso_id, setFieldValue]);

  const asistentes = values.asistentes ?? [];

  const marcarTodos = (presente) =>
    setFieldValue('asistentes', asistentes.map((a) => ({ ...a, presente })));

  return (
    <AppCrudForm titulo={titulo} accion={accion} handleOnClose={handleOnClose} saving={saving}>
      <SeccionForm titulo='Sesión de clase' />
      <FormikAutocomplete
        name='curso_id'
        label='Curso'
        options={cursos}
        disabled={disabled || !soloCrear}
        textFieldProps={{ variant: 'standard', helperText: soloCrear ? 'Al elegir el curso se cargan sus alumnos matriculados.' : '' }}
      />
      <MyDateField label='Fecha de la sesión' name='fecha_sesion' disabled={disabled} />
      <MyTextField className='campo-completo' fullWidth multiline minRows={2} label='Observación' name='observacion' disabled={disabled} />

      <Box className='campo-completo'>
        <Divider sx={{ my: 1 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
            Toma de lista ({asistentes.filter((a) => a.presente).length}/{asistentes.length})
          </Typography>
          {!disabled && asistentes.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button size='small' onClick={() => marcarTodos(true)}>Marcar todos</Button>
              <Button size='small' color='inherit' onClick={() => marcarTodos(false)}>Desmarcar todos</Button>
            </Box>
          )}
        </Box>

        {asistentes.length === 0 ? (
          <Typography color='text.secondary' sx={{ py: 2 }}>
            {values.curso_id
              ? 'El curso seleccionado no tiene alumnos matriculados.'
              : 'Selecciona un curso para cargar los alumnos.'}
          </Typography>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 0.5 }}>
            {asistentes.map((a, i) => (
              <FormControlLabel
                key={a.alumno_id}
                control={
                  <Checkbox
                    checked={!!a.presente}
                    disabled={disabled}
                    onChange={(e) => setFieldValue(`asistentes.${i}.presente`, e.target.checked)}
                  />
                }
                label={a.nombre}
              />
            ))}
          </Box>
        )}
      </Box>
    </AppCrudForm>
  );
};

AsistenciaForm.propTypes = {
  accion: PropTypes.string.isRequired,
  titulo: PropTypes.string,
  handleOnClose: PropTypes.func.isRequired,
  saving: PropTypes.bool,
  cursos: PropTypes.array.isRequired,
};

export default AsistenciaForm;

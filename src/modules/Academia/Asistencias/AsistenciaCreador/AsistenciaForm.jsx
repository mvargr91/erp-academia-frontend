import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormikContext } from 'formik';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import AppCrudForm, { SeccionForm } from '../../../../shared/components/AppCrudForm';
import MyTextField from '../../../../shared/components/MyTextField';
import MyDateField from '../../../../shared/components/MyDateField';
import FormikAutocomplete from '../../../../shared/components/FormikAutocomplete';
import jwtAxios from '../../../../@crema/services/auth/jwt-auth';

const AsistenciaForm = (props) => {
  const { accion, titulo, handleOnClose, saving, cursos } = props;
  const disabled = accion === 'ver';
  const soloCrear = accion === 'crear';

  const { values, setFieldValue } = useFormikContext();
  // Respuesta de asistencias/preparar: { valida, motivo, sugerida, alumnos: [{ alumno_id, nombre, clase_numero, clases_ciclo }] }
  const [calendario, setCalendario] = useState(null);
  const rosterAplicadoRef = useRef(null);

  // Valida la fecha contra el calendario del curso (día de clase, festivos, cierres).
  useEffect(() => {
    if (!values.curso_id || !values.fecha_sesion) {
      setCalendario(null);
      return undefined;
    }
    let vigente = true;
    jwtAxios
      .get('asistencias/preparar', { params: { curso_id: values.curso_id, fecha: values.fecha_sesion } })
      .then(({ data }) => vigente && setCalendario(data))
      .catch(() => vigente && setCalendario(null));
    return () => {
      vigente = false;
    };
  }, [values.curso_id, values.fecha_sesion]);

  // Al crear: la lista son los matriculados del curso; todos inician ausentes y se marcan al ser llamados.
  useEffect(() => {
    if (!soloCrear || !calendario || rosterAplicadoRef.current === String(values.curso_id)) return;
    setFieldValue(
      'asistentes',
      calendario.alumnos.map((a) => ({ alumno_id: a.alumno_id, nombre: a.nombre, presente: false })),
    );
    rosterAplicadoRef.current = String(values.curso_id);
  }, [soloCrear, calendario, values.curso_id, setFieldValue]);

  const cicloDe = useMemo(
    () => Object.fromEntries((calendario?.alumnos ?? []).map((a) => [a.alumno_id, a])),
    [calendario],
  );
  const fechaCorta = (iso) => (iso ? iso.split('-').reverse().join('/') : '');

  const asistentes = values.asistentes ?? [];
  const presentes = asistentes.filter((a) => a.presente).length;
  const [filtro, setFiltro] = useState('');

  const marcarTodos = (presente) =>
    setFieldValue('asistentes', asistentes.map((a) => ({ ...a, presente })));

  const alternar = (i) => {
    if (disabled) return;
    setFieldValue(`asistentes.${i}.presente`, !asistentes[i].presente);
  };

  const texto = filtro.trim().toLowerCase();
  const visibles = asistentes
    .map((a, i) => ({ ...a, i }))
    .filter((a) => !texto || (a.nombre ?? '').toLowerCase().includes(texto));

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
      {!disabled && calendario && !calendario.valida && (
        <Alert
          severity='warning'
          className='campo-completo'
          action={
            calendario.sugerida && calendario.sugerida !== values.fecha_sesion ? (
              <Button color='inherit' size='small' onClick={() => setFieldValue('fecha_sesion', calendario.sugerida)}>
                Usar {fechaCorta(calendario.sugerida)}
              </Button>
            ) : null
          }
        >
          {calendario.motivo}
        </Alert>
      )}
      <MyTextField className='campo-completo' fullWidth multiline minRows={2} label='Observación' name='observacion' disabled={disabled} />

      <Box className='campo-completo'>
        <Divider sx={{ my: 1 }} />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant='h5' sx={{ fontWeight: 'bold' }}>Toma de lista</Typography>
            {asistentes.length > 0 && (
              <>
                <Chip size='small' color='success' label={`Presentes ${presentes}`} />
                <Chip size='small' variant='outlined' label={`Ausentes ${asistentes.length - presentes}`} />
              </>
            )}
          </Box>
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
          <>
            {asistentes.length > 8 && (
              <TextField
                size='small'
                fullWidth
                placeholder='Buscar alumno...'
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                sx={{ mb: 1 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <SearchIcon fontSize='small' />
                    </InputAdornment>
                  ),
                }}
              />
            )}
            <List dense disablePadding sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}>
              {visibles.map((a) => (
                <ListItemButton
                  key={a.alumno_id}
                  divider
                  onClick={() => alternar(a.i)}
                  disabled={disabled && !a.presente}
                  sx={{
                    py: 1,
                    bgcolor: (t) => (a.presente ? alpha(t.palette.success.main, 0.15) : 'transparent'),
                    '&:hover': {
                      bgcolor: (t) => (a.presente ? alpha(t.palette.success.main, 0.25) : t.palette.action.hover),
                    },
                    '&.Mui-disabled': { opacity: 0.6 },
                  }}
                >
                  <Typography sx={{ width: 32, color: 'text.secondary' }}>{a.i + 1}.</Typography>
                  <ListItemText
                    primary={a.nombre}
                    primaryTypographyProps={{ fontSize: 16, fontWeight: a.presente ? 'bold' : 'normal' }}
                  />
                  {cicloDe[a.alumno_id]?.modalidad === 'paquete' && (
                    <Chip
                      size='small'
                      variant='outlined'
                      sx={{ mr: 1 }}
                      color={cicloDe[a.alumno_id].paquete.restantes > 1 ? 'primary' : 'error'}
                      label={
                        cicloDe[a.alumno_id].paquete.restantes > 0
                          ? `Paquete · quedan ${cicloDe[a.alumno_id].paquete.restantes}`
                          : 'Paquete sin clases'
                      }
                    />
                  )}
                  {cicloDe[a.alumno_id]?.clase_numero && (
                    <Chip
                      size='small'
                      variant='outlined'
                      sx={{ mr: 1 }}
                      label={`Clase ${cicloDe[a.alumno_id].clase_numero} de ${cicloDe[a.alumno_id].clases_ciclo}`}
                      color={cicloDe[a.alumno_id].clase_numero === cicloDe[a.alumno_id].clases_ciclo ? 'warning' : 'default'}
                    />
                  )}
                  <ListItemIcon sx={{ minWidth: 0 }}>
                    <Checkbox
                      edge='end'
                      color='success'
                      checked={!!a.presente}
                      disabled={disabled}
                      tabIndex={-1}
                      disableRipple
                      sx={{ '& .MuiSvgIcon-root': { fontSize: 30 } }}
                    />
                  </ListItemIcon>
                </ListItemButton>
              ))}
              {visibles.length === 0 && (
                <Typography color='text.secondary' sx={{ p: 2 }}>Sin coincidencias.</Typography>
              )}
            </List>
          </>
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

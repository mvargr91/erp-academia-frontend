import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormikContext } from 'formik';
import { useDispatch } from 'react-redux';
import { Alert, Box, Button } from '@mui/material';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import jwtAxios from '../../../../@crema/services/auth/jwt-auth';
import AppCrudForm, { SeccionForm } from '../../../../shared/components/AppCrudForm';
import MyTextField from '../../../../shared/components/MyTextField';
import MySelectField from '../../../../shared/components/MySelectField';
import MyDateField from '../../../../shared/components/MyDateField';
import FormikAutocomplete from '../../../../shared/components/FormikAutocomplete';
import { CampoSede } from '../../../../shared/sedes';
import { METODOS_PAGO } from '../../../../shared/constants/Academia';
import usePermisosOpcion from '../../../../shared/hooks/usePermisosOpcion';
import { showMessage } from '../../../../@crema/redux/features/cammon/commonSlice';

const PagoForm = (props) => {
  const { accion, titulo, handleOnClose, saving, alumnos, cursos } = props;
  const disabled = accion === 'ver';
  const { values } = useFormikContext();
  const [paquetes, setPaquetes] = useState([]);
  const dispatch = useDispatch();
  // Condonar (perdonar la deuda sin recibir dinero) es un permiso aparte de registrar pagos.
  const puedeCondonar = usePermisosOpcion('/pagos').permisos.indexOf('Condonar') >= 0;
  const [condonando, setCondonando] = useState(false);
  const [errorCondonar, setErrorCondonar] = useState('');
  const destino = values.paquete_id ? { paquete_id: values.paquete_id } : values.curso_id ? { curso_id: values.curso_id } : null;

  const condonar = () => {
    const motivo = String(values.observacion ?? '').trim();
    if (!motivo) {
      setErrorCondonar('Para condonar, escribe el motivo en el campo Observación.');
      return;
    }
    if (!window.confirm('¿Condonar toda la deuda pendiente? El saldo quedará en 0 y no se registra ningún pago.')) return;
    setErrorCondonar('');
    setCondonando(true);
    jwtAxios
      .post('condonaciones', { alumno_id: values.alumno_id, ...destino, motivo })
      .then(({ data }) => {
        dispatch(showMessage(data.mensajes));
        handleOnClose();
      })
      .catch((e) => setErrorCondonar(e?.response?.data?.mensajes?.[0] ?? 'No se pudo condonar la deuda.'))
      .finally(() => setCondonando(false));
  };

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
        textFieldProps={{ variant: 'standard' }}
      />
      {!values.paquete_id && (
        <FormikAutocomplete name='curso_id' label='Curso' options={cursos} disabled={disabled} textFieldProps={{ variant: 'standard' }} />
      )}
      <MyTextField fullWidth type='number' label='Monto' name='monto' disabled={disabled} required />
      <MyDateField label='Fecha de pago' name='fecha_pago' disabled={disabled} />
      <CampoSede disabled={disabled} label='Sede donde se recibe' />
      <MySelectField name='metodo_pago' label='Método de pago' options={METODOS_PAGO} disabled={disabled} fullWidth variant='standard' />

      <SeccionForm titulo='Detalle' />
      <MyTextField fullWidth label='Referencia' name='referencia' disabled={disabled} />
      <MyTextField className='campo-completo' fullWidth multiline minRows={2} label='Observación' name='observacion' disabled={disabled} />

      {accion === 'crear' && puedeCondonar && (
        <Box className='campo-completo' sx={{ mt: 2 }}>
          {errorCondonar && (
            <Alert severity='error' sx={{ mb: 2 }} onClose={() => setErrorCondonar('')}>
              {errorCondonar}
            </Alert>
          )}
          <Button
            color='warning'
            variant='outlined'
            startIcon={<MoneyOffIcon />}
            disabled={!values.alumno_id || !destino || condonando || saving}
            onClick={condonar}
          >
            Condonar la deuda (el saldo queda en 0)
          </Button>
        </Box>
      )}
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
};

export default PagoForm;

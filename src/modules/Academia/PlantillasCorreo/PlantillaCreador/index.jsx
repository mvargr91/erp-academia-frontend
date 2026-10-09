import React, { useState } from 'react';
import PropTypes from 'prop-types';
import * as yup from 'yup';
import { useFormikContext } from 'formik';
import { Alert, Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SendIcon from '@mui/icons-material/Send';
import RestoreIcon from '@mui/icons-material/Restore';
import AppCrudDialog from '../../../../shared/components/AppCrudDialog';
import AppCrudForm, { SeccionForm } from '../../../../shared/components/AppCrudForm';
import MyTextField from '../../../../shared/components/MyTextField';
import MyRadioField from '../../../../shared/components/MyRadioField';
import FormikEditorHtml from '../../../../shared/components/FormikEditorHtml';
import jwtAxios from '../../../../@crema/services/auth/jwt-auth';
import { OPCIONES_ESTADO, aRadio } from '../../../../shared/constants/Academia';
import { onShow, onCreate, onUpdate, resetActual } from '../../../../@crema/redux/features/plantillasCorreo/plantillasCorreoSlice';

// Variables de las plantillas manuales (deben coincidir con EnviosCorreo::VARIABLES del backend).
const VARIABLES_MANUALES = {
  alumno: 'Nombre del destinatario',
  academia: 'Nombre de la academia',
  saldo: 'Saldo pendiente del destinatario',
  curso: 'Curso (si el envío es a un curso)',
};

const validationSchema = yup.object({
  nombre: yup.string().when('tipo', { is: 'manual', then: (s) => s.required('Requerido').max(128, 'Máximo 128 caracteres') }),
  asunto: yup.string().required('Requerido').max(128, 'Máximo 128 caracteres'),
  texto: yup
    .string()
    .test('vacio', 'El contenido no puede estar vacío', (v) => Boolean(v && v.replace(/<[^>]*>/g, '').trim())),
});

const initialValues = (registro) => ({
  id: registro?.id ?? '',
  tipo: registro?.tipo ?? 'manual',
  nombre: registro?.nombre ?? '',
  asunto: registro?.asunto ?? '',
  texto: registro?.texto ?? '',
  estado: aRadio(registro?.estado),
});

// Acciones sobre lo que se está editando (sin guardar): vista previa, prueba y restaurar.
const Herramientas = ({ id, disabled, sistema }) => {
  const { values, setFieldValue } = useFormikContext();
  const [vista, setVista] = useState(null);
  const [aviso, setAviso] = useState(null);

  const error = (e, texto) => setAviso({ tipo: 'error', texto: e?.response?.data?.mensajes?.[0] ?? texto });

  const verPrevia = () =>
    jwtAxios
      .post(`plantillas-correo/${id}/vista-previa`, { asunto: values.asunto, texto: values.texto })
      .then(({ data }) => setVista(data))
      .catch((e) => error(e, 'No se pudo generar la vista previa.'));

  const probar = () =>
    jwtAxios
      .post(`plantillas-correo/${id}/probar`, { asunto: values.asunto, texto: values.texto })
      .then(({ data }) => setAviso({ tipo: 'success', texto: data.mensajes?.[0] }))
      .catch((e) => error(e, 'No se pudo enviar la prueba.'));

  const restaurar = () =>
    jwtAxios
      .get(`plantillas-correo/${id}/por-defecto`)
      .then(({ data }) => {
        setFieldValue('asunto', data.asunto);
        setFieldValue('texto', data.texto);
        setAviso({ tipo: 'info', texto: 'Se cargó el texto por defecto. Guarda para aplicarlo.' });
      })
      .catch((e) => error(e, 'No se pudo restaurar.'));

  return (
    <Box className='campo-completo'>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Button size='small' variant='outlined' startIcon={<VisibilityIcon />} onClick={verPrevia}>
          Vista previa
        </Button>
        {!disabled && (
          <>
            <Button size='small' variant='outlined' startIcon={<SendIcon />} onClick={probar}>
              Enviarme una prueba
            </Button>
            {sistema && (
              <Button size='small' color='inherit' startIcon={<RestoreIcon />} onClick={restaurar}>
                Restaurar texto por defecto
              </Button>
            )}
          </>
        )}
      </Box>
      {aviso && (
        <Alert severity={aviso.tipo} sx={{ mt: 1 }} onClose={() => setAviso(null)}>
          {aviso.texto}
        </Alert>
      )}

      <Dialog open={Boolean(vista)} onClose={() => setVista(null)} maxWidth='md' fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Box>
            <Typography variant='caption' color='text.secondary'>
              Asunto
            </Typography>
            <Typography sx={{ fontWeight: 'bold' }}>{vista?.asunto}</Typography>
          </Box>
          <IconButton onClick={() => setVista(null)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant='caption' color='text.secondary'>
            Las variables se muestran con su descripción entre corchetes.
          </Typography>
          <Box
            component='iframe'
            title='Vista previa del correo'
            srcDoc={vista?.html}
            sx={{ width: '100%', height: '65vh', border: '1px solid #ddd', borderRadius: 1, mt: 1, background: '#fff' }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

Herramientas.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  disabled: PropTypes.bool,
  sistema: PropTypes.bool,
};

const PlantillaCreador = ({ plantilla, accion, handleOnClose, updateColeccion, titulo }) => {
  const ver = accion === 'ver';
  return (
    <AppCrudDialog
      stateKey='plantillasCorreo'
      registroId={plantilla}
      accion={accion}
      handleOnClose={handleOnClose}
      updateColeccion={updateColeccion}
      onShow={onShow}
      onCreate={onCreate}
      onUpdate={onUpdate}
      resetActual={resetActual}
      initialValues={initialValues}
      validationSchema={validationSchema}
      maxWidth='lg'
    >
      {({ registro, saving }) => {
        const manual = !registro || registro.tipo === 'manual';
        return (
        <AppCrudForm titulo={titulo} accion={accion} handleOnClose={handleOnClose} saving={saving}>
          <SeccionForm titulo={manual ? 'Plantilla manual' : registro.nombre} />
          {manual && (
            <MyTextField
              className='campo-completo'
              fullWidth
              label='Nombre de la plantilla'
              name='nombre'
              disabled={ver}
              required
            />
          )}
          <MyTextField
            className='campo-completo'
            fullWidth
            label='Asunto'
            name='asunto'
            disabled={ver}
            required
          />
          <FormikEditorHtml
            name='texto'
            label='Contenido del correo'
            variables={manual ? VARIABLES_MANUALES : registro?.variables}
            disabled={ver}
          />
          <Alert severity='info' className='campo-completo'>
            El encabezado con el nombre de la academia, el saludo y el pie con los datos de contacto se agregan
            automáticamente.
          </Alert>
          <MyRadioField className='campo-completo' label='Estado' name='estado' disabled={ver} options={OPCIONES_ESTADO} />
          {registro?.id && <Herramientas id={registro.id} disabled={ver} sistema={!manual} />}
          {manual && accion === 'crear' && (
            <Alert severity='info' className='campo-completo'>
              Después de guardarla, envíala desde Academia → Envíos de correo.
            </Alert>
          )}
        </AppCrudForm>
        );
      }}
    </AppCrudDialog>
  );
};

PlantillaCreador.propTypes = {
  plantilla: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  accion: PropTypes.string.isRequired,
  handleOnClose: PropTypes.func.isRequired,
  updateColeccion: PropTypes.func,
  titulo: PropTypes.string,
};

export default PlantillaCreador;

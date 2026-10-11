// Nuevo envío masivo: plantilla (o texto libre) + destinatarios, revisión previa y envío a la cola.
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Formik, Form, useFormikContext } from 'formik';
import * as yup from 'yup';
import Swal from 'sweetalert2';
import { Alert, Box, Button, Card, CardContent, IconButton, MenuItem, TextField, Tooltip, Typography, useTheme } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import GroupsIcon from '@mui/icons-material/Groups';
import SendIcon from '@mui/icons-material/Send';
import jwtAxios from '../../../../@crema/services/auth/jwt-auth';
import { showMessage } from '../../../../@crema/redux/features/cammon/commonSlice';
import MyTextField from '../../../../shared/components/MyTextField';
import FormikAutocomplete from '../../../../shared/components/FormikAutocomplete';
import FormikMultiSelect from '../../../../shared/components/FormikMultiSelect';
import FormikEditorHtml from '../../../../shared/components/FormikEditorHtml';
import { formatoMoneda } from '../../../../shared/constants/Academia';

const VARIABLES = {
  alumno: 'Nombre del destinatario',
  academia: 'Nombre de la academia',
  saldo: 'Saldo pendiente del destinatario',
  curso: 'Curso (si el envío es a un curso)',
};

const VACIO = { plantilla_id: '', asunto: '', texto: '', audiencia: 'todos', curso_id: '', vacacional_curso_id: '', alumnos: [] };

const escapar = (texto) => String(texto ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Borrador del anuncio de un vacacional próximo (llega con ?vacacional=ID desde Cursos vacacionales).
// Va por defecto al público de vacacionales; se puede cambiar a los alumnos de la academia.
const anuncioDe = (v) => {
  const datos = [
    v.ritmo_nombre && ['Género', v.ritmo_nombre],
    v.profesor_nombre && ['Profesor', v.profesor_nombre],
    ['Días de clase', v.fechas_texto],
    v.hora_inicio && ['Horario', v.hora_fin ? `${v.hora_inicio} a ${v.hora_fin}` : v.hora_inicio],
    v.total_fechas > v.clases_por_alumno && ['Clases', `eliges ${v.clases_por_alumno} de los ${v.total_fechas} días`],
    ['Valor', formatoMoneda(v.valor)],
  ].filter(Boolean);
  return {
    ...VACIO,
    audiencia: 'vacacionales',
    asunto: `Próximo vacacional: ${v.nombre}`,
    texto: [
      '<p>Hola {alumno},</p>',
      `<p>En {academia} abrimos un nuevo vacacional: <strong>${escapar(v.nombre)}</strong>.</p>`,
      `<ul>${datos.map(([k, d]) => `<li><strong>${k}:</strong> ${escapar(d)}</li>`).join('')}</ul>`,
      v.descripcion ? `<p>${escapar(v.descripcion)}</p>` : '',
      '<p>Los cupos son limitados. Responde este correo para reservar el tuyo.</p>',
    ].join(''),
  };
};

const esquema = yup.object({
  asunto: yup.string().required('Requerido').max(150, 'Máximo 150 caracteres'),
  texto: yup.string().test('vacio', 'Escribe el contenido', (v) => Boolean(v && v.replace(/<[^>]*>/g, '').trim())),
  audiencia: yup.string().required('Elige a quién enviar'),
  curso_id: yup.mixed().when('audiencia', { is: 'curso', then: (s) => s.required('Elige el curso') }),
  vacacional_curso_id: yup.mixed().when('audiencia', { is: 'vacacional_curso', then: (s) => s.required('Elige el curso vacacional') }),
  alumnos: yup.array().when('audiencia', { is: 'seleccion', then: (s) => s.min(1, 'Elige al menos un alumno') }),
});

const Contenido = ({ catalogos, resumen, setResumen }) => {
  const { values, setFieldValue } = useFormikContext();

  // Al elegir una plantilla se copian su asunto y texto (se pueden retocar para este envío).
  useEffect(() => {
    const p = catalogos.plantillas.find((x) => String(x.id) === String(values.plantilla_id));
    if (p) {
      setFieldValue('asunto', p.asunto);
      setFieldValue('texto', p.texto);
    }
  }, [values.plantilla_id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cambiar los destinatarios invalida el resumen calculado.
  useEffect(() => setResumen(null), [values.audiencia, values.curso_id, values.vacacional_curso_id, values.alumnos]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Card sx={{ mb: 3, boxShadow: '0px 0px 5px 2px rgb(0 0 0 / 8%)' }}>
        <CardContent sx={{ display: 'grid', gap: 3 }}>
          <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
            1. Mensaje
          </Typography>
          <FormikAutocomplete
            name='plantilla_id'
            label='Plantilla (opcional)'
            options={catalogos.plantillas.map((p) => ({ id: p.id, nombre: p.nombre }))}
            textFieldProps={{ variant: 'standard' }}
          />
          <MyTextField fullWidth label='Asunto' name='asunto' required />
          <FormikEditorHtml name='texto' label='Contenido' variables={VARIABLES} className='' />
        </CardContent>
      </Card>

      <Card sx={{ mb: 3, boxShadow: '0px 0px 5px 2px rgb(0 0 0 / 8%)' }}>
        <CardContent sx={{ display: 'grid', gap: 3 }}>
          <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
            2. Destinatarios
          </Typography>
          <TextField
            select
            variant='standard'
            label='Enviar a'
            value={values.audiencia}
            onChange={(e) => setFieldValue('audiencia', e.target.value)}
          >
            {catalogos.audiencias.map((a) => (
              <MenuItem key={a.id} value={a.id}>
                {a.nombre}
              </MenuItem>
            ))}
          </TextField>
          {values.audiencia === 'curso' && (
            <FormikAutocomplete name='curso_id' label='Curso' options={catalogos.cursos} textFieldProps={{ variant: 'standard' }} />
          )}
          {values.audiencia === 'vacacional_curso' && (
            <FormikAutocomplete
              name='vacacional_curso_id'
              label='Curso vacacional'
              options={catalogos.vacacionales}
              textFieldProps={{ variant: 'standard' }}
            />
          )}
          {values.audiencia === 'seleccion' && (
            <FormikMultiSelect name='alumnos' label='Alumnos' options={catalogos.alumnos} className='' placeholder='Buscar alumno...' />
          )}
          {resumen && (
            <Alert severity={resumen.con_correo ? (resumen.supera_limite ? 'warning' : 'success') : 'error'}>
              <strong>{resumen.con_correo}</strong> de {resumen.total} destinatarios recibirán el correo.
              {resumen.sin_correo.length > 0 && ` Sin correo registrado: ${resumen.sin_correo.join(', ')}.`}
              {resumen.supera_limite &&
                ` Supera el límite diario aproximado de Gmail (${resumen.limite}): algunos podrían no salir hoy.`}
            </Alert>
          )}
        </CardContent>
      </Card>
    </>
  );
};

const NuevoEnvio = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const [query] = useSearchParams();
  const vacacionalId = query.get('vacacional');
  const [catalogos, setCatalogos] = useState({ plantillas: [], audiencias: [], cursos: [], alumnos: [], vacacionales: [] });
  const [resumen, setResumen] = useState(null);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    Promise.all([
      jwtAxios.get('plantillas-correo', { params: { ligera: 1 } }),
      jwtAxios.get('envios-correo', { params: { limite: 1 } }),
      jwtAxios.get('cursos', { params: { ligera: 1 } }),
      jwtAxios.get('alumnos', { params: { ligera: 1 } }),
      // Sin permiso sobre vacacionales el resto del formulario sigue funcionando.
      jwtAxios.get('vacacionales-cursos', { params: { ligera: 1 } }).catch(() => ({ data: [] })),
    ])
      .then(([pl, en, cu, al, va]) =>
        setCatalogos({ plantillas: pl.data, audiencias: en.data.audiencias, cursos: cu.data, alumnos: al.data, vacacionales: va.data }),
      )
      .catch(() => setError('No se pudieron cargar los datos del formulario.'));
  }, []);

  const vacacional = useMemo(
    () => catalogos.vacacionales.find((v) => String(v.id) === String(vacacionalId)),
    [catalogos.vacacionales, vacacionalId],
  );
  const iniciales = useMemo(() => (vacacional ? anuncioDe(vacacional) : VACIO), [vacacional]);

  const payload = (v) => ({
    plantilla_id: v.plantilla_id || null,
    asunto: v.asunto,
    texto: v.texto,
    audiencia: v.audiencia,
    curso_id: v.audiencia === 'curso' ? v.curso_id : null,
    vacacional_curso_id: v.audiencia === 'vacacional_curso' ? v.vacacional_curso_id : null,
    alumnos: v.audiencia === 'seleccion' ? v.alumnos : [],
  });
  const mensajeError = (e, texto) => e?.response?.data?.mensajes?.[0] ?? texto;

  const revisar = (values, validateForm, setTouched) =>
    validateForm().then((errores) => {
      if (Object.keys(errores).length) {
        setTouched(Object.fromEntries(Object.keys(errores).map((k) => [k, true])));
        return;
      }
      setError('');
      jwtAxios
        .post('envios-correo/resumen', payload(values))
        .then(({ data }) => setResumen(data))
        .catch((e) => setError(mensajeError(e, 'No se pudieron calcular los destinatarios.')));
    });

  const enviar = (values) =>
    Swal.fire({
      title: 'Confirmar envío',
      text: `Se enviará "${values.asunto}" a ${resumen.con_correo} destinatario(s). ¿Continuar?`,
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
      background: theme.palette.background.default,
      color: theme.palette.text.primary,
    }).then(({ isConfirmed }) => {
      if (!isConfirmed) return;
      setEnviando(true);
      jwtAxios
        .post('envios-correo', payload(values))
        .then(({ data }) => {
          dispatch(showMessage(data.mensajes));
          navigate('/envios-correo');
        })
        .catch((e) => setError(mensajeError(e, 'No se pudo enviar.')))
        .finally(() => setEnviando(false));
    });

  return (
    <Box sx={{ maxWidth: 1000 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Tooltip title='Volver'>
          <IconButton onClick={() => navigate('/envios-correo')}>
            <ArrowBackIosIcon />
          </IconButton>
        </Tooltip>
        <Typography variant='h2' sx={{ fontWeight: 'bold' }}>
          Nuevo envío de correo
        </Typography>
      </Box>
      {error && (
        <Alert severity='error' sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      <Formik
        // El borrador del anuncio llega cuando cargan los catálogos: el formulario se monta de nuevo con él.
        key={vacacional ? `anuncio-${vacacional.id}` : 'nuevo'}
        initialValues={iniciales}
        validationSchema={esquema}
        onSubmit={() => {}}
      >
        {({ values, validateForm, setTouched }) => (
          <Form noValidate>
            <Contenido catalogos={catalogos} resumen={resumen} setResumen={setResumen} />
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button onClick={() => navigate('/envios-correo')}>Cancelar</Button>
              <Button variant='outlined' startIcon={<GroupsIcon />} onClick={() => revisar(values, validateForm, setTouched)}>
                Revisar destinatarios
              </Button>
              <Button
                variant='contained'
                startIcon={<SendIcon />}
                disabled={!resumen?.con_correo || enviando}
                onClick={() => enviar(values)}
              >
                Enviar
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default NuevoEnvio;

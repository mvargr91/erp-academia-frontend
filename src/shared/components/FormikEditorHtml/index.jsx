// Editor de texto enriquecido (CKEditor 5) ligado a un campo Formik que guarda HTML.
// `variables` ({ nombre: descripción }) muestra botones que insertan {nombre} donde está el cursor.
import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useField, useFormikContext } from 'formik';
import { Box, Chip, FormHelperText, Tooltip, Typography } from '@mui/material';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import '@ckeditor/ckeditor5-build-classic/build/translations/es';
import jwtAxios from '../../../@crema/services/auth/jwt-auth';

const BARRA = ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|', 'blockQuote', 'undo', 'redo'];

// Solo imágenes: el selector de archivos y lo que se pega o arrastra se limitan a estos tipos
// (el backend lo vuelve a verificar por el contenido del archivo).
const TIPOS_IMAGEN = ['png', 'jpeg', 'webp', 'gif'];

// Sube al ERP las imágenes que se insertan, pegan o arrastran en el editor y deja su URL pública.
function AdaptadorImagenes(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => ({
    upload: () =>
      loader.file.then((archivo) => {
        const datos = new FormData();
        datos.append('imagen', archivo);
        return jwtAxios
          .post('correo-imagenes', datos, { headers: { 'Content-Type': 'multipart/form-data' } })
          .then(({ data }) => ({ default: data.url }))
          .catch((e) => Promise.reject(e?.response?.data?.mensajes?.[0] ?? 'No se pudo subir la imagen.'));
      }),
    abort: () => {},
  });
}

const FormikEditorHtml = ({ name, label, variables, disabled, className, imagenes }) => {
  const [field, meta] = useField(name);
  const { setFieldValue, setFieldTouched } = useFormikContext();
  const editorRef = useRef(null);

  const insertar = (variable) => {
    const editor = editorRef.current;
    if (!editor || disabled) return;
    editor.model.change((writer) => {
      editor.model.insertContent(writer.createText(`{${variable}}`));
    });
    editor.editing.view.focus();
  };

  const entradas = Object.entries(variables || {});

  return (
    <Box className={className}>
      {label && (
        <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mb: 0.5 }}>
          {label}
        </Typography>
      )}
      {entradas.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
          <Typography variant='caption' color='text.secondary' sx={{ alignSelf: 'center', mr: 0.5 }}>
            Variables:
          </Typography>
          {entradas.map(([variable, descripcion]) => (
            <Tooltip key={variable} title={`${descripcion} — clic para insertar`}>
              <Chip
                size='small'
                variant='outlined'
                color='primary'
                label={`{${variable}}`}
                onClick={disabled ? undefined : () => insertar(variable)}
              />
            </Tooltip>
          ))}
        </Box>
      )}
      <Box
        sx={{
          // El editor va sobre fondo claro aunque el panel esté en modo oscuro.
          '& .ck-editor__editable': { minHeight: 220, color: '#222' },
          '& .ck-editor__editable img': { maxWidth: '100%', height: 'auto' },
          '& .ck.ck-editor__main > .ck-editor__editable': { background: '#fff' },
        }}
      >
        <CKEditor
          editor={ClassicEditor}
          data={field.value || ''}
          disabled={disabled}
          config={
            imagenes
              ? {
                  toolbar: [...BARRA.slice(0, 7), 'uploadImage', ...BARRA.slice(7)],
                  language: 'es',
                  extraPlugins: [AdaptadorImagenes],
                  image: {
                    upload: { types: TIPOS_IMAGEN },
                    toolbar: ['imageTextAlternative'],
                  },
                }
              : { toolbar: BARRA, language: 'es' }
          }
          onReady={(editor) => {
            editorRef.current = editor;
          }}
          onChange={(_, editor) => setFieldValue(name, editor.getData())}
          onBlur={() => setFieldTouched(name, true)}
        />
      </Box>
      {meta.touched && meta.error && <FormHelperText error>{meta.error}</FormHelperText>}
    </Box>
  );
};

FormikEditorHtml.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  variables: PropTypes.object,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  // Botón para insertar imágenes (se suben al ERP). Solo para contenido de correos.
  imagenes: PropTypes.bool,
};

FormikEditorHtml.defaultProps = {
  className: 'campo-completo',
  imagenes: false,
};

/** ¿El HTML tiene contenido: texto o al menos una imagen? (un correo puede ser solo una imagen). */
export const tieneContenido = (html) => Boolean(html && (/<img\b/i.test(html) || html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()));

export default FormikEditorHtml;

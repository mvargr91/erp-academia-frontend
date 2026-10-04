// Editor de texto enriquecido (CKEditor 5) ligado a un campo Formik que guarda HTML.
// `variables` ({ nombre: descripción }) muestra botones que insertan {nombre} donde está el cursor.
import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useField, useFormikContext } from 'formik';
import { Box, Chip, FormHelperText, Tooltip, Typography } from '@mui/material';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import '@ckeditor/ckeditor5-build-classic/build/translations/es';

const BARRA = ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|', 'blockQuote', 'undo', 'redo'];

const FormikEditorHtml = ({ name, label, variables, disabled, className }) => {
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
          '& .ck.ck-editor__main > .ck-editor__editable': { background: '#fff' },
        }}
      >
        <CKEditor
          editor={ClassicEditor}
          data={field.value || ''}
          disabled={disabled}
          config={{ toolbar: BARRA, language: 'es' }}
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
};

FormikEditorHtml.defaultProps = {
  className: 'campo-completo',
};

export default FormikEditorHtml;

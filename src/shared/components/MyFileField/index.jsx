// Campo Formik para subir un archivo (imagen, video o documento).
// El valor es el File seleccionado; el backend lo guarda en storage con una ruta que dice a qué
// registro pertenece. "rutaActual" es lo que ya está guardado (para mostrarlo y previsualizarlo).
import React, { useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { useField, useFormikContext } from 'formik';
import * as yup from 'yup';
import { Box, Button, FormHelperText, Link, Typography } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import { nombreDeRuta, urlArchivo } from '../../functions/Archivos';

// Deben coincidir con las reglas de ArchivosService en el backend.
export const TIPOS_ARCHIVO = {
  imagen: { accept: 'image/jpeg,image/png,image/webp', extensiones: ['jpg', 'jpeg', 'png', 'webp'], maxMB: 5 },
  video: { accept: 'video/mp4,video/webm', extensiones: ['mp4', 'webm'], maxMB: 50 },
  documento: { accept: 'application/pdf,image/jpeg,image/png', extensiones: ['pdf', 'jpg', 'jpeg', 'png'], maxMB: 10 },
};

const extensionDe = (nombre = '') => nombre.split('.').pop().toLowerCase();
const tamano = (bytes) => (bytes >= 1048576 ? `${(bytes / 1048576).toFixed(1)} MB` : `${Math.ceil(bytes / 1024)} KB`);

/** Validación yup del archivo. "requerido" puede ser booleano o función de los valores del formulario. */
export const validarArchivo = (tipo = 'imagen', requerido = false) => {
  const { extensiones, maxMB } = TIPOS_ARCHIVO[tipo];
  return yup
    .mixed()
    .nullable()
    .test('requerido', 'Selecciona un archivo', function (archivo) {
      const obligatorio = typeof requerido === 'function' ? requerido(this.parent) : requerido;
      return !obligatorio || archivo instanceof Blob;
    })
    .test('tipo', `Formatos permitidos: ${extensiones.join(', ')}`, (archivo) =>
      !(archivo instanceof File) || extensiones.includes(extensionDe(archivo.name)))
    .test('tamano', `El archivo no puede pesar más de ${maxMB} MB`, (archivo) =>
      !(archivo instanceof Blob) || archivo.size <= maxMB * 1048576);
};

const MyFileField = ({ name = 'archivo', label, tipo = 'imagen', rutaActual, disabled, className }) => {
  const [field, meta] = useField(name);
  const { setFieldValue, setFieldTouched } = useFormikContext();
  const input = useRef(null);
  const archivo = field.value instanceof Blob ? field.value : null;
  const error = meta.touched && meta.error ? meta.error : '';
  const { accept, extensiones, maxMB } = TIPOS_ARCHIVO[tipo];

  const vistaPrevia = useMemo(() => {
    if (tipo !== 'imagen') return '';
    if (archivo) return URL.createObjectURL(archivo);
    return urlArchivo(rutaActual);
  }, [archivo, rutaActual, tipo]);

  useEffect(() => () => {
    if (vistaPrevia.startsWith('blob:')) URL.revokeObjectURL(vistaPrevia);
  }, [vistaPrevia]);

  const seleccionar = (evento) => {
    const elegido = evento.target.files?.[0] ?? null;
    setFieldValue(name, elegido);
    setFieldTouched(name, true, false);
    evento.target.value = ''; // permite volver a elegir el mismo archivo
  };

  return (
    <Box className={className}>
      <Typography variant='body2' sx={{ color: 'text.secondary', mb: 1 }}>{label}</Typography>

      <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap', p: 3, border: '1px dashed', borderColor: error ? 'error.main' : '#C9D2DA', borderRadius: 2 }}>
        {vistaPrevia && (
          <Box component='img' src={vistaPrevia} alt='' sx={{ width: 96, height: 72, objectFit: 'cover', borderRadius: 1, bgcolor: '#F1F4F7' }} />
        )}
        <Box sx={{ flex: 1, minWidth: 180 }}>
          {archivo ? (
            <Typography variant='body2'>
              <strong>{archivo.name}</strong> · {tamano(archivo.size)} <Typography component='span' variant='body2' color='text.secondary'>(nuevo)</Typography>
            </Typography>
          ) : rutaActual ? (
            <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1, wordBreak: 'break-all' }}>
              <InsertDriveFileOutlinedIcon fontSize='small' sx={{ color: '#9AA5B1' }} />
              {tipo === 'documento' ? nombreDeRuta(rutaActual) : (
                <Link href={urlArchivo(rutaActual)} target='_blank' rel='noopener noreferrer'>{nombreDeRuta(rutaActual)}</Link>
              )}
            </Typography>
          ) : (
            <Typography variant='body2' color='text.secondary'>Ningún archivo seleccionado</Typography>
          )}
          <Typography variant='caption' color='text.secondary'>
            {extensiones.join(', ').toUpperCase()} · máximo {maxMB} MB
          </Typography>
        </Box>
        {!disabled && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant='outlined' size='small' startIcon={<UploadFileIcon />} onClick={() => input.current?.click()}>
              {archivo || rutaActual ? 'Cambiar' : 'Seleccionar'}
            </Button>
            {archivo && (
              <Button size='small' color='inherit' onClick={() => setFieldValue(name, null)}>Quitar</Button>
            )}
          </Box>
        )}
        <input ref={input} type='file' hidden accept={accept} onChange={seleccionar} />
      </Box>
      {error && <FormHelperText error>{error}</FormHelperText>}
    </Box>
  );
};

MyFileField.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string.isRequired,
  tipo: PropTypes.oneOf(Object.keys(TIPOS_ARCHIVO)),
  rutaActual: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default MyFileField;

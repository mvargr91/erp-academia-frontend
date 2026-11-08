// Exportes → Alumnos por curso: descarga el Excel de validación (alumnos por curso con lo que debe cada uno)
// y sube las correcciones del dueño. Es lo mismo que los botones de la pantalla Alumnos, con permisos propios.
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, Box, Button, Card, CardContent, CircularProgress, Typography } from '@mui/material';
import TableViewIcon from '@mui/icons-material/TableView';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import usePermisosOpcion from '../../../shared/hooks/usePermisosOpcion';
import { descargarArchivo } from '../../../shared/functions/Archivos';
import ImportarCorrecciones from '../Alumnos/ImportarCorrecciones';

const AlumnosPorCurso = ({ route }) => {
  const { titulo, permisos, cargado } = usePermisosOpcion(route.path);
  const [descargando, setDescargando] = useState(false);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState('');
  const [aplicado, setAplicado] = useState(false);

  if (cargado && permisos.length === 0) {
    return <Box sx={{ p: 4, fontSize: 19 }}>No está autorizado para ver esta opción.</Box>;
  }

  const descargar = async () => {
    setDescargando(true);
    setError('');
    try {
      await descargarArchivo('alumnos/exportar-por-curso', `alumnos-por-curso-${new Date().toISOString().slice(0, 10)}.xlsx`);
    } catch (e) {
      setError('No se pudo generar el Excel. Inténtalo de nuevo.');
    } finally {
      setDescargando(false);
    }
  };

  return (
    <Card sx={{ boxShadow: '0px 0px 5px 2px rgb(0 0 0 / 8%)' }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant='h2' sx={{ mb: 2 }}>
          {titulo || 'Alumnos por curso'}
        </Typography>
        <Typography color='text.secondary' sx={{ mb: 1 }}>
          Excel para validar con el dueño de la academia: todos los alumnos en cada curso con su precio por ciclo y lo que debe,
          resumen por alumno, paquetes, vacacionales y alumnos sin curso.
        </Typography>
        <Typography color='text.secondary' sx={{ mb: 3 }}>
          Para corregir, se editan las columnas azules (pareja, valor especial, retirar y nuevas matrículas) y se sube el mismo
          archivo. Antes de guardar verá los cambios y cómo queda el precio de cada alumno; las tarifas se aplican solas.
        </Typography>

        {error && <Alert severity='error' sx={{ mb: 2 }}>{error}</Alert>}
        {aplicado && <Alert severity='success' sx={{ mb: 2 }}>Las correcciones se aplicaron.</Alert>}

        <Box display='flex' gap={2} flexWrap='wrap'>
          {permisos.includes('Listar') && (
            <Button
              variant='contained'
              startIcon={descargando ? <CircularProgress size={18} color='inherit' /> : <TableViewIcon />}
              onClick={descargar}
              disabled={descargando}
            >
              Descargar Excel
            </Button>
          )}
          {permisos.includes('Importar') && (
            <Button variant='outlined' startIcon={<UploadFileIcon />} onClick={() => setSubiendo(true)}>
              Subir correcciones
            </Button>
          )}
        </Box>
      </CardContent>
      <ImportarCorrecciones abierto={subiendo} onCerrar={() => setSubiendo(false)} onAplicado={() => setAplicado(true)} />
    </Card>
  );
};

AlumnosPorCurso.propTypes = {
  route: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
};

export default AlumnosPorCurso;

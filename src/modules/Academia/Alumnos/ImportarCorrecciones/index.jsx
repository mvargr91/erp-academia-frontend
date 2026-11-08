// Sube el Excel de "Alumnos por curso y deuda" con las correcciones del dueño (pareja, valor especial,
// retiros y nuevas matrículas). Primero muestra la vista previa (el backend simula sin guardar) con los
// cambios y cómo queda el precio de cada alumno; solo al confirmar se aplican.
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import jwtAxios from '../../../../@crema/services/auth/jwt-auth';
import { formatoMoneda } from '../../../../shared/constants/Academia';

const mensajeDe = (e) =>
  e?.response?.data?.mensajes?.[0] ?? e?.response?.data?.errores?.[0] ?? 'No se pudo procesar el archivo. Inténtalo de nuevo.';

const ImportarCorrecciones = ({ abierto, onCerrar, onAplicado }) => {
  const [archivo, setArchivo] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const enviar = async (confirmar) => {
    setCargando(true);
    setError('');
    try {
      const datos = new FormData();
      datos.append('archivo', archivo);
      datos.append('confirmar', confirmar ? '1' : '0');
      const { data } = await jwtAxios.post('alumnos/importar-correcciones', datos, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResultado(data);
      if (data.aplicado) onAplicado();
    } catch (e) {
      if (e?.response?.data?.errores) setResultado(e.response.data);
      else setError(mensajeDe(e));
    } finally {
      setCargando(false);
    }
  };

  const cerrar = () => {
    if (cargando) return;
    setArchivo(null);
    setResultado(null);
    setError('');
    onCerrar();
  };

  const elegir = (e) => {
    setArchivo(e.target.files?.[0] ?? null);
    setResultado(null);
    setError('');
    e.target.value = '';
  };

  const errores = resultado?.errores ?? [];
  const cambios = resultado?.cambios ?? [];
  const ajustes = resultado?.ajustes ?? [];
  const puedeAplicar = resultado && !resultado.aplicado && errores.length === 0 && cambios.length > 0;

  return (
    <Dialog open={abierto} onClose={cerrar} maxWidth='md' fullWidth>
      <DialogTitle>Subir correcciones de alumnos por curso</DialogTitle>
      <DialogContent dividers>
        {!resultado?.aplicado && (
          <>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
              Suba el Excel descargado con &quot;Descargar alumnos por curso y deuda&quot;, con las columnas azules corregidas
              (pareja, valor especial, retirar y nuevas matrículas). Primero verá los cambios y cómo queda el precio de cada
              alumno; nada se guarda hasta que confirme.
            </Typography>
            <Box display='flex' alignItems='center' gap={2} mb={2}>
              <Button variant='outlined' component='label' startIcon={<UploadFileIcon />} disabled={cargando}>
                Elegir archivo
                <input hidden type='file' accept='.xlsx' onChange={elegir} />
              </Button>
              <Typography variant='body2'>{archivo ? archivo.name : 'Ningún archivo elegido'}</Typography>
            </Box>
          </>
        )}

        {error && <Alert severity='error' sx={{ mb: 2 }}>{error}</Alert>}
        {resultado?.aviso && <Alert severity='info' sx={{ mb: 2 }}>{resultado.aviso}</Alert>}
        {resultado?.aplicado && (
          <Alert severity='success' sx={{ mb: 2 }}>
            Se aplicaron {cambios.length} cambios. Los precios se recalcularon con las tarifas y el saldo del ciclo actual se
            ajustó en {formatoMoneda(resultado.total_ajuste)} en total.
          </Alert>
        )}

        {errores.length > 0 && (
          <Alert severity='error' sx={{ mb: 2 }}>
            <Typography variant='subtitle2' sx={{ mb: 1 }}>
              Corrija estos puntos en el Excel y vuelva a subirlo (no se aplicó nada):
            </Typography>
            {errores.map((texto) => (
              <Typography key={texto} variant='body2'>
                • {texto}
              </Typography>
            ))}
          </Alert>
        )}

        {cambios.length > 0 && (
          <>
            <Typography variant='h6' sx={{ mt: 1 }}>
              Cambios ({cambios.length})
            </Typography>
            <Table size='small' sx={{ mb: 3 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Alumno</TableCell>
                  <TableCell>Curso</TableCell>
                  <TableCell>Cambio</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cambios.map((c, i) => (
                  <TableRow key={`${c.alumno}-${c.curso}-${i}`}>
                    <TableCell>{c.alumno}</TableCell>
                    <TableCell>{c.curso}</TableCell>
                    <TableCell>{c.cambio}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}

        {ajustes.length > 0 && (
          <>
            <Typography variant='h6'>Precio por ciclo y ajuste del saldo</Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
              Incluye a los alumnos cuyo precio cambia por estos movimientos (por ejemplo, el orden de sus cursos o la pareja).
            </Typography>
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell>Alumno</TableCell>
                  <TableCell>Curso</TableCell>
                  <TableCell align='right'>Antes</TableCell>
                  <TableCell align='right'>Después</TableCell>
                  <TableCell align='right'>Ajuste saldo</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ajustes.map((a, i) => (
                  <TableRow key={`${a.alumno}-${a.curso}-${i}`}>
                    <TableCell>{a.alumno}</TableCell>
                    <TableCell>{a.curso}</TableCell>
                    <TableCell align='right'>
                      {a.precio_antes === null ? '—' : formatoMoneda(a.precio_antes)}
                      {a.regla_antes && (
                        <Typography variant='caption' display='block' color='text.secondary'>
                          {a.regla_antes}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align='right'>
                      {formatoMoneda(a.precio_despues)}
                      <Typography variant='caption' display='block' color='text.secondary'>
                        {a.regla_despues}
                      </Typography>
                    </TableCell>
                    <TableCell align='right'>
                      {formatoMoneda(a.ajuste_saldo)}
                      <Typography variant='caption' display='block' color='text.secondary'>
                        {a.nota}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={cerrar} disabled={cargando}>
          {resultado?.aplicado ? 'Cerrar' : 'Cancelar'}
        </Button>
        {!resultado?.aplicado && (
          <Button variant='outlined' onClick={() => enviar(false)} disabled={!archivo || cargando}>
            {cargando && !puedeAplicar ? <CircularProgress size={20} /> : 'Revisar cambios'}
          </Button>
        )}
        {puedeAplicar && (
          <Button variant='contained' onClick={() => enviar(true)} disabled={cargando}>
            {cargando ? <CircularProgress size={20} color='inherit' /> : 'Aplicar cambios'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

ImportarCorrecciones.propTypes = {
  abierto: PropTypes.bool.isRequired,
  onCerrar: PropTypes.func.isRequired,
  onAplicado: PropTypes.func.isRequired,
};

export default ImportarCorrecciones;

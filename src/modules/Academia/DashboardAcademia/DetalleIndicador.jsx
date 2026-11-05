// Lo que hay detrás de un número del panel (alumnos, cursos, ingresos, morosos…), con los mismos
// filtros del panel (sede del encabezado). Se puede buscar en la lista y exportarla a Excel.
import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import jwtAxios from '../../../@crema/services/auth/jwt-auth';
import { exportarExcel } from '../../../shared/functions/ExportarExcel';
import { formatoMoneda } from '../../../shared/constants/Academia';

const fechaCorta = (iso) => (iso ? String(iso).slice(0, 10).split('-').reverse().join('/') : '');

const mostrar = (columna, valor) => {
  if (valor === null || valor === undefined) return '';
  if (columna.tipo === 'dinero') return formatoMoneda(Number(valor));
  if (columna.tipo === 'fecha') return fechaCorta(valor);
  return valor;
};

const DetalleIndicador = ({ consulta, onClose }) => {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    if (!consulta) return undefined;
    let vigente = true;
    setDatos(null);
    setError('');
    setBusqueda('');
    jwtAxios
      .get('academia/dashboard/detalle', { params: consulta })
      .then(({ data }) => vigente && setDatos(data))
      .catch(() => vigente && setError('No se pudo cargar el detalle.'));
    return () => {
      vigente = false;
    };
  }, [consulta]);

  const filas = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    if (!datos || !texto) return datos?.filas ?? [];
    return datos.filas.filter((fila) => datos.columnas.some((c) => String(mostrar(c, fila[c.id])).toLowerCase().includes(texto)));
  }, [datos, busqueda]);

  // Total de las columnas de dinero (de las filas que se ven).
  const totales = (datos?.columnas ?? [])
    .filter((c) => c.tipo === 'dinero')
    .map((c) => ({ ...c, total: filas.reduce((suma, f) => suma + (Number(f[c.id]) || 0), 0) }));

  const exportar = () =>
    exportarExcel({
      nombre: datos.titulo,
      columnas: datos.columnas.map((c) => ({
        id: c.id,
        label: c.label,
        typeHead: c.tipo === 'dinero' || c.tipo === 'numero' ? 'numeric' : 'string',
        value: (v) => (c.tipo === 'fecha' ? fechaCorta(v) : v),
      })),
      filas,
    });

  return (
    <Dialog open={Boolean(consulta)} onClose={onClose} fullWidth maxWidth='lg'>
      <DialogTitle sx={{ fontWeight: 'bold' }}>{datos?.titulo ?? 'Detalle'}</DialogTitle>
      <DialogContent>
        {error && <Alert severity='error'>{error}</Alert>}
        {!datos && !error && <LinearProgress />}
        {datos && (
          <>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', mb: 2 }}>
              <TextField
                variant='standard'
                placeholder='Buscar...'
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                sx={{ flex: '1 1 260px' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <SearchIcon fontSize='small' />
                    </InputAdornment>
                  ),
                }}
              />
              <Typography variant='body2' color='text.secondary'>
                {filas.length} de {datos.filas.length} registro{datos.filas.length === 1 ? '' : 's'}
                {totales.map((c) => ` · ${c.label}: ${formatoMoneda(c.total)}`).join('')}
              </Typography>
            </Box>
            <TableContainer sx={{ maxHeight: '60vh' }}>
              <Table size='small' stickyHeader>
                <TableHead>
                  <TableRow>
                    {datos.columnas.map((c) => (
                      <TableCell key={c.id} align={c.tipo === 'dinero' || c.tipo === 'numero' ? 'right' : 'left'} sx={{ fontWeight: 'bold' }}>
                        {c.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filas.map((fila, i) => (
                    <TableRow key={i} hover>
                      {datos.columnas.map((c) => (
                        <TableCell key={c.id} align={c.tipo === 'dinero' || c.tipo === 'numero' ? 'right' : 'left'}>
                          {mostrar(c, fila[c.id])}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                  {filas.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={datos.columnas.length} sx={{ color: 'text.secondary' }}>
                        {datos.filas.length === 0 ? 'No hay registros.' : 'Ningún registro coincide con la búsqueda.'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        {datos && filas.length > 0 && (
          <Button startIcon={<FileDownloadIcon />} onClick={exportar}>
            Exportar a Excel
          </Button>
        )}
        <Button variant='contained' onClick={onClose}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DetalleIndicador.propTypes = {
  // { indicador, mes?, ritmo? } o null (cerrado).
  consulta: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};

export default DetalleIndicador;

// Tabla CRUD reutilizable con el mismo diseño de los módulos existentes (Banco, Proveedor...):
// toolbar con título/ayuda/columnas/crear, filtros con debounce, ordenamiento por columna,
// paginación superior e inferior, acciones por fila según permisos, confirmación de borrado
// y exportación a Excel de todos los registros que cumplen los filtros.
import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { styled, useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import {
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  IconButton,
  LinearProgress,
  MenuItem,
  Pagination,
  Paper,
  Popover,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import TuneIcon from '@mui/icons-material/Tune';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from 'moment';
import IntlMessages from '@crema/helpers/IntlMessages';
import AppMessageView from '@crema/components/AppMessageView';
import { useDebounce } from '@crema/hooks/useDebounce';
import MyCell from '../MyCell';
import HelpButton from '../HelpButton';
import { exportarExcel } from '../../functions/ExportarExcel';
import {
  CREATE_TYPE,
  ERROR_TYPE,
  UPDATE_TYPE,
} from '../../constants/Constantes';

const ROWS_PER_PAGE_OPTIONS = [5, 10, 15, 25, 50];

// Columnas de auditoría presentes en todos los recursos del backend.
export const auditCells = [
  {
    id: 'usuario_modificacion_nombre',
    typeHead: 'string',
    label: 'Modificado Por',
    value: (value) => value,
    align: 'left',
    width: '140px',
    mostrarInicio: false,
  },
  {
    id: 'fecha_modificacion',
    typeHead: 'string',
    label: 'Fecha Última Modificación',
    value: (value) => (value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : ''),
    align: 'left',
    width: '180px',
    mostrarInicio: false,
  },
  {
    id: 'usuario_creacion_nombre',
    typeHead: 'string',
    label: 'Creado Por',
    value: (value) => value,
    align: 'left',
    width: '140px',
    mostrarInicio: false,
  },
  {
    id: 'fecha_creacion',
    typeHead: 'string',
    label: 'Fecha Creación',
    value: (value) => (value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : ''),
    align: 'left',
    width: '180px',
    mostrarInicio: false,
  },
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.primary,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 11,
    textAlign: 'center',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  textAlign: 'start',
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
    fontSize: 14,
  },
}));

const useStyles = makeStyles(() => ({
  marcoTabla: {
    boxShadow: '0px 0px 5px 5px rgb(0 0 0 / 10%)',
    borderRadius: '4px',
    paddingLeft: '15px',
    paddingRight: '15px',
    marginTop: '5px',
  },
  root: {
    width: '100%',
    padding: '20px',
  },
  head: {
    borderTop: '2px solid rgba(128, 128, 128, 0.3)',
    borderBottom: '2px solid rgba(128, 128, 128, 0.3)',
  },
  headCell: {
    padding: '0px 0px 0px 15px',
  },
  cell: (props) => ({
    padding: props.vp + ' 0px ' + props.vp + ' 15px',
    whiteSpace: 'nowrap',
  }),
  cellWidth: (props) => ({
    minWidth: props.width,
  }),
  cellColor: (props) => ({
    backgroundColor: props.cellColor,
    color: 'white',
    padding: '2px 8px',
    borderRadius: '4px',
  }),
  acciones: (props) => ({
    padding: props.vp + ' 0px ' + props.vp + ' 15px',
    minWidth: '100px',
    whiteSpace: 'nowrap',
  }),
  paper: {
    width: '100%',
    boxShadow: 'none',
    backgroundColor: 'transparent',
  },
  table: {
    minWidth: '100%',
  },
  rowsPerPageOptions: {
    marginRight: '10px',
  },
  title: {
    flex: '1 1 100%',
    fontWeight: 'bold',
  },
  titleTop: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '10px',
  },
  horizontalBottoms: {
    width: 'min-content',
    display: 'flex',
    gap: '5px',
  },
  contenedorFiltros: {
    width: '90%',
    display: 'grid',
    gridTemplateColumns: (props) => `repeat(${props.numFiltros}, 4fr) 1fr`,
    gap: '20px',
    alignItems: 'end',
    '@media (max-width: 600px)': {
      gridTemplateColumns: '1fr !important',
    },
  },
}));

const construirColumnas = (cells) =>
  cells.map((cell) => ({ ...cell, mostrar: cell.mostrarInicio }));

const filtrosIniciales = (filtrosConfig) =>
  Object.fromEntries(filtrosConfig.map((filtro) => [filtro.name, '']));

const AppCrudTable = (props) => {
  const {
    stateKey,
    onGetColeccion,
    onDelete,
    cells,
    titulo,
    subtitulo,
    urlAyuda,
    permisos,
    entidadNombre,
    filtrosConfig,
    filtrosFijos,
    paginado,
    defaultOrderBy,
    refreshKey,
    onCrear,
    onEditar,
    onVer,
    accionesExtra,
    eliminable,
    onVolver,
  } = props;

  const theme = useTheme();
  const dispatch = useDispatch();
  const { rows, desde, hasta, ultima_pagina, total, loading } = useSelector(
    (state) => state[stateKey],
  );
  const { message, messageType } = useSelector(({ common }) => common);
  // Al cambiar la sede del encabezado (cabecera X-Sede) la lista se vuelve a pedir.
  const sedeId = useSelector((state) => state.sedeActual.id);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('');
  const [orderByToSend, setOrderByToSend] = useState(paginado ? defaultOrderBy : '');
  const [filtros, setFiltros] = useState(() => filtrosIniciales(filtrosConfig));
  const debouncedFiltros = useDebounce(filtros, 800);
  const [columnasMostradas, setColumnasMostradas] = useState(() => construirColumnas(cells));
  const [popoverTarget, setPopoverTarget] = useState(null);
  const [exportando, setExportando] = useState(false);

  const classes = useStyles({ vp: '0px', numFiltros: Math.max(filtrosConfig.length, 1) });
  const filtrosFijosKey = JSON.stringify(filtrosFijos);

  const puede = (permiso) => permisos.indexOf(permiso) >= 0;

  const cargarColeccion = (pagina = page) => {
    dispatch(
      onGetColeccion({
        page: pagina,
        rowsPerPage,
        orderByToSend,
        filtros: { ...debouncedFiltros, ...filtrosFijos },
      }),
    );
  };

  useEffect(() => {
    setPage(1);
  }, [debouncedFiltros, orderByToSend, filtrosFijosKey, sedeId]);

  useEffect(() => {
    cargarColeccion();
  }, [dispatch, page, rowsPerPage, debouncedFiltros, orderByToSend, filtrosFijosKey, refreshKey, sedeId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Exporta todos los registros de la lista (no solo la página visible) con los filtros y el orden
  // actuales y las columnas que estén a la vista.
  const exportar = async () => {
    setExportando(true);
    try {
      const filas = onGetColeccion.obtenerTodas
        ? await onGetColeccion.obtenerTodas({ orderByToSend, filtros: { ...debouncedFiltros, ...filtrosFijos } })
        : rows;
      await exportarExcel({
        nombre: titulo || entidadNombre || 'Datos',
        columnas: columnasMostradas.filter((columna) => columna.mostrar),
        filas,
      });
    } catch (e) {
      Swal.fire({
        background: theme.palette.background.default,
        color: theme.palette.text.primary,
        title: 'Error',
        text: 'No se pudo exportar a Excel. Inténtalo de nuevo.',
        icon: 'error',
      });
    } finally {
      setExportando(false);
    }
  };

  const changeOrderBy = (id) => {
    if (!paginado) return;
    if (orderBy === id) {
      const nuevoOrden = order === 'asc' ? 'desc' : 'asc';
      setOrder(nuevoOrden);
      setOrderByToSend(`${id}:${nuevoOrden}`);
    } else {
      setOrder('asc');
      setOrderBy(id);
      setOrderByToSend(`${id}:asc`);
    }
  };

  const onChangeFiltro = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const limpiarFiltros = () => setFiltros(filtrosIniciales(filtrosConfig));

  const handleOnchangeMostrarColumna = (e) => {
    setColumnasMostradas((prev) =>
      prev.map((column) =>
        column.id === e.target.id ? { ...column, mostrar: !column.mostrar } : column,
      ),
    );
  };

  const showAllColumns = () =>
    setColumnasMostradas((prev) => prev.map((column) => ({ ...column, mostrar: true })));

  const reiniciarColumns = () => setColumnasMostradas(construirColumnas(cells));

  const swalBase = {
    background: theme.palette.background.default,
    color: theme.palette.text.primary,
  };

  const onDeleteRow = (row) => {
    Swal.fire({
      ...swalBase,
      title: 'Confirmar',
      text: `¿Seguro Que Desea Eliminar ${entidadNombre ? 'el registro de ' + entidadNombre : 'el registro'}?`,
      allowEscapeKey: false,
      allowEnterKey: false,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'NO',
      confirmButtonText: 'SI',
    }).then((result) => {
      if (!result.isConfirmed) return;
      dispatch(onDelete({ id: row.id }))
        .unwrap()
        .then(({ mensaje }) => {
          Swal.fire({ ...swalBase, title: 'Eliminado', text: mensaje, icon: 'success' });
          // Si se borró el último registro de la página, retrocede una página.
          if (rows.length === 1 && page > 1) {
            setPage(page - 1);
          } else {
            cargarColeccion();
          }
        })
        .catch((mensajeError) => {
          Swal.fire({ ...swalBase, title: 'Error', text: mensajeError, icon: 'error' });
        });
    });
  };

  const textoPaginacion = `Mostrando de ${desde} a ${hasta} de ${total} resultados - Página ${page} de ${ultima_pagina}`;

  const botonSx = (backgroundColor) => ({
    backgroundColor,
    color: 'white',
    boxShadow:
      '0px 3px 5px -1px rgb(0 0 0 / 30%), 0px 6px 10px 0px rgb(0 0 0 / 20%), 0px 1px 18px 0px rgb(0 0 0 / 16%)',
    '&:hover': {
      backgroundColor: theme.palette.colorHovers,
      cursor: 'pointer',
    },
    padding: '13px',
  });

  const iconoAccionSx = (color, hover = theme.palette.colorHovers) => ({
    '&:hover': { color: hover, cursor: 'pointer' },
    color,
    mx: '2px',
  });

  const filtroSx = {
    '& .MuiInput-underline:before': { borderBottomColor: theme.palette.divider, marginBottom: -0.5 },
    '& .MuiInput-underline:hover:before': { borderBottomColor: theme.palette.text.primary },
    '& .MuiInput-underline:after': { borderBottomColor: theme.palette.text.primary },
  };

  const cabeceras = useMemo(() => columnasMostradas.filter((c) => c.mostrar), [columnasMostradas]);

  const paginacion = paginado && (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        gap: { xs: 2, sm: 0 },
        pt: '10px',
        pb: '5px',
      }}
    >
      <Box sx={{ width: { xs: '100%', sm: 'auto' }, textAlign: { xs: 'center', sm: 'left' } }}>
        <p>{textoPaginacion}</p>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <select
          className={classes.rowsPerPageOptions}
          value={rowsPerPage}
          onChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(1);
          }}
        >
          {ROWS_PER_PAGE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <Pagination
          showFirstButton
          showLastButton
          onChange={(e, nuevaPagina) => setPage(nuevaPagina)}
          count={ultima_pagina}
          page={page}
        />
      </Box>
    </Box>
  );

  const hayPermisos = permisos.length > 0;

  return (
    <div className={classes.root}>
      <Paper sx={{ marginBottom: theme.spacing(2) }} className={classes.paper}>
        {hayPermisos && (
          <Toolbar
            sx={{
              padding: '15px',
              backgroundColor: theme.palette.background.paper,
              boxShadow: '0px 0px 5px 5px rgb(0 0 0 / 10%)',
              borderRadius: '4px',
              display: 'grid',
              gap: '10px',
            }}
          >
            <Box className={classes.titleTop}>
              <Box display='flex' alignItems='center' flex='1 1 100%'>
                {onVolver && (
                  <Tooltip title='Volver'>
                    <IconButton onClick={onVolver} sx={{ mr: 1, color: 'text.primary' }}>
                      <ArrowBackIosIcon />
                    </IconButton>
                  </Tooltip>
                )}
                <Box>
                  <Typography className={classes.title} variant='h2' component='div'>
                    {titulo}
                  </Typography>
                  {subtitulo && (
                    <Typography variant='subtitle1' color='text.secondary'>
                      {subtitulo}
                    </Typography>
                  )}
                </Box>
              </Box>
              <Box className={classes.horizontalBottoms}>
                {urlAyuda && <HelpButton url={urlAyuda} />}
                <Tooltip title='Mostrar/Ocultar Columnas'>
                  <IconButton
                    sx={botonSx(theme.palette.colorFiltro)}
                    onClick={(e) => setPopoverTarget(e.currentTarget)}
                  >
                    <TuneIcon />
                  </IconButton>
                </Tooltip>
                {puede('Exportar') && (
                  <Tooltip title='Exportar a Excel'>
                    <span>
                      <IconButton sx={botonSx('#1D6F42')} onClick={exportar} disabled={exportando || total === 0}>
                        {exportando ? <CircularProgress size={22} color='inherit' /> : <FileDownloadIcon />}
                      </IconButton>
                    </span>
                  </Tooltip>
                )}
                {onCrear && puede('Crear') && (
                  <Tooltip title={`Crear ${entidadNombre}`}>
                    <IconButton sx={botonSx(theme.palette.primary.main)} onClick={onCrear}>
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </Box>
            {filtrosConfig.length > 0 && (
              <Box className={classes.contenedorFiltros}>
                {filtrosConfig.map((filtro) =>
                  filtro.type === 'date' ? (
                    // Mismo calendario (MUI, en español) que los formularios.
                    <DatePicker
                      key={filtro.name}
                      label={filtro.label}
                      format='DD/MM/YYYY'
                      value={filtros[filtro.name] ? dayjs(filtros[filtro.name]) : null}
                      onChange={(fecha) =>
                        onChangeFiltro({
                          target: { name: filtro.name, value: fecha && fecha.isValid() ? fecha.format('YYYY-MM-DD') : '' },
                        })
                      }
                      slotProps={{
                        textField: { variant: 'standard', fullWidth: true, sx: filtroSx, InputLabelProps: { shrink: true } },
                        openPickerButton: { size: 'small' },
                        actionBar: { actions: ['clear', 'today'] },
                      }}
                    />
                  ) : (
                  <TextField
                    key={filtro.name}
                    label={filtro.label}
                    name={filtro.name}
                    onChange={onChangeFiltro}
                    value={filtros[filtro.name]}
                    variant='standard'
                    select={filtro.type === 'select'}
                    fullWidth
                    sx={filtroSx}
                  >
                    {filtro.type === 'select' && [
                      <MenuItem key='__todos' value=''>
                        <em>Todos</em>
                      </MenuItem>,
                      ...(filtro.options || []).map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.nombre}
                        </MenuItem>
                      )),
                    ]}
                  </TextField>
                  ),
                )}
                <Box display='flex' mb={2}>
                  <Tooltip title='Limpiar Filtros'>
                    <IconButton sx={botonSx(theme.palette.primary.main)} onClick={limpiarFiltros}>
                      <ClearAllIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            )}
          </Toolbar>
        )}

        {loading && <LinearProgress sx={{ mt: 1 }} />}

        {hayPermisos && rows.length > 0 ? (
          <Box sx={{ background: theme.palette.background.paper }} className={classes.marcoTabla}>
            {paginacion}
            <TableContainer component={Paper}>
              <Table className={classes.table} size='small' aria-label='tabla'>
                <TableHead>
                  <StyledTableRow className={classes.head}>
                    <StyledTableCell
                      align='center'
                      style={{ fontWeight: 'bold' }}
                      className={classes.headCell}
                    >
                      Acciones
                    </StyledTableCell>
                    {cabeceras.map((cell) => (
                      <StyledTableCell
                        key={cell.id}
                        style={{ fontWeight: 'bold' }}
                        align={cell.typeHead === 'numeric' ? 'right' : 'left'}
                        className={classes.cell}
                        sortDirection={orderBy === cell.id ? order : false}
                      >
                        {paginado && cell.ordenable !== false ? (
                          <TableSortLabel
                            active={orderBy === cell.id}
                            direction={orderBy === cell.id ? order : 'asc'}
                            onClick={() => changeOrderBy(cell.id)}
                          >
                            {cell.label}
                          </TableSortLabel>
                        ) : (
                          cell.label
                        )}
                      </StyledTableCell>
                    ))}
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <StyledTableRow hover tabIndex={-1} key={row.id}>
                      <StyledTableCell align='center' className={classes.acciones}>
                        {onEditar && puede('Modificar') && (
                          <Tooltip title={<IntlMessages id='boton.editar' />}>
                            <EditIcon
                              onClick={() => onEditar(row)}
                              sx={iconoAccionSx(theme.palette.colorHovers, theme.palette.primary.main)}
                            />
                          </Tooltip>
                        )}
                        {onVer && puede('Listar') && (
                          <Tooltip title={<IntlMessages id='boton.ver' />}>
                            <VisibilityIcon
                              onClick={() => onVer(row)}
                              sx={iconoAccionSx(theme.palette.grayBottoms)}
                            />
                          </Tooltip>
                        )}
                        {accionesExtra
                          .filter(
                            (accion) =>
                              (!accion.permiso || puede(accion.permiso)) &&
                              (!accion.visible || accion.visible(row)),
                          )
                          .map(({ titulo: tituloAccion, icono: Icono, onClick, color }) => (
                            <Tooltip key={tituloAccion} title={tituloAccion}>
                              <Icono
                                onClick={() => onClick(row)}
                                sx={iconoAccionSx(color || theme.palette.primary.main)}
                              />
                            </Tooltip>
                          ))}
                        {onDelete && puede('Eliminar') && (!eliminable || eliminable(row)) && (
                          <Tooltip title={<IntlMessages id='boton.eliminar' />}>
                            <DeleteIcon
                              onClick={() => onDeleteRow(row)}
                              sx={iconoAccionSx(theme.palette.redBottoms)}
                            />
                          </Tooltip>
                        )}
                      </StyledTableCell>
                      {cabeceras.map((columna) => (
                        <MyCell
                          useStyles={useStyles}
                          key={row.id + columna.id}
                          align={columna.align}
                          width={columna.width}
                          claseBase={classes.cell}
                          value={columna.value(row[columna.id], row) ?? ''}
                          cellColor={columna.cellColor ? columna.cellColor(row[columna.id], row) : ''}
                        />
                      ))}
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {paginacion}
          </Box>
        ) : (
          !loading && (
            <Box
              component='h2'
              padding={4}
              fontSize={19}
              className={classes.marcoTabla}
              sx={{ background: theme.palette.background.paper }}
            >
              <IntlMessages id={hayPermisos ? 'sinResultados' : 'noAutorizado'} />
            </Box>
          )
        )}
      </Paper>

      <Popover
        open={Boolean(popoverTarget)}
        anchorEl={popoverTarget}
        onClose={() => setPopoverTarget(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Box sx={{ display: 'grid', padding: '10px', color: theme.palette.grayBottoms }}>
          {columnasMostradas.map((column) => (
            <FormControlLabel
              key={column.id}
              control={
                <Switch
                  id={column.id}
                  checked={column.mostrar}
                  onChange={handleOnchangeMostrarColumna}
                />
              }
              label={column.label}
            />
          ))}
          <Box>
            <Button onClick={showAllColumns}>Mostrar Todos</Button>
            <Button onClick={reiniciarColumns}>Reiniciar Vista</Button>
          </Box>
        </Box>
      </Popover>

      <AppMessageView
        variant={messageType === ERROR_TYPE ? 'error' : 'success'}
        message={
          [UPDATE_TYPE, CREATE_TYPE, ERROR_TYPE].includes(messageType) ? message : ''
        }
      />
    </div>
  );
};

AppCrudTable.propTypes = {
  // Clave del slice en el store (ej: 'destinos').
  stateKey: PropTypes.string.isRequired,
  onGetColeccion: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  cells: PropTypes.array.isRequired,
  titulo: PropTypes.string,
  subtitulo: PropTypes.node,
  urlAyuda: PropTypes.string,
  permisos: PropTypes.arrayOf(PropTypes.string).isRequired,
  entidadNombre: PropTypes.string,
  // [{ name, label, type: 'text' | 'select' | 'date', options: [{ id, nombre }] }]
  filtrosConfig: PropTypes.array,
  // Filtros que siempre se envían (ej: { curso_id }).
  filtrosFijos: PropTypes.object,
  // false para endpoints hijos que devuelven arreglo plano (sin paginación ni orden).
  paginado: PropTypes.bool,
  defaultOrderBy: PropTypes.string,
  // Cambiarlo fuerza recargar la colección (después de crear/editar).
  refreshKey: PropTypes.number,
  onCrear: PropTypes.func,
  onEditar: PropTypes.func,
  onVer: PropTypes.func,
  // [{ titulo, icono, onClick(row), permiso?, visible?(row), color? }]
  accionesExtra: PropTypes.array,
  // (row) => bool: si se muestra Eliminar en esa fila (por defecto en todas).
  eliminable: PropTypes.func,
  onVolver: PropTypes.func,
};

AppCrudTable.defaultProps = {
  titulo: '',
  urlAyuda: '',
  entidadNombre: '',
  filtrosConfig: [],
  filtrosFijos: {},
  paginado: true,
  defaultOrderBy: 'fecha_modificacion:desc',
  refreshKey: 0,
  accionesExtra: [],
};

export default AppCrudTable;

import React, {useState, useEffect} from 'react';
import {
  Box, 
  Button,
  lighten,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  FormControlLabel,
  Switch,
  Popover,
  TextField,
  MenuItem,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Pagination from '@material-ui/lab/Pagination';
import {
  Tune,
  ClearAll,
  LibraryAddCheck
} from '@material-ui/icons';
import SolicitudAccesoCreador from './SolicitudAccesoCreador';
import {
  onGetColeccion,
} from 'redux/actions/SolicitudAccesoAction';
import { onGetColeccionLigera as onGetClientes } from 'redux/actions/ClienteAction';
import {useDispatch, useSelector} from 'react-redux';
import IntlMessages from '@crema/utility/IntlMessages';
import Swal from 'sweetalert2';
import {
  UPDATE_TYPE,
  CREATE_TYPE,
  DELETE_TYPE,
} from 'shared/constants/Constantes';
import {MessageView} from '@crema';
import {useDebounce} from 'shared/hooks/useDebounce';
import moment from 'moment';
import MyCell from 'shared/components/MyCell';
import { ESTADOS_SOLICITUD_ACCESO } from 'shared/constants/ListaValores';
import HelpButton from 'shared/components/HelpButton';

const cells = [
  {
    id: 'usuario',
    typeHead: 'string',
    label: 'Usuario',
    value: (value) => value,
    align: 'left',
    mostrarInicio: true,
  },
  {
    id: 'estado_acceso',
    typeHead: 'string',
    label: 'Estado Acceso',
    value: (value) => ESTADOS_SOLICITUD_ACCESO.map((state) => state.id === value ? state.nombre : ''),
    align: 'left',
    mostrarInicio: true,
  },
  {
    id: 'fecha_solicitud',
    typeHead: 'string',
    label: 'Fecha Solicitud',
    value: (value) => moment(value).format('YYYY-MM-DD HH:mm:ss'),
    align: 'left',
    mostrarInicio: true,
  },
  {
    id: 'fecha_expiracion',
    typeHead: 'string',
    label: 'Fecha Expiración',
    value: (value) => value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : '',
    align: 'left',
    mostrarInicio: true,
  },
  {
    id: 'usuario_modificacion_usuario',
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
    value: (value) => moment(value).format('YYYY-MM-DD HH:mm:ss'),
    align: 'left',
    width: '180px',
    mostrarInicio: false,
  },
  {
    id: 'usuario_creacion_usuario',
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
    value: (value) => moment(value).format('YYYY-MM-DD HH:mm:ss'),
    align: 'left',
    width: '180px',
    mostrarInicio: false,
  },
];

function EnhancedTableHead(props) {
  const {classes, order, orderBy, onRequestSort, columnasMostradas} = props;

  return (
    <TableHead>
      <TableRow className={classes.head}>
        <TableCell
          align='center'
          style={{fontWeight: 'bold'}}
          className={classes.headCell}>
          {'Acciones'}
        </TableCell>
        {columnasMostradas.map((cell) => {
          if (cell.mostrar) {
            return (
              <TableCell
                key={cell.id}
                style={{fontWeight: 'bold'}}
                align={
                  cell.typeHead === 'string'
                    ? 'left'
                    : cell.typeHead === 'numeric'
                    ? 'right'
                    : 'center'
                }
                className={classes.cell}
                sortDirection={orderBy === cell.id ? order : false}>
                <TableSortLabel
                  active={orderBy === cell.id}
                  direction={orderBy === cell.id ? order : 'asc'}
                  // onClick={createSortHandler(cell.id)}
                  onClick={() => {
                    onRequestSort(cell.id);
                  }}>
                  {cell.label}
                  {orderBy === cell.id ? (
                    <span className={classes.visuallyHidden}>
                      {order === 'desc'
                        ? 'sorted descending'
                        : 'sorted ascending'}
                    </span>
                  ) : null}
                </TableSortLabel>
              </TableCell>
            );
          } else {
            return <th key={cell.id}></th>;
          }
        })}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  columnasMostradas: PropTypes.array.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    padding: '15px',
    backgroundColor: 'white',
    boxShadow: '0px 0px 5px 5px rgb(0 0 0 / 10%)',
    borderRadius: '4px',
    display: 'grid',
    // gap: '20px',
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    boxShadow:
      '0px 3px 5px -1px rgb(0 0 0 / 30%), 0px 6px 10px 0px rgb(0 0 0 / 20%), 0px 1px 18px 0px rgb(0 0 0 / 16%)',
    '&:hover': {
      backgroundColor: theme.palette.colorHover,
      cursor: 'pointer',
    },
  },
  clearButton: {
    backgroundColor: 'gray',
    color: 'white',
    boxShadow:
      '0px 3px 5px -1px rgb(0 0 0 / 30%), 0px 6px 10px 0px rgb(0 0 0 / 20%), 0px 1px 18px 0px rgb(0 0 0 / 16%)',
    '&:hover': {
      backgroundColor: theme.palette.colorHover,
      cursor: 'pointer',
    },
  },
  horizontalBottoms: {
    width: 'min-content',
    display: 'flex',
    gap: '5px',
  },
  titleTop: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  columnFilterButton: {
    backgroundColor: theme.palette.secondary.main,
    color: 'white',
    boxShadow:
      '0px 3px 5px -1px rgb(0 0 0 / 30%), 0px 6px 10px 0px rgb(0 0 0 / 20%), 0px 1px 18px 0px rgb(0 0 0 / 16%)',
    '&:hover': {
      backgroundColor: theme.palette.colorHover,
      cursor: 'pointer',
    },
  },
  contenedorFiltros: {
    width: '90%',
    display: 'grid',
    gridTemplateColumns: '3fr 3fr 3fr 1fr',
    gap: '20px',
  },
  pairFilters: {
    display: 'flex',
    justifyContent: 'flex-start',
    gap: '20px',
    minWidth: '100px',
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const {
    titulo,
    handleOpenPopoverColumns,
    queryFilter,
    usuario,
    limpiarFiltros,
    cliente,
    clientes,
    user,
    estado,
    url
  } = props;
  return (
    <Toolbar
      className={clsx(classes.root)}>
        <>
          <Box className={classes.titleTop}>
            <Typography
              className={classes.title}
              variant='h6'
              id='tableTitle'
              component='div'>
              {titulo}
            </Typography>
            <Box className={classes.horizontalBottoms}>
              <HelpButton url={url} />
              <Tooltip
                title='Mostrar/Ocultar Columnas'
                onClick={handleOpenPopoverColumns}>
                <IconButton
                  className={classes.columnFilterButton}
                  aria-label='filter list'>
                  <Tune />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <Box className={classes.contenedorFiltros}>
            { user?.rol?.tipo === 'IN' && (
              <TextField
                label='Cliente'
                name='cliente'
                id='cliente'
                onChange={queryFilter}
                value={cliente}
                select
                className={classes.inputFiltros}
              >
                {clientes.map((cus) => {
                  return (
                    <MenuItem
                      value={cus.id}
                      key={cus.id}
                      id={cus.id}
                      className={classes.pointer}>
                      {cus.nombre}
                    </MenuItem>
                  );
                })}
              </TextField>
            )}
            <TextField
              label='Nombre Usuario'
              name='usuario'
              id='usuario'
              onChange={queryFilter}
              value={usuario}
              className={classes.inputFiltros}
            />
            <TextField
                label='Estado Solicitud'
                name='estado'
                id='estado'
                onChange={queryFilter}
                value={estado}
                select
                className={classes.inputFiltros}
              >
                {ESTADOS_SOLICITUD_ACCESO.map((estado) => {
                  return (
                    <MenuItem
                      value={estado.id}
                      key={estado.id}
                      id={estado.id}
                      className={classes.pointer}>
                      {estado.nombre}
                    </MenuItem>
                  );
                })}
              </TextField>
            <Box display='grid'>
              <Box display='flex' mb={2}>
                <Tooltip title='Limpiar Filtros' onClick={limpiarFiltros}>
                  <IconButton
                    className={classes.clearButton}
                    aria-label='filter list'>
                    <ClearAll />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Box>
        </>
    </Toolbar>
  );
};

const useStyles = makeStyles((theme) => ({
  marcoTabla: {
    backgroundColor: 'white',
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
    borderTop: '2px solid #dee2e6',
    borderBottom: '2px solid #dee2e6',
    // display:'grid',
    // gridTemplateColumns:gridTemplate,
  },
  headCell: {
    padding: '0px 0px 0px 15px',
  },
  row: {
    // display:'grid',
    // gridTemplateColumns:gridTemplate,
    padding: 'none',
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
  }),
  acciones: (props) => ({
    padding: props.vp + ' 0px ' + props.vp + ' 15px',
    minWidth: '100px',
  }),
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
    boxShadow: 'none',
    backgroundColor: 'transparent',
  },
  table: {
    minWidth: '100%',
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  generalIcons: {
    '&:hover': {
      color: theme.palette.colorHover,
      cursor: 'pointer',
    },
  },
  editIcon: {
    color: theme.palette.primary.main,
  },
  visivilityIcon: {
    color: theme.palette.grayBottoms,
  },
  deleteIcon: {
    color: theme.palette.redBottoms,
  },
  popoverColumns: {
    display: 'grid',
    padding: '10px',
    color: theme.palette.grayBottoms,
  },
  paginacion: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '10px',
    paddingBottom: '5px',
  },
  rowsPerPageOptions: {
    marginRight: '10px',
  },
}));

const initialFilters = {
  usuario: '',
  estado: '',
  cliente: ''
}

let hUrl = '';

const SolicitudAcceso = (props) => {
  let columnasMostradasInicial = [];
  cells.forEach((cell) => {
    columnasMostradasInicial.push({
      id: cell.id,
      mostrar: cell.mostrarInicio,
      typeHead: cell.typeHead,
      label: cell.label,
      value: cell.value,
      align: cell.align,
      width: cell.width,
      cellColor: cell.cellColor,
    });
  });
  const [showForm, setShowForm] = useState(false);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('');
  const [orderByToSend, setOrderByToSend] = React.useState(
    'fecha_modificacion:desc',
  );
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [accion, setAccion] = useState('ver');
  const [permisos, setPermisos] = useState('');
  const [titulo, setTitulo] = useState('');
  const [showTable, setShowTable] = useState(true);
  const [filters, setFilters] = useState(initialFilters);
  const {
    usuario,
    estado,
    cliente
  } = filters;
  const [openPopOver, setOpenPopOver] = useState(false);
  const [popoverTarget, setPopoverTarget] = useState(null);
  const [columnasMostradas, setColumnasMostradas] = useState(columnasMostradasInicial);
  const [solicitudAccesoSeleccionada, setSolicitudAccesoSeleccionada] = useState(0);

  const {rows, desde, hasta, ultima_pagina, total} = useSelector(
    ({solicitudAccesoReducer}) => solicitudAccesoReducer,
  );
  const {message, error, messageType} = useSelector(({common}) => common);
  const clientes = useSelector(({clienteReducer}) => clienteReducer.ligera);
  const {user} = useSelector(({auth}) => auth);

  const debouncedName = useDebounce(usuario, 800);
  const classes = useStyles({vp: '0px'});
  const dispatch = useDispatch();

  const rowsPerPageOptions = [5, 10, 15, 25, 50];
  const textoPaginacion = `Mostrando de ${desde} a ${hasta} de ${total} resultados - Página ${page} de ${ultima_pagina}`;
  
  
  useEffect(() => {
    if (message) {
      if (messageType === DELETE_TYPE) {
        Swal.fire('Eliminada', message, 'success');
        updateColeccion();
      }
    }
  }, [message, error]); // eslint-disable-line react-hooks/exhaustive-deps
    
  useEffect(() => {
    if (rows.length === 0) {
      setShowTable(false);
    } else {
      setShowTable(true);
    }
  }, [rows]);

  useEffect(() => {
    user &&
      user.permisos.forEach((modulo) => {
        modulo.opciones.forEach((opcion) => {
          if (opcion.url === props.route.path) {
            setTitulo(opcion.nombre);
            hUrl = opcion.url_ayuda;
            const permisoAux = [];
            opcion.permisos.forEach((permiso) => {
              if (permiso.permitido) {
                permisoAux.push(permiso.titulo);
              }
            });
            setPermisos(permisoAux);
          }
        });
      });
    if(user?.rol?.tipo === 'IN'){
      dispatch(onGetClientes());
      setFilters({
        ...filters,
        cliente: user.asociado.id
      })
    }
  }, [user, props.route]); // eslint-disable-line

  useEffect(() => {
    dispatch(onGetColeccion(page, rowsPerPage, orderByToSend, usuario, estado, cliente));
  }, [dispatch, page, rowsPerPage, debouncedName, estado, cliente, orderByToSend, showForm]); //eslint-disable-line

  useEffect(() => {
    setPage(1);
  }, [debouncedName, orderByToSend, cliente, estado]);

  const queryFilter = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    })
  }

  const limpiarFiltros = () => {
    setFilters(initialFilters);
  };

  const updateColeccion = () => {
    setPage(1);
    dispatch(onGetColeccion({page, rowsPerPage, orderByToSend, usuario, estado, cliente}));
  };

  const changeOrderBy = (id) => {
    if (orderBy === id) {
      if (order === 'asc') {
        setOrder('desc');
        setOrderByToSend(id + ':desc');
      } else {
        setOrder('asc');
        setOrderByToSend(id + ':asc');
      }
    } else {
      setOrder('asc');
      setOrderBy(id);
      setOrderByToSend(id + ':asc');
    }
  };

  const onOpenEditSolicitudAcceso = (id) => {
    setSolicitudAccesoSeleccionada(id);
    setAccion('editar');
    setShowForm(true);
  };

  const handleClosePopover = () => {
    setOpenPopOver(false);
    setPopoverTarget(null);
  };

  const handleOpenPopoverColumns = (e) => {
    setPopoverTarget(e.currentTarget);
    setOpenPopOver(true);
  };

  const handleOnchangeMostrarColumna = (e) => {
    let aux = columnasMostradas;
    setColumnasMostradas(
      aux.map((column) => {
        if (column.id === e.target.id) {
          return {...column, mostrar: !column.mostrar};
        } else {
          return column;
        }
      }),
    );
  };

  const showAllColumns = () => {
    let aux = columnasMostradas;
    setColumnasMostradas(
      aux.map((column) => {
        return {...column, mostrar: true};
      }),
    );
  };

  const reiniciarColumns = () => {
    setColumnasMostradas(columnasMostradasInicial);
  };

  const onOpenAddSolicitudAcceso = () => {
    setSolicitudAccesoSeleccionada(0);
    setAccion('crear');
    setShowForm(true);
  };

  const handleOnClose = () => {
    setShowForm(false);
    setSolicitudAccesoSeleccionada(0);
    setAccion('ver');
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        {permisos && (
          <EnhancedTableToolbar
            onOpenAddSolicitudAcceso={onOpenAddSolicitudAcceso}
            handleOpenPopoverColumns={handleOpenPopoverColumns}
            queryFilter={queryFilter}
            limpiarFiltros={limpiarFiltros}
            usuario={usuario}
            permisos={permisos}
            titulo={titulo}
            cliente={cliente}
            estado={estado}
            clientes={clientes}
            user={user}
            url={hUrl}
          />
        )}
        {showTable && permisos ? (
          <Box className={classes.marcoTabla}>
            <Box className={classes.paginacion}>
              <Box>
                <p>{textoPaginacion}</p>
              </Box>
              <Box className={classes.paginacion}>
                <select
                  className={classes.rowsPerPageOptions}
                  value={rowsPerPage}
                  onChange={handleChangeRowsPerPage}>
                  {rowsPerPageOptions.map((option) => {
                    return (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    );
                  })}
                </select>
                <Pagination
                  showFirstButton
                  showLastButton
                  onChange={handleChangePage}
                  count={ultima_pagina}
                  page={page}
                />
              </Box>
            </Box>

            <TableContainer>
              <Table
                className={classes.table}
                aria-labelledby='tableTitle'
                size={'small'}
                aria-label='enhanced table'>
                <EnhancedTableHead
                  classes={classes}
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={changeOrderBy}
                  rowCount={rows.length}
                  columnasMostradas={columnasMostradas}
                />
                <TableBody>
                  {
                    rows.map((row, index) => {
                      return (
                        <TableRow
                          hover
                          tabIndex={-1}
                          key={row.id}
                          className={classes.row}>

                          <TableCell
                            align='center'
                            className={classes.acciones}>
                            {permisos.indexOf('Modificar') >= 0 && (
                              <Tooltip
                                title={'Gestionar'}>
                                <LibraryAddCheck
                                  onClick={() =>
                                    onOpenEditSolicitudAcceso(row.id)
                                  }
                                  className={`${classes.generalIcons} ${classes.editIcon}`}/>
                              </Tooltip>
                            )}
                            {/* {permisos.indexOf('Listar') >= 0 && (
                              <Tooltip title={<IntlMessages id='boton.ver' />}>
                                <Visibility
                                  onClick={() =>
                                    onOpenViewSolicitudAcceso(row.id)
                                  }
                                  className={`${classes.generalIcons} ${classes.visivilityIcon}`}></Visibility>
                              </Tooltip>
                            )}
                            {permisos.indexOf('Eliminar') >= 0 && (
                              <Tooltip
                                title={<IntlMessages id='boton.eliminar' />}>
                                <Delete
                                  onClick={() =>
                                    onDeleteSolicitudAcceso(row.id)
                                  }
                                  className={`${classes.generalIcons} ${classes.deleteIcon}`}></Delete>
                              </Tooltip>
                            )} */}
                          </TableCell>

                          {columnasMostradas.map((columna) => {
                            if (columna.mostrar) {
                              return (
                                <MyCell
                                  useStyles={useStyles}
                                  key={row.id + columna.id}
                                  align={columna.align}
                                  width={columna.width}
                                  claseBase={classes.cell}
                                  value={columna.value(row[columna.id])}
                                  cellColor={
                                    columna.cellColor
                                      ? columna.cellColor(row[columna.id])
                                      : ''
                                  }
                                  popover={columna.id === 'valor_parametro'}
                                />
                              );
                            } else {
                              return <th key={row.id + columna.id}></th>;
                            }
                          })}
                        </TableRow>
                      );
                    })
                  }
                </TableBody>
              </Table>
            </TableContainer>

            <Box className={classes.paginacion}>
              <Box>
                <p>{textoPaginacion}</p>
              </Box>
              <Box className={classes.paginacion}>
                <select
                  className={classes.rowsPerPageOptions}
                  value={rowsPerPage}
                  onChange={handleChangeRowsPerPage}>
                  {rowsPerPageOptions.map((option) => {
                    return (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    );
                  })}
                </select>
                <Pagination
                  showFirstButton
                  showLastButton
                  onChange={handleChangePage}
                  count={ultima_pagina}
                  page={page}
                />
              </Box>
            </Box>
          </Box>
        ) : permisos ? (
          <Box
            component='h2'
            padding={4}
            fontSize={19}
            className={classes.marcoTabla}>
            <IntlMessages id='sinResultados' />
          </Box>
        ) : (
          <Box
            component='h2'
            padding={4}
            fontSize={19}
            className={classes.marcoTabla}>
            <IntlMessages id='noAutorizado' />
          </Box>
        )}
      </Paper>

      {showForm ? (
        <SolicitudAccesoCreador
          showForm={showForm}
          solicitudAcceso={solicitudAccesoSeleccionada}
          accion={accion}
          handleOnClose={handleOnClose}
          updateColeccion={updateColeccion}
          titulo={titulo}
          user={user}
          clientes={clientes}
        />
      ) : (
        ''
      )}

      <Popover
        id='popoverColumns'
        open={openPopOver}
        anchorEl={popoverTarget}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}>
        <Box className={classes.popoverColumns}>
          {columnasMostradas.map((column) => {
            return (
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
            );
          })}
          <Box>
            <Button onClick={showAllColumns}>Mostrar Todos</Button>
            <Button onClick={reiniciarColumns}>Reiniciar Vista</Button>
          </Box>
        </Box>
      </Popover>
      <MessageView
        variant={messageType === UPDATE_TYPE || messageType === CREATE_TYPE? 'success': 'error'}
        message={message||error}
      />
    </div>
  );
};

export default SolicitudAcceso;

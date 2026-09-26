import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { Input } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {
  onGetPermisos,
  onOtorgarPermiso,
  onRevocarPermiso,
} from '../../../@crema/redux/features/rol/rolesSlice';
import { onGetColeccionLigera as onGetColeccionLigeraModulo } from '../../../@crema/redux/features/modulo/moduloSlice';
import { onGetColeccionLigera as onGetColeccionLigeraOpcion } from '../../../@crema/redux/features/opcionSistema/opcionSistemaSlice';
import { useDispatch, useSelector } from 'react-redux';
import IntlMessages from '../../../@crema/helpers/IntlMessages';
import TextField from '@mui/material/TextField';
import { useParams } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const EnhancedTableToolbar = ({
  numSelected,
  moduloFiltro,
  opcionFiltro,
  limpiarFiltros,
  queryFilter,
  modulos,
  opcionesSistema,
  theme,
}) => {
  
  return (
    <Toolbar
      sx={{
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[2],
        justifyContent: 'normal',
        padding: '15px',
        borderRadius: '4px',
        display: 'grid',
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color='inherit'
          variant='subtitle1'
          component='div'
        >
          {numSelected} selected
        </Typography>
      ) : (
        <>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
            }}
          >
            <Typography
              sx={{ flex: '1 1 100%' }}
              variant='h2'
              id='tableTitle'
              component='div'
            >
              <IntlMessages id='seguridad.permisos' />
            </Typography>
          </Box>
          <Box
            sx={{
              width: '90%',
              display: 'grid',
              gridTemplateColumns: '4fr 4fr 1fr',
              gap: '20px',
            }}
          >
            <TextField
              label='Módulo'
              name='moduloFiltro'
              id='moduloFiltro'
              select
              onChange={queryFilter}
              value={moduloFiltro}
              variant='standard'
              // variant='filled'
              fullWidth
              SelectProps={{
                IconComponent: ArrowDropDownIcon,
                native: false,
                MenuProps: {
                  PaperProps: {
                    sx: {
                      maxHeight: 250,
                    },
                  },
                },
              }}
              InputProps={{
                inputComponent: Input,
                disableUnderline: false,
              }}
              sx={{                
                '& .MuiInput-underline:before': {
                  borderBottomColor: '#ccc',
                  marginBottom: -0.5,
                },
                '& .MuiInput-underline:hover:before': {
                  borderBottomColor: theme.palette.text.primary,
                },
                '& .MuiInput-underline:after': {
                  borderBottomColor: theme.palette.text.primary,
                },
                '& .MuiSelect-icon': {
                  color: theme.palette.text.primary,
                },
              }}
            >
              {modulos.map((modulo) => (
                <MenuItem value={modulo.id} key={modulo.id}>
                  {modulo.nombre}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label='Opción del Sistema'
              name='opcionFiltro'
              id='opcionFiltro'
              select
              onChange={queryFilter}
              value={opcionFiltro}
              variant="standard"
              fullWidth
              SelectProps={{
                IconComponent: ArrowDropDownIcon,
                native: false,
                MenuProps: {
                  PaperProps: {
                    sx: {
                      maxHeight: 250,
                    },
                  },
                },
              }}
              InputProps={{
                inputComponent: Input,
                disableUnderline: false,
              }}
              sx={{                
                '& .MuiInput-underline:before': {
                  borderBottomColor: '#ccc',
                  marginBottom: -0.5,
                },
                '& .MuiInput-underline:hover:before': {
                  borderBottomColor: theme.palette.text.primary,
                },
                '& .MuiInput-underline:after': {
                  borderBottomColor: theme.palette.text.primary,
                },
                '& .MuiSelect-icon': {
                  color: theme.palette.text.primary,
                },
              }}
            >
              {opcionesSistema.map((opcion) => (
                <MenuItem value={opcion.id} key={opcion.id}>
                  {opcion.nombre}
                </MenuItem>
              ))}
            </TextField>
            <Box display='grid'>
              <Box display='flex' mb={2}>
                <Tooltip title='Limpiar Filtros' onClick={limpiarFiltros}>
                  <IconButton
                    aria-label='filter list'
                    sx={{
                      backgroundColor: theme.palette.colorHovers,
                      color: 'white',
                      boxShadow:
                        '0px 3px 5px -1px rgb(0 0 0 / 30%), 0px 6px 10px 0px rgb(0 0 0 / 20%), 0px 1px 18px 0px rgb(0 0 0 / 16%)',
                      '&:hover': {
                        backgroundColor: theme.palette.colorHovers,
                        cursor: 'pointer',
                      },
                    }}
                  >
                    <ClearAllIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Box>
        </>
      )}

      {numSelected > 0 ? (
        <Tooltip title='Delete'>
          <IconButton aria-label='delete'>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : null}
    </Toolbar>
  );
};

const Permissions = () => {
  const theme = useTheme();
  const { rol_id } = useParams();
  const [moduloFiltro, setModuloFiltro] = useState('');
  const [opcionFiltro, setOpcionFiltro] = useState('');

  const { permisos: rows } = useSelector((state) => state.roles);
  const { coleccionLigera: modulos } = useSelector((state) => state.modulos);
  const { coleccionLigera: opcionesSistema } = useSelector((state) => state.opcionSistema);

  const dispatch = useDispatch();

  const modulosAux = rows && Array.isArray(rows) ? rows.map((modulo) => {
    const opcionesAux = modulo.opciones && Array.isArray(modulo.opciones) ? modulo.opciones.map((opcion) => ({
      nombre: opcion.nombre,
      permisos: opcion.permisos.map((permiso) => ({
        ...permiso,
        permitido: !!permiso.permitido,
      })),
      mostrar: true,
      id: opcion.id,
    })) : [];
    
    return {
      nombre: modulo.nombre,
      opciones: opcionesAux,
      id: modulo.id,
      mostrar: true,
    };
  }) : [];


  const [showModulos, setShowModulos] = useState([]);

  // Actualiza 'showModulos' cuando 'modulosAux' cambia
  useEffect(() => {
    setShowModulos(modulosAux);
  }, [modulosAux]);

  useEffect(() => {    
    dispatch(onGetColeccionLigeraModulo());
  }, [dispatch, rol_id]);

  useEffect(() => {
    if (moduloFiltro) {
      dispatch(onGetColeccionLigeraOpcion(moduloFiltro));      
    }
    updateColeccion();
  }, [dispatch, moduloFiltro]);

  useEffect(() => {
    updateColeccion();
  }, [dispatch, opcionFiltro]);

  const updateColeccion = () => {
    dispatch(onGetPermisos({id:rol_id, modulo: moduloFiltro, opcionSistema: opcionFiltro}));
  };

  const queryFilter = (e) => {
    if (e.target.name === 'moduloFiltro') {
      setModuloFiltro(e.target.value);
    } else if (e.target.name === 'opcionFiltro') {
      setOpcionFiltro(e.target.value);
    }
  };
  
  const limpiarFiltros = () => {
    setModuloFiltro('');
    setOpcionFiltro('');
    updateColeccion();
  };

  const handleMostrarModulo = (id) => {
    setShowModulos((prevModulos) =>
      prevModulos.map((modulo) =>
        modulo.id === id ? { ...modulo, mostrar: !modulo.mostrar } : modulo
      )
    );
  };

  const handleMostrarOpcion = (id) => {
    setShowModulos((prevModulos) =>
      prevModulos.map((modulo) => ({
        ...modulo,
        opciones: modulo.opciones.map((opcion) =>
          opcion.id === id ? { ...opcion, mostrar: !opcion.mostrar } : opcion
        ),
      }))
    );
  };

  const togglePermission = (opcionId, permisoId, permitido) => {
    setShowModulos((prevModulos) =>
      prevModulos.map((modulo) => ({
        ...modulo,
        opciones: modulo.opciones.map((opcion) =>
          opcion.id === opcionId
            ? {
                ...opcion,
                permisos: opcion.permisos.map((permiso) =>
                  permiso.id === permisoId
                    ? { ...permiso, permitido }
                    : permiso
                ),
              }
            : opcion
        ),
      }))
    );
  };
  
  
  

  return (
    <div sx={{ width: '100%', padding: '20px' }}>
      <Paper
        sx={{
          width: '100%',
          marginBottom: theme.spacing(2),
          boxShadow: 'none',
          backgroundColor: 'transparent',
        }}
      >
        <EnhancedTableToolbar
          numSelected={0}
          queryFilter={queryFilter}
          limpiarFiltros={limpiarFiltros}
          opcionFiltro={opcionFiltro}
          moduloFiltro={moduloFiltro}
          modulos={modulos}
          opcionesSistema={opcionesSistema}
          theme={theme}
        />

        {showModulos.length > 0 ? (
          <Box
            sx={{
              backgroundColor: theme.palette.background.paper,
              boxShadow: '0px 0px 5px 5px rgb(0 0 0 / 10%)',
              borderRadius: '4px',
              padding: '15px',
              marginTop: '5px',
            }}
          >
            {showModulos.map((modulo, key) => (
              <div key={key}>
                <Box
                  component='h2'
                  fontWeight='500'
                  borderBottom='1px #ddd solid'
                  display='flex'
                  justifyContent='space-between'
                  alignItems='center'
                  marginTop='10px'
                  onClick={() => handleMostrarModulo(modulo.id)}
                >
                  {modulo.nombre}
                  {modulo.mostrar ? (
                    <KeyboardArrowDownIcon />
                  ) : (
                    <KeyboardArrowLeftIcon />
                  )}
                </Box>
                {modulo.mostrar && (
                  <Box>
                    {modulo.opciones.map((opcion) => (
                      <Box
                        borderBottom='1px #ddd solid'
                        marginLeft='10px'
                        py='10px'
                        key={opcion.id}
                      >
                        <Box
                          component='h4'
                          fontWeight='300'
                          display='flex'
                          alignItems='center'
                          onClick={() => handleMostrarOpcion(opcion.id)}
                        >
                          {opcion.mostrar ? (
                            <KeyboardArrowDownIcon />
                          ) : (
                            <KeyboardArrowRightIcon />
                          )}
                          {opcion.nombre}
                        </Box>
                        {opcion.mostrar && (
                          <Box
                            display='grid'
                            gridTemplateColumns='repeat(4,1fr)'
                            mx='20px'
                            gap='20px'
                            py='10px'
                          >
                            {opcion.permisos.map((permiso) => (
                              <Box
                                key={`${opcion.id}-${permiso.id}`}
                                component='h4'
                                fontWeight='300'
                                display='flex'
                                alignItems='center'
                              >
                                <Checkbox
                                  checked={Boolean(permiso.permitido)}
                                  onChange={(event) => {
                                    const permitido = event.target.checked;
                                    // togglePermission(opcion.id, permiso.id, permitido);
                                    if (permitido) {
                                      dispatch(onOtorgarPermiso({ params: { rol_id, permission_id: permiso.id } }));
                                    } else {
                                      dispatch(onRevocarPermiso({ params: { rol_id, permission_id: permiso.id } }));
                                    }
                                  }}
                                />
                                {permiso.nombre}
                              </Box>
                            ))}
                          </Box>
                        )}
                      </Box>
                    ))}
                  </Box>
                )}
              </div>
            ))}
          </Box>
        ) : (
          <Box
            component='h2'
            padding={4}
            fontSize={19}
            sx={{
              backgroundColor: theme.palette.background.paper,
              boxShadow: '0px 0px 5px 5px rgb(0 0 0 / 10%)',
              borderRadius: '4px',
              paddingLeft: '15px',
              paddingRight: '15px',
              paddingTop: '15px',
              paddingBottom: '15px',
              marginTop: '5px',
            }}
            display='flex'
            justifyContent='space-between'
          >
            <IntlMessages sx={{
              backgroundColor: theme.palette.background.paper,
              boxShadow: '0px 0px 5px 5px rgb(0 0 0 / 10%)',
              borderRadius: '4px',
              paddingLeft: '15px',
              paddingRight: '15px',
              paddingTop: '15px',
              paddingBottom: '15px',
              marginTop: '5px',
            }}
            id='sinResultados' />
          </Box>
        )}
      </Paper>
    </div>
  );
};

export default Permissions;


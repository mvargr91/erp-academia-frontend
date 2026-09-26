// src/@crema/redux/helpers/createCrudSlice.jsx
// Fábrica de slices CRUD para los recursos del backend que siguen el contrato estándar:
//   GET    /recurso            -> paginado { datos, desde, hasta, ultima_pagina, total } o arreglo plano
//   GET    /recurso?ligera=1   -> arreglo { id, nombre, ... }
//   GET    /recurso/{id}
//   POST   /recurso            -> { datos, mensajes: [texto, tipo] }
//   PUT    /recurso/{id}       -> { datos, mensajes: [texto, tipo] }
//   DELETE /recurso/{id}       -> { mensajes: [texto, tipo] }
//   PUT    /recurso/{id}/{accion} (acciones extra: estado, verificar, leida...)
// Si los params traen un archivo (File/Blob) se envían como multipart; al modificar se usa
// POST con _method=PUT porque PHP no lee multipart en PUT.
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import jwtAxios from '../../services/auth/jwt-auth';
import { showMessage } from '../features/cammon/commonSlice';
import { ERROR_TYPE } from '../../../shared/constants/Constantes';
import { aFormData, tieneArchivo } from '../../../shared/functions/Archivos';

const MENSAJE_ERROR = 'Ocurrió un error';
const MULTIPART = { headers: { 'Content-Type': 'multipart/form-data' } };

const limpiarParams = (params = {}) =>
  Object.fromEntries(
    Object.entries(params).filter(
      ([, valor]) => valor !== undefined && valor !== null && valor !== '',
    ),
  );

export const extraerMensajeError = (error) => {
  if (error?.response?.status === 429) {
    return 'Demasiados intentos. Espera un minuto e inténtalo de nuevo.';
  }
  const mensajes = error?.response?.data?.mensajes;
  if (Array.isArray(mensajes) && mensajes.length > 0) {
    return mensajes[0];
  }
  return error?.message || MENSAJE_ERROR;
};

const ejecutarCallbacks = (...callbacks) => {
  callbacks.forEach((callback) => {
    if (typeof callback === 'function') {
      callback();
    }
  });
};

const normalizarColeccion = (data) => {
  if (Array.isArray(data)) {
    return {
      datos: data,
      desde: data.length ? 1 : 0,
      hasta: data.length,
      ultima_pagina: 1,
      total: data.length,
    };
  }
  const { datos = [], desde = 0, hasta = 0, ultima_pagina = 1, total = 0 } = data ?? {};
  return { datos, desde: desde ?? 0, hasta: hasta ?? 0, ultima_pagina, total };
};

/**
 * @param {object} config
 * @param {string} config.name      Nombre del slice (clave en el store).
 * @param {string} config.endpoint  Prefijo de la ruta en la API (sin /v1/).
 * @param {object} [config.acciones] Acciones PUT extra: { onCambiarEstado: 'estado', onVerificar: 'verificar' }
 */
export const createCrudSlice = ({ name, endpoint, acciones = {} }) => {
  const onGetColeccion = createAsyncThunk(
    `${name}/onGetColeccion`,
    async ({ page, rowsPerPage, orderByToSend, filtros } = {}, thunkAPI) => {
      try {
        const response = await jwtAxios.get(endpoint, {
          params: limpiarParams({
            page: page || 1,
            limite: rowsPerPage,
            ordenar_por: orderByToSend,
            ...filtros,
          }),
        });
        return normalizarColeccion(response.data);
      } catch (error) {
        return thunkAPI.rejectWithValue(extraerMensajeError(error));
      }
    },
  );

  const onGetColeccionLigera = createAsyncThunk(
    `${name}/onGetColeccionLigera`,
    async (filtros = {}, thunkAPI) => {
      try {
        const response = await jwtAxios.get(endpoint, {
          params: limpiarParams({ ligera: 1, ...filtros }),
        });
        return response.data;
      } catch (error) {
        return thunkAPI.rejectWithValue(extraerMensajeError(error));
      }
    },
  );

  const onShow = createAsyncThunk(`${name}/onShow`, async (id, thunkAPI) => {
    try {
      const response = await jwtAxios.get(`${endpoint}/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(extraerMensajeError(error));
    }
  });

  const onCreate = createAsyncThunk(
    `${name}/onCreate`,
    async ({ params, handleOnClose, updateColeccion }, thunkAPI) => {
      try {
        const response = tieneArchivo(params)
          ? await jwtAxios.post(endpoint, aFormData(params), MULTIPART)
          : await jwtAxios.post(endpoint, params);
        ejecutarCallbacks(handleOnClose, updateColeccion);
        thunkAPI.dispatch(showMessage(response.data.mensajes));
        return response.data.datos;
      } catch (error) {
        const mensajeError = extraerMensajeError(error);
        thunkAPI.dispatch(showMessage([mensajeError, ERROR_TYPE]));
        return thunkAPI.rejectWithValue(mensajeError);
      }
    },
  );

  const onUpdate = createAsyncThunk(
    `${name}/onUpdate`,
    async ({ params, handleOnClose, updateColeccion }, thunkAPI) => {
      try {
        const response = tieneArchivo(params)
          ? await jwtAxios.post(`${endpoint}/${params.id}`, aFormData({ ...params, _method: 'PUT' }), MULTIPART)
          : await jwtAxios.put(`${endpoint}/${params.id}`, params);
        ejecutarCallbacks(handleOnClose, updateColeccion);
        thunkAPI.dispatch(showMessage(response.data.mensajes));
        return response.data.datos;
      } catch (error) {
        const mensajeError = extraerMensajeError(error);
        thunkAPI.dispatch(showMessage([mensajeError, ERROR_TYPE]));
        return thunkAPI.rejectWithValue(mensajeError);
      }
    },
  );

  // La confirmación visual (Swal) la maneja el componente con unwrap(),
  // así no depende del mensaje global compartido por todas las pantallas.
  const onDelete = createAsyncThunk(
    `${name}/onDelete`,
    async ({ id, updateColeccion }, thunkAPI) => {
      try {
        const response = await jwtAxios.delete(`${endpoint}/${id}`);
        ejecutarCallbacks(updateColeccion);
        return { id, mensaje: response.data.mensajes?.[0] };
      } catch (error) {
        return thunkAPI.rejectWithValue(extraerMensajeError(error));
      }
    },
  );

  const accionesThunks = Object.fromEntries(
    Object.entries(acciones).map(([thunkName, sufijo]) => [
      thunkName,
      createAsyncThunk(
        `${name}/${thunkName}`,
        async ({ params, handleOnClose, updateColeccion }, thunkAPI) => {
          try {
            const response = await jwtAxios.put(
              `${endpoint}/${params.id}/${sufijo}`,
              params,
            );
            ejecutarCallbacks(handleOnClose, updateColeccion);
            thunkAPI.dispatch(showMessage(response.data.mensajes));
            return response.data.datos;
          } catch (error) {
            const mensajeError = extraerMensajeError(error);
            thunkAPI.dispatch(showMessage([mensajeError, ERROR_TYPE]));
            return thunkAPI.rejectWithValue(mensajeError);
          }
        },
      ),
    ]),
  );

  const initialState = {
    rows: [],
    desde: 0,
    hasta: 0,
    ultima_pagina: 1,
    total: 0,
    coleccionLigera: [],
    actual: null,
    loading: false,
    loadingActual: false,
    saving: false,
    error: null,
  };

  const slice = createSlice({
    name,
    initialState,
    reducers: {
      resetError(state) {
        state.error = null;
      },
      resetActual(state) {
        state.actual = null;
      },
      resetColeccion(state) {
        state.rows = initialState.rows;
        state.desde = 0;
        state.hasta = 0;
        state.ultima_pagina = 1;
        state.total = 0;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(onGetColeccion.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(onGetColeccion.fulfilled, (state, action) => {
          state.loading = false;
          state.rows = action.payload.datos;
          state.desde = action.payload.desde;
          state.hasta = action.payload.hasta;
          state.ultima_pagina = action.payload.ultima_pagina;
          state.total = action.payload.total;
        })
        .addCase(onGetColeccion.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

        .addCase(onGetColeccionLigera.fulfilled, (state, action) => {
          state.coleccionLigera = action.payload;
        })
        .addCase(onGetColeccionLigera.rejected, (state, action) => {
          state.error = action.payload;
        })

        .addCase(onShow.pending, (state) => {
          state.loadingActual = true;
          state.error = null;
        })
        .addCase(onShow.fulfilled, (state, action) => {
          state.loadingActual = false;
          state.actual = action.payload;
        })
        .addCase(onShow.rejected, (state, action) => {
          state.loadingActual = false;
          state.error = action.payload;
        })

        .addCase(onDelete.fulfilled, (state) => {
          state.saving = false;
          state.actual = null;
        });

      // Crear, modificar y acciones extra comparten el mismo ciclo de guardado.
      [onCreate, onUpdate, ...Object.values(accionesThunks)].forEach((thunk) => {
        builder
          .addCase(thunk.pending, (state) => {
            state.saving = true;
            state.error = null;
          })
          .addCase(thunk.fulfilled, (state, action) => {
            state.saving = false;
            state.actual = action.payload ?? state.actual;
          })
          .addCase(thunk.rejected, (state, action) => {
            state.saving = false;
            state.error = action.payload;
          });
      });

      builder
        .addCase(onDelete.pending, (state) => {
          state.saving = true;
          state.error = null;
        })
        .addCase(onDelete.rejected, (state, action) => {
          state.saving = false;
          state.error = action.payload;
        });
    },
  });

  return {
    slice,
    thunks: {
      onGetColeccion,
      onGetColeccionLigera,
      onShow,
      onCreate,
      onUpdate,
      onDelete,
      ...accionesThunks,
    },
  };
};

export default createCrudSlice;

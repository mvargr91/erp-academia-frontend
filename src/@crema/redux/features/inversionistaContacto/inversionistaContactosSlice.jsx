// src/redux/features/inversionistas-contactos/inversionistas-contactosSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import jwtAxios from '../../../services/auth/jwt-auth';
import { showMessage, hideMessage} from '../cammon/commonSlice';

// Estado inicial
const initialState = {
  rows: [],
  desde: 0,
  hasta: 0,
  ultima_pagina: 1,
  total: 0,
  coleccionLigera: [],
  inversionistaContactoActual: null,
  loading: false,
  error: null,
  message: null,
};

// Acciones asíncronas (Thunks)
export const onGetColeccion = createAsyncThunk(
    'inversionistasContactos/onGetColeccion',
    async ({currentPage,rowsPerPage,inversionista_id,orderByToSend}, thunkAPI) => {
      try {
        const page = currentPage ? currentPage : 0;
        const inversionistaAux = inversionista_id ? inversionista_id : '';
        const ordenar_por = orderByToSend ? orderByToSend : '';
        const response = await jwtAxios.get('inversionistas-contactos/' + inversionistaAux, {
          params: {
            page: page,
            limite: rowsPerPage,
            ordenar_por: ordenar_por,
          },
        });
        // Supón que la estructura de la respuesta es como se espera
        const { datos, desde, hasta, ultima_pagina, total } = response.data;  
        return { datos, desde, hasta, ultima_pagina, total };
      } catch (error) {
        console.error("Error en onGetColeccion:", error);
        dispatch(fetchSuccess());
        return thunkAPI.rejectWithValue(messages['message.somethingWentWrong'] || error.message);
      }
    }
  );
  
 

export const onGetColeccionLigera = createAsyncThunk(
  'inversionistasContactos/onGetColeccionLigera',
  async (inversionista_id, thunkAPI) => {
    try {
      const response = await jwtAxios.get('inversionistas-contactos/'+inversionista_id, {
        params: { ligera: true },

      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(messages['message.somethingWentWrong'] || error.message);
    }
  }
);

export const onShow = createAsyncThunk(
  'inversionistasContactos/onShow',
  async ({inversionista,InversionistaContacto}, thunkAPI) => {
    try {
      const response = await jwtAxios.get(`inversionistas-contactos/${inversionista}/${InversionistaContacto}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(messages['message.somethingWentWrong'] || error.message);
    }
  }
);

export const onUpdate = createAsyncThunk(
  'inversionistasContactos/onUpdate',
  async ({ params, handleOnClose, updateColeccion }, thunkAPI) => {
    try {
      const response = await jwtAxios.put(`inversionistas-contactos/${params.id}`, params);

      // Cierra el formulario y actualiza la colección

      if (handleOnClose && typeof handleOnClose === 'function') {
        handleOnClose();
      }

      if (updateColeccion && typeof updateColeccion === 'function') {
        updateColeccion();
      }

      // Despacha el mensaje de éxito
      thunkAPI.dispatch(showMessage([response.data.mensajes[0], response.data.mensajes[1]]));
      return response.data.datos;
    } catch (error) {
      // Extrae el mensaje de error del backend si está disponible
      const mensajeError =
        error?.response?.data?.mensajes?.[0] ??
        error?.message ??
        'Ocurrió un error';
      thunkAPI.dispatch(showMessage([mensajeError, 4]));
      // ¡Muy importante devolver rejectWithValue!
      return thunkAPI.rejectWithValue(mensajeError);
    }
  }
);


export const onDelete = createAsyncThunk(
  'inversionistasContactos/onDelete',
  async ({ id , updateColeccion}, thunkAPI) => {
    try {
      const response = await jwtAxios.delete(`inversionistas-contactos/${id}`);
      const mensaje = response.data.mensajes[0];
      const tipoMensaje = response.data.mensajes[1];

      thunkAPI.dispatch(showMessage([mensaje, tipoMensaje]));
      updateColeccion();
      setTimeout(() => {
        thunkAPI.dispatch(hideMessage([mensaje, tipoMensaje]));
      }, 3000);

      return response.data;
    } catch (error) {
      const mensajeError = error.response?.data?.mensajes[0] || "Ocurrió un error al eliminar.";
      thunkAPI.dispatch(showMessage([mensajeError, 4]));
      return thunkAPI.rejectWithValue(mensajeError);
    }
  }
);


export const onCreate = createAsyncThunk(
  'inversionistasContactos/onCreate',
  async ({ params, handleOnClose, updateColeccion }, thunkAPI) => {
    try {
      const response = await jwtAxios.post('inversionistas-contactos', params);

      // Solo si salió bien:
      if (handleOnClose) handleOnClose();
      if (updateColeccion) updateColeccion();

      const mensaje = response.data?.mensajes?.[0] ?? 'Operación exitosa';
      const tipoMensaje = response.data?.mensajes?.[1] ?? 2;
      thunkAPI.dispatch(showMessage([mensaje, tipoMensaje]));

      return response.data.datos;
    } catch (error) {
      const mensajeError =
        error?.response?.data?.mensajes?.[0] ??
        error?.message ??
        'Ocurrió un error';
      thunkAPI.dispatch(showMessage([mensajeError, 4]));
      // ¡Muy importante devolver rejectWithValue!
      return thunkAPI.rejectWithValue(mensajeError);
    }
  }
);

// Slice de inversionistas-contactos
const inversionistaContactosSlice = createSlice({
  name: 'inversionistasContactos',
  initialState,
  reducers: {
    resetError(state) {
      state.error = null;
    },
    resetInversionistaContactoActual(state) {
      state.inversionistaContactoActual = null;
    },
    resetMessage(state) {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Obtener colección de inversionistas-contactos
      .addCase(onGetColeccion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onGetColeccion.fulfilled, (state, action) => {
        state;
        state.loading = false;
        state.rows = action.payload.datos ; 
        state.desde = action.payload.desde ;
        state.hasta = action.payload.hasta;
        state.ultima_pagina = action.payload.ultima_pagina ;
        state.total = action.payload.total;
      })
      .addCase(onGetColeccion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Obtener colección ligera de inversionistas-contactos
      .addCase(onGetColeccionLigera.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onGetColeccionLigera.fulfilled, (state, action) => {
        state.loading = false;
        state.coleccionLigera = action.payload;
      })
      .addCase(onGetColeccionLigera.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Mostrar un inversionistaContacto
      .addCase(onShow.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onShow.fulfilled, (state, action) => {
        state.loading = false;
        state.inversionistaContactoActual = action.payload;
      })
      .addCase(onShow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Actualizar un inversionistaContacto
      .addCase(onUpdate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onUpdate.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.inversionistaContactoActual = action.payload;
      })
      .addCase(onUpdate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Eliminar un inversionistaContacto
      .addCase(onDelete.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onDelete.fulfilled, (state, action) => {
        state.loading = false;
        state.inversionistaContactoActual = action.payload;
        state.message = null;
      })
      .addCase(onDelete.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Crear un inversionistaContacto
      .addCase(onCreate.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(onCreate.fulfilled, (state, action) => {
        state.loading = false;
        state.inversionistaContactoActual = action.payload; 
        state.message = action.payload.mensajes ?? action.payload.mensajes[0];
      })
      .addCase(onCreate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = action.payload.mensajes ?? action.payload.mensajes[0];
      })
     
  },
});

// Exportar acciones y reducer
export const { resetError, resetInversionistaContactoActual, resetMessage } = inversionistaContactosSlice.actions;
export default inversionistaContactosSlice.reducer;

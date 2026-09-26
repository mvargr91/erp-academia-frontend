// src/redux/features/inversionistas-contactos-legales/inversionistas-contactos-legalesSlice.js
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
  consultaDocumento: [],    
  inversionistaContactoLegalActual: null,
  loading: false,
  error: null,
  message: null,
};

// Acciones asíncronas (Thunks)
export const onGetColeccion = createAsyncThunk(
    'inversionistasContactosLegales/onGetColeccion',
    async ({currentPage,rowsPerPage,inversionista_id,orderByToSend}, thunkAPI) => {
      try {
        const page = currentPage ? currentPage : 0;
        const inversionistaAux = inversionista_id ? inversionista_id : '';
        const ordenar_por = orderByToSend ? orderByToSend : '';
        const response = await jwtAxios.get('inversionistas-contactos-legales/' + inversionistaAux, {
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
  'inversionistasContactosLegales/onGetColeccionLigera',
  async (inversionista_id, thunkAPI) => {
    try {
      const response = await jwtAxios.get('inversionistas-contactos-legales/'+inversionista_id, {
        params: { ligera: true },

      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(messages['message.somethingWentWrong'] || error.message);
    }
  }
);

export const onShow = createAsyncThunk(
  'inversionistasContactosLegales/onShow',
  async ({inversionista,InversionistaContactoLegal}, thunkAPI) => {
    try {
      const response = await jwtAxios.get(`inversionistas-contactos-legales/${inversionista}/${InversionistaContactoLegal}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(messages['message.somethingWentWrong'] || error.message);
    }
  }
);

export const obtenerContactoLegalDocumento = createAsyncThunk(
  'inversionistasContactosLegales/obtenerContactoLegalDocumento',
  async ({numero_documento}, thunkAPI) => {
    let documentoAux = numero_documento ? numero_documento : ''
    try {
      const response = await jwtAxios.get('inversionistas-contactos-legales/contacto', {
        params: {
           doc: true,
           numero_documento: documentoAux,
          },

      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(messages['message.somethingWentWrong'] || error.message);
    }
  }
);

export const onUpdate = createAsyncThunk(
  'inversionistasContactosLegales/onUpdate',
  async ({ params, handleOnClose, updateColeccion }, thunkAPI) => {
    try {
      const response = await jwtAxios.put(`inversionistas-contactos-legales/${params.id}`, params);

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
  'inversionistasContactosLegales/onDelete',
  async ({ id , updateColeccion}, thunkAPI) => {
    try {
      const response = await jwtAxios.delete(`inversionistas-contactos-legales/${id}`);
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
  'inversionistasContactosLegales/onCreate',
  async ({ params, handleOnClose, updateColeccion }, thunkAPI) => {
    try {
      const response = await jwtAxios.post('inversionistas-contactos-legales', params);

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

// Slice de inversionistas-contactos-legales
const inversionistaContactosLegalesSlice = createSlice({
  name: 'inversionistasContactosLegales',
  initialState,
  reducers: {
    resetError(state) {
      state.error = null;
    },
    resetInversionistaContactoLegalActual(state) {
      state.inversionistaContactoLegalActual = null;
    },
    resetMessage(state) {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Obtener colección de inversionistas-contactos-legales
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

      // Obtener colección ligera de inversionistas-contactos-legales
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

      //  obtener Contacto Legal Documento
      .addCase(obtenerContactoLegalDocumento.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(obtenerContactoLegalDocumento.fulfilled, (state, action) => {
        state.loading = false;
        state.consultaDocumento = action.payload;
      })
      .addCase(obtenerContactoLegalDocumento.rejected, (state, action) => {
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
        state.inversionistaContactoLegalActual = action.payload;
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
        state.inversionistaContactoLegalActual = action.payload;
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
        state.inversionistaContactoLegalActual = action.payload;
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
        state.inversionistaContactoLegalActual = action.payload; 
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
export const { resetError, resetInversionistaContactoLegalActual, resetMessage } = inversionistaContactosLegalesSlice.actions;
export default inversionistaContactosLegalesSlice.reducer;

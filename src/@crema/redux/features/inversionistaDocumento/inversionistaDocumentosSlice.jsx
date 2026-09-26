// src/redux/features/inversionistas-documentos/inversionistas-documentosSlice.js
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
  inversionistaDocumentoActual: null,
  loading: false,
  error: null,
  message: null,
};

// Acciones asíncronas (Thunks)
export const onGetColeccion = createAsyncThunk(
    'inversionistasDocumentos/onGetColeccion',
    async ({currentPage,rowsPerPage,nombre,orderByToSend}, thunkAPI) => {
      try {
        const page = currentPage ? currentPage : 0;
        const nombreAux = nombre ? nombre : '';
        const ordenar_por = orderByToSend ? orderByToSend : '';
        const response = await jwtAxios.get('inversionistas-documentos', {
          params: {
            page: page,
            limite: rowsPerPage,
            nombre: nombreAux,
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
  
export const onGetColeccionTipo = createAsyncThunk(
  'inversionistasDocumentos/onGetColeccionTipo',
  async ({currentPage,rowsPerPage,nombreFiltro, tipoLista, inversionista_id, orderByToSend}, thunkAPI) => {
    try {
      const page = currentPage ? currentPage : 0;
      const nombreAux = nombreFiltro ? nombreFiltro : '';
      const tipoListaAux = tipoLista ? tipoLista : '';
      const ordenar_por = orderByToSend ? orderByToSend : '';
      const response = await jwtAxios.get('inversionistas-documentos', {
        params: {
          page: page,
          limite: rowsPerPage,
          nombre: nombreAux,
          ordenar_por: ordenar_por,
          tipo_lista:tipoListaAux,
          id_inversionista:inversionista_id,
          tipo: true,
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
  'inversionistasDocumentos/onGetColeccionLigera',
  async (_, thunkAPI) => {
    try {
      const response = await jwtAxios.get('inversionistas-documentos', {
        params: { ligera: true },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(messages['message.somethingWentWrong'] || error.message);
    }
  }
);

export const onShow = createAsyncThunk(
  'inversionistasDocumentos/onShow',
  async (id, thunkAPI) => {
    try {
      const response = await jwtAxios.get(`inversionistas-documentos/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(messages['message.somethingWentWrong'] || error.message);
    }
  }
);

export const onUpdate = createAsyncThunk(
  'inversionistasDocumentos/onUpdate',
  async ({ params, updateColeccion }, thunkAPI) => {
    try {
      const response = await jwtAxios.put(`inversionistas-documentos`, params);

      if (updateColeccion && typeof updateColeccion === 'function') {
        updateColeccion();
      }

      // Despacha el mensaje de éxito
      thunkAPI.dispatch(showMessage([response.data.mensajes[0], response.data.mensajes[1]]));
      return response.data.datos;
    } catch (error) {
      // Extrae el mensaje de error del backend si está disponible
      const mensajeError = error.response?.data?.mensajes[0] || "Ocurrió un error";
      thunkAPI.dispatch(showMessage([mensajeError, 4]));

      return thunkAPI.rejectWithValue(mensajeError);
    }
  }
);


export const onDelete = createAsyncThunk(
  'inversionistasDocumentos/onDelete',
  async ({ id , inversionista_id, updateColeccion}, thunkAPI) => {
    try {
      console.log(id);
      const response = await jwtAxios.delete(`inversionistas-documentos/${id}/${inversionista_id}`);
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
  'inversionistasDocumentos/onCreate',
  async ({ params, handleOnClose, updateColeccion }, thunkAPI) => {
    try {
      const response = await jwtAxios.post('inversionistas-documentos', params);
      handleOnClose();
      updateColeccion();

      const mensaje = response.data.mensajes[0];
      const tipoMensaje = response.data.mensajes[1];

      thunkAPI.dispatch(showMessage([mensaje, tipoMensaje]));
      return response.data.datos;
    } catch (error) {
      const mensajeError = error.response?.data?.mensajes[0] || "Ocurrió un error";
      thunkAPI.dispatch(showMessage([mensajeError, 4]));
      return thunkAPI.rejectWithValue(mensajeError);
    }
  }
);

export const onUploadDocumento = createAsyncThunk(
  "inversionistasDocumentos/uploadDocumento",
  async ({formData}, thunkAPI) => {
    try {
      const response = await jwtAxios.post("/inversionistas-documentos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      // Muestra un mensaje de éxito si la carga fue correcta
      thunkAPI.dispatch(showMessage(["Documento subido correctamente.", 2]));
      
      return response.data;
    } catch (error) {
      const mensajeError = error.response?.data?.message || "No se pudo subir el documento.";
      thunkAPI.dispatch(showMessage([mensajeError, 4]));
      return thunkAPI.rejectWithValue(mensajeError);
    }
  }
);


// Slice de inversionistas-documentos
const inversionistaDocumentosSlice = createSlice({
  name: 'inversionistas-documentos',
  initialState,
  reducers: {
    resetError(state) {
      state.error = null;
    },
    resetInversionistaDocumentoActual(state) {
      state.inversionistaDocumentoActual = null;
    },
    resetMessage(state) {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Obtener colección de inversionistas-documentos
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

      // Obtener colección de inversionistas-documentos por tipo de lista
      .addCase(onGetColeccionTipo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onGetColeccionTipo.fulfilled, (state, action) => {
        state;
        state.loading = false;
        state.rows = action.payload.datos ; 
        state.desde = action.payload.desde ;
        state.hasta = action.payload.hasta;
        state.ultima_pagina = action.payload.ultima_pagina ;
        state.total = action.payload.total;
      })
      .addCase(onGetColeccionTipo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Obtener colección ligera de inversionistas-documentos
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

      // Mostrar un inversionistaDocumento
      .addCase(onShow.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onShow.fulfilled, (state, action) => {
        state.loading = false;
        state.inversionistaDocumentoActual = action.payload;
      })
      .addCase(onShow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Actualizar un inversionistaDocumento
      .addCase(onUpdate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onUpdate.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.inversionistaDocumentoActual = action.payload;
      })
      .addCase(onUpdate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Eliminar un inversionistaDocumento
      .addCase(onDelete.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onDelete.fulfilled, (state, action) => {
        state.loading = false;
        state.inversionistaDocumentoActual = action.payload;
        state.message = null;
      })
      .addCase(onDelete.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Crear un inversionistaDocumento
      .addCase(onCreate.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(onCreate.fulfilled, (state, action) => {
        state.loading = false;
        state.inversionistaDocumentoActual = action.payload; 
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
export const { resetError, resetInversionistaDocumentoActual, resetMessage } = inversionistaDocumentosSlice.actions;
export default inversionistaDocumentosSlice.reducer;

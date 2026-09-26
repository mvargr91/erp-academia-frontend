// src/redux/features/listas-documentos/listas-documentosSlice.js
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
  listaDocumentoActual: null,
  loading: false,
  error: null,
  message: null,
};

// Acciones asíncronas (Thunks)
export const onGetColeccion = createAsyncThunk(
    'listasDocumentos/onGetColeccion',
    async ({page, rowsPerPage, nombreFiltro, orderByToSend}, thunkAPI) => {
      try {
        page = page ? page : 0;
        const nombreAux = nombreFiltro ? nombreFiltro : '';
        const ordenar_por = orderByToSend ? orderByToSend : '';
        const response = await jwtAxios.get('listas-documentos', {
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
  'listasDocumentos/onGetColeccionTipo',
  async ({currentPage,rowsPerPage,nombreFiltro, tipoLista, compania_id, orderByToSend}, thunkAPI) => {
    try {
      const page = currentPage ? currentPage : 0;
      const nombreAux = nombreFiltro ? nombreFiltro : '';
      const tipoListaAux = tipoLista ? tipoLista : '';
      const ordenar_por = orderByToSend ? orderByToSend : '';
      const response = await jwtAxios.get('listas-documentos', {
        params: {
          page: page,
          limite: rowsPerPage,
          nombre: nombreAux,
          ordenar_por: ordenar_por,
          tipo: true,
          tipo_lista:tipoListaAux,
          id_compania:compania_id,
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
  'listasDocumentos/onGetColeccionLigera',
  async (_, thunkAPI) => {
    try {
      const response = await jwtAxios.get('listas-documentos', {
        params: { ligera: true },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(messages['message.somethingWentWrong'] || error.message);
    }
  }
);

export const onShow = createAsyncThunk(
  'listasDocumentos/onShow',
  async (id, thunkAPI) => {
    try {
      const response = await jwtAxios.get(`listas-documentos/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(messages['message.somethingWentWrong'] || error.message);
    }
  }
);

export const onUpdate = createAsyncThunk(
  'listasDocumentos/onUpdate',
  async ({ params, handleOnClose, updateColeccion }, thunkAPI) => {
    try {
      const response = await jwtAxios.put(`listas-documentos/${params.id}`, params);

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
      const mensajeError = error.response?.data?.mensajes[0] || "Ocurrió un error";
      thunkAPI.dispatch(showMessage([mensajeError, 4]));

      return thunkAPI.rejectWithValue(mensajeError);
    }
  }
);


export const onDelete = createAsyncThunk(
  'listasDocumentos/onDelete',
  async ({ id, updateColeccion }, thunkAPI) => {
    console.log(id)
    try {
      const response = await jwtAxios.delete(`listas-documentos/${id}`);
      updateColeccion();
      const mensaje = response.data.mensajes[0];
      const tipoMensaje = response.data.mensajes[1];

      thunkAPI.dispatch(showMessage([mensaje, tipoMensaje]));
      setTimeout(()=> {
        thunkAPI.dispatch(hideMessage([mensaje, tipoMensaje])); 
      }, 3000);
      return response.data;
    } catch (error) {
      const mensajeError = error.response?.data?.mensajes[0] || "Ocurrió un error";
      thunkAPI.dispatch(showMessage([mensajeError, 4]));
      return thunkAPI.rejectWithValue(mensajeError);
    }
  }
);

export const onCreate = createAsyncThunk(
  'listasDocumentos/onCreate',
  async ({ params, handleOnClose, updateColeccion }, thunkAPI) => {
    try {
      const response = await jwtAxios.post('listas-documentos', params);
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


// Slice de listas-documentos
const listaDocumentosSlice = createSlice({
  name: 'listas-documentos',
  initialState,
  reducers: {
    resetError(state) {
      state.error = null;
    },
    resetListaDocumentoActual(state) {
      state.listaDocumentoActual = null;
    },
    resetMessage(state) {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Obtener colección de listas-documentos
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

      // Obtener colección de listas-documentos por tipo de lista
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

      // Obtener colección ligera de listas-documentos
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

      // Mostrar un listaDocumento
      .addCase(onShow.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onShow.fulfilled, (state, action) => {
        state.loading = false;
        state.listaDocumentoActual = action.payload;
      })
      .addCase(onShow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Actualizar un listaDocumento
      .addCase(onUpdate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onUpdate.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.listaDocumentoActual = action.payload;
      })
      .addCase(onUpdate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Eliminar un listaDocumento
      .addCase(onDelete.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onDelete.fulfilled, (state, action) => {
        state.loading = false;
        state.listaDocumentoActual = action.payload;
        state.message = null;
      })
      .addCase(onDelete.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Crear un listaDocumento
      .addCase(onCreate.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(onCreate.fulfilled, (state, action) => {
        state.loading = false;
        state.listaDocumentoActual = action.payload; 
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
export const { resetError, resetListaDocumentoActual, resetMessage } = listaDocumentosSlice.actions;
export default listaDocumentosSlice.reducer;

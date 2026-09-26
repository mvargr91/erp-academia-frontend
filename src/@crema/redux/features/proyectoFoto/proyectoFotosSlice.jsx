// src/redux/features/proyectos-fotos/proyectos-fotosSlice.js
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
  proyectoDocumentoActual: null,
  loading: false,
  error: null,
  message: null,
};

// Acciones asíncronas (Thunks)
export const onGetColeccion = createAsyncThunk(
    'proyectosFotos/onGetColeccion',
    async ({page ,rowsPerPage, proyecto_id ,orderByToSend}, thunkAPI) => {
      try {
        const ordenar_por = orderByToSend ? orderByToSend : '';
        const response = await jwtAxios.get('proyectos-fotos', {
          params: {
            page: page,
            limite: rowsPerPage,
            id_proyecto:proyecto_id,
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
  'proyectosFotos/onGetColeccionLigera',
  async (_, thunkAPI) => {
    try {
      const response = await jwtAxios.get('proyectos-fotos', {
        params: { ligera: true },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(messages['message.somethingWentWrong'] || error.message);
    }
  }
);

export const onShow = createAsyncThunk(
  'proyectosFotos/onShow',
  async (id, thunkAPI) => {
    try {
      const response = await jwtAxios.get(`proyectos-fotos/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(messages['message.somethingWentWrong'] || error.message);
    }
  }
);

export const onUpdate = createAsyncThunk(
  'proyectosFotos/onUpdate',
  async ({ params, handleOnClose, updateColeccion }, thunkAPI) => {
    try {
      const response = await jwtAxios.put(`proyectos-fotos/${params.id}`, params);

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
  'proyectosFotos/onDelete',
  async ({ id , updateColeccion}, thunkAPI) => {
    try {
      const response = await jwtAxios.delete(`proyectos-fotos/${id}`);
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
  'proyectosFotos/onCreate',
  async ({ params, handleOnClose, updateColeccion }, thunkAPI) => {
    try {
      const response = await jwtAxios.post('proyectos-fotos', params);
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

export const onUploadFoto = createAsyncThunk(
  'proyectosFotos/onUploadFoto',
  async ({ formData, handleOnClose, updateColeccion }, thunkAPI) => {
    try {
      const response = await jwtAxios.post('proyectos-fotos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (handleOnClose && typeof handleOnClose === 'function') {
        handleOnClose();
      }

      if (updateColeccion && typeof updateColeccion === 'function') {
        updateColeccion();
      }

      const mensaje = response.data.mensajes[0];
      const tipoMensaje = response.data.mensajes[1];

      thunkAPI.dispatch(showMessage([mensaje, tipoMensaje]));
      return response.data.datos;
    } catch (error) {
      const mensajeError =
        error.response?.data?.mensajes?.[0] || 'No se pudo subir la foto.';
      thunkAPI.dispatch(showMessage([mensajeError, 4]));
      return thunkAPI.rejectWithValue(mensajeError);
    }
  }
);


// Slice de proyectos-fotos
const proyectoFotosSlice = createSlice({
  name: 'proyectos-fotos',
  initialState,
  reducers: {
    resetError(state) {
      state.error = null;
    },
    resetProyectoDocumentoActual(state) {
      state.proyectoDocumentoActual = null;
    },
    resetMessage(state) {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Obtener colección de proyectos-fotos
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

      // Obtener colección ligera de proyectos-fotos
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

      // Mostrar un proyectoDocumento
      .addCase(onShow.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onShow.fulfilled, (state, action) => {
        state.loading = false;
        state.proyectoDocumentoActual = action.payload;
      })
      .addCase(onShow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Actualizar un proyectoDocumento
      .addCase(onUpdate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onUpdate.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.proyectoDocumentoActual = action.payload;
      })
      .addCase(onUpdate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Eliminar un proyectoDocumento
      .addCase(onDelete.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onDelete.fulfilled, (state, action) => {
        state.loading = false;
        state.proyectoDocumentoActual = action.payload;
        state.message = null;
      })
      .addCase(onDelete.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Crear un proyectoDocumento
      .addCase(onCreate.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(onCreate.fulfilled, (state, action) => {
        state.loading = false;
        state.proyectoDocumentoActual = action.payload; 
        state.message = action.payload.mensajes ?? action.payload.mensajes[0];
      })
      .addCase(onCreate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = action.payload.mensajes ?? action.payload.mensajes[0];
      })

      // Crear un onUploadFoto
      .addCase(onUploadFoto.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(onUploadFoto.fulfilled, (state, action) => {
        state.loading = false;
        state.proyectoDocumentoActual = action.payload; 
        state.message = action.payload.mensajes ?? action.payload.mensajes[0];
      })
      .addCase(onUploadFoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = action.payload.mensajes ?? action.payload.mensajes[0];
      })
     
  },
});

// Exportar acciones y reducer
export const { resetError, resetProyectoDocumentoActual, resetMessage } = proyectoFotosSlice.actions;
export default proyectoFotosSlice.reducer;

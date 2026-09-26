// src/redux/features/parametroConstantes/parametroConstantesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import jwtAxios from '../../../services/auth/jwt-auth';
import { showMessage, hideMessage } from '../cammon/commonSlice';

// Estado inicial
const initialState = {
  rows: [],
  desde: 0,
  hasta: 0,
  ultima_pagina: 1,
  total: 0,
  coleccionLigera: [],
  parametroConstanteActual: null,
  loading: false,
  error: null,
  message: null,
};

// Acciones asíncronas (Thunks)
export const onGetColeccion = createAsyncThunk(
    'parametroConstantes/onGetColeccion',
    async ({page, rowsPerPage, nombreFiltro, orderByToSend}, thunkAPI) => {
      try {
        console.log(nombreFiltro);
        const nombreAux = nombreFiltro ? nombreFiltro : '';
        const ordenar_por = orderByToSend ? orderByToSend : '';
        const response = await jwtAxios.get('parametros-constantes',
          {
            params: {
              page: page,
              limite: rowsPerPage,
              codigo_parametro: nombreAux,
              ordenar_por: ordenar_por,
            },
          }
        );
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
  'parametroConstantes/onGetColeccionLigera',
  async (_, thunkAPI) => {
    try {
      const response = await jwtAxios.get('parametros-constantes', {
        params: { ligera: true },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(messages['message.somethingWentWrong'] || error.message);
    }
  }
);

export const onShow = createAsyncThunk(
  'parametroConstantes/onShow',
  async (id, thunkAPI) => {
    try {
      const response = await jwtAxios.get(`parametros-constantes/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(messages['message.somethingWentWrong'] || error.message);
    }
  }
);

export const onUpdate = createAsyncThunk(
  'parametroConstantes/onUpdate',
  async ({ params, handleOnClose, updateColeccion }, thunkAPI) => {
    try {
      const response = await jwtAxios.put(`parametros-constantes/${params.id}`, params);

      // Cierra el formulario y actualiza la colección
      handleOnClose();
      updateColeccion();

      // Extrae el mensaje de la respuesta y despáchalo
      const mensaje = response.data.mensajes[0]; // "El parametroConstante ha sido modificado."
      const tipoMensaje = response.data.mensajes[1]; // 1 (éxito)

      // Despacha showMessage con el mensaje y el tipo de mensaje
      thunkAPI.dispatch(showMessage([mensaje, tipoMensaje]));
      thunkAPI.dispatch(resetMessage()); // limpia el mensaje después de despacharlo
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
  'parametroConstantes/onDelete',
  async ({ id, updateColeccion }, thunkAPI) => {
    console.log(id)
    try {
      const response = await jwtAxios.delete(`parametros-constantes/${id}`);
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
  'parametroConstantes/onCreate',
  async ({ params, handleOnClose, updateColeccion }, thunkAPI) => {
    try {
      const response = await jwtAxios.post('parametros-constantes', params);
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

// Slice de parametroConstantes
const parametroConstantesSlice = createSlice({
  name: 'parametroConstantes',
  initialState,
  reducers: {
    resetError(state) {
      state.error = null;
    },
    resetParametroConstanteActual(state) {
      state.parametroConstanteActual = null;
    },
    resetMessage(state) {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Obtener colección de parametroConstantes
      .addCase(onGetColeccion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onGetColeccion.fulfilled, (state, action) => {
        state;
        state.loading = false;
        state.rows= action.payload.datos; 
        state.desde = action.payload.desde;
        state.hasta = action.payload.hasta;
        state.ultima_pagina = action.payload.ultima_pagina ;
        state.total = action.payload.total;
      })
      .addCase(onGetColeccion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Obtener colección ligera de parametroConstantes
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

      // Mostrar un parametroConstante
      .addCase(onShow.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onShow.fulfilled, (state, action) => {
        state.loading = false;
        state.parametroConstanteActual = action.payload;
      })
      .addCase(onShow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Actualizar un parametroConstante
      .addCase(onUpdate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onUpdate.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.parametroConstanteActual = action.payload;
      })
      .addCase(onUpdate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Eliminar un parametroConstante
      .addCase(onDelete.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onDelete.fulfilled, (state, action) => {
        state.loading = false;
        state.parametroConstanteActual = action.payload;
      })
      .addCase(onDelete.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Crear un parametroConstante
      .addCase(onCreate.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(onCreate.fulfilled, (state, action) => {
        state.loading = false;
        state.parametroConstanteActual = action.datos;
        state.message = action.payload[0];
      })
      .addCase(onCreate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = action.payload[0];
      });
  },
});

// Exportar acciones y reducer
export const { resetError, resetParametroConstanteActual, resetMessage } = parametroConstantesSlice.actions;
export default parametroConstantesSlice.reducer;

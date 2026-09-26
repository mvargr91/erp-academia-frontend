// src/redux/features/inversiones/inversionesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import jwtAxios from '../../../services/auth/jwt-auth';
import { showMessage, hideMessage} from '../cammon/commonSlice';
import {
  UPDATE_TYPE,
  CREATE_TYPE,
  DELETE_TYPE,
} from '../../../../shared/constants/Constantes';

// Estado inicial
const initialState = {
  rows: [],
  desde: 0,
  hasta: 0,
  ultima_pagina: 1,
  total: 0,
  coleccionLigera: [],
  InversionActual: null,
  loading: false,
};

// Acciones asíncronas (Thunks)
export const onGetColeccion = createAsyncThunk(
    'inversiones/onGetColeccion',
    async ({page, rowsPerPage, nombreFiltro, estadoFiltro, fechaDesdeFiltro, fechaHastaFiltro, orderByToSend}, thunkAPI) => {
      try {
        const nombreAux = nombreFiltro ? nombreFiltro : '';
        const estadoAux = estadoFiltro ? estadoFiltro : '';
        const fechaDesdeAux = fechaDesdeFiltro ? fechaDesdeFiltro : '';
        const fechaHastaAux = fechaHastaFiltro ? fechaHastaFiltro : '';
        const ordenar_por = orderByToSend ? orderByToSend : '';
        const response = await jwtAxios.get('inversiones', {
          params: {
            page: page,
            limite: rowsPerPage,
            nombre: nombreAux,
            estado_inversion: estadoAux,
            fechaInicial: fechaDesdeAux,
            fechaFinal: fechaHastaAux,
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
  'inversiones/onGetColeccionLigera',
  async (_, thunkAPI) => {
    try {
      const response = await jwtAxios.get('inversiones', {
        params: { ligera: true },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(messages['message.somethingWentWrong'] || error.message);
    }
  }
);

export const onShow = createAsyncThunk(
  'inversiones/onShow',
  async (id, thunkAPI) => {
    try {
      const response = await jwtAxios.get(`inversiones/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(messages['message.somethingWentWrong'] || error.message);
    }
  }
);

export const onUpdate = createAsyncThunk(
  'inversiones/onUpdate',
  async ({ data, handleOnClose }, thunkAPI) => {
    try {
      const response = await jwtAxios.put(`inversiones/${data.id}`, data);
      const mensaje = response.data.mensajes[0];
      const tipoMensaje = response.data.mensajes[1];
      thunkAPI.dispatch(showMessage([mensaje, tipoMensaje]));
      setTimeout(()=> {
        thunkAPI.dispatch(hideMessage([mensaje, tipoMensaje])); 
        handleOnClose();
      }, 3000);
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
  'inversiones/onDelete',
  async ({ id, updateColeccion }, thunkAPI) => {
    try {
      const response = await jwtAxios.put(`inversiones/anular/${id}`);
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
  'inversiones/onCreate',
  async ({ params, handleOnClose }, thunkAPI) => {
    try {
      const response = await jwtAxios.post('inversiones', params);
      
      const mensaje = response.data.mensajes[0];
      const tipoMensaje = response.data.mensajes[1];
      thunkAPI.dispatch(showMessage([mensaje, tipoMensaje]));
      setTimeout(()=> {
        thunkAPI.dispatch(hideMessage([mensaje, tipoMensaje])); 
        handleOnClose();
      }, 3000);
      return response.data.datos;
    } catch (error) {
      const mensajeError = error.response?.data?.mensajes[0] || "Ocurrió un error";
      thunkAPI.dispatch(showMessage([mensajeError, 4]));
      return thunkAPI.rejectWithValue(mensajeError);
    }
  }
);


// Slice de inversiones
const inversionesSlice = createSlice({
  name: 'inversiones',
  initialState,
  reducers: {
    
    resetInversionActual(state) {
      state.InversionActual = null;
    },
    
  },
  extraReducers: (builder) => {
    builder
      // Obtener colección de inversiones
      .addCase(onGetColeccion.pending, (state) => {
        state.loading = true;
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
      })

      // Obtener colección ligera de inversiones
      .addCase(onGetColeccionLigera.pending, (state) => {
        state.loading = true;
      })
      .addCase(onGetColeccionLigera.fulfilled, (state, action) => {
        state.loading = false;
        state.coleccionLigera = action.payload;
      })
      .addCase(onGetColeccionLigera.rejected, (state, action) => {
        state.loading = false;
      })

      // Mostrar un Inversion
      .addCase(onShow.pending, (state) => {
        state.loading = true;
      })
      .addCase(onShow.fulfilled, (state, action) => {
        state.loading = false;
        state.InversionActual = action.payload;
      })
      .addCase(onShow.rejected, (state, action) => {
        state.loading = false;
      })

      // Actualizar un Inversion
      .addCase(onUpdate.pending, (state) => {
        state.loading = true;
      })
      .addCase(onUpdate.fulfilled, (state, action) => {
        state.loading = false;
        state.InversionActual = action.payload;
      })
      .addCase(onUpdate.rejected, (state, action) => {
        state.loading = false;
      })

      // Eliminar un Inversion
      .addCase(onDelete.pending, (state) => {
        state.loading = true;
      })
      .addCase(onDelete.fulfilled, (state, action) => {
        state.loading = false;
        state.InversionActual = action.payload;
      })
      .addCase(onDelete.rejected, (state, action) => {
        state.loading = false;
      })

      // Crear un Inversion
      .addCase(onCreate.pending, (state) => {
        state.loading = true;
      })
      .addCase(onCreate.fulfilled, (state, action) => {
        state.loading = false;
        state.InversionActual = action.payload; 
      })
      .addCase(onCreate.rejected, (state, action) => {
        state.loading = false;
      })
     
  },
});

// Exportar acciones y reducer
export const {  resetInversionActual  } = inversionesSlice.actions;
export default inversionesSlice.reducer;

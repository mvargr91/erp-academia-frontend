// src/redux/features/actividades-proyectos/actividades-proyectosSlice.js
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
  ActividadProyectoActual: null,
  loading: false,
  error: null,
  message: null,
};

// Acciones asíncronas (Thunks)
export const onGetColeccion = createAsyncThunk(
    'actividadProyecto/onGetColeccion',
    async ({page, rowsPerPage, idTipoProyecto, idEtapaProyecto, orderByToSend}, thunkAPI) => {
      try {
        page = page ? page : 0;
        const etapaProyectoAux = idEtapaProyecto ? idEtapaProyecto : '';
        const tipoProyectoAux = idTipoProyecto ? idTipoProyecto : '';
        const ordenar_por = orderByToSend ? orderByToSend : '';
        const response = await jwtAxios.get('actividades-proyectos', {
          params: {
            page: page,
            limite: rowsPerPage,
            etapaProyecto: etapaProyectoAux,
            tipoProyecto: tipoProyectoAux,
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
  'actividadProyecto/onGetColeccionLigera',
  async (_, thunkAPI) => {
    try {
      const response = await jwtAxios.get('actividades-proyectos', {
        params: { ligera: true },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(messages['message.somethingWentWrong'] || error.message);
    }
  }
);

export const onGetColeccionLigeraXTipo = createAsyncThunk(
  'actividadProyecto/onGetColeccionLigeraXTipo',
  async ({id_tipo_proyecto}, thunkAPI) => {
    try {
      const response = await jwtAxios.get('actividades-proyectos' , {
        params: {
           tipo: true,
           tipoProyecto: id_tipo_proyecto,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(messages['message.somethingWentWrong'] || error.message);
    }
  }
);

export const onShow = createAsyncThunk(
  'actividadProyecto/onShow',
  async (id, thunkAPI) => {
    try {
      const response = await jwtAxios.get(`actividades-proyectos/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(messages['message.somethingWentWrong'] || error.message);
    }
  }
);

export const onUpdate = createAsyncThunk(
  'actividadProyecto/onUpdate',
  async ({ params, handleOnClose, updateColeccion }, thunkAPI) => {
    try {
      const response = await jwtAxios.put(`actividades-proyectos/${params.id}`, params);

      const mensaje = response.data.mensajes[0];
      const tipoMensaje = response.data.mensajes[1];
      thunkAPI.dispatch(showMessage([mensaje, tipoMensaje]));
      handleOnClose();
      updateColeccion();
      
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
  'actividadProyecto/onDelete',
  async ({ id, updateColeccion }, thunkAPI) => {
    try {
      const response = await jwtAxios.delete(`actividades-proyectos/${id}`);
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
  'actividadProyecto/onCreate',
  async ({ params, handleOnClose, updateColeccion }, thunkAPI) => {
   
    try {
      const response = await jwtAxios.post('actividades-proyectos', params);
      const mensaje = response.data.mensajes[0];
      const tipoMensaje = response.data.mensajes[1];
      thunkAPI.dispatch(showMessage([mensaje, tipoMensaje]));
      handleOnClose();
      updateColeccion();
      return response.data.datos;
    } catch (error) {
      const mensajeError = error.response?.data?.mensajes[0] || "Ocurrió un error";
      thunkAPI.dispatch(showMessage([mensajeError, 4]));
      return thunkAPI.rejectWithValue(mensajeError);
    }
  }
);


// Slice de actividades-proyectos
const actividadProyectoSlice = createSlice({
  name: 'actividadProyecto',
  initialState,
  reducers: {
    resetError(state) {
      state.error = null;
    },
    resetActividadProyectoActual(state) {
      state.ActividadProyectoActual = null;
    },
    resetMessage(state) {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Obtener colección de actividades-proyectos
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

      // Obtener colección ligera de actividades-proyectos
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

      // Obtener colección ligera de actividades-proyectos por tipo
      .addCase(onGetColeccionLigeraXTipo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onGetColeccionLigeraXTipo.fulfilled, (state, action) => {
        state.loading = false;
        state.coleccionLigera = action.payload;
      })
      .addCase(onGetColeccionLigeraXTipo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Mostrar un ActividadProyecto
      .addCase(onShow.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onShow.fulfilled, (state, action) => {
        state.loading = false;
        state.ActividadProyectoActual = action.payload;
      })
      .addCase(onShow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Actualizar un ActividadProyecto
      .addCase(onUpdate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onUpdate.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.ActividadProyectoActual = action.payload;
      })
      .addCase(onUpdate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Eliminar un ActividadProyecto
      .addCase(onDelete.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onDelete.fulfilled, (state, action) => {
        state.loading = false;
        state.ActividadProyectoActual = action.payload;
        state.message = null;
      })
      .addCase(onDelete.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Crear un ActividadProyecto
      .addCase(onCreate.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(onCreate.fulfilled, (state, action) => {
        state.loading = false;
        state.ActividadProyectoActual = action.payload; 
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
export const { resetError, resetActividadProyectoActual, resetMessage } = actividadProyectoSlice.actions;
export default actividadProyectoSlice.reducer;

// src/redux/features/actividades-por-proyectos/actividades-por-proyectosSlice.js
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
  coleccionEjecutadas: [],
  ActividadPorProyectoActual: null,
  HeadActividadPorProyectoActual: null,
  loading: false,
  error: null,
  message: null,
};

// Acciones asíncronas (Thunks)
export const onGetColeccion = createAsyncThunk(
    'actividadPorProyecto/onGetColeccion',
    async ({page, rowsPerPage, proyecto_id, estadoFiltro, orderByToSend}, thunkAPI) => {
      try {
        page = page ? page : 0;
        const ordenar_por = orderByToSend ? orderByToSend : '';
        const response = await jwtAxios.get(`actividades-por-proyectos/${proyecto_id}`, {
          params: {
            page: page,
            limite: rowsPerPage,
            estado: estadoFiltro,
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
  'actividadPorProyecto/onGetColeccionLigera',
  async (_, thunkAPI) => {
    try {
      const response = await jwtAxios.get('actividades-por-proyectos', {
        params: { ligera: true },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(messages['message.somethingWentWrong'] || error.message);
    }
  }
);

export const onGetColeccionEjecutadas = createAsyncThunk(
  'actividadPorProyecto/onGetColeccionEjecutadas',
  async ({page, rowsPerPage, proyecto_id, orderByToSend}, thunkAPI) => {
    try {
      page = page ? page : 0;
      const ordenar_por = orderByToSend ? orderByToSend : '';
      const response = await jwtAxios.get(`actividades-por-proyectos/${proyecto_id}`, {
        params: {
            ejecutadas: true,
            page: page,
            limite: rowsPerPage,
            ordenar_por: ordenar_por,
          },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(messages['message.somethingWentWrong'] || error.message);
    }
  }
);

export const onShow = createAsyncThunk(
  'actividadPorProyecto/onShow',
  async (id, thunkAPI) => {
    try {
      const response = await jwtAxios.get(`actividades-por-proyectos/show/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(messages['message.somethingWentWrong'] || error.message);
    }
  }
);

export const onHead = createAsyncThunk(
  'actividadPorProyecto/onHead',
  async (proyecto_id, thunkAPI) => {
    try {
      const response = await jwtAxios.get(`actividades-por-proyectos/${proyecto_id}`, {
        params: { head: true },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(messages['message.somethingWentWrong'] || error.message);
    }
  }
);

export const onUpdate = createAsyncThunk(
  'actividadPorProyecto/onUpdate',
  async ({ params, handleOnClose, updateColeccion }, thunkAPI) => {
    try {
    
      const formData = new FormData();
      formData.append("archivo", params.archivo);
      formData.append("ciudad_id", params.ciudad_id); 
      formData.append("codigo_proyecto", params.codigo_proyecto);
      formData.append("eliminar_archivo", params.eliminar_archivo );
      formData.append("estado_actividad", params.estado_actividad);
      formData.append("fecha_compromiso", params.fecha_compromiso ? params.fecha_compromiso : '' );
      formData.append("fecha_ejecucion", params.fecha_ejecucion ? params.fecha_ejecucion : '');
      formData.append("id", params.id);
      formData.append("id_actividad_proyecto", params.id_actividad_proyecto);
      formData.append("id_etapa_proyecto", params.id_etapa_proyecto);
      formData.append("id_proyecto", params.id_proyecto);
      formData.append("id_tipo_proyecto", params.id_tipo_proyecto);
      formData.append("nombre_actividad", params.nombre_actividad);
      formData.append("nombre_archivo", params.nombre_archivo ? params.nombre_archivo : '');
      formData.append("observaciones", params.observaciones ? params.observaciones  : '');
      formData.append('_method', 'PUT'); 

      // Hacemos PUT directo (Laravel lo recibe bien)
      const response = await jwtAxios.post(
        `actividades-por-proyectos/${params.id}`, formData, { 
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );
      handleOnClose();
      updateColeccion();
      const mensaje = response.data?.mensajes?.[0];
      const tipoMensaje = response.data?.mensajes?.[1];

      thunkAPI.dispatch(showMessage([mensaje, tipoMensaje]));

      return response.data?.datos;
    } catch (error) {
      const mensajeError = error.response?.data?.mensajes?.[0] || 'Ocurrió un error';
      thunkAPI.dispatch(showMessage([mensajeError, 4]));
      return thunkAPI.rejectWithValue(mensajeError);
    }
  }
);


export const onDelete = createAsyncThunk(
  'actividadPorProyecto/onDelete',
  async ({ id, updateColeccion }, thunkAPI) => {
    try {
      const response = await jwtAxios.delete(`actividades-por-proyectos/${id}`);
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
  'actividadPorProyecto/onCreate',
  async ({ params, handleOnClose, updateColeccion }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("archivo", params.archivo ? params.archivo : '' );
      formData.append("ciudad_id", params.ciudad_id); 
      formData.append("codigo_proyecto", params.codigo_proyecto);
      formData.append("eliminar_archivo", params.eliminar_archivo);
      formData.append("estado_actividad", params.estado_actividad);
      formData.append("fecha_compromiso", params.fecha_compromiso ? params.fecha_compromiso : '' );
      formData.append("fecha_ejecucion", params.fecha_ejecucion ? params.fecha_ejecucion : '');
      formData.append("id", params.id ? params.id : '');
      formData.append("id_actividad_proyecto", params.id_actividad_proyecto);
      formData.append("id_etapa_proyecto", params.id_etapa_proyecto);
      formData.append("id_proyecto", params.id_proyecto);
      formData.append("id_tipo_proyecto", params.id_tipo_proyecto);
      formData.append("nombre_actividad", params.nombre_actividad);
      formData.append("nombre_archivo", params.nombre_archivo ? params.nombre_archivo : '');
      formData.append("observaciones", params.observaciones ? params.observaciones  : '');
      
      const response = await jwtAxios.post(
        `actividades-por-proyectos`, formData, { 
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

     
      const mensaje = response.data?.mensajes?.[0];
      const tipoMensaje = response.data?.mensajes?.[1];

      thunkAPI.dispatch(showMessage([mensaje, tipoMensaje]));
      handleOnClose();
      updateColeccion();
      return response.data?.datos;
    } catch (error) {
      const mensajeError = error.response?.data?.mensajes?.[0] || 'Ocurrió un error';
      thunkAPI.dispatch(showMessage([mensajeError, 4]));
      return thunkAPI.rejectWithValue(mensajeError);
    }
  }
);


// Slice de actividades-por-proyectos
const actividadPorProyectoSlice = createSlice({
  name: 'actividadPorProyecto',
  initialState,
  reducers: {
    resetError(state) {
      state.error = null;
    },
    resetActividadPorProyectoActual(state) {
      state.ActividadPorProyectoActual = null;
    },
    resetHeadActividadPorProyectoActual(state) {
      state.HeadActividadPorProyectoActual = null;
    },
    resetMessage(state) {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Obtener colección de actividades-por-proyectos
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

      // Obtener colección ligera de actividades-por-proyectos
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

      // Obtener colección ejecutadas de actividades-por-proyectos
      .addCase(onGetColeccionEjecutadas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onGetColeccionEjecutadas.fulfilled, (state, action) => {
        state;
        state.loading = false;
        state.rows = action.payload.datos ; 
        state.desde = action.payload.desde ;
        state.hasta = action.payload.hasta;
        state.ultima_pagina = action.payload.ultima_pagina ;
        state.total = action.payload.total;
      })
      .addCase(onGetColeccionEjecutadas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Mostrar un ActividadPorProyecto
      .addCase(onShow.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onShow.fulfilled, (state, action) => {
        state.loading = false;
        state.ActividadPorProyectoActual = action.payload;
      })
      .addCase(onShow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Mostrar un encabezado
      .addCase(onHead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onHead.fulfilled, (state, action) => {
        state.loading = false;
        state.HeadActividadPorProyectoActual = action.payload;
      })
      .addCase(onHead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Actualizar un ActividadPorProyecto
      .addCase(onUpdate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onUpdate.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.ActividadPorProyectoActual = action.payload;
      })
      .addCase(onUpdate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Eliminar un ActividadPorProyecto
      .addCase(onDelete.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onDelete.fulfilled, (state, action) => {
        state.loading = false;
        state.ActividadPorProyectoActual = action.payload;
        state.message = null;
      })
      .addCase(onDelete.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Crear un ActividadPorProyecto
      .addCase(onCreate.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(onCreate.fulfilled, (state, action) => {
        state.loading = false;
        state.ActividadPorProyectoActual = action.payload; 
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
export const { resetError, resetActividadPorProyectoActual, resetHeadActividadPorProyectoActual, resetMessage } = actividadPorProyectoSlice.actions;
export default actividadPorProyectoSlice.reducer;

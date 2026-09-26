// src/redux/features/conceptos-por-proyectos/conceptos-por-proyectosSlice.js
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
  datosPrevios: [],
  conceptosPorProyecto: [],
  camposEnergia: {
    precio_energia_comunidad: 0,
    energia_comercializada_comunidad: 0,
    precio_energia_bolsa: 0,
    energia_comercializada_bolsa: 0,
  },
  conceptosCalculados: [],
  conceptosSimulados: [],
  ConceptoPorProyectoActual: null,
  HeadConceptoPorProyectoActual: null,
    // --- Simulación ---
  conceptosSimulacion: [],      
  arregloConceptosSim: [],    
  loading: false,
  error: null,
  message: null,
};

// Acciones asíncronas (Thunks)
export const onGetColeccion = createAsyncThunk(
    'conceptoPorProyecto/onGetColeccion',
    async ({page, rowsPerPage, idProyecto, anioFiltro, mesFiltro, orderByToSend}, thunkAPI) => {
      try {
        page = page ? page : 0;
        const idProyectoAux = idProyecto ? idProyecto : '';
        const anioAux = anioFiltro ? anioFiltro : '';
        const mesAux = mesFiltro ? mesFiltro : '';
        const ordenar_por = orderByToSend ? orderByToSend : '';
        const response = await jwtAxios.get(`conceptos-por-proyectos`, {
          params: {
            page: page,
            limite: rowsPerPage,
            proyecto_id: idProyectoAux,
            anio: anioAux,
            mes: mesAux,
            ordenar_por: ordenar_por,
          },
        });
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
  'conceptoPorProyecto/onGetColeccionLigera',
  async (_, thunkAPI) => {
    try {
      const response = await jwtAxios.get('conceptos-por-proyectos', {
        params: { ligera: true },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(messages['message.somethingWentWrong'] || error.message);
    }
  }
);

export const onGetDatosPrevios = createAsyncThunk(
  'conceptoPorProyecto/onGetDatosPrevios',
  async ({proyecto_id}, thunkAPI) => {
    try {
      const response = await jwtAxios.get('conceptos-por-proyectos', {
        params: { 
          previos: true,
          proyecto_id: proyecto_id
         },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(messages['message.somethingWentWrong'] || error.message);
    }
  }
);

export const onGetConceptosParaPeriodo = createAsyncThunk(
  'conceptoPorProyecto/onGetConceptosParaPeriodo',
  async ({id_proyecto, anio, mes}, thunkAPI) => {
    try {
      const response = await jwtAxios.get('conceptos-por-proyectos', {
        params: { 
          conceptos: true,
          proyecto_id: id_proyecto,
          anio: anio,
          mes: mes,
         },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(messages['message.somethingWentWrong'] || error.message);
    }
  }
);

export const onCopiarValores = createAsyncThunk(
  'conceptoPorProyecto/onCopiarValores',
  /**
   * params = {
   *   id_proyecto,
   *   anio_origen, mes_origen,
   *   anio_destino, mes_destino,
   *   replace (boolean)
   * }
   */
  async (params, thunkAPI) => {
    try {
      const { data } = await jwtAxios.post('conceptos-por-proyectos/copiar', params);
      const mensaje = data?.mensajes?.[0];
      const tipoMensaje = data?.mensajes?.[1];
      thunkAPI.dispatch(showMessage([mensaje, tipoMensaje]));
      return data;
    } catch (error) {
      const mensajeError =
        error?.response?.data?.message ||
        error?.response?.data?.mensajes?.[0] ||
        error.message ||
        'Ocurrió un error';
      thunkAPI.dispatch(showMessage([mensajeError, 4]));
      return thunkAPI.rejectWithValue(mensajeError);
    }
  }
);

export const onGetConceptosSimulacion = createAsyncThunk(
  'conceptoPorProyecto/onGetConceptosSimulacion',
  async ({ id_tipo_proyecto, id_simulacion = null }, thunkAPI) => {
    try {
      const response = await jwtAxios.get('conceptos-por-proyectos/conceptos-simulacion', {
        params: {
          id_tipo_proyecto,
          ...(id_simulacion ? { id_simulacion } : {}),
        },
      });
      return response.data; // { conceptos: [...] }
    } catch (error) {
      const mensajeError =
        error?.response?.data?.message ||
        error?.response?.data?.mensajes?.[0] ||
        error.message ||
        'Ocurrió un error';
      thunkAPI.dispatch(showMessage([mensajeError, 4]));
      return thunkAPI.rejectWithValue(mensajeError);
    }
  }
);

export const onShow = createAsyncThunk(
  'conceptoPorProyecto/onShow',
  async (id, thunkAPI) => {
    try {
      const response = await jwtAxios.get(`conceptos-por-proyectos/show/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(messages['message.somethingWentWrong'] || error.message);
    }
  }
);

export const onHead = createAsyncThunk(
  'conceptoPorProyecto/onHead',
  async (proyecto_id, thunkAPI) => {
    try {
      const response = await jwtAxios.get(`conceptos-por-proyectos`, {
        params: { 
          head: true,
          proyecto_id: proyecto_id
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(messages['message.somethingWentWrong'] || error.message);
    }
  }
);

export const onCalcular = createAsyncThunk(
  'conceptoPorProyecto/onCalcular',
  async ({ params }, thunkAPI) => {
    try {
      const response = await jwtAxios.post(`conceptos-por-proyectos/calcular`, params );
      return response?.data;
    } catch (error) {
      const mensajeError = error.response?.data?.mensajes?.[0] || 'Ocurrió un error';
      thunkAPI.dispatch(showMessage([mensajeError, 4]));
      return thunkAPI.rejectWithValue(mensajeError);
    }
  }
);

export const onCalcularSimulacion = createAsyncThunk(
  'conceptoPorProyecto/onCalcularSimulacion',
  async ({ params }, thunkAPI) => {
    try {
      const response = await jwtAxios.post(
        'conceptos-por-proyectos/calcular-simulacion',
        params
      );
      return response?.data;
    } catch (error) {
      const mensajeError =
        error?.response?.data?.mensajes?.[0] ||
        error?.response?.data?.message ||
        error?.message ||
        'Ocurrió un error';
      thunkAPI.dispatch(showMessage([mensajeError, 4]));
      return thunkAPI.rejectWithValue(mensajeError);
    }
  }
);

export const onGuardar = createAsyncThunk(
  'conceptoPorProyecto/onGuardar',
  /**
   * params = {
   *   id_proyecto,
   *   anio_origen, mes_origen,
   *   anio_destino, mes_destino,
   *   replace (boolean)
   * }
   */
  async ({params, updateColeccion, handleOnClose }, thunkAPI) => {
    try {
      const { data } = await jwtAxios.post('conceptos-por-proyectos/guardar', params);
      const mensaje = data?.mensajes?.[0];
      const tipoMensaje = data?.mensajes?.[1];
      thunkAPI.dispatch(showMessage([mensaje, tipoMensaje]));
      updateColeccion();
      handleOnClose();
      return data;
    } catch (error) {
      const mensajeError =
        error?.response?.data?.message ||
        error?.response?.data?.mensajes?.[0] ||
        error.message ||
        'Ocurrió un error';
      thunkAPI.dispatch(showMessage([mensajeError, 4]));
      return thunkAPI.rejectWithValue(mensajeError);
    }
  }
);

export const onDelete = createAsyncThunk(
  'conceptoPorProyecto/onDelete',
  async ({ id, updateColeccion }, thunkAPI) => {
    try {
      const response = await jwtAxios.delete(`conceptos-por-proyectos/${id}`);
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
  'conceptoPorProyecto/onCreate',
  async ({ params, handleOnClose, updateColeccion }, thunkAPI) => {
    try {
      
      const response = await jwtAxios.post(`conceptos-por-proyectos`, params );     
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


// Slice de conceptos-por-proyectos
const conceptoPorProyectoSlice = createSlice({
  name: 'conceptoPorProyecto',
  initialState,
  reducers: {
    resetError(state) {
      state.error = null;
    },
    resetConceptoPorProyectoActual(state) {
      state.ConceptoPorProyectoActual = null;
    },
    resetHeadConceptoPorProyectoActual(state) {
      state.HeadConceptoPorProyectoActual = null;
    },
    resetMessage(state) {
      state.message = null;
    },
    resetSimulacionConceptos(state) {
      state.conceptosSimulacion = [];
      state.arregloConceptosSim = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Obtener colección de conceptos-por-proyectos
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

      // Obtener colección ligera de conceptos-por-proyectos
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

      // Obtener datos previos (año-mes) de conceptos-por-proyectos
      .addCase(onGetDatosPrevios.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onGetDatosPrevios.fulfilled, (state, action) => {
        state.loading = false;
        state.datosPrevios = action.payload;
      })
      .addCase(onGetDatosPrevios.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Obtener colección de calculos
      .addCase(onCalcular.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onCalcular.fulfilled, (state, action) => {
        state.loading = false;
        state.conceptosCalculados = action.payload?.conceptos || []
      })
      .addCase(onCalcular.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Obtener datos conceptos por proyecto - año-mes de valores-conceptos-por-proyectos
      .addCase(onGetConceptosParaPeriodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onGetConceptosParaPeriodo.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload || {};
        state.conceptosPorProyecto = payload.conceptos || [];
        state.camposEnergia = {
          precio_energia_comunidad:
            payload.precio_energia_comunidad ?? 0,
          energia_comercializada_comunidad:
            payload.energia_comercializada_comunidad ?? 0,
          precio_energia_bolsa:
            payload.precio_energia_bolsa ?? 0,
          energia_comercializada_bolsa:
            payload.energia_comercializada_bolsa ?? 0,
        };
      })
      .addCase(onGetConceptosParaPeriodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Mostrar un ConceptoPorProyecto
      .addCase(onShow.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onShow.fulfilled, (state, action) => {
        state.loading = false;
        state.ConceptoPorProyectoActual = action.payload;
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
        state.HeadConceptoPorProyectoActual = action.payload;
      })
      .addCase(onHead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })



      // Eliminar un ConceptoPorProyecto
      .addCase(onDelete.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onDelete.fulfilled, (state, action) => {
        state.loading = false;
        state.ConceptoPorProyectoActual = action.payload;
        state.message = null;
      })
      .addCase(onDelete.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Crear un ConceptoPorProyecto
      .addCase(onCreate.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(onCreate.fulfilled, (state, action) => {
        state.loading = false;
        state.ConceptoPorProyectoActual = action.payload; 
        state.message = action.payload.mensajes ?? action.payload.mensajes[0];
      })
      .addCase(onCreate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = action.payload.mensajes ?? action.payload.mensajes[0];
      })

      // Copia de valores (preview/replace)
      .addCase(onCopiarValores.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onCopiarValores.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Puedes guardar alguna pista si te sirve
        state.message = action.payload?.message || null;
      })
      .addCase(onCopiarValores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error en copia';
      })

       // Guardar de valores (preview/replace)
      .addCase(onGuardar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onGuardar.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload?.message || null;
      })
      .addCase(onGuardar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error en copia';
      })

      // --- Obtener conceptos para simulación ---
      .addCase(onGetConceptosSimulacion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onGetConceptosSimulacion.fulfilled, (state, action) => {
        state.loading = false;
        state.conceptosSimulacion = action.payload?.conceptos || [];
      })
      .addCase(onGetConceptosSimulacion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error cargando conceptos de simulación';
      })

      // Obtener colección de calculos simulación
      .addCase(onCalcularSimulacion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onCalcularSimulacion.fulfilled, (state, action) => {
        state.loading = false;

        // Ajusta según lo que devuelva tu backend:
        // - Si devuelve { conceptos: [...] }
        // - o { conceptos_simulacion: [...] }
        state.conceptosSimulados =
          action.payload?.conceptos_simulacion ||
          action.payload?.conceptos ||
          [];
      })
      .addCase(onCalcularSimulacion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error calculando simulación';
      });

     
  },
});

// Exportar acciones y reducer
export const { resetError, resetConceptoPorProyectoActual, resetHeadConceptoPorProyectoActual, resetMessage, resetSimulacionConceptos } = conceptoPorProyectoSlice.actions;
export default conceptoPorProyectoSlice.reducer;

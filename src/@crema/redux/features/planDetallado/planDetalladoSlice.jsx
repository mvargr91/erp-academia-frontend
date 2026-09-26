// src/redux/features/plan-detallado/plan-detalladoSlice.js
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
  totalGeneral : 0,
  totalRteFuente : 0,
  totalNeto: 0, 
  coleccionLigera: [],
  PlanDetalladoActual: null,
  loading: false,
  error: null,
  message: null,
};

// Acciones asíncronas (Thunks)
export const onGetColeccion = createAsyncThunk(
    'plan-detallado/onGetColeccion',
    async ({page,rowsPerPage,inversion_id, id_proyecto, InversionSeleccionado, orderByToSend}, thunkAPI) => {
      try {
        page = page ? page : 0;
        const inversionIdAux = inversion_id ? inversion_id : '';
        const proyectoIdAux = id_proyecto ? id_proyecto : '';
        const inversionistaAux = InversionSeleccionado ? InversionSeleccionado : '';
        const ordenar_por = orderByToSend ? orderByToSend : '';
        const response = await jwtAxios.get('plan-detallado', {
          params: {
            page: page,
            limite: rowsPerPage,
            id_inversion: inversionIdAux,
            id_proyecto: proyectoIdAux,
            id_inversionista: inversionistaAux,
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

export const onGetColeccionPlan = createAsyncThunk(
    'plan-detallado/onGetColeccionPlan',
    async ({page, rowsPerPage, idInversionista, idProyecto, estadoFiltro, tipoFiltro, fechaDesdeFiltro, fechaHastaFiltro, fechaPagoDesdeFiltro, fechaPagoHastaFiltro, orderByToSend}, thunkAPI) => {
      try {
        page = page ? page : 0;
        const proyectoIdAux = idProyecto ? idProyecto : '';
        const inversionistaAux = idInversionista ? idInversionista : '';
        const estadoAux = estadoFiltro ? estadoFiltro : '';
        const tipoAux = tipoFiltro ? tipoFiltro : '';
        const fechaDesdeAux = fechaDesdeFiltro ? fechaDesdeFiltro : '';
        const fechaHastaAux = fechaHastaFiltro ? fechaHastaFiltro : '';
        const fechaPagoDesdeAux = fechaPagoDesdeFiltro ? fechaPagoDesdeFiltro : '';
        const fechaPagoHastaAux = fechaPagoHastaFiltro ? fechaPagoHastaFiltro : '';
        const ordenar_por = orderByToSend ? orderByToSend : '';
        const response = await jwtAxios.get('plan-detallado', {
          params: {
            page: page,
            limite: rowsPerPage,
            id_proyecto: proyectoIdAux,
            id_inversionista: inversionistaAux,
            estado: tipoAux,
            tipo: estadoAux,
            fechaDesde: fechaDesdeAux,
            fechaHasta: fechaHastaAux,
            fechaPagoDesde: fechaPagoDesdeAux,
            fechaPagoHasta: fechaPagoHastaAux,
            ordenar_por: ordenar_por,
          },
        });
        // Supón que la estructura de la respuesta es como se espera
        const { datos, desde, hasta, ultima_pagina, total } = response.data;  
        return { datos, desde, hasta, ultima_pagina, total };
      } catch (error) {
        console.error("Error en onGetColeccionPlan:", error);
        dispatch(fetchSuccess());
        return thunkAPI.rejectWithValue(messages['message.somethingWentWrong'] || error.message);
      }
    }
);  

export const onGetColeccionProyecto = createAsyncThunk(
    'plan-detallado/onGetColeccionProyecto',
    async ({page,rowsPerPage,inversion_id, id_proyecto, InversionSeleccionado, orderByToSend}, thunkAPI) => {
      try {
        page = page ? page : 0;
        const inversionIdAux = inversion_id ? inversion_id : '';
        const proyectoIdAux = id_proyecto ? id_proyecto : '';
        const inversionistaAux = InversionSeleccionado ? InversionSeleccionado : '';
        const ordenar_por = orderByToSend ? orderByToSend : '';
        const response = await jwtAxios.get('plan-detallado', {
          params: {
            page: page,
            limite: rowsPerPage,
            id_inversion: inversionIdAux,
            id_proyecto: proyectoIdAux,
            id_inversionista: inversionistaAux,
            ordenar_por: ordenar_por,
            proyecto: true,
          },
        });
        // Supón que la estructura de la respuesta es como se espera
        const { datos, desde, hasta, ultima_pagina, total } = response.data;  
        return { datos, desde, hasta, ultima_pagina, total };
      } catch (error) {
        console.error("Error en onGetColeccionProyecto:", error);
        dispatch(fetchSuccess());
        return thunkAPI.rejectWithValue(messages['message.somethingWentWrong'] || error.message);
      }
    }
);  

export const onGetColeccionLigera = createAsyncThunk(
  'plan-detallado/onGetColeccionLigera',
  async (_, thunkAPI) => {
    try {
      const response = await jwtAxios.get('plan-detallado', {
        params: { ligera: true },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(messages['message.somethingWentWrong'] || error.message);
    }
  }
);

export const onGetProgramacion = createAsyncThunk(
  'plan-detallado/onGetProgramacion',
  async ({page,rowsPerPage,fechaProgramacionFiltro,nombreFiltro,orderByToSend}, thunkAPI) => {
    try {
      const fechaProgramacionAux = fechaProgramacionFiltro ? fechaProgramacionFiltro : '';
      const nombreFiltroAux = nombreFiltro ? nombreFiltro : '';
      const ordenar_por = orderByToSend ? orderByToSend : '';
      const response = await jwtAxios.get('programaciones/lista', {
        params: {
          page: page ?? 1,
          limite: rowsPerPage ?? 10,
          fechaProgramacion: fechaProgramacionAux,
          nombre:  nombreFiltroAux,
          ordenar_por: ordenar_por,
        },
      });
      // Supón que la estructura de la respuesta es como se espera
      const { datos, desde, hasta, ultima_pagina, total, total_general , total_ret_fuente, total_neto  } = response.data?.data;
      return { datos, desde, hasta, ultima_pagina, total, total_general , total_ret_fuente, total_neto };
    } catch (error) {
      console.error("Error en onGetColeccion:", error);
      dispatch(fetchSuccess());
      return thunkAPI.rejectWithValue(messages['message.somethingWentWrong'] || error.message);
    }
  }
);  

export const onGetPagoProgramados = createAsyncThunk(
  'plan-detallado/onGetPagoProgramados',
  async ({page,rowsPerPage,orderByToSend}, thunkAPI) => {
    try {
       console.log(page, rowsPerPage, orderByToSend )
      const ordenar_por = orderByToSend ? orderByToSend : '';
      const response = await jwtAxios.get('programaciones/programadas', {
        params: {
          page: page ?? 0,
          limite: rowsPerPage ?? 10,
          ordenar_por: ordenar_por,
        },
      });
      // Supón que la estructura de la respuesta es como se espera
      const { datos, desde, hasta, ultima_pagina, total, total_general_valor ,  total_general_a_pagar } = response.data;
      return { datos, desde, hasta, ultima_pagina, total, total_general_valor , total_general_a_pagar };
    } catch (error) {
      console.error("Error en onGetColeccion:", error);
      dispatch(fetchSuccess());
      return thunkAPI.rejectWithValue(messages['message.somethingWentWrong'] || error.message);
    }
  }
);

export const onGuardarProgramacion = createAsyncThunk(
  'plan-detallado/onGuardarProgramacion',
  async ({params}, thunkAPI) => {
    try {
      const response = await jwtAxios.put(`programaciones/guardar`, params);
      // Despacha el mensaje de éxito
      thunkAPI.dispatch(showMessage([response.data.mensajes[0], response.data.mensajes[1]]));
      return response.data.datos;
    } catch (error) {
      console.error("Error en onGetColeccion:", error);
      dispatch(fetchSuccess());
      return thunkAPI.rejectWithValue(messages['message.somethingWentWrong'] || error.message);
    }
  }
);

export const onGuardarPagosProgramados = createAsyncThunk(
    'plan-detallado/onGuardarPagosProgramados',
    async (row, thunkAPI) => {
      try {
        const response = await jwtAxios.put(`programaciones/pagos`, row);
        thunkAPI.dispatch(showMessage([response.data.mensajes[0], response.data.mensajes[1]]));
        return response.data.datos;
      } catch (error) {
        const mensajeError = error.response?.data?.mensajes?.[0] || 'Error al guardar pago';
        thunkAPI.dispatch(showMessage([mensajeError, 4]));
        return thunkAPI.rejectWithValue(mensajeError);
      }
    }
  );

export const onShow = createAsyncThunk(
  'plan-detallado/onShow',
  async (id, thunkAPI) => {
    try {
      const response = await jwtAxios.get(`plan-detallado/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(messages['message.somethingWentWrong'] || error.message);
    }
  }
);

export const onUpdate = createAsyncThunk(
  'plan-detallado/onUpdate',
  async ({ params, handleOnClose, updateColeccion }, thunkAPI) => {
    try {
      const response = await jwtAxios.put(`plan-detallado/${params.id}`, params);

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
  'plan-detallado/onDelete',
  async ({ id, updateColeccion }, thunkAPI) => {
    console.log(id)
    try {
      const response = await jwtAxios.delete(`plan-detallado/${id}`);
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
  'plan-detallado/onCreate',
  async ({ params, handleOnClose, updateColeccion }, thunkAPI) => {
    try {
      const response = await jwtAxios.post('plan-detallado', params);
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

// Slice de plan-detallado
const planDetalladoSlice = createSlice({
  name: 'plan-detallado',
  initialState,
  reducers: {
    resetError(state) {
      state.error = null;
    },
    resetPlanDetalladoActual(state) {
      state.PlanDetalladoActual = null;
    },
    resetMessage(state) {
      state.message = null;
    },
    clearPlanDetallado(state) {
      state.rows = [];
      state.desde = 0;
      state.hasta = 0;
      state.ultima_pagina = 1;
      state.total = 0;
      state.totalGeneral = 0;
      state.totalNeto = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Obtener colección de plan-detallado
      .addCase(onGetColeccion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onGetColeccion.fulfilled, (state, action) => {
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

      // Obtener colección de plan-detallado consulta plan
      .addCase(onGetColeccionPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onGetColeccionPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.rows = action.payload.datos ; 
        state.desde = action.payload.desde ;
        state.hasta = action.payload.hasta;
        state.ultima_pagina = action.payload.ultima_pagina ;
        state.total = action.payload.total;
      })
      .addCase(onGetColeccionPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Obtener colección de plan-detallado por proyecto
      .addCase(onGetColeccionProyecto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onGetColeccionProyecto.fulfilled, (state, action) => {
        state.loading = false;
        state.rows = action.payload.datos ; 
        state.desde = action.payload.desde ;
        state.hasta = action.payload.hasta;
        state.ultima_pagina = action.payload.ultima_pagina ;
        state.total = action.payload.total;
      })
      .addCase(onGetColeccionProyecto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Obtener colección ligera de plan-detallado
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

      // Obtener colección de para programacion de inversiones
      .addCase(onGetProgramacion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onGetProgramacion.fulfilled, (state, action) => {
        state.loading = false;
        state.rows = action.payload.datos ; 
        state.desde = action.payload.desde ;
        state.hasta = action.payload.hasta;
        state.ultima_pagina = action.payload.ultima_pagina ;
        state.total = action.payload.total;
        state.totalGeneral  = action.payload.total_general ;
        state.totalRteFuente  = action.payload.total_ret_fuente ;        
        state.totalNeto  = action.payload.total_neto ;
      })
      .addCase(onGetProgramacion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Obtener colección de pagos programados
      .addCase(onGetPagoProgramados.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onGetPagoProgramados.fulfilled, (state, action) => {
        state.loading = false;
        state.rows = action.payload.datos ; 
        state.desde = action.payload.desde ;
        state.hasta = action.payload.hasta;
        state.ultima_pagina = action.payload.ultima_pagina ;
        state.total = action.payload.total;
        state.totalGeneral  = action.payload.total_general_valor ;
        state.totalNeto  = action.payload.total_general_a_pagar ;
      })
      .addCase(onGetPagoProgramados.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //  Guardar programación de pagos
      .addCase(onGuardarProgramacion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onGuardarProgramacion.fulfilled, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(onGuardarProgramacion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Mostrar un PlanDetallado
      .addCase(onShow.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onShow.fulfilled, (state, action) => {
        state.loading = false;
        state.PlanDetalladoActual = action.payload;
      })
      .addCase(onShow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // guardar pagos en PlanDetallado
      .addCase(onGuardarPagosProgramados.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onGuardarPagosProgramados.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload?.mensajes;
      })
      .addCase(onGuardarPagosProgramados.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = Array.isArray(action.payload?.mensajes)
        ? action.payload.mensajes[0]
        : action.payload || 'Error al guardar el pago.';
      })

      // Actualizar un PlanDetallado
      .addCase(onUpdate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onUpdate.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.PlanDetalladoActual = action.payload;
      })
      .addCase(onUpdate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Eliminar un PlanDetallado
      .addCase(onDelete.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onDelete.fulfilled, (state, action) => {
        state.loading = false;
        state.PlanDetalladoActual = action.payload;
        state.message = null;
      })
      .addCase(onDelete.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Crear un PlanDetallado
      .addCase(onCreate.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(onCreate.fulfilled, (state, action) => {
        state.loading = false;
        state.PlanDetalladoActual = action.payload; 
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
export const { resetError, resetPlanDetalladoActual, resetMessage, clearPlanDetallado } = planDetalladoSlice.actions;
export default planDetalladoSlice.reducer;

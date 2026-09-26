import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import jwtAxios from '../../../services/auth/jwt-auth';
import { showMessage, hideMessage } from '../cammon/commonSlice';

const initialState = {
  rows: [],
  desde: 0,
  hasta: 0,
  ultima_pagina: 1,
  total: 0,
  coleccionLigera: [],
  coleccionEjecutadas: [],
  SimulacionPorProyectoActual: null,
  SimulacionPorInversionistaActual: null,
  HeadSimulacionPorProyectoActual: null,
  loading: false,
  error: null,
  message: null,
};

export const onGetColeccion = createAsyncThunk(
  'simulacionPorProyecto/onGetColeccion',
  async ({ page, rowsPerPage, proyecto_id, estadoFiltro, orderByToSend, indicativo_tipo_simulacion, indicativo_modelo_ccial }, thunkAPI) => {
    try {
      page = page ? page : 0;
      const ordenar_por = orderByToSend ? orderByToSend : '';

      const response = await jwtAxios.get(`simulaciones-por-proyectos/${proyecto_id}`, {
        params: {
          page,
          limite: rowsPerPage,
          estado: estadoFiltro,
          ordenar_por,
          indicativo_tipo_simulacion,
          indicativo_modelo_ccial,
        },
      });

      const { datos, desde, hasta, ultima_pagina, total } = response.data;
      return { datos, desde, hasta, ultima_pagina, total };
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.message || 'Ocurrió un error');
    }
  }
);

export const onGetColeccionLigera = createAsyncThunk(
  'simulacionPorProyecto/onGetColeccionLigera',
  async (proyecto_id, thunkAPI) => {
    try {
      const response = await jwtAxios.get(`simulaciones-por-proyectos/${proyecto_id}`, {
        params: {
          ligera: true,
          indicativo_tipo_simulacion: 'I',
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.message || 'Ocurrió un error');
    }
  }
);

export const onShow = createAsyncThunk(
  'simulacionPorProyecto/onShow',
  async (id, thunkAPI) => {
    try {
      const response = await jwtAxios.get(`simulaciones-por-proyectos/show/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.message || 'Ocurrió un error');
    }
  }
);

export const onDelete = createAsyncThunk(
  'simulacionPorProyecto/onDelete',
  async ({ id, updateColeccion }, thunkAPI) => {
    try {
      const response = await jwtAxios.delete(`simulaciones-por-proyectos/${id}`);
      updateColeccion();

      const mensaje = response.data.mensajes[0];
      const tipoMensaje = response.data.mensajes[1];

      thunkAPI.dispatch(showMessage([mensaje, tipoMensaje]));
      setTimeout(() => {
        thunkAPI.dispatch(hideMessage([mensaje, tipoMensaje]));
      }, 3000);

      return response.data;
    } catch (error) {
      const mensajeError = error.response?.data?.mensajes?.[0] || 'Ocurrió un error';
      thunkAPI.dispatch(showMessage([mensajeError, 4]));
      return thunkAPI.rejectWithValue(mensajeError);
    }
  }
);

export const onCalcularSimulacion = createAsyncThunk(
  'simulacionPorProyecto/onCalcularSimulacion',
  async ({ params }, thunkAPI) => {
    try {
      const response = await jwtAxios.post(`simulaciones-por-proyectos/calcular-simulacion`, params);
      return response.data;
    } catch (error) {
      const mensajeError =
        error.response?.data?.mensajes?.[0] || 'Ocurrió un error calculando simulación';
      thunkAPI.dispatch(showMessage([mensajeError, 4]));
      return thunkAPI.rejectWithValue(mensajeError);
    }
  }
);

export const onGuardarSimulacion = createAsyncThunk(
  'simulacionPorProyecto/onGuardarSimulacion',
  async ({ params }, thunkAPI) => {
    try {
      const response = await jwtAxios.post(`simulaciones-por-proyectos/guardar`, params);

      const mensaje = response.data?.mensajes?.[0];
      const tipo = response.data?.mensajes?.[1] ?? 1;

      thunkAPI.dispatch(showMessage([mensaje, tipo]));
      setTimeout(() => thunkAPI.dispatch(hideMessage([mensaje, tipo])), 3000);

      return response.data.datos;
    } catch (error) {
      const mensajeError = error.response?.data?.mensajes?.[0] || 'Error guardando simulación';
      thunkAPI.dispatch(showMessage([mensajeError, 4]));
      return thunkAPI.rejectWithValue(mensajeError);
    }
  }
);

export const onInitEdicionSimulacion = createAsyncThunk(
  'simulacionPorProyecto/onInitEdicionSimulacion',
  async ({ id_simulacion }, thunkAPI) => {
    try {
      const response = await jwtAxios.post(`simulaciones-por-proyectos/inicializar-edicion`, {
        id_simulacion,
      });
      return response.data ?? null;
    } catch (error) {
      const mensajeError =
        error.response?.data?.mensajes?.[0] || 'Ocurrió un error inicializando edición';
      thunkAPI.dispatch(showMessage([mensajeError, 4]));
      return thunkAPI.rejectWithValue(mensajeError);
    }
  }
);

export const onInitSimulacionInversionista = createAsyncThunk(
  'simulacionPorProyecto/onInitSimulacionInversionista',
  async ({ accion, id, id_simulacion, porcentaje_part_inversionista }, thunkAPI) => {
    try {
      const response = await jwtAxios.post(
        `simulaciones-por-proyectos/inicializar-inversionista`,
        { accion, id, id_simulacion,porcentaje_part_inversionista }
      );
      return response.data ?? null;
    } catch (error) {
      const mensajeError =
        error.response?.data?.mensajes?.[0] || 'Ocurrió un error inicializando simulación inversionista';
      thunkAPI.dispatch(showMessage([mensajeError, 4]));
      return thunkAPI.rejectWithValue(mensajeError);
    }
  }
);

export const onGuardarSimulacionInversionista = createAsyncThunk(
  'simulacionPorProyecto/onGuardarSimulacionInversionista',
  async ({ params }, thunkAPI) => {
    try {
      const response = await jwtAxios.post(
        `simulaciones-por-proyectos/guardar-inversionista`,
        params
      );
      const mensaje = response.data?.mensajes?.[0];
      const tipo = response.data?.mensajes?.[1] ?? 1;
      thunkAPI.dispatch(showMessage([mensaje, tipo]));
      setTimeout(() => thunkAPI.dispatch(hideMessage([mensaje, tipo])), 3000);

      return response.data?.datos ?? null;
    } catch (error) {
      const mensajeError =
        error.response?.data?.mensajes?.[0] || 'Error guardando simulación inversionista';

      thunkAPI.dispatch(showMessage([mensajeError, 4]));
      return thunkAPI.rejectWithValue(mensajeError);
    }
  }
);

const mapInitEdicionToStateShape = (data) => {
  if (!data) return null;

  const simulacion = {
    id: Number(data.id_simulacion),
    id_simulacion: Number(data.id_simulacion),
    id_proyecto: Number(data.id_proyecto),
    indicativo_modelo_ccial: data.indicativo_modelo_ccial ?? '',
    porcentaje_reduccion_tarifa: data.porcentaje_reduccion_tarifa ?? null,
    porcentaje_perdida_efic: data.porcentaje_perdida_efic ?? null,
    valor_total_proyecto: data.valor_total_proyecto ?? null,
    porcentaje_IPC: data.porcentaje_IPC ?? null,
    anios_depreciacion: data.anios_depreciacion ?? null,
    porcentaje_tasa_oportunidad: data.porcentaje_tasa_oportunidad ?? null,
    Valor_VPN_proyecto: data.Valor_VPN_proyecto ?? null,
    porcentaje_TIR_proyecto: data.porcentaje_TIR_proyecto ?? null,
    anios_PBT: data.anios_PBT ?? null,
    anio_1: data.anio_1 ?? null,
  };

  const conceptos = Array.isArray(data.conceptos) ? data.conceptos : [];

  return { simulacion, conceptos };
};

const mapInitInversionistaToStateShape = (data) => {
  if (!data) return null;

  
  const sim = data ?? {};
  console.log(sim)

  return {
    simulacion: {
      id_simulacion_origen: Number(sim.id_simulacion_origen ?? 0),
      id_proyecto: Number(sim.id_proyecto ?? 0),
      indicativo_modelo_ccial: sim.indicativo_modelo_ccial ?? '',
      indicativo_tipo_simulacion: sim.indicativo_tipo_simulacion ?? 'I',
      porcentaje_part_inversionista: sim.porcentaje_part_inversionista ?? 0,
      nombre_inversionista: sim.nombre_inversionista ?? '',
      telefono_inversionista: sim.telefono_inversionista ?? '',
      email_inversionista: sim.email_inversionista ?? '',
      valor_part_inversionista: sim.valor_part_inversionista ?? 0,
      porcentaje_tasa_oportunidad: sim.porcentaje_tasa_oportunidad ?? null,
      Valor_VPN_proyecto: sim.Valor_VPN_proyecto ?? 0,
      porcentaje_TIR_proyecto: sim.porcentaje_TIR_proyecto ?? 0,
      anios_PBT: sim.anios_PBT ?? 0,
      anio_1: sim.anio_1 ?? null,
      updated_at: sim.updated_at,
      valor_total_proyecto: sim.valor_total_proyecto,
    },
    conceptos: Array.isArray(data?.conceptos) ? data.conceptos : [],
  };
};

const simulacionPorProyectoSlice = createSlice({
  name: 'simulacionPorProyecto',
  initialState,
  reducers: {
    resetError(state) {
      state.error = null;
    },
    resetSimulacionPorProyectoActual(state) {
      state.SimulacionPorProyectoActual = null;
    },
    resetSimulacionPorInversionistaActual(state) {
      state.SimulacionPorInversionistaActual = null;
    },
    resetHeadSimulacionPorProyectoActual(state) {
      state.HeadSimulacionPorProyectoActual = null;
    },
    resetMessage(state) {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(onGetColeccion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onGetColeccion.fulfilled, (state, action) => {
        state.loading = false;
        state.rows = action.payload.datos;
        state.desde = action.payload.desde;
        state.hasta = action.payload.hasta;
        state.ultima_pagina = action.payload.ultima_pagina;
        state.total = action.payload.total;
      })
      .addCase(onGetColeccion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

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

      .addCase(onShow.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onShow.fulfilled, (state, action) => {
        state.loading = false;
        state.SimulacionPorProyectoActual = action.payload;
      })
      .addCase(onShow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(onDelete.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onDelete.fulfilled, (state, action) => {
        state.loading = false;
        state.SimulacionPorProyectoActual = action.payload;
        state.message = null;
      })
      .addCase(onDelete.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(onCalcularSimulacion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onCalcularSimulacion.fulfilled, (state, action) => {
        state.loading = false;
        state.SimulacionPorProyectoActual = action.payload;
      })
      .addCase(onCalcularSimulacion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(onGuardarSimulacion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onGuardarSimulacion.fulfilled, (state, action) => {
        state.loading = false;
        state.SimulacionPorProyectoActual = action.payload;
      })
      .addCase(onGuardarSimulacion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(onInitEdicionSimulacion.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.SimulacionPorProyectoActual = null;
      })
      .addCase(onInitEdicionSimulacion.fulfilled, (state, action) => {
        state.loading = false;
        state.SimulacionPorProyectoActual = mapInitEdicionToStateShape(action.payload);
      })
      .addCase(onInitEdicionSimulacion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(onInitSimulacionInversionista.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.SimulacionPorInversionistaActual = null;
      })
      .addCase(onInitSimulacionInversionista.fulfilled, (state, action) => {
        state.loading = false;
        state.SimulacionPorInversionistaActual = mapInitInversionistaToStateShape(action.payload);
      })
      .addCase(onInitSimulacionInversionista.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(onGuardarSimulacionInversionista.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onGuardarSimulacionInversionista.fulfilled, (state, action) => {
        state.loading = false;
        state.SimulacionPorInversionistaActual = action.payload;
      })
      .addCase(onGuardarSimulacionInversionista.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  resetError,
  resetSimulacionPorProyectoActual,
  resetSimulacionPorInversionistaActual,
  resetHeadSimulacionPorProyectoActual,
  resetMessage,
} = simulacionPorProyectoSlice.actions;

export default simulacionPorProyectoSlice.reducer;
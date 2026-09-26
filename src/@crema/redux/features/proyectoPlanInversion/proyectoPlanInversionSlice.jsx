import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import jwtAxios from '../../../services/auth/jwt-auth';
import { showMessage, hideMessage } from '../cammon/commonSlice';

const proyectoPlanInversionVacio = {
  id_proyecto: '',
  id_inversionista: '',
  plan_pagos: [],
};

const initialState = {
  rows: [],
  desde: 0,
  hasta: 0,
  ultima_pagina: 1,
  total: 0,
  coleccionLigera: [],
  proyectoPlanInversionActual: proyectoPlanInversionVacio,
  loading: false,
  error: null,
  message: null,
};

export const onGetColeccion = createAsyncThunk(
  'proyectosPlanInversiones/onGetColeccion',
  async ({ page, rowsPerPage, nombreFiltro, idProyecto, orderByToSend }, thunkAPI) => {
    try {
      const ordenar_por = orderByToSend ? orderByToSend : '';
      const response = await jwtAxios.get('proyectos-plan-inversiones', {
        params: {
          page,
          limite: rowsPerPage,
          inversionista: nombreFiltro,
          id_proyecto: idProyecto,
          ordenar_por,
        },
      });

      const { datos, desde, hasta, ultima_pagina, total } = response.data;
      return { datos, desde, hasta, ultima_pagina, total };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.mensajes?.[0] || error.message || 'Ocurrió un error'
      );
    }
  }
);

export const onGetColeccionLigera = createAsyncThunk(
  'proyectosPlanInversiones/onGetColeccionLigera',
  async (_, thunkAPI) => {
    try {
      const response = await jwtAxios.get('proyectos-plan-inversiones', {
        params: { ligera: true },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.mensajes?.[0] || error.message || 'Ocurrió un error'
      );
    }
  }
);

export const onShow = createAsyncThunk(
  'proyectosPlanInversiones/onShow',
  async ({ id_inversionista, id_proyecto }, thunkAPI) => {
    try {
      const response = await jwtAxios.get(
        `proyectos-plan-inversiones/${id_inversionista}/${id_proyecto}`
      );

      return {
        id_proyecto: response.data?.id_proyecto || '',
        id_inversionista: response.data?.id_inversionista || '',
        plan_pagos: Array.isArray(response.data?.plan_pagos)
          ? response.data.plan_pagos
          : [],
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.mensajes?.[0] || error.message || 'Ocurrió un error'
      );
    }
  }
);

export const onUpdate = createAsyncThunk(
  'proyectosPlanInversiones/onUpdate',
  async ({ params, handleOnClose, updateColeccion }, thunkAPI) => {
    try {
      const response = await jwtAxios.put(
        `proyectos-plan-inversiones/${params.id_inversionista}/${params.id_proyecto}`,
        params
      );

      if (handleOnClose && typeof handleOnClose === 'function') {
        handleOnClose();
      }

      if (updateColeccion && typeof updateColeccion === 'function') {
        updateColeccion();
      }

      thunkAPI.dispatch(showMessage([response.data.mensajes[0], response.data.mensajes[1]]));

      return response.data.datos;
    } catch (error) {
      const mensajeError =
        error.response?.data?.mensajes?.[0] || 'Ocurrió un error';
      thunkAPI.dispatch(showMessage([mensajeError, 4]));
      return thunkAPI.rejectWithValue(mensajeError);
    }
  }
);

export const onDelete = createAsyncThunk(
  'proyectosPlanInversiones/onDelete',
  async ({ inversionista, proyecto, updateColeccion }, thunkAPI) => {
    try {
      const response = await jwtAxios.delete(`proyectos-plan-inversiones/${inversionista}/${proyecto}`);
      const mensaje = response.data.mensajes[0];
      const tipoMensaje = response.data.mensajes[1];

      thunkAPI.dispatch(showMessage([mensaje, tipoMensaje]));

      if (updateColeccion) {
        updateColeccion();
      }

      setTimeout(() => {
        thunkAPI.dispatch(hideMessage());
      }, 3000);

      return response.data;
    } catch (error) {
      const mensajeError =
        error.response?.data?.mensajes?.[0] || 'Ocurrió un error al eliminar.';
      thunkAPI.dispatch(showMessage([mensajeError, 4]));
      return thunkAPI.rejectWithValue(mensajeError);
    }
  }
);

export const onCreate = createAsyncThunk(
  'proyectosPlanInversiones/onCreate',
  async ({ params, handleOnClose, updateColeccion }, thunkAPI) => {
    try {
      const response = await jwtAxios.post('proyectos-plan-inversiones', params);

      if (handleOnClose) {
        handleOnClose();
      }

      if (updateColeccion) {
        updateColeccion();
      }

      const mensaje = response.data.mensajes[0];
      const tipoMensaje = response.data.mensajes[1];

      thunkAPI.dispatch(showMessage([mensaje, tipoMensaje]));
      return response.data.datos;
    } catch (error) {
      const mensajeError =
        error.response?.data?.mensajes?.[0] || 'Ocurrió un error';
      thunkAPI.dispatch(showMessage([mensajeError, 4]));
      return thunkAPI.rejectWithValue(mensajeError);
    }
  }
);

const proyectosPlanInversionesSlice = createSlice({
  name: 'proyectosPlanInversiones',
  initialState,
  reducers: {
    resetError(state) {
      state.error = null;
    },
    resetProyectosPlanInversionesActual(state) {
      state.proyectoPlanInversionActual = {
        id_proyecto: '',
        id_inversionista: '',
        plan_pagos: [],
      };
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
        state.proyectoPlanInversionActual = {
          id_proyecto: '',
          id_inversionista: '',
          plan_pagos: [],
        };
      })
      .addCase(onShow.fulfilled, (state, action) => {
        state.loading = false;
        state.proyectoPlanInversionActual = {
          id_proyecto: action.payload?.id_proyecto || '',
          id_inversionista: action.payload?.id_inversionista || '',
          plan_pagos: Array.isArray(action.payload?.plan_pagos)
            ? action.payload.plan_pagos
            : [],
        };
      })
      .addCase(onShow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.proyectoPlanInversionActual = {
          id_proyecto: '',
          id_inversionista: '',
          plan_pagos: [],
        };
      })

      .addCase(onUpdate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onUpdate.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.proyectoPlanInversionActual = action.payload || proyectoPlanInversionVacio;
      })
      .addCase(onUpdate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(onDelete.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onDelete.fulfilled, (state, action) => {
        state.loading = false;
        state.proyectoPlanInversionActual = proyectoPlanInversionVacio;
        state.message = null;
      })
      .addCase(onDelete.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(onCreate.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(onCreate.fulfilled, (state, action) => {
        state.loading = false;
        state.proyectoPlanInversionActual = action.payload || proyectoPlanInversionVacio;
      })
      .addCase(onCreate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  resetError,
  resetProyectosPlanInversionesActual,
  resetMessage,
} = proyectosPlanInversionesSlice.actions;

export default proyectosPlanInversionesSlice.reducer;
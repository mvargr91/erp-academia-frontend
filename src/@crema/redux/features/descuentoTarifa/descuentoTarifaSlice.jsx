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
  descuentoTarifaActual: null,
  matriz: {
    columnas: [],
    filas: [],
    numero_anios: 0,
  },
  loading: false,
  error: null,
  message: null,
};

export const onGetMatriz = createAsyncThunk(
  'descuentoTarifa/onGetMatriz',
  async (_, thunkAPI) => {
    try {
      const response = await jwtAxios.get('descuentos-tarifas/matriz/data');
      return response.data;
    } catch (error) {
      const mensajeError =
        error.response?.data?.mensaje || 'Ocurrió un error al obtener la matriz.';
      thunkAPI.dispatch(showMessage([mensajeError, 4]));
      return thunkAPI.rejectWithValue(mensajeError);
    }
  }
);

export const onCreateMatriz = createAsyncThunk(
  'descuentoTarifa/onCreateMatriz',
  async ({ params, handleOnClose }, thunkAPI) => {
    try {
      const response = await jwtAxios.post(
        'descuentos-tarifas/matriz/guardar',
        params
      );

      console.log(response.data);

      const mensaje = response.data.mensajes[0];
      thunkAPI.dispatch(showMessage([mensaje, 1]));

      if (handleOnClose && typeof handleOnClose === 'function') {
        handleOnClose();
      }

      setTimeout(() => {
        thunkAPI.dispatch(hideMessage());
      }, 3000);

      return response.data.data;
    } catch (error) {
      const mensajeError =
        error.response?.data?.mensaje || 'Ocurrió un error al guardar la matriz.';
      thunkAPI.dispatch(showMessage([mensajeError, 4]));
      return thunkAPI.rejectWithValue(mensajeError);
    }
  }
);

const descuentoTarifaSlice = createSlice({
  name: 'descuentoTarifa',
  initialState,
  reducers: {
    resetError(state) {
      state.error = null;
    },
    resetDescuentoTarifaActual(state) {
      state.descuentoTarifaActual = null;
    },
    resetMessage(state) {
      state.message = null;
    },
    resetMatriz(state) {
      state.matriz = {
        columnas: [],
        filas: [],
        numero_anios: 0,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(onGetMatriz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onGetMatriz.fulfilled, (state, action) => {
        state.loading = false;
        state.matriz = action.payload || {
          columnas: [],
          filas: [],
          numero_anios: 0,
        };
      })
      .addCase(onGetMatriz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(onCreateMatriz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onCreateMatriz.fulfilled, (state, action) => {
        state.loading = false;
        state.matriz = action.payload || state.matriz;
      })
      .addCase(onCreateMatriz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  resetError,
  resetDescuentoTarifaActual,
  resetMessage,
  resetMatriz,
} = descuentoTarifaSlice.actions;

export default descuentoTarifaSlice.reducer;
// src/redux/features/copiaSeguridad/copiaSeguridadSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import jwtAxios from '../../../services/auth/jwt-auth';

// Estado inicial
const initialState = {
  rows: [],
  desde: 0,
  hasta: 0,
  ultima_pagina: 1,
  total: 0,
  coleccionLigera: [],
  loading: false,
  error: null,
  message: null,
};

// Acciones asíncronas (Thunks)
export const onGetBackUp = createAsyncThunk(
  'copiaSeguridad/onGetBackUp',
  async (_, thunkAPI) => {
    try {
      const response = await jwtAxios.post('backup');
      return response.data;
    } catch (error) {
      console.error("Error en onGetBackUp:", error);
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error inesperado al crear backup');
    }
  }
);



// Slice de copiaSeguridad
const copiaSeguridadSlice = createSlice({
  name: 'copiaSeguridad',
  initialState,
  reducers: {
    resetError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Obtener colección de copiaSeguridad
      .addCase(onGetBackUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onGetBackUp.fulfilled, (state, action) => {
        state;
        state.loading = false;
        state.rows= action.payload.datos; 
      })
      .addCase(onGetBackUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

  },
});

// Exportar acciones y reducer
export const { resetError } = copiaSeguridadSlice.actions;
export default copiaSeguridadSlice.reducer;

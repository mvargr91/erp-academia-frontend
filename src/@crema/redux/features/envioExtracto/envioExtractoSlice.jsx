// src/redux/features/envioExtracto/envioExtractoSlice.js
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
export const onGetExtractos = createAsyncThunk(
  'envioExtracto/onGetExtractos',
  async (_, thunkAPI) => {
    try {
      const response = await jwtAxios.post('extractos');
      return response.data; 
    } catch (error) {
      console.error("Error en onGetExtractos:", error);
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error inesperado al crear backup');
    }
  }
);



// Slice de envioExtracto
const envioExtractoSlice = createSlice({
  name: 'envioExtracto',
  initialState,
  reducers: {
    resetError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Obtener colección de envioExtracto
      .addCase(onGetExtractos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onGetExtractos.fulfilled, (state, action) => {
        state;
        state.loading = false;
        state.rows= action.payload.datos; 
      })
      .addCase(onGetExtractos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

  },
});

// Exportar acciones y reducer
export const { resetError } = envioExtractoSlice.actions;
export default envioExtractoSlice.reducer;

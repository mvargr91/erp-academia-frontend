// src/redux/features/descargaPortafolio/descargaPortafolioSlice.js
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
export const onGetDescargaPortafolio = createAsyncThunk(
  'descargaPortafolio/onGetDescargaPortafolio',
  async (_, thunkAPI) => {
    try {
      const response = await jwtAxios.get('exportar-portafolio', {
        responseType: 'blob', //
      });

      // Convierte el blob en una URL para descargar
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);

      return {
        status: 'success',
        url: blobUrl,
        filename: 'portafolio_inversiones.pdf',
      };
    } catch (error) {
      console.error("Error en onGetDescargaPortafolio:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Error inesperado al generar el PDF'
      );
    }
  }
);



// Slice de descargaPortafolio
const descargaPortafolioSlice = createSlice({
  name: 'descargaPortafolio',
  initialState,
  reducers: {
    resetError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Obtener colección de descargaPortafolio
      .addCase(onGetDescargaPortafolio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onGetDescargaPortafolio.fulfilled, (state, action) => {
        state;
        state.loading = false;
        state.rows= action.payload.datos; 
      })
      .addCase(onGetDescargaPortafolio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

  },
});

// Exportar acciones y reducer
export const { resetError } = descargaPortafolioSlice.actions;
export default descargaPortafolioSlice.reducer;

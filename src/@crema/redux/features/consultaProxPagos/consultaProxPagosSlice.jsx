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
export const onGetProxPagos = createAsyncThunk(
  'consultaProxPagos/onGetProxPagos',
  async ({ fechaDesdeFiltro,fechaHastaFiltro,tipoConceptoFiltro,inversionistaFiltro,}, thunkAPI) => {
    try {
      const fechaDesdeAux = fechaDesdeFiltro ? fechaDesdeFiltro : '';
      const fechaHastaAux = fechaHastaFiltro ? fechaHastaFiltro : '';
      const tipoConceptoFiltroAux = tipoConceptoFiltro ? tipoConceptoFiltro : '';
      const inversionistaFiltroAux = inversionistaFiltro ? inversionistaFiltro : '';
      const response = await jwtAxios.get('programaciones/resumenSemanal', {
          params: {
            fechaInicial: fechaDesdeAux,
            fechaFinal: fechaHastaAux,
            nombre: inversionistaFiltroAux,
            concepto: tipoConceptoFiltroAux,
          },
        });
      return response.data; 
    } catch (error) {
      console.error("Error en onGetBackUp:", error);
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error inesperado');
    }
  }
);

// Acciones asíncronas (Thunks)
export const onGetHcaPagos = createAsyncThunk(
  'consultaProxPagos/onGetHcaPagos',
  async ({ fechaDesdeFiltro,fechaHastaFiltro,tipoConceptoFiltro,inversionistaFiltro,}, thunkAPI) => {
    try {
      const fechaDesdeAux = fechaDesdeFiltro ? fechaDesdeFiltro : '';
      const fechaHastaAux = fechaHastaFiltro ? fechaHastaFiltro : '';
      const tipoConceptoFiltroAux = tipoConceptoFiltro ? tipoConceptoFiltro : '';
      const inversionistaFiltroAux = inversionistaFiltro ? inversionistaFiltro : '';
      const response = await jwtAxios.get('programaciones/historico-pagos', {
          params: {
            fechaInicial: fechaDesdeAux,
            fechaFinal: fechaHastaAux,
            nombre: inversionistaFiltroAux,
            concepto: tipoConceptoFiltroAux,
          },
        });
      return response.data; 
    } catch (error) {
      console.error("Error en onGetHcaPagos:", error);
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error inesperado');
    }
  }
);


// Slice de copiaSeguridad
const consultaProxPagosSlice = createSlice({
  name: 'consultaProxPagos',
  initialState,
  reducers: {
    resetError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Obtener colección de copiaSeguridad
      .addCase(onGetProxPagos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onGetProxPagos.fulfilled, (state, action) => {
       state;
        state.loading = false;
        state.rows = action.payload.datos ; 
        state.desde = action.payload.desde ;
        state.hasta = action.payload.hasta;
        state.ultima_pagina = action.payload.ultima_pagina ;
        state.total = action.payload.total;
      })
      .addCase(onGetProxPagos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Obtener colección de histico de pagos
      .addCase(onGetHcaPagos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onGetHcaPagos.fulfilled, (state, action) => {
       state;
        state.loading = false;
        state.rows = action.payload.datos; 
        state.desde = action.payload.desde;
        state.hasta = action.payload.hasta;
        state.ultima_pagina = action.payload.ultima_pagina;
        state.total = action.payload.total;
      })
      .addCase(onGetHcaPagos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

  },
});

// Exportar acciones y reducer
export const { resetError } = consultaProxPagosSlice.actions;
export default consultaProxPagosSlice.reducer;

// src/redux/features/auditorias/auditoriasSlice.js
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
export const onGetColeccion = createAsyncThunk(
    'auditoria/onGetColeccion',
    async ({
      page,
      rowsPerPage,
      orderByToSend,
      nombreRecursoFiltro,
      descripcionRecursoFiltro,
      fechaDesdeFiltro,
      fechaHastaFiltro,
      accionFiltro,}, thunkAPI) => {
      try {
        const ordenar_por = orderByToSend ? orderByToSend : '';
        const nombre_recursoAux = nombreRecursoFiltro ? nombreRecursoFiltro : '';
        const descripcion_recursoAux = descripcionRecursoFiltro ? descripcionRecursoFiltro : '';
        const fecha_desdeAux = fechaDesdeFiltro ? fechaDesdeFiltro : '';
        const fecha_hastaAux = fechaHastaFiltro ? fechaHastaFiltro : '';
        const accionAux = accionFiltro ? accionFiltro : '';
        const response = await jwtAxios.get('auditoria-tablas',
          {
            params: {
              page: page,
              limite: rowsPerPage,
              ordenar_por: ordenar_por,
              nombre_recurso: nombre_recursoAux,
              descripcion_recurso: descripcion_recursoAux,
              fecha_desde: fecha_desdeAux,
              fecha_hasta: fecha_hastaAux,
              accion: accionAux,
            },
          }
        );
        return response.data;
      } catch (error) {
        console.error("Error en onGetColeccion:", error);
        dispatch(fetchSuccess());
        return thunkAPI.rejectWithValue(messages['message.somethingWentWrong'] || error.message);
      }
    }
);



// Slice de auditorias
const auditoriasSlice = createSlice({
  name: 'auditoria',
  initialState,
  reducers: {
    resetError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Obtener colección de auditorias
      .addCase(onGetColeccion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onGetColeccion.fulfilled, (state, action) => {
        state;
        state.loading = false;
        state.rows= action.payload.datos; 
        state.desde = action.payload.desde;
        state.hasta = action.payload.hasta;
        state.ultima_pagina = action.payload.ultima_pagina ;
        state.total = action.payload.total;
      })
      .addCase(onGetColeccion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

  },
});

// Exportar acciones y reducer
export const { resetError, resetauditoriaActual, resetMessage } = auditoriasSlice.actions;
export default auditoriasSlice.reducer;

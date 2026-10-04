// Sede elegida en el selector del encabezado. Se envía al API en la cabecera X-Sede (igual que
// X-Academia): con una sede, listados y panel se filtran por ella; sin sede se ven todas.
// La elección es por navegador (localStorage), y la lista de sedes se guarda para pintar
// las tablas sin esperar a la API.
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import jwtAxios from '../../../services/auth/jwt-auth';
import environment from '../../../../env';

const CLAVE_SEDE = `erp-sede:${environment.ACADEMIA}`;
const CLAVE_LISTA = `erp-sedes:${environment.ACADEMIA}`;

const leer = (clave, porDefecto) => {
  try {
    return JSON.parse(localStorage.getItem(clave)) ?? porDefecto;
  } catch {
    return porDefecto;
  }
};

const aplicarCabecera = (id) => {
  if (id) {
    jwtAxios.defaults.headers.common['X-Sede'] = id;
  } else {
    delete jwtAxios.defaults.headers.common['X-Sede'];
  }
};

const idInicial = leer(CLAVE_SEDE, null);
aplicarCabecera(idInicial);

export const cargarSedes = createAsyncThunk('sedeActual/cargarSedes', async () => {
  const { data } = await jwtAxios.get('sedes', { params: { ligera: 1 } });
  return data;
});

const slice = createSlice({
  name: 'sedeActual',
  initialState: { id: idInicial, lista: leer(CLAVE_LISTA, []) },
  reducers: {
    sedeElegida(state, action) {
      state.id = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(cargarSedes.fulfilled, (state, action) => {
      state.lista = action.payload;
      // La sede guardada pudo eliminarse o quedar inactiva.
      if (state.id && !action.payload.some((sede) => sede.id === state.id)) {
        state.id = null;
      }
    });
  },
});

/** Elige la sede del encabezado (null = todas). */
export const elegirSede = (id) => (dispatch) => {
  const sedeId = id || null;
  aplicarCabecera(sedeId);
  localStorage.setItem(CLAVE_SEDE, JSON.stringify(sedeId));
  dispatch(slice.actions.sedeElegida(sedeId));
};

// Mantiene cabecera y almacenamiento al día cuando la lista cambia desde la API.
export const sincronizarSedes = () => async (dispatch, getState) => {
  await dispatch(cargarSedes());
  const { id, lista } = getState().sedeActual;
  aplicarCabecera(id);
  localStorage.setItem(CLAVE_SEDE, JSON.stringify(id));
  localStorage.setItem(CLAVE_LISTA, JSON.stringify(lista));
};

export default slice.reducer;

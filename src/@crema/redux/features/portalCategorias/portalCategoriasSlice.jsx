// src/@crema/redux/features/portalCategorias/portalCategoriasSlice.jsx
// Portal: categorías activas (barra de categorías).
// Endpoints sin autenticación (v1/publico/*).
import { createCrudSlice } from '../../helpers/createCrudSlice';

const { slice, thunks } = createCrudSlice({
  name: 'portalCategorias',
  endpoint: 'publico/categorias',
});

export const { onGetColeccion, onShow } = thunks;

export const { resetError, resetActual, resetColeccion } = slice.actions;
export default slice.reducer;

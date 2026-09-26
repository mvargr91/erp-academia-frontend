// src/@crema/redux/features/portalPromociones/portalPromocionesSlice.jsx
// Portal: promociones vigentes con sus experiencias.
// Endpoints sin autenticación (v1/publico/*).
import { createCrudSlice } from '../../helpers/createCrudSlice';

const { slice, thunks } = createCrudSlice({
  name: 'portalPromociones',
  endpoint: 'publico/promociones',
});

export const { onGetColeccion, onShow } = thunks;

export const { resetError, resetActual, resetColeccion } = slice.actions;
export default slice.reducer;

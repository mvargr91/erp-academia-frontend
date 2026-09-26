// src/@crema/redux/features/portalDestinos/portalDestinosSlice.jsx
// Portal: destinos activos.
// Endpoints sin autenticación (v1/publico/*).
import { createCrudSlice } from '../../helpers/createCrudSlice';

const { slice, thunks } = createCrudSlice({
  name: 'portalDestinos',
  endpoint: 'publico/destinos',
});

export const { onGetColeccion, onShow } = thunks;

export const { resetError, resetActual, resetColeccion } = slice.actions;
export default slice.reducer;

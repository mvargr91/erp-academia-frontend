// src/@crema/redux/features/portalExperiencias/portalExperienciasSlice.jsx
// Portal: experiencias publicadas (listado para tarjetas y detalle por slug con onShow(slug)).
// Endpoints sin autenticación (v1/publico/*).
import { createCrudSlice } from '../../helpers/createCrudSlice';

const { slice, thunks } = createCrudSlice({
  name: 'portalExperiencias',
  endpoint: 'publico/experiencias',
});

export const { onGetColeccion, onShow } = thunks;

export const { resetError, resetActual, resetColeccion } = slice.actions;
export default slice.reducer;

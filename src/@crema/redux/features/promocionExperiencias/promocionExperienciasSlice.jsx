// src/@crema/redux/features/promocionExperiencias/promocionExperienciasSlice.jsx
// Promociones: experiencias asociadas. Requiere filtros: { promocion_id }.
import { createCrudSlice } from '../../helpers/createCrudSlice';

const { slice, thunks } = createCrudSlice({
  name: 'promocionExperiencias',
  endpoint: 'promocion-experiencias',
});

export const {
  onGetColeccion,
  onGetColeccionLigera,
  onShow,
  onCreate,
  onUpdate,
  onDelete,
} = thunks;

export const { resetError, resetActual, resetColeccion } = slice.actions;
export default slice.reducer;

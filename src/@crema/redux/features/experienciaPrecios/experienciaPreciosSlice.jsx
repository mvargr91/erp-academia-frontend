// src/@crema/redux/features/experienciaPrecios/experienciaPreciosSlice.jsx
// Experiencias: tarifas. Requiere filtros: { experiencia_id }.
import { createCrudSlice } from '../../helpers/createCrudSlice';

const { slice, thunks } = createCrudSlice({
  name: 'experienciaPrecios',
  endpoint: 'experiencia-precios',
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

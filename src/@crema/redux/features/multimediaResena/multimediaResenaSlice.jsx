// src/@crema/redux/features/multimediaResena/multimediaResenaSlice.jsx
// Reseñas: archivos adjuntos. Requiere filtros: { resena_id }.
import { createCrudSlice } from '../../helpers/createCrudSlice';

const { slice, thunks } = createCrudSlice({
  name: 'multimediaResena',
  endpoint: 'multimedia-resena',
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

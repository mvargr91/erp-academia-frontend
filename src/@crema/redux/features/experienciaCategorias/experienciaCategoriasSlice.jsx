// src/@crema/redux/features/experienciaCategorias/experienciaCategoriasSlice.jsx
// Experiencias: categorías asignadas. Requiere filtros: { experiencia_id }.
import { createCrudSlice } from '../../helpers/createCrudSlice';

const { slice, thunks } = createCrudSlice({
  name: 'experienciaCategorias',
  endpoint: 'experiencia-categorias',
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

// src/@crema/redux/features/favoritos/favoritosSlice.jsx
// Turismo: favoritos del usuario. Requiere filtros: { usuario_id }.
import { createCrudSlice } from '../../helpers/createCrudSlice';

const { slice, thunks } = createCrudSlice({
  name: 'favoritos',
  endpoint: 'favoritos',
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

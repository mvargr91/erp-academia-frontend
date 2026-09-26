// src/@crema/redux/features/caracteristicas/caracteristicasSlice.jsx
// Turismo: características (incluye/no incluye de las experiencias).
import { createCrudSlice } from '../../helpers/createCrudSlice';

const { slice, thunks } = createCrudSlice({
  name: 'caracteristicas',
  endpoint: 'caracteristicas',
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

// src/@crema/redux/features/experiencias/experienciasSlice.jsx
// Experiencias: experiencias turísticas (con flujo de estados).
import { createCrudSlice } from '../../helpers/createCrudSlice';

const { slice, thunks } = createCrudSlice({
  name: 'experiencias',
  endpoint: 'experiencias',
  acciones: { onCambiarEstado: 'estado' },
});

export const {
  onGetColeccion,
  onGetColeccionLigera,
  onShow,
  onCreate,
  onUpdate,
  onDelete,
  onCambiarEstado,
} = thunks;

export const { resetError, resetActual, resetColeccion } = slice.actions;
export default slice.reducer;

// src/@crema/redux/features/reservas/reservasSlice.jsx
// Reservas: reservas (con flujo de estados).
import { createCrudSlice } from '../../helpers/createCrudSlice';

const { slice, thunks } = createCrudSlice({
  name: 'reservas',
  endpoint: 'reservas',
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

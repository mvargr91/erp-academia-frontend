// src/@crema/redux/features/notificaciones/notificacionesSlice.jsx
// Turismo: notificaciones del usuario. Requiere filtros: { usuario_id, leido? }.
import { createCrudSlice } from '../../helpers/createCrudSlice';

const { slice, thunks } = createCrudSlice({
  name: 'notificaciones',
  endpoint: 'notificaciones',
  acciones: { onMarcarLeida: 'leida' },
});

export const {
  onGetColeccion,
  onGetColeccionLigera,
  onShow,
  onCreate,
  onUpdate,
  onDelete,
  onMarcarLeida,
} = thunks;

export const { resetError, resetActual, resetColeccion } = slice.actions;
export default slice.reducer;

// src/@crema/redux/features/acompanantesReserva/acompanantesReservaSlice.jsx
// Reservas: acompañantes. Requiere filtros: { reserva_id }.
import { createCrudSlice } from '../../helpers/createCrudSlice';

const { slice, thunks } = createCrudSlice({
  name: 'acompanantesReserva',
  endpoint: 'acompanantes-reserva',
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

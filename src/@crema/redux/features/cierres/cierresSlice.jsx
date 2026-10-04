// Academia: cierres (vacaciones/eventos) — esas fechas no tienen clase y los ciclos se corren.
import { createCrudSlice } from '../../helpers/createCrudSlice';

const { slice, thunks } = createCrudSlice({
  name: 'cierres',
  endpoint: 'cierres',
});

export const { onGetColeccion, onShow, onCreate, onUpdate, onDelete } = thunks;

export const { resetError, resetActual, resetColeccion } = slice.actions;
export default slice.reducer;

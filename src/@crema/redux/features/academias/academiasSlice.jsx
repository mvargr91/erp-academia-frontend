// Administración ERP: academias clientes (solo desde la academia administradora).
import { createCrudSlice } from '../../helpers/createCrudSlice';

const { slice, thunks } = createCrudSlice({
  name: 'academias',
  endpoint: 'academias',
});

export const { onGetColeccion, onGetColeccionLigera, onShow, onCreate, onUpdate } = thunks;

export const { resetError, resetActual, resetColeccion } = slice.actions;
export default slice.reducer;

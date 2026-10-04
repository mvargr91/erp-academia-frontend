// Academia: clases personalizadas (privadas o de pareja), descontadas del paquete de cada alumno.
import { createCrudSlice } from '../../helpers/createCrudSlice';

const { slice, thunks } = createCrudSlice({
  name: 'clasesPrivadas',
  endpoint: 'clases-privadas',
});

export const { onGetColeccion, onShow, onCreate, onUpdate, onDelete } = thunks;

export const { resetError, resetActual, resetColeccion } = slice.actions;
export default slice.reducer;

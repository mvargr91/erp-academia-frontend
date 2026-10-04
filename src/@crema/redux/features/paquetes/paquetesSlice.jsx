// Academia: paquetes de clases comprados por los alumnos (cursos grupales y clases privadas).
import { createCrudSlice } from '../../helpers/createCrudSlice';

const { slice, thunks } = createCrudSlice({
  name: 'paquetes',
  endpoint: 'paquetes',
});

export const { onGetColeccion, onGetColeccionLigera, onShow, onCreate, onUpdate, onDelete } = thunks;

export const { resetError, resetActual, resetColeccion } = slice.actions;
export default slice.reducer;

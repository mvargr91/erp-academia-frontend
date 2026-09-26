// Academia: cursos / clases (con matrícula de alumnos).
import { createCrudSlice } from '../../helpers/createCrudSlice';

const { slice, thunks } = createCrudSlice({
  name: 'cursos',
  endpoint: 'cursos',
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

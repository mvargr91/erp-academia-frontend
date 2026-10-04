// Administración ERP: festivos nacionales (compartidos por todas las academias).
import { createCrudSlice } from '../../helpers/createCrudSlice';

const { slice, thunks } = createCrudSlice({
  name: 'festivos',
  endpoint: 'festivos',
});

export const { onGetColeccion, onShow, onCreate, onDelete } = thunks;

export const { resetError, resetActual, resetColeccion } = slice.actions;
export default slice.reducer;

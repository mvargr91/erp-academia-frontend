// Administración ERP: pagos recibidos de las academias (con soporte opcional).
import { createCrudSlice } from '../../helpers/createCrudSlice';

const { slice, thunks } = createCrudSlice({
  name: 'pagosAcademias',
  endpoint: 'pagos-academias',
});

export const { onGetColeccion, onShow, onCreate, onDelete } = thunks;

export const { resetError, resetActual, resetColeccion } = slice.actions;
export default slice.reducer;

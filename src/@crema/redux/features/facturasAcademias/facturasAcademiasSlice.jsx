// Administración ERP: cuentas de cobro a las academias (las genera el proceso diario del backend).
import { createCrudSlice } from '../../helpers/createCrudSlice';

const { slice, thunks } = createCrudSlice({
  name: 'facturasAcademias',
  endpoint: 'facturas-academias',
});

export const { onGetColeccion, onGetColeccionLigera, onShow, onUpdate } = thunks;

export const { resetError, resetActual, resetColeccion } = slice.actions;
export default slice.reducer;

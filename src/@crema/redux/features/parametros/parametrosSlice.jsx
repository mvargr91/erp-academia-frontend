// Configuración: parámetros del sistema de la academia (los códigos los define el sistema).
import { createCrudSlice } from '../../helpers/createCrudSlice';

const { slice, thunks } = createCrudSlice({
  name: 'parametros',
  endpoint: 'parametros',
});

export const { onGetColeccion, onShow, onUpdate } = thunks;

export const { resetError, resetActual, resetColeccion } = slice.actions;
export default slice.reducer;

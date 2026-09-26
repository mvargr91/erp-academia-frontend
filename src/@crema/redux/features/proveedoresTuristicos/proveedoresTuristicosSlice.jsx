// src/@crema/redux/features/proveedoresTuristicos/proveedoresTuristicosSlice.jsx
// Proveedores: proveedores turísticos (con flujo de verificación).
import { createCrudSlice } from '../../helpers/createCrudSlice';

const { slice, thunks } = createCrudSlice({
  name: 'proveedoresTuristicos',
  endpoint: 'proveedores-turisticos',
  acciones: { onVerificar: 'verificar' },
});

export const {
  onGetColeccion,
  onGetColeccionLigera,
  onShow,
  onCreate,
  onUpdate,
  onDelete,
  onVerificar,
} = thunks;

export const { resetError, resetActual, resetColeccion } = slice.actions;
export default slice.reducer;

// src/@crema/redux/features/documentosProveedorTuristico/documentosProveedorTuristicoSlice.jsx
// Proveedores: documentos del proveedor turístico. Requiere filtros: { proveedor_id }.
import { createCrudSlice } from '../../helpers/createCrudSlice';

const { slice, thunks } = createCrudSlice({
  name: 'documentosProveedorTuristico',
  endpoint: 'documentos-proveedor',
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

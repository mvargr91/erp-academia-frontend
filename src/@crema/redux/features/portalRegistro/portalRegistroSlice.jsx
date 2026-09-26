// src/@crema/redux/features/portalRegistro/portalRegistroSlice.jsx
// Portal: registro público de viajeros (rol Cliente) y proveedores (rol Proveedor).
// POST v1/publico/registro — sin autenticación.
import { createCrudSlice } from '../../helpers/createCrudSlice';

const { slice, thunks } = createCrudSlice({
  name: 'portalRegistro',
  endpoint: 'publico/registro',
});

export const { onCreate } = thunks;

export const { resetError, resetActual } = slice.actions;
export default slice.reducer;

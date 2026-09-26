// src/@crema/redux/features/usuariosProveedor/usuariosProveedorSlice.jsx
// Usuarios con rol Proveedor, para vincular una cuenta a su ficha de proveedor turístico.
// Uso: onGetColeccionLigera({ rol: 'Proveedor' })
import { createCrudSlice } from '../../helpers/createCrudSlice';

const { slice, thunks } = createCrudSlice({
  name: 'usuariosProveedor',
  endpoint: 'usuarios',
});

export const { onGetColeccionLigera } = thunks;

export default slice.reducer;

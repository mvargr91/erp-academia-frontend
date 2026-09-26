// src/@crema/redux/features/cuenta/cuentaSlice.jsx
// "Mi cuenta": datos del usuario autenticado (cualquier rol). No usa createCrudSlice
// porque el recurso no lleva id: el backend lo resuelve desde el token.
//   GET v1/cuenta            -> { id, nombre, identificacion_usuario, correo_electronico, rol, miembro_desde, proveedor }
//   PUT v1/cuenta            -> datos personales
//   PUT v1/cuenta/clave      -> cambio de contraseña (pide la actual)
//   PUT v1/cuenta/proveedor  -> datos del negocio (solo si tiene proveedor vinculado)
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import jwtAxios from '../../../services/auth/jwt-auth';
import { showMessage } from '../cammon/commonSlice';
import { actualizarUsuarioSesion } from '../auth/authSlice';
import { extraerMensajeError } from '../../helpers/createCrudSlice';
import { ERROR_TYPE } from '../../../../shared/constants/Constantes';

const guardar = (tipo, url, alGuardar) =>
  createAsyncThunk(`cuenta/${tipo}`, async ({ params, onSuccess }, thunkAPI) => {
    try {
      const response = await jwtAxios.put(url, params);
      alGuardar?.(response.data.datos, thunkAPI);
      if (typeof onSuccess === 'function') onSuccess();
      thunkAPI.dispatch(showMessage(response.data.mensajes));
      return response.data.datos ?? null;
    } catch (error) {
      const mensajeError = extraerMensajeError(error);
      thunkAPI.dispatch(showMessage([mensajeError, ERROR_TYPE]));
      return thunkAPI.rejectWithValue(mensajeError);
    }
  });

export const onGetCuenta = createAsyncThunk('cuenta/onGetCuenta', async (_, thunkAPI) => {
  try {
    const response = await jwtAxios.get('cuenta');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(extraerMensajeError(error));
  }
});

// El nombre y el correo también se ven en el encabezado: se sincronizan con la sesión.
export const onUpdateCuenta = guardar('onUpdateCuenta', 'cuenta', (datos, { dispatch }) =>
  dispatch(actualizarUsuarioSesion({ nombre: datos.nombre, correo_electronico: datos.correo_electronico })),
);
export const onCambiarClave = guardar('onCambiarClave', 'cuenta/clave');
export const onUpdateNegocio = guardar('onUpdateNegocio', 'cuenta/proveedor');

const cuentaSlice = createSlice({
  name: 'cuenta',
  initialState: { datos: null, loading: false, saving: false, error: null },
  reducers: {
    resetCuenta(state) {
      state.datos = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(onGetCuenta.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onGetCuenta.fulfilled, (state, action) => {
        state.loading = false;
        state.datos = action.payload;
      })
      .addCase(onGetCuenta.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    [onUpdateCuenta, onCambiarClave, onUpdateNegocio].forEach((thunk) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.saving = true;
        })
        .addCase(thunk.fulfilled, (state, action) => {
          state.saving = false;
          state.datos = action.payload ?? state.datos;
        })
        .addCase(thunk.rejected, (state) => {
          state.saving = false;
        });
    });
  },
});

export const { resetCuenta } = cuentaSlice.actions;
export default cuentaSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import jwtAxios from '../../../services/auth/jwt-auth';

// Estado inicial
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  message: null,
};

// Acción asíncrona para hacer login y obtener los datos del usuario
export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }, thunkAPI) => {
    try {
      // Petición para obtener el token
      const response = await jwtAxios.post('/users/token', { username, password });
      const { access_token } = response.data;

      // Guardar el token en localStorage
      localStorage.setItem('token', access_token);

      // Petición para obtener los datos del usuario con el token
      const res = await jwtAxios.get('/users/current/session', {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      const user = res.data;

      // Guardar los datos del usuario en localStorage
      localStorage.setItem('user', JSON.stringify(user));

      // Retornar el token y el usuario
      return { user, token: access_token };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Error desconocido');
    }
  }
);

// Acción asíncrona para cargar el usuario desde localStorage
export const loadUser = createAsyncThunk('auth/loadUser', async (_, thunkAPI) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (token && user) {
    return { user: JSON.parse(user), token };
  } else {
    return thunkAPI.rejectWithValue('No user data found');
  }
});

// Acción asíncrona para verificar si el usuario está autenticado y cargar su información
export const getAuthUser = createAsyncThunk('auth/getAuthUser', async (_, thunkAPI) => {
  const dispatch = thunkAPI.dispatch;

  try {
    dispatch(fetchStart());
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch(fetchSuccess());
      return { user: undefined, token: null, isAuthenticated: false };
    }

    const response = await jwtAxios.get('/users/current/session', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const user = response.data;

    return { user, token, isAuthenticated: true };
  } catch (error) {
    localStorage.removeItem('token');
    dispatch(fetchSuccess());
    return thunkAPI.rejectWithValue('Error al cargar el usuario');
  }
});

// Acción asíncrona para el reseteo de contraseña (enviar email)
export const onResetCognitoPassword = createAsyncThunk(
  'auth/resetCognitoPassword',
  async ({ email }, thunkAPI) => {
    try {
      const params = { email };
      const response = await jwtAxios.post('forgot-password', params);

      if (response.data) {
        const mensaje = response.data['mensajes'][0];
        thunkAPI.dispatch(showMessage(mensaje));
        thunkAPI.dispatch(resetMessage());
        return response.data['mensajes'][0];
      } else {
        thunkAPI.dispatch(showMessage(mensaje));
        thunkAPI.dispatch(resetMessage());
        return thunkAPI.rejectWithValue(response.data['mensajes'][0]);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.mensajes[0] || 'Error desconocido';
      thunkAPI.dispatch(fetchError(errorMessage));
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

// Acción asíncrona para el cambio de contraseña
export const onResetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ email, token, password, password_confirmation, navigate }, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;

    try {
      
      const params = {
        token,
        email,
        password,
        password_confirmation,
      };
      const response = await jwtAxios.post('reset-password', params);

      if (response.data) {
        const mensaje = response.data['mensajes'][0];
        thunkAPI.dispatch(showMessage(mensaje));
        thunkAPI.dispatch(resetMessage());
        
        return response.data['mensajes'][0];
      } else {
        thunkAPI.dispatch(showMessage(mensaje));
        thunkAPI.dispatch(resetMessage());
        return thunkAPI.rejectWithValue(response.data['mensajes'][0]);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.mensajes[0] || 'Error desconocido';
      dispatch(fetchError(errorMessage));
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

// Acción para cerrar sesión
export const logoutUser = (navigate) => (dispatch) => {
  dispatch(logout());
  localStorage.clear();
  navigate('/signin', { replace: true });
};

// Slice de autenticación
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.message = null;
      localStorage.clear();
    },
    fetchStart: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    fetchSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    fetchError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    showMessage: (state, action) => {
      state.message = action.payload;
    },
    clearMessage: (state) => {
      state.message = null;
    },
    // "Mi cuenta" cambió nombre/correo: refleja el cambio en el encabezado sin volver a iniciar sesión.
    actualizarUsuarioSesion: (state, action) => {
      if (!state.user?.usuario) return;
      state.user.usuario = { ...state.user.usuario, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loadUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      .addCase(getAuthUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAuthUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = action.payload.isAuthenticated;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(getAuthUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
        state.user = null;
        state.token = null;
      })
      .addCase(onResetCognitoPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onResetCognitoPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(onResetCognitoPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(onResetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onResetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(onResetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Exportar acciones y reducer
export const { logout, fetchStart, fetchSuccess, fetchError, showMessage, clearMessage, actualizarUsuarioSesion } = authSlice.actions;
export default authSlice.reducer;

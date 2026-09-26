// src/redux/features/roles/rolesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import jwtAxios from '../../../services/auth/jwt-auth';
import { showMessage , hideMessage} from '../cammon/commonSlice';

// Estado inicial
const initialState = {
  rows: [],
  desde: 0,
  hasta: 0,
  ultima_pagina: 1,
  total: 0,
  coleccionLigera: [],
  rolActual: null,
  loading: false,
  error: null,
  message: null,
  permisos:null,
  otorgar:null,
  revocar:null,
};

// Acciones asíncronas (Thunks)
export const onGetColeccion = createAsyncThunk(
    'roles/onGetColeccion',
    async ({page, rowsPerPage, nombreFiltro, orderByToSend}, thunkAPI) => {
      try {
        const nombreAux = nombreFiltro ? nombreFiltro : '';
        const ordenar_por = orderByToSend ? orderByToSend : '';
        const response = await jwtAxios.get('roles', 
          {
            params: {
              page: page,
              limite: rowsPerPage,
              nombre: nombreAux,
              ordenar_por: ordenar_por,
            },
          }
        );
        // Supón que la estructura de la respuesta es como se espera
        const { datos, desde, hasta, ultima_pagina, total } = response.data;  
        return { datos, desde, hasta, ultima_pagina, total };
      } catch (error) {
        console.error("Error en onGetColeccion:", error);
        dispatch(fetchSuccess());
        return thunkAPI.rejectWithValue(messages['message.somethingWentWrong'] || error.message);
      }
    }
);  

export const onGetColeccionLigera = createAsyncThunk(
  'roles/onGetColeccionLigera',
  async (_, thunkAPI) => {
    try {
      const response = await jwtAxios.get('roles', {
        params: { ligera: true },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(messages['message.somethingWentWrong'] || error.message);
    }
  }
);

export const onGetPermisos = createAsyncThunk(
'roles/onGetPermisos',
  async ({ id, modulo, opcionSistema }, thunkAPI) => {
    const moduloAux = modulo ? modulo : '';
    const opcionSistemaAux = opcionSistema ? opcionSistema : '';
    try {
      const response = await jwtAxios.get(`roles/permisos/${id}`,{
        params: {
          modulo_id: moduloAux,
          option_id: opcionSistemaAux,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(messages['message.somethingWentWrong'] || error.message);
    }
  }
);

export const onOtorgarPermiso = createAsyncThunk(
  'roles/onOtorgarPermiso',
  async ({ params }, thunkAPI) => {
    try {
      const response = await jwtAxios.post('roles/permisos', params);
      
      // Si la respuesta es 204, devolvemos los datos manualmente
      if (response.status === 204) {
        return { permission_id: params.permission_id };
      }

      const mensaje = response.data.mensajes?.[0] || "Permiso otorgado con éxito";
      thunkAPI.dispatch(showMessage([mensaje, 1]));
      return response.data.datos || { permission_id: params.permission_id };
    } catch (error) {
      const mensajeError = error.response?.data?.mensajes?.[0] || "Ocurrió un error";
      thunkAPI.dispatch(showMessage([mensajeError, 4]));
      return thunkAPI.rejectWithValue(mensajeError);
    }
  }
);

export const onRevocarPermiso = createAsyncThunk(
  'roles/onRevocarPermiso',
  async ({ params }, thunkAPI) => {
    try {
      const response = await jwtAxios.put('roles/permisos', params);
      
      // Si la respuesta es 204, devolvemos los datos manualmente
      if (response.status === 204) {
        return { permission_id: params.permission_id };
      }

      const mensaje = response.data.mensajes?.[0] || "Permiso revocado con éxito";
      thunkAPI.dispatch(showMessage([mensaje, 1]));
      return response.data.datos || { permission_id: params.permission_id };
    } catch (error) {
      const mensajeError = error.response?.data?.mensajes?.[0] || "Ocurrió un error";
      thunkAPI.dispatch(showMessage([mensajeError, 4]));
      return thunkAPI.rejectWithValue(mensajeError);
    }
  }
);


export const onShow = createAsyncThunk(
  'roles/onShow',
  async (id, thunkAPI) => {
    try {
      const response = await jwtAxios.get(`roles/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(messages['message.somethingWentWrong'] || error.message);
    }
  }
);

export const onUpdate = createAsyncThunk(
  'roles/onUpdate',
  async ({ params, handleOnClose, updateColeccion }, thunkAPI) => {
    try {
      const response = await jwtAxios.put(`roles/${params.id}`, params);
      // Cierra el formulario y actualiza la colección
      handleOnClose();
      updateColeccion();
      // Extrae el mensaje de la respuesta y despáchalo
      const mensaje = response.data.mensajes[0]; // "El rol ha sido modificado."
      const tipoMensaje = response.data.mensajes[1]; // 1 (éxito)

      // Despacha showMessage con el mensaje y el tipo de mensaje
      thunkAPI.dispatch(showMessage([mensaje, tipoMensaje]));

      return response.data.datos;
    } catch (error) {
      // Extrae el mensaje de error del backend si está disponible
      const mensajeError = error.response?.data?.mensajes[0] || "Ocurrió un error";
      thunkAPI.dispatch(showMessage([mensajeError, 4]));

      return thunkAPI.rejectWithValue(mensajeError);
    }
  }
);

export const onDelete = createAsyncThunk(
  'roles/onDelete',
  async ({ id, updateColeccion }, thunkAPI) => {
    console.log(id)
    try {
      const response = await jwtAxios.delete(`roles/${id}`);
      updateColeccion();
      const mensaje = response.data.mensajes[0];
      const tipoMensaje = response.data.mensajes[1];

      thunkAPI.dispatch(showMessage([mensaje, tipoMensaje]));

      setTimeout(()=> {
        thunkAPI.dispatch(hideMessage([mensaje, tipoMensaje])); 
      }, 3000);
      
      return response.data;
    } catch (error) {
      const mensajeError = error.response?.data?.mensajes[0] || "Ocurrió un error";
      thunkAPI.dispatch(showMessage([mensajeError, 4]));
      return thunkAPI.rejectWithValue(mensajeError);
    }
  }
);

export const onCreate = createAsyncThunk(
  'roles/onCreate',
  async ({ params, handleOnClose, updateColeccion }, thunkAPI) => {
    try {
      const response = await jwtAxios.post('roles', params);
      handleOnClose();
      updateColeccion();
      const mensaje = response.data.mensajes[0];
      const tipoMensaje = response.data.mensajes[1];

      thunkAPI.dispatch(showMessage([mensaje, tipoMensaje]));
      return response.data.datos;
    } catch (error) {
      const mensajeError = error.response?.data?.mensajes[0] || "Ocurrió un error";
      thunkAPI.dispatch(showMessage([mensajeError, 4]));
      return thunkAPI.rejectWithValue(mensajeError);
    }
  }
);

// Slice de roles
const rolesSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    resetError(state) {
      state.error = null;
    },
    resetRolActual(state) {
      state.rolActual = null;
    },    
    resetMessage(state) {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Obtener colección de roles
      .addCase(onGetColeccion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onGetColeccion.fulfilled, (state, action) => {
        state;
        state.loading = false;
        state.rows = action.payload.datos ; 
        state.desde = action.payload.desde ;
        state.hasta = action.payload.hasta;
        state.ultima_pagina = action.payload.ultima_pagina ;
        state.total = action.payload.total;
      })
      .addCase(onGetColeccion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Obtener colección ligera de roles
      .addCase(onGetColeccionLigera.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onGetColeccionLigera.fulfilled, (state, action) => {
        state.loading = false;
        state.coleccionLigera = action.payload;
      })
      .addCase(onGetColeccionLigera.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Obtener colección de permisos
      .addCase(onGetPermisos.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.permisos = null;
      })
      .addCase(onGetPermisos.fulfilled, (state, action) => {
        state.loading = false;
        state.permisos = action.payload;
      })
      .addCase(onGetPermisos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.permisos = null;
      })

      .addCase(onOtorgarPermiso.fulfilled, (state, action) => {
        state.loading = false;
        state.otorgar = action.payload;
      
        if (state.permisos) {
          state.permisos = state.permisos.map(modulo => ({
            ...modulo,
            opciones: modulo.opciones.map(opcion => ({
              ...opcion,
              permisos: opcion.permisos.map(permiso =>
                permiso.id === action.payload.permission_id // ✅ Usamos `permission_id` del 204
                  ? { ...permiso, permitido: true }
                  : permiso
              ),
            })),
          }));
        }
      })
      
      .addCase(onRevocarPermiso.fulfilled, (state, action) => {
        state.loading = false;
        state.revocar = action.payload;
      
        if (state.permisos) {
          state.permisos = state.permisos.map(modulo => ({
            ...modulo,
            opciones: modulo.opciones.map(opcion => ({
              ...opcion,
              permisos: opcion.permisos.map(permiso =>
                permiso.id === action.payload.permission_id // ✅ Usamos `permission_id` del 204
                  ? { ...permiso, permitido: false }
                  : permiso
              ),
            })),
          }));
        }
      })      
      

      // Mostrar un rol
      .addCase(onShow.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onShow.fulfilled, (state, action) => {
        state.loading = false;
        state.rolActual = action.payload;
      })
      .addCase(onShow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Actualizar un rol
      .addCase(onUpdate.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.rolActual = null;
      })
      .addCase(onUpdate.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.rolActual = action.payload;
      })
      .addCase(onUpdate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.rolActual = null;
      })

      // Eliminar un rol
      .addCase(onDelete.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onDelete.fulfilled, (state, action) => {
        state.loading = false;
        state.rolActual = action.payload;
        state.message = null;
      })
      .addCase(onDelete.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Crear un rol
      .addCase(onCreate.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(onCreate.fulfilled, (state, action) => {
        state.loading = false;
        state.rolActual = action.datos;
        state.message = action.payload[0];
      })
      .addCase(onCreate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = action.payload[0];
      });
  },
});

// Exportar acciones y reducer
export const { resetError, resetRolActual, resetMessage } = rolesSlice.actions;
export default rolesSlice.reducer;

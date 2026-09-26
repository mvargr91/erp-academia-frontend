// src/@crema/redux/features/experienciaDisponibilidad/experienciaDisponibilidadSlice.jsx
// Experiencias: disponibilidad por fecha. Requiere filtros: { experiencia_id, fecha_desde?, fecha_hasta? }.
import { createCrudSlice } from '../../helpers/createCrudSlice';

const { slice, thunks } = createCrudSlice({
  name: 'experienciaDisponibilidad',
  endpoint: 'experiencia-disponibilidad',
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

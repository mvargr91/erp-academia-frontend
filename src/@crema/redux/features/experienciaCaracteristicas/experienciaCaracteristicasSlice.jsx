// src/@crema/redux/features/experienciaCaracteristicas/experienciaCaracteristicasSlice.jsx
// Experiencias: características asignadas. Requiere filtros: { experiencia_id }.
import { createCrudSlice } from '../../helpers/createCrudSlice';

const { slice, thunks } = createCrudSlice({
  name: 'experienciaCaracteristicas',
  endpoint: 'experiencia-caracteristicas',
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

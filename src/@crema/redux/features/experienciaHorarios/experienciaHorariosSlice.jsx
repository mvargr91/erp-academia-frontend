// src/@crema/redux/features/experienciaHorarios/experienciaHorariosSlice.jsx
// Experiencias: horarios semanales. Requiere filtros: { experiencia_id }.
import { createCrudSlice } from '../../helpers/createCrudSlice';

const { slice, thunks } = createCrudSlice({
  name: 'experienciaHorarios',
  endpoint: 'experiencia-horarios',
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

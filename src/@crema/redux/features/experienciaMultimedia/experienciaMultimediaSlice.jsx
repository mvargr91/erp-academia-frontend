// src/@crema/redux/features/experienciaMultimedia/experienciaMultimediaSlice.jsx
// Experiencias: fotos y videos. Requiere filtros: { experiencia_id }.
import { createCrudSlice } from '../../helpers/createCrudSlice';

const { slice, thunks } = createCrudSlice({
  name: 'experienciaMultimedia',
  endpoint: 'experiencia-multimedia',
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

// src/redux/features/notifications/notificationSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  message: null,
  variant: 'success', // Puede ser 'success', 'error', 'warning', 'info'
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    showMessage(state, action) {
      state.message = action.payload.message;
      state.variant = action.payload.variant;
    },
    clearMessage(state) {
      state.message = null;
      state.variant = 'success';
    },
  },
});

export const { showMessage, clearMessage } = notificationSlice.actions;
export default notificationSlice.reducer;

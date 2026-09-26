// src/redux/features/commonSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  error: '', // Propiedad `error`
  loading: false,
  isAppDrawerOpen: false,
  updatingContent: false,
  message: '', // Propiedad `message`
  messageType: 0, // Propiedad `messageType`
};

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.error = '';
      state.message = '';
      state.loading = true;
    },
    fetchSuccess: (state) => {
      state.loading = false;
      state.updatingContent = false;
    },
    updatingContent: (state) => {
      state.updatingContent = true;
    },
    fetchError: (state, action) => {
      state.loading = false;
      state.error = action.payload[1];
      state.message = action.payload[0];
      state.messageType = 4;
      state.updatingContent = false;
    },
    showMessage: (state, action) => {
      state.message = action.payload[0];
      state.messageType = action.payload[1];
      state.loading = false;
      state.updatingContent = false;
    },
    hideMessage: (state) => {
      state.loading = false;
      state.error = '';
      state.message = '';
      state.updatingContent = false;
    },
    toggleAppDrawer: (state) => {
      state.isAppDrawerOpen = !state.isAppDrawerOpen;
    },
  },
});

export const {
  fetchStart,
  fetchSuccess,
  updatingContent,
  fetchError,
  showMessage,
  hideMessage,
  toggleAppDrawer,
} = commonSlice.actions;

export default commonSlice.reducer;

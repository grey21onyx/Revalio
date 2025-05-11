import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

// Konfigurasi Redux Store
export const store = configureStore({
  reducer: {
    auth: authReducer,
    // Tambahkan reducer lainnya di sini ketika diperlukan
  },
  // Middleware dan enhancer tambahan dapat dikonfigurasi di sini
});

// Export type RootState dan AppDispatch untuk penggunaan dengan TypeScript
export const RootState = store.getState;
export const AppDispatch = store.dispatch; 
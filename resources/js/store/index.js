import { configureStore } from '@reduxjs/toolkit';

// Temporary reducer untuk mengatasi error "Store does not have a valid reducer"
const initialState = {
  // Tambahkan initial state di sini sesuai kebutuhan
};

function dummyReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}

// Configure store
const store = configureStore({
  reducer: {
    dummy: dummyReducer,
    // Tambahkan reducers lain jika sudah ada
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;

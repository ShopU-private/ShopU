import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import addressReducer from './slices/addressSlice.js';
import userReducer from './slices/userSlice.js';
export const store = configureStore({
    reducer: {
        auth: authReducer,
        address: addressReducer,
        user: userReducer,
    },
});

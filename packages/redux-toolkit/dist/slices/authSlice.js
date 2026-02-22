import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
export const verifyOtp = createAsyncThunk('/api/verify-otp', async (data, { rejectWithValue }) => {
    try {
        const response = await axios.post('/api/auth/login/verify-otp', data, {
            withCredentials: true,
        });
        return response.data;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            return rejectWithValue(error.response?.data?.message || 'Failed to verify OTP');
        }
        return rejectWithValue('An error occured');
    }
});
export const logoutUser = createAsyncThunk('/auth/logout', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get('/api/account/logout');
        return response.data;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            return rejectWithValue(error.response?.data?.message || 'Failed to logout user');
        }
        return rejectWithValue('An error occured');
    }
});
export const checkAuthStatus = createAsyncThunk('/auth/check-status', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get('/api/account/me', {
            withCredentials: true,
        });
        if (response.data.success && response.data.user) {
            return {
                loggedIn: true,
                id: response.data.user.id,
                name: response.data.user.name,
                email: response.data.user.email,
                phoneNumber: response.data.user.phoneNumber,
                role: response.data.user.role,
                userDetails: response.data.user,
            };
        }
        return {
            loggedIn: false,
            userDetails: null,
        };
    }
    catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            return {
                loggedIn: false,
                userDetails: null,
            };
        }
        return rejectWithValue('Failed to check auth status');
    }
});
const initialState = {
    loading: false,
    user: null,
    isLoggedIn: false,
    error: null,
};
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearAuth: state => {
            state.loading = false;
            state.user = null;
            state.isLoggedIn = false;
            state.error = null;
        },
    },
    extraReducers: builders => {
        builders
            .addCase(verifyOtp.pending, state => {
            state.loading = true;
            state.error = null;
        })
            .addCase(verifyOtp.fulfilled, (state, action) => {
            if (action.payload.user) {
                state.user = {
                    id: action.payload.user.id,
                    phoneNumber: action.payload.user.phoneNumber,
                    role: action.payload.user.role,
                    name: action.payload.user.name || '',
                    email: action.payload.user.email || '',
                };
                state.isLoggedIn = true;
            }
            state.loading = false;
            state.error = null;
        })
            .addCase(verifyOtp.rejected, (state, action) => {
            state.loading = false;
            state.isLoggedIn = false;
            state.user = null;
            state.error = action.payload || 'Failed to verify the OTP';
        })
            .addCase(logoutUser.fulfilled, state => {
            state.error = null;
            state.isLoggedIn = false;
            state.loading = false;
            state.user = null;
        })
            .addCase(checkAuthStatus.pending, state => {
            state.loading = true;
        })
            .addCase(checkAuthStatus.fulfilled, (state, action) => {
            if (action.payload.loggedIn) {
                state.isLoggedIn = true;
                state.user = {
                    id: action.payload.id,
                    name: action.payload.name,
                    email: action.payload.email,
                    phoneNumber: action.payload.phoneNumber,
                    role: action.payload.role,
                };
            }
            else {
                state.isLoggedIn = false;
                state.user = null;
            }
            state.loading = false;
            state.error = null;
        })
            .addCase(checkAuthStatus.rejected, state => {
            state.isLoggedIn = false;
            state.user = null;
            state.loading = false;
        });
    },
});
export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;

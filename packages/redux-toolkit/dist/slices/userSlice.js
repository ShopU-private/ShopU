import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
export const getUserDetails = createAsyncThunk('/account/me', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get('/api/account/me', {
            withCredentials: true,
        });
        return response.data.userDetails;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            return rejectWithValue(error.response?.data.message || 'Failed to fetch account details');
        }
        return rejectWithValue('An error occured');
    }
});
const initialState = {
    userDetails: null,
    loading: false,
    error: null,
};
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearUserDetails: state => {
            state.userDetails = null;
            state.error = null;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(getUserDetails.pending, state => {
            state.loading = true;
            state.error = null;
        })
            .addCase(getUserDetails.fulfilled, (state, action) => {
            state.loading = false;
            state.userDetails = action.payload;
        })
            .addCase(getUserDetails.rejected, (state, action) => {
            state.loading = false;
            state.userDetails = null;
            state.error = action.error.message || 'Error';
        });
    },
});
export const { clearUserDetails } = userSlice.actions;
export default userSlice.reducer;

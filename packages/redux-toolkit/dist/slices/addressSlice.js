import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
// Fetch all addresses
export const fetchAddresses = createAsyncThunk('address/fetchAddresses', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get('/api/account/address', {
            withCredentials: true,
        });
        return response.data.addresses || [];
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            return rejectWithValue(error.response?.data.message || 'Failed to fetch address');
        }
        return rejectWithValue('An error occurred');
    }
});
// Add new address
export const addAddress = createAsyncThunk('address/addAddress', async (address, { rejectWithValue }) => {
    try {
        const response = await axios.post('/api/account/address', address, {
            withCredentials: true,
        });
        return response.data.address;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            return rejectWithValue(error.response?.data.message || 'Failed to add address');
        }
        return rejectWithValue('An error occurred');
    }
});
// Update address
export const updateAddress = createAsyncThunk('address/updateAddress', async ({ id, address }, { rejectWithValue }) => {
    try {
        const response = await axios.patch(`/api/account/address/${id}`, address, {
            withCredentials: true,
        });
        return response.data.updatedAddress;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            return rejectWithValue(error.response?.data.message || 'Failed to update address');
        }
        return rejectWithValue('An error occurred');
    }
});
export const deleteAddress = createAsyncThunk('address/deleteAddress', async (id, { rejectWithValue }) => {
    try {
        const promise = axios.delete(`/api/account/address/${id}`, {
            withCredentials: true,
        });
        await promise;
        return id;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete address');
        }
        return rejectWithValue('An error occurred');
    }
});
const initialState = {
    addresses: [],
    error: null,
    loading: false,
    selectedAddressId: null,
};
const addressSlice = createSlice({
    name: 'address',
    initialState,
    reducers: {
        setSelectedAddress: (state, action) => {
            state.selectedAddressId = action.payload;
        },
        clearAddresses: state => {
            state.addresses = [];
            state.selectedAddressId = null;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: builder => {
        builder
            // Fetch addresses
            .addCase(fetchAddresses.pending, state => {
            state.loading = true;
            state.error = null;
        })
            .addCase(fetchAddresses.fulfilled, (state, action) => {
            state.loading = false;
            state.addresses = action.payload;
        })
            .addCase(fetchAddresses.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
            // Add address
            .addCase(addAddress.pending, state => {
            state.loading = true;
            state.error = null;
        })
            .addCase(addAddress.fulfilled, (state, action) => {
            state.loading = false;
            state.addresses.push(action.payload);
        })
            .addCase(addAddress.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
            // Update address
            .addCase(updateAddress.pending, state => {
            state.loading = true;
            state.error = null;
        })
            .addCase(updateAddress.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.addresses.findIndex(addr => addr.id === action.payload.id);
            if (index !== -1) {
                state.addresses[index] = action.payload;
            }
        })
            .addCase(updateAddress.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
            // Delete address
            .addCase(deleteAddress.pending, state => {
            state.loading = true;
            state.error = null;
        })
            .addCase(deleteAddress.fulfilled, (state, action) => {
            state.loading = false;
            state.addresses = state.addresses.filter(addr => addr.id !== action.payload);
            if (state.selectedAddressId === action.payload) {
                state.selectedAddressId = null;
            }
        })
            .addCase(deleteAddress.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});
export const { setSelectedAddress, clearAddresses } = addressSlice.actions;
export default addressSlice.reducer;

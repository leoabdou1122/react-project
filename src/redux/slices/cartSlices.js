// cartSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchUserCart = createAsyncThunk('cart/fetchUserCart', async (cartId) => {
    try {
        const res = await axios.get(`http://127.0.0.1:3002/cart/${cartId}`);
        return res.data;
    } catch (error) {
        throw Error('Failed to fetch user cart');
    }
});

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cart: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserCart.fulfilled, (state, action) => {
                state.cart = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchUserCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export default cartSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const userAuth = createAsyncThunk('data/userAuth', async () => {
    const res = await axios.get('http://localhost:3002/user/auth', { withCredentials: true });
    return res.data
});

const authSlice = createSlice({
    name : 'data',
    initialState : {
        data : [],
        loading : true,
        error : null
    },
    reducers : {},
    extraReducers : (builder) => {
        builder
        .addCase(userAuth.pending, (state) => {
            state.loading = true;
        })
        .addCase(userAuth.fulfilled, (state, action) => {
            state.data = action.payload;
            state.loading = false
        })
        .addCase(userAuth.rejected, (state, action) => {
            state.error = action.error.message;
            state.loading = false
        })
    }
})

export default authSlice.reducer
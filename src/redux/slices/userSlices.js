import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchAllUsers = createAsyncThunk('data/fetchAllUsers', async () => {
    const res = await axios.get('http://localhost:3002/user/allUsers');
    return res.data
});

const dataSlice = createSlice({
    name : 'data',
    initialState : {
        data : [],
        loading : true,
        error : null
    },
    reducers : {},
    extraReducers : (builder) => {
        builder
        .addCase(fetchAllUsers.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchAllUsers.fulfilled, (state, action) => {
            state.data = action.payload;
            state.loading = false
        })
        .addCase(fetchAllUsers.rejected, (state, action) => {
            state.error = action.error.message;
            state.loading = false
        })
    }
})

export default dataSlice.reducer
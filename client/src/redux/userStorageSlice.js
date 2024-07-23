import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import userStorageApi from '../api/userStorage.api';

export const fetchUserStorageInfo = createAsyncThunk(
    `userStorage/getInfo`,
    async (payload, thunkAPI) => {
        try {
            const response = await userStorageApi.getUserStorageInfo()
            return response;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);

export const userStorageSlice = createSlice({
    name: 'userStorageSlice',
    initialState: {
        isPending: false,
        userStorageInfo: null
    },
    reducers: {
        clearUserStorageState: (state, action) => {
            state.isPending = false
            state.userStorageInfo = null
        }
    },
    extraReducers: {
        [fetchUserStorageInfo.pending]: (state) => {
            state.isPending = true;
        },
        [fetchUserStorageInfo.rejected]: (state, { payload }) => {
            state.isPending = false;
        },
        [fetchUserStorageInfo.fulfilled]: (state, { payload }) => {
            state.isPending = false;
            state.userStorageInfo = payload;
        },
    }
})

export const {
    clearUserStorageState,
} = userStorageSlice.actions;

export const getUserStorageInfo = (state) => state.userStorage.userStorageInfo

export default userStorageSlice.reducer;

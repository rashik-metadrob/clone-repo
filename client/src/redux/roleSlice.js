import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import roleAndPermissionApi from '../api/roleAndPermission.api';

export const fetchAllPermissions = createAsyncThunk(
    `role/fetchAllPermissions`,
    async (payload, thunkAPI) => {
        try {
            const response = await roleAndPermissionApi.getAllPermissions()
            return response
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);

export const fetchAllRoles = createAsyncThunk(
    `role/fetchAllRoles`,
    async (payload, thunkAPI) => {
        try {
            const response = await roleAndPermissionApi.getRoleAndPermissions({ limit: 100, page: 1, isSuperAdminRole: false })
            return response
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);

export const roleSlice = createSlice({
    name: 'roleSlice',
    initialState: {
        listPermissions: [],
        roles: [],
        isPending: false,
    },
    reducers: {
        setListPermissions: (state, action) => {
            state.listPermissions = action.payload;
        },
    },
    extraReducers: {
        [fetchAllPermissions.pending]: (state) => {
            state.isPending = true;
        },
        [fetchAllPermissions.rejected]: (state, { payload }) => {
            state.isPending = false;
            state.listPermissions = []
        },
        [fetchAllPermissions.fulfilled]: (state, { payload }) => {
            state.isPending = false;
            state.listPermissions = payload;
        },
        [fetchAllRoles.pending]: (state) => {
            state.isPending = true;
        },
        [fetchAllRoles.rejected]: (state, { payload }) => {
            state.isPending = false;
            state.roles = []
        },
        [fetchAllRoles.fulfilled]: (state, { payload }) => {
            state.isPending = false;
            state.roles = _.map(_.get(payload, ['results'], []), (el) => {
                return {
                    label: el.name,
                    value: el.id
                }
            });
        },
    }
})

export const {
    setListPermissions,
} = roleSlice.actions;

export const getListPermissions = (state) => state.role.listPermissions
export const getListRoles = (state) => state.role.roles

export default roleSlice.reducer;

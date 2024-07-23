import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import notificationApi from '../api/notification.api';
import { NOTIFICATION_TYPES } from '../utils/constants';
import _ from 'lodash';

export const fetchExceedMaximumCapacityNotifications = createAsyncThunk(
    `notification/fetchExceedMaximumCapacityNotifications`,
    async (payload, thunkAPI) => {
        try {
            const response = await notificationApi.getNotifications({
                type: NOTIFICATION_TYPES.EXCEEDED_STORAGE_LIMIT
            })
            return response;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);

export const fetchPublishedStoresAreSentToDraftNotifications = createAsyncThunk(
    `notification/fetchPublishedStoresAreSentToDraftNotifications`,
    async (payload, thunkAPI) => {
        try {
            const response = await notificationApi.getNotifications({
                type: NOTIFICATION_TYPES.PUBLISHED_STORE_BE_SENT_TO_DRAFT
            })
            return response;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);

export const notificationSlice = createSlice({
    name: 'notificationSlice',
    initialState: {
        isPending: false,
        exceedMaximumCapacityNotifications: [],
        publishedStoresAreSentToDraftNotifications: []
    },
    reducers: {
        clearNotificationState: (state, action) => {
            state.isPending = false
            state.exceedMaximumCapacityNotifications = []
            state.publishedStoresAreSentToDraftNotifications = []
        },
        viewNotification: (state, action) => {
            state.exceedMaximumCapacityNotifications = _.map(state.exceedMaximumCapacityNotifications, (el) => {
                if(el.isViewed) {
                    el.isViewed = true
                }

                return el
            })
            state.publishedStoresAreSentToDraftNotifications = _.map(state.publishedStoresAreSentToDraftNotifications, (el) => {
                if(el.isViewed) {
                    el.isViewed = true
                }

                return el
            })
        },
    },
    extraReducers: {
        [fetchExceedMaximumCapacityNotifications.pending]: (state) => {
            state.isPending = true;
        },
        [fetchExceedMaximumCapacityNotifications.rejected]: (state, { payload }) => {
            state.isPending = false;
        },
        [fetchExceedMaximumCapacityNotifications.fulfilled]: (state, { payload }) => {
            state.isPending = false;
            state.exceedMaximumCapacityNotifications = _.get(payload, ['results'], []);
        },
        [fetchPublishedStoresAreSentToDraftNotifications.pending]: (state) => {
            state.isPending = true;
        },
        [fetchPublishedStoresAreSentToDraftNotifications.rejected]: (state, { payload }) => {
            state.isPending = false;
        },
        [fetchPublishedStoresAreSentToDraftNotifications.fulfilled]: (state, { payload }) => {
            state.isPending = false;
            state.publishedStoresAreSentToDraftNotifications = _.get(payload, ['results'], []);
        },
    }
})

export const {
    clearNotificationState,
    viewNotification
} = notificationSlice.actions;

export const getExceedMaximumCapacityNotifications = (state) => state.notification.exceedMaximumCapacityNotifications
export const getPublishedStoresAreSentToDraftNotifications = (state) => state.notification.publishedStoresAreSentToDraftNotifications

export default notificationSlice.reducer;

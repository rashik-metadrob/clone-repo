import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ASSET_TYPES } from '../utils/constants';
import _ from 'lodash';
import userAudioApi from '../api/userAudio.api';

export const fetchUserPlaylist = createAsyncThunk(
    `audio/fetchUserPlaylist`,
    async (payload, thunkAPI) => {
        try {
            const response = await userAudioApi.getUserAudios()
            const rootState = thunkAPI.getState()
            return {
                data: response,
                rootState
            };
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);

export const audioSlice = createSlice({
    name: 'audioSlice',
    initialState: {
        listAudios: [],
        isPending: false,
    },
    reducers: {
        setListAudios: (state, action) => {
            state.listAudios = action.payload;
        },
    },
    extraReducers: {
        [fetchUserPlaylist.pending]: (state) => {
            state.isPending = true;
        },
        [fetchUserPlaylist.rejected]: (state, { payload }) => {
            state.isPending = false;
            state.listAudios = []
        },
        [fetchUserPlaylist.fulfilled]: (state, { payload }) => {
            state.isPending = false;

            let audios = _.get(payload, ['data'], [])
            if(_.get(payload, ['rootState', 'app', 'shouldShufflePlaylist'], false)){
                audios = _.shuffle(_.get(payload, ['data'], []))
            }
            if(audios.length > 0){
                audios[0].isPlaying = true;
            }
            state.listAudios = audios;
        },
    }
})

export const {
    setListAudios,
} = audioSlice.actions;

export const getListAudios = (state) => state.audio.listAudios

export default audioSlice.reducer;

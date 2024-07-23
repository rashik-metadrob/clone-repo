import { createSlice } from '@reduxjs/toolkit';

export const spotifySlice = createSlice({
    name: 'spotifySlice',
    initialState: {
        spotifyDeviceId: "",
        isPaused: false,
        isActive: false,
        currentTrack: {
            name: "",
            album: {
                images: [
                    { url: "" }
                ]
            },
            artists: [
                { name: "" }
            ]
        },
        spotifyUserPlayList: [],
        spotifyHitPopPlayList: [],
        spotifyFocusPlayList: []
    },
    reducers: {
        setSpotifyDeviceId : (state, action) => {
            state.spotifyDeviceId = action.payload;
        },
        setMusicIsPaused : (state, action) => {
            state.isPaused = action.payload;
        },
        setSpotifyIsActive : (state, action) => {
            state.isActive = action.payload;
        },
        setSpotifyCurrentTrack : (state, action) => {
            state.currentTrack = action.payload;
        },
        setSpotifyUserPlayList : (state, action) => {
            state.spotifyUserPlayList = action.payload;
        },
        setSpotifyHitPopPlayList : (state, action) => {
            state.spotifyHitPopPlayList = action.payload;
        },
        setSpotifyFocusPlayList : (state, action) => {
            state.spotifyFocusPlayList = action.payload;
        },
    }
})

export const {
    setSpotifyDeviceId,
    setMusicIsPaused,
    setSpotifyIsActive,
    setSpotifyCurrentTrack,
    setSpotifyUserPlayList,
    setSpotifyHitPopPlayList,
    setSpotifyFocusPlayList
} = spotifySlice.actions;

export const getSpotifyFocusPlayList = (state) => state.spotify.spotifyFocusPlayList
export const getSpotifyHitPopPlayList = (state) => state.spotify.spotifyHitPopPlayList
export const getSpotifyUserPlayList = (state) => state.spotify.spotifyUserPlayList
export const getSpotifyCurrentTrack = (state) => state.spotify.currentTrack
export const getSpotifyIsActive = (state) => state.spotify.isActive
export const getIsMusicPaused = (state) => state.spotify.isPaused
export const getSpotifyDeviceId = (state) => state.spotify.spotifyDeviceId

export default spotifySlice.reducer;

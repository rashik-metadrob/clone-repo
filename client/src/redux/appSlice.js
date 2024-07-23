import { createSlice } from '@reduxjs/toolkit';
import { MUSIC_AND_AUDIO_SOURCE } from '../utils/constants';

export const appSlice = createSlice({
    name: 'appSlice',
    initialState: {
        isHiddenPreview: false,
        user: null,
        userPermissons: {
            permissionRetailer: [],
            permissionSuperAdmin: [],
        },
        isfirstLogin:true,
        theme: "dark",
        exchangeRate: {},
        isCompleteStoreOnboardingForViewer: false,
        isCompleteStoreOnboardingForRetailer: false,
        spotifyState: null,
        spotifyRedirectUrl: "",
        spotifyAccessToken: "",
        spotifyRefeshToken: "",
        spotifyUserProfile: null,
        spotifyLastSelectedPlaylist: "",
        rememberLoginInfo: {
            email: "",
            password: ""
        },
        shouldRememberPassword: true,
        agreeWithTermAndConditions: false,

        musicAndAudioSource: MUSIC_AND_AUDIO_SOURCE.YOUR_AUDIO,

        // Your pplaylist
        shouldShufflePlaylist: false,

        language: 'en',
    },
    reducers: {
        setLanguage: (state, action) => {
            state.language = action.payload;
        },
        setUserPermissons: (state, action) => {
            state.userPermissons = action.payload;
        },
        setShouldShufflePlaylist: (state, action) => {
            state.shouldShufflePlaylist = action.payload;
        },
        setMusicAndAudioSource: (state, action) => {
            state.musicAndAudioSource = action.payload;
        },
        setAgreeWithTermAndConditions: (state, action) => {
            state.agreeWithTermAndConditions = action.payload;
        },
        setIsHiddenPreview: (state, action) => {
            state.isHiddenPreview = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
            if(!action.payload){
                state.userPermissons = []
            }
        },
        changeFirstLogin: (state) => {
            state.isfirstLogin = false;
        },
        setTheme : (state, action) => {
            state.theme = action.payload;
        },
        setExchangeRate : (state, action) => {
            state.exchangeRate = action.payload;
        },
        setIsCompleteStoreOnboardingForViewer : (state, action) => {
            state.isCompleteStoreOnboardingForViewer = action.payload;
        },
        setIsCompleteStoreOnboardingForRetailer : (state, action) => {
            state.isCompleteStoreOnboardingForRetailer = action.payload;
        },
        setSpotifyState : (state, action) => {
            state.spotifyState = action.payload;
        },
        setSpotifyRedirectInfo : (state, action) => {
            state.spotifyState = action.payload.spotifyState;
            state.spotifyRedirectUrl = action.payload.spotifyRedirectUrl
        },
        setSpotifyAccessToken : (state, action) => {
            state.spotifyAccessToken = action.payload;
        },
        setSpotifyRefeshToken : (state, action) => {
            state.spotifyRefeshToken = action.payload;
        },
        setSpotifyUserProfile : (state, action) => {
            state.spotifyUserProfile = action.payload;
        },
        logoutSpotify: (state, action) => {
            state.spotifyUserPlayList = [];
            state.spotifyUserProfile = null;
            state.spotifyRefeshToken = "";
            state.spotifyAccessToken = "";
        },
        setSpotifyLastSelectedPlaylist : (state, action) => {
            state.spotifyLastSelectedPlaylist = action.payload;
        },
        setRememberLoginInfo : (state, action) => {
            state.rememberLoginInfo = action.payload;
        },
        setShouldRememberPassword : (state, action) => {
            state.shouldRememberPassword = action.payload;
        },
    }
})

export const {
    setIsHiddenPreview,
    setUser,
    changeFirstLogin,
    setTheme,
    setExchangeRate,
    setIsCompleteStoreOnboardingForViewer,
    setSpotifyState,
    setSpotifyRedirectInfo,
    setSpotifyAccessToken,
    setSpotifyRefeshToken,
    setSpotifyUserProfile,
    logoutSpotify,
    setSpotifyLastSelectedPlaylist,
    setRememberLoginInfo,
    setShouldRememberPassword,
    setIsCompleteStoreOnboardingForRetailer,
    setAgreeWithTermAndConditions,
    setMusicAndAudioSource,
    setShouldShufflePlaylist,
    setUserPermissons,
    setLanguage
} = appSlice.actions;

export const getLanguage = (state) => state.app.language
export const getUserPermissons = (state) => state.app.userPermissons
export const getShouldShufflePlaylist = (state) => state.app.shouldShufflePlaylist
export const getMusicAndAudioSource = (state) => state.app.musicAndAudioSource
export const getAgreeWithTermAndConditions = (state) => state.app.agreeWithTermAndConditions
export const getShouldRememberPassword = (state) => state.app.shouldRememberPassword
export const getRememberLoginInfo = (state) => state.app.rememberLoginInfo
export const getSpotifyLastSelectedPlaylist = (state) => state.app.spotifyLastSelectedPlaylist
export const getSpotifyUserProfile = (state) => state.app.spotifyUserProfile
export const getSpotifyRefeshToken = (state) => state.app.spotifyRefeshToken
export const getSpotifyAccessToken = (state) => state.app.spotifyAccessToken
export const getSpotifyRedirectUrl = (state) => state.app.spotifyRedirectUrl
export const getSpotifyState = (state) => state.app.spotifyState
export const getIsCompleteStoreOnboardingForViewer = (state) => state.app.isCompleteStoreOnboardingForViewer
export const getIsCompleteStoreOnboardingForRetailer = (state) => state.app.isCompleteStoreOnboardingForRetailer
export const getExchangeRate = (state) => state.app.exchangeRate
export const getTheme = (state) => state.app.theme
export const getUser = (state) => state.app.user
export const getIsUserConnectedStoreFront = (state) => state.app.user?.shopifyAccessToken && state.app.user?.shopifyStoreName
export const getIsHiddenPreview = (state) => state.app.isHiddenPreview
export const getFirstLogin = (state) => state.app.isfirstLogin

export default appSlice.reducer;

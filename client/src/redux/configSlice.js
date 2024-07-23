import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';

export const configSlice = createSlice({
    name: 'configSlice',
    initialState: {
        isOverrideMaterialDesktop: false,
        isOverrideMaterialMobile: false,
        isAntialiasDesktop: false,
        isAntialiasMobile: false,
        isShowHDRIDesktop: false,
        isShowHDRIMobile: false,
        pixelRatioDesktop: 100, // %
        pixelRatioMobile: 100, // %
        isLoadedConfig: false
    },
    reducers: {
        setIsOverrideMaterialDesktop: (state, action) => {
            state.isOverrideMaterialDesktop = action.payload;
        },
        setIsOverrideMaterialMobile: (state, action) => {
            state.isOverrideMaterialMobile = action.payload;
        },
        setIsAntialiasDesktop: (state, action) => {
            state.isAntialiasDesktop = action.payload;
        },
        setIsAntialiasMobile: (state, action) => {
            state.isAntialiasMobile = action.payload;
        },
        setIsShowHDRIDesktop: (state, action) => {
            state.isShowHDRIDesktop = action.payload;
        },
        setIsShowHDRIMobile: (state, action) => {
            state.isShowHDRIMobile = action.payload;
        },
        setPixelRatioDesktop: (state, action) => {
            state.pixelRatioDesktop = action.payload;
        },
        setPixelRatioMobile: (state, action) => {
            state.pixelRatioMobile = action.payload;
        },
        setInitConfig: (state, action) => {
            state.isOverrideMaterialDesktop = _.get(action.payload, ['isOverrideMaterialDesktop'], false);
            state.isOverrideMaterialMobile = _.get(action.payload, ['isOverrideMaterialMobile'], false);
            state.isAntialiasDesktop = _.get(action.payload, ['isAntialiasDesktop'], false);
            state.isAntialiasMobile = _.get(action.payload, ['isAntialiasMobile'], false);
            state.isShowHDRIDesktop = _.get(action.payload, ['isShowHDRIDesktop'], false);
            state.isShowHDRIMobile = _.get(action.payload, ['isShowHDRIMobile'], false);
            state.pixelRatioDesktop = _.get(action.payload, ['pixelRatioDesktop'], 100);
            state.pixelRatioMobile = _.get(action.payload, ['pixelRatioMobile'], 100);
            state.isLoadedConfig = true
        },
        setIsLoadedConfig: (state, action) => {
            state.isLoadedConfig = action.payload;
        },
    }
})

export const {
    setIsOverrideMaterialDesktop,
    setIsOverrideMaterialMobile,
    setIsAntialiasDesktop,
    setIsAntialiasMobile,
    setIsShowHDRIDesktop,
    setIsShowHDRIMobile,
    setIsLoadedConfig,
    setPixelRatioDesktop,
    setPixelRatioMobile,
    setInitConfig
} = configSlice.actions;

export const getIsOverrideMaterialDesktop = (state) => state.config.isOverrideMaterialDesktop
export const getIsOverrideMaterialMobile = (state) => state.config.isOverrideMaterialMobile
export const getIsAntialiasDesktop = (state) => state.config.isAntialiasDesktop
export const getIsAntialiasMobile = (state) => state.config.isAntialiasMobile
export const getIsShowHDRIDesktop = (state) => state.config.isShowHDRIDesktop
export const getIsShowHDRIMobile = (state) => state.config.isShowHDRIMobile
export const getPixelRatioDesktop = (state) => state.config.pixelRatioDesktop
export const getPixelRatioMobile = (state) => state.config.pixelRatioMobile
export const getIsLoadedConfig = (state) => state.config.isLoadedConfig

export default configSlice.reducer;

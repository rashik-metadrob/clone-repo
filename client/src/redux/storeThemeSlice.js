import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import { FONTS_OPTIONS, STORE_THEME_TYPES, TEXT_ALIGN, TEXT_DECORATION } from "../utils/constants"

export const STORE_BRAND_SETUP_INFO_DEFAULT = {
    storeThemeType: STORE_THEME_TYPES.TYPE_1,
    name: "",
    description: "",
    brandLogo: null,
    background: null,
    storeNameStyle: {
        font: FONTS_OPTIONS[0].value,
        fontSize: 40,
        color: '#FFFFFF',
        background: '#00000000',
        depth: 1,
        transparency: 1,
        textAlign: TEXT_ALIGN.LEFT,
        textDecoration: TEXT_DECORATION.NORMAL,
        glow: false
    }
}

export const storeThemeSlice = createSlice({
    name: 'themeSlice',
    initialState: {
        storeBrandSetupInfo: STORE_BRAND_SETUP_INFO_DEFAULT
    },
    reducers: {
        setStoreBrandSetupInfo: (state, action) => {
            state.storeBrandSetupInfo = {
                ...state.storeBrandSetupInfo,
                ...action.payload
            }
        },
        setStoreBrandSetupInfoStoreNameStyle: (state, action) => {
            state.storeBrandSetupInfo = {
                ...state.storeBrandSetupInfo,
                storeNameStyle: {
                    ...state.storeBrandSetupInfo.storeNameStyle,
                    ...action.payload
                }
            }
        },
        resetStoreThemeState: (state, action) => {
            state.storeBrandSetupInfo = STORE_BRAND_SETUP_INFO_DEFAULT
        },
    }
})

export const {
    setStoreBrandSetupInfo,
    resetStoreThemeState,
    setStoreBrandSetupInfoStoreNameStyle
} = storeThemeSlice.actions;

export const getStoreBrandSetupInfo = (state) => state.storeTheme.storeBrandSetupInfo

export default storeThemeSlice.reducer;
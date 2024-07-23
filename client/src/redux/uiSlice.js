import { createSlice } from '@reduxjs/toolkit';
import { CART_MODE, DRAWER_BAG_TABS, PRODUCT_TAB_TYPES, PRODUCT_TYPES, PUBLISH_CAMERA_MODE } from "../utils/constants.js"
import { isShopifyEmbedded } from '@shopify/app-bridge/utilities';
import global from './global.js';

export const uiSlice = createSlice({
    name: 'uiSlice',
    initialState: {
        isShowDrawerCheckout: false,
        isShowDrawerBag: false,
        productTabType: PRODUCT_TAB_TYPES.PRODUCTS,
        isShowModalMoreInfo: false,
        drawerBagActiveTab: DRAWER_BAG_TABS.MY_ORDERS,
        cartMode: isShopifyEmbedded() ? CART_MODE.SHOPIFY : CART_MODE.METADROD,
        isShowWallPreviewNavigate: false,
    },
    reducers: {
        setIsShowWallPreviewNavigate: (state, action) => {
            state.isShowWallPreviewNavigate = action.payload
        },
        setIsShowDrawerCheckout: (state, action) => {
            state.isShowDrawerCheckout = action.payload
        },
        setIsShowDrawerBag: (state, action) => {
            state.isShowDrawerBag = action.payload
        },
        setProductTabType: (state, action) => {
            state.productTabType = action.payload
        },
        setIsShowModalMoreInfo: (state, action) => {
            state.isShowModalMoreInfo = action.payload
        },
        setDrawerBagActiveTab: (state, action) => {
            state.drawerBagActiveTab = action.payload
        },
        setCartMode: (state, action) => {
            state.cartMode = action.payload
        },
    }
})

export const {
    setIsShowDrawerCheckout,
    setIsShowDrawerBag,
    setProductTabType,
    setIsShowModalMoreInfo,
    setDrawerBagActiveTab,
    setCartMode,
    setIsShowWallPreviewNavigate
} = uiSlice.actions;

export const getIsShowWallPreviewNavigate = (state) => state.ui.isShowWallPreviewNavigate

// Disable preview control (Player.js) when popup show
export const getIsDisabledPreviewControl = (state) => state.ui.isShowModalMoreInfo || state.model.publishCameraMode === PUBLISH_CAMERA_MODE.FOCUS_OBJECT

export const getIsShowModalMoreInfo = (state) => state.ui.isShowModalMoreInfo
export const getProductTabType = (state) => state.ui.productTabType
export const getIsShowDrawerBag = (state) => state.ui.isShowDrawerBag
export const getIsShowDrawerCheckout = (state) => state.ui.isShowDrawerCheckout

export const getDrawerBagActiveTab = (state) => state.ui.drawerBagActiveTab
export const getCartMode = (state) => state.ui.cartMode

export default uiSlice.reducer;
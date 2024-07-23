import { createSlice } from '@reduxjs/toolkit';

export const shopifySlice = createSlice({
    name: 'shopifySlice',
    initialState: {
        shopifyCart: [],
        shopifyAmountInfo: {
            amount: 0,
            currencyCode: "USD"
        },
        shopifyCartId: ""
    },
    reducers: {
        setShopifyCart: (state, action) => {
            state.shopifyCart = action.payload;
        },
        setShopifyAmountInfo: (state, action) => {
            state.shopifyAmountInfo = action.payload;
        },
        setShopifyCartId : (state, action) => {
            state.shopifyCartId = action.payload;
        },
    }
})

export const {
    setShopifyCart,
    setShopifyAmountInfo,
    setShopifyCartId
} = shopifySlice.actions;

export const getShopifyCart = (state) => state.shopify.shopifyCart
export const getShopifyAmountInfo = (state) => state.shopify.shopifyAmountInfo
export const getShopifyCartId = (state) => state.shopify.shopifyCartId

export default shopifySlice.reducer;

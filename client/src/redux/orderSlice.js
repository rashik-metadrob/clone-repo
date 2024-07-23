import { createSlice } from '@reduxjs/toolkit';
import { createTracking } from '../api/tracking.api';
import { TRACKING_ACTION_NAME, TRACKING_TYPE } from '../utils/constants';
import moment from 'moment';

export const orderSlice = createSlice({
    name: 'orderSlice',
    initialState: {
        cart: [],
        selectedShip: {

        }
    },
    reducers: {
        addProductToCart: (state, action) => {
            if (state.cart.findIndex(p => p.id === action.payload.id) !== -1) {
                state.cart = state.cart.map(p => {
                    if (p.id === action.payload.id) {
                        p.quantity += action.payload.quantity
                    }
                    return p
                })
            } else {
                state.cart.push(action.payload)
            }
        },
        setCart : (state, action) => {
            state.cart = action.payload
        },
        deleteProductInCart: (state, action) => {
            // action.payload is id of product in database
            let traking = {
                trackingContainerId: action.payload,
                type: TRACKING_TYPE.PRODUCT,
                track: {
                    actionName: TRACKING_ACTION_NAME.REMOVE_FROM_CART,
                    actionTime: moment().toString(),
                    actionValue: 1,
                    actionTrackingId: action.payload,
                    actionUnit: "time"
                }
            }
            createTracking(traking)
            state.cart = state.cart.filter(el => el.id !== action.payload)
        },
        setSelectedShip: (state, action) => {
            state.selectedShip = action.payload
        },
    }
})

export const {
    addProductToCart,
    setCart,
    deleteProductInCart,
    setSelectedShip
} = orderSlice.actions;

export const getCart = (state) => state.order.cart
export const getSelectedShip = (state) => state.order.selectedShip

export default orderSlice.reducer;
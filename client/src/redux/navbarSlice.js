import { createSlice } from '@reduxjs/toolkit';

export const navbarSlice = createSlice({
    name: 'navbarSlice',
    initialState: {
        collapsed: false,
        currentMenu: ''
    },
    reducers: {
        setCollapsed: (state, action) => {
            state.collapsed = action.payload;
        },
        setCurrentMenu: (state, action) => {
            state.currentMenu = action.payload;
        }
    }
})

export const {
    setCollapsed,
    setCurrentMenu
} = navbarSlice.actions;

export const getCollapsed = (state) => state.navbar.collapsed
export const getCurrentMenu = (state) => state.navbar.currentMenu

export default navbarSlice.reducer;

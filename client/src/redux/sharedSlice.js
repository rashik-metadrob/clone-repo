import { createSlice } from '@reduxjs/toolkit';

export const sharedSlice = createSlice({
    name: 'sharedSlice',
    initialState: {
        listDecorativeCategories: [],
        sharedListDecoratives: []
    },
    reducers: {
        setSharedListDecoratives: (state, action) => {
            state.sharedListDecoratives = action.payload;
        },
        setListDecorativeCategories: (state, action) => {
            state.listDecorativeCategories = action.payload;
        },
    }
})

export const {
    setListDecorativeCategories,
    setSharedListDecoratives
} = sharedSlice.actions;

export const getSharedListDecoratives = (state) => state.shared.sharedListDecoratives
export const getListDecorativeCategories = (state) => state.shared.listDecorativeCategories

export default sharedSlice.reducer;
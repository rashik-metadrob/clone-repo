import { createSlice } from '@reduxjs/toolkit';

export const homepageSlice = createSlice({
    name: 'homepageSlice',
    initialState: {
        isHomeFirst:false

    },
    reducers: {

        setHomeFirst: (state, action) => {
            state.isHomeFirst = true;
        },

    }
})

export const {
  setHomeFirst

} = homepageSlice.actions;


export const getHomeFirst = (state) => state.home.isHomeFirst

export default homepageSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

export const dashboardSlice = createSlice({
    name: 'dashboardSlice',
    initialState: {
        searchText: "",
        isFirstAccess: true,
        web3Account: {
            address: "",
            balance: 0
        }
    },
    reducers: {
        setSearchText: (state, action) => {
            state.searchText = action.payload;
        },
        setIsFirstAccess: (state, action) => {
            state.isFirstAccess = action.payload;
        },
        setWeb3AccountAddress: (state, action) => {
            state.web3Account.address = action.payload;
        },
        setWeb3AccountBalance: (state, action) => {
            state.web3Account.balance = action.payload;
        }
    }
})

export const {
    setSearchText,
    setIsFirstAccess,
    setWeb3AccountAddress,
    setWeb3AccountBalance
} = dashboardSlice.actions;

export const getWeb3Account = (state) => state.dashboard.web3Account
export const getIsFirstAccess = (state) => state.dashboard.isFirstAccess
export const getSearchText = (state) => state.dashboard.searchText;

export default dashboardSlice.reducer;
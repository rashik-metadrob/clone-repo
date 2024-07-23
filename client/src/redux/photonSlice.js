import { createSlice } from '@reduxjs/toolkit'
import { PUBLISH_ROLE } from '../utils/constants'
import _ from 'lodash'

export const photonSlice = createSlice({
    name: 'photonSlice',
    initialState: {
      otherPlayers: [],
      onChangeMutePlayer: false
    },
    reducers: {
      setOtherPlayer: (state, action) => {
        let data = _.cloneDeep(action.payload);
        data.forEach(el => {
          if(_.has(_.find(state.otherPlayers, {clientId: el.clientId}, null), ['mute'])){
            el.mute = _.get(_.find(state.otherPlayers, {clientId: el.clientId}, null), ['mute'])
          }
          if(_.has(_.find(state.otherPlayers, {clientId: el.clientId}, null), ['beMuted'])){
            el.beMuted = _.get(_.find(state.otherPlayers, {clientId: el.clientId}, null), ['beMuted'])
          }
        })

        state.otherPlayers = data;
      },
      addListOtherPlayers: (state, action) => {
        action.payload.forEach(element => {
            if(!state.otherPlayers.find(el => el.clientId === element.clientId)){
                state.otherPlayers.push(element);
            }
        });
      },
      removeOtherPlayer: (state, action) => {
        state.otherPlayers = state.otherPlayers.filter(el => el.clientId !== action.payload);
      },
      addOtherPlayer: (state, action) => {
        if(!state.otherPlayers.find(el => el.clientId === action.payload.clientId)){
          state.otherPlayers.push(action.payload);
        }
      },
      //{id: string, value: bool}
      onMuteOtherPlayer: (state, action) => {
        state.otherPlayers = state.otherPlayers.map(el => {
          return {
            ...el,
            mute: el.clientId === action.payload.id ? action.payload.value : el.mute
          }
        })

        state.onChangeMutePlayer = !state.onChangeMutePlayer
      },
      onMuteAllOtherPlayer: (state, action) => {
        state.otherPlayers = state.otherPlayers.map(el => {
          return {
            ...el,
            mute: el.role !== PUBLISH_ROLE.SALE ? action.payload : false
          }
        })
      },
      setBeMutedTwoWayOtherPlayer: (state, action) => {
        state.otherPlayers = state.otherPlayers.map(el => {
          return {
            ...el,
            beMuted: action.payload.from === el.socketId ? action.payload.value : el.beMuted
          }
        })
      },
    }
})

export const {
  setOtherPlayer,
  addListOtherPlayers,
  removeOtherPlayer,
  addOtherPlayer,
  onMuteOtherPlayer,
  onMuteAllOtherPlayer,
  setBeMutedTwoWayOtherPlayer
} = photonSlice.actions;

export const getOtherPlayers = (state) => state.photon.otherPlayers
export const getOnMuteOtherChange = (state) => state.photon.onChangeMutePlayer;

export default photonSlice.reducer;

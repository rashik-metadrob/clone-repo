import { configureStore } from '@reduxjs/toolkit';
import modelSlice from './modelSlice';
import dashboardSlice from './dashboardSlice';
import orderSlice from './orderSlice';
import appSlice from './appSlice';
import navbarSlice from './navbarSlice';
import joyrideSlice from './joyrideSlice';
import homepageSlice from './homepageSlice';
import uiSlice from './uiSlice'
import shopifySlice from "./shopifySlice"
import spotifySlice from './spotifySlice';
import sharedSlice from "./sharedSlice"
import storeThemeSlice from "./storeThemeSlice"
import decorativeEditorSlice from "./decorativeEditorSlice"
import photonSlice from './photonSlice';
import audioSlice from './audioSlice';
import configSlice from './configSlice'
import userStorageSlice from './userStorageSlice';
import notificationSlice from './notificationSlice';
import roleSlice from './roleSlice'

import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { useDispatch } from 'react-redux';

const reducer = combineReducers({
  model: modelSlice,
  dashboard: dashboardSlice,
  order: orderSlice,
  app: appSlice,
  navbar: navbarSlice,
  joyride: joyrideSlice,
  home: homepageSlice,
  ui: uiSlice,
  shopify: shopifySlice,
  spotify: spotifySlice,
  shared: sharedSlice,
  storeTheme: storeThemeSlice,
  decorativeEditor: decorativeEditorSlice,
  photon: photonSlice,
  audio: audioSlice,
  config: configSlice,
  userStorage: userStorageSlice,
  notification: notificationSlice,
  role: roleSlice
});

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  // if you do not want to persist this part of the state
  blacklist: ['navbar','joyride','model','dashboard', 'ui', 'shopify', 'spotify', 'shared', 'storeTheme', 'decorativeEditor', 'audio', 'config', 'userStorage', 'notification', 'role']
};

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
  reducer: persistedReducer,
});
export const useAppDispatch = () => useDispatch()
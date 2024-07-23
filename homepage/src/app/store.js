import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import bookModalReducer from '../features/Slices/bookModalSlice'
import loaderReducer from '../features/Slices/loaderSlice'
import timerReducer from '../features/Slices/timerSlice'
import popupReducer from '../features/Slices/popupSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    bookmodal:bookModalReducer,
    loadermodal:loaderReducer,
    timermodal:timerReducer,
    popup:popupReducer,

  },
});

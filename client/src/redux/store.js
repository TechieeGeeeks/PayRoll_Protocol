// store.js
import { configureStore } from "@reduxjs/toolkit";
// import * as actionTypes from "_constants__WEBPACK_IMPORTED_MODULE_0__";
import localforage from "localforage";
import { combineReducers } from "redux";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";
import navigationSlice from "./slices/navigationSlice";

const combinedReducer = combineReducers({
  navigation: navigationSlice,
});

const rootReducer = (state, action) => {
  return combinedReducer(state, action);
};

// Make sure to configure localforage bxefore the Redux store is created
localforage.config({
  driver: localforage.INDEXEDDB, // or localforage.LOCALSTORAGE
  name: "fhe",
  storeName: "fhe",
  version: 1.0,
  description: "fhe store",
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

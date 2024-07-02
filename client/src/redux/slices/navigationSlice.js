// userSlice.js

import { createSlice } from "@reduxjs/toolkit";

const naviagationSlice = createSlice({
  name: "navigation",
  initialState: {
    navigation: null,
  },
  reducers: {
    setNavigation: (state, action) => {
      state.navigation = action.payload;
    },
    resetNavigation: (state) => {
      state.navigation = "/";
    },
  },
});

export const { setNavigation, resetNavigation } = naviagationSlice.actions;
export default naviagationSlice.reducer;

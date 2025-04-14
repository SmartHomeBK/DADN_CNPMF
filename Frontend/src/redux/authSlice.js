import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isCheckingAuth: true,
  isAuth: false,
  userInfor: {},
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsCheckingAuth: (state, actions) => {
      state.isCheckingAuth = actions.payload;
    },
    setIsAuth: (state, actions) => {
      state.isAuth = actions.payload;
    },
    setUser: (state, actions) => {
      state.userInfor = actions.payload;
    },
  },
});

export const { setIsCheckingAuth, setIsAuth, setUser } = authSlice.actions;

export default authSlice.reducer;

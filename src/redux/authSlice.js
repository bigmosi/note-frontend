import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  permissions: []
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setPermissions: (state, action) => {
      state.permissions = action.payload;
    },
  },
});

export const {
  setAuthenticated,
  setUser,
  setToken,
  setPermissions,
} = authSlice.actions;
export default authSlice.reducer;

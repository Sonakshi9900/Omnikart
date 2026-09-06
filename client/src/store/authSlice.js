import { createSlice } from '@reduxjs/toolkit';

const initialUser = JSON.parse(localStorage.getItem('omnikart_user')) || null;

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: initialUser,
    isAuthenticated: !!initialUser,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('omnikart_user', JSON.stringify(action.payload));
    },
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('omnikart_user');
    },
  },
});

export const { setCredentials, logoutUser } = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export default authSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  email: '',
  password: '',
  token: localStorage.getItem('token') || null,
  user: localStorage.getItem('user') || null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    registerUser: (state, action) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.password = action.payload.password;
    },
    setToken: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    clearToken: (state) => {
      state.token = null;
      state.user = null;
    },
  },
});

export const { registerUser, setToken, clearToken } = userSlice.actions;

export default userSlice.reducer;
